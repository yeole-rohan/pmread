from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession

from app.database import get_db
from app.models.analysis import Analysis
from app.models.project import Project
from app.models.uploaded_doc import UploadedDoc
from app.schemas.analysis import split_question
from app.worker import extract_insights_task

router = APIRouter()

PRD_SECTIONS = [
    "Problem", "Proposed Feature", "Why Worth Building", "Goals", "Non-Goals",
    "User Stories", "What Needs to Change", "Engineering Tasks", "Edge Cases",
    "Analytics Events", "Open Questions",
]


def _is_share_valid(analysis: Analysis) -> bool:
    if analysis.share_revoked_at:
        return False
    if analysis.share_expires_at and datetime.now(timezone.utc) > analysis.share_expires_at:
        return False
    return True


@router.get("/{token}")
async def get_shared_prd(token: str, db: DBSession = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.share_token == token).first()
    if not analysis or analysis.status != "complete":
        raise HTTPException(status_code=404, detail={"error": "Shared PRD not found.", "code": "NOT_FOUND"})
    if not _is_share_valid(analysis):
        raise HTTPException(status_code=404, detail={"error": "This link has expired or been revoked.", "code": "SHARE_INVALID"})

    # increment view count
    analysis.share_view_count = (analysis.share_view_count or 0) + 1
    db.commit()

    title, additional_context = split_question(analysis.question)
    return {
        "question": analysis.question,
        "title": title,
        "additional_context": additional_context,
        "brief": analysis.brief,
        "created_at": analysis.created_at,
        "sections": PRD_SECTIONS,
    }


class FeedbackPayload(BaseModel):
    submitter_name: str
    submitter_email: Optional[str] = None
    section_ref: Optional[str] = None
    feedback_text: str


@router.post("/{token}/feedback")
async def submit_share_feedback(token: str, body: FeedbackPayload, db: DBSession = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.share_token == token).first()
    if not analysis or analysis.status != "complete" or not _is_share_valid(analysis):
        raise HTTPException(status_code=404, detail={"error": "Not found.", "code": "NOT_FOUND"})

    if not body.feedback_text.strip():
        raise HTTPException(status_code=422, detail={"error": "Feedback text is required.", "code": "EMPTY_FEEDBACK"})

    section_label = f" on '{body.section_ref}'" if body.section_ref else ""
    source_label = f"Stakeholder feedback{section_label} — {body.submitter_name}"

    doc = UploadedDoc(
        project_id=analysis.project_id,
        user_id=analysis.user_id,
        original_name=source_label,
        file_type="text",
        extracted_text=body.feedback_text.strip(),
        char_count=len(body.feedback_text.strip()),
        insight_status="pending",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    extract_insights_task.delay(str(doc.id))
    return {"success": True}
