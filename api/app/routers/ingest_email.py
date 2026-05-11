"""Postmark inbound email webhook and ingest-token management."""
import base64
import secrets

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.database import get_db
from app.models.project import Project
from app.models.uploaded_doc import UploadedDoc
from app.models.user import User
from app.project_access import get_accessible_project, require_editor_role
from app.worker import extract_insights_task

# Webhook endpoint registered under /api/ingest
email_router = APIRouter()

# Project management endpoint registered under /api/projects
projects_router = APIRouter()

SUPPORTED_ATTACHMENT_TYPES = {
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


class PostmarkAttachment(BaseModel):
    Name: str
    Content: str
    ContentType: str
    ContentLength: int = 0


class PostmarkInboundPayload(BaseModel):
    From: str = ""
    To: str = ""
    Subject: str = ""
    TextBody: str = ""
    HtmlBody: str = ""
    Attachments: list[PostmarkAttachment] = []


@email_router.post("/email")
async def ingest_email(
    payload: PostmarkInboundPayload,
    db: DBSession = Depends(get_db),
):
    """
    Postmark inbound webhook. Always returns 200 to prevent retries.
    Silently rejects unknown tokens or unauthorised senders.
    """
    # 1. Extract token from To address local part
    to_local = payload.To.split("@")[0].strip().lower()

    # 2. Look up project by ingest_email_token
    project = db.query(Project).filter(Project.ingest_email_token == to_local).first()
    if not project:
        return {"ok": True}

    # 3. Validate sender — look up user by From email
    from_email = payload.From
    # Postmark may include display name: "Name <email>" — extract just the address
    if "<" in from_email:
        from_email = from_email.split("<")[-1].rstrip(">").strip()

    sender = db.query(User).filter(User.email == from_email).first()
    if not sender or sender.id != project.user_id:
        return {"ok": True}

    # 4. If TextBody is non-empty and long enough, create a doc
    if payload.TextBody and len(payload.TextBody) > 20:
        subject = payload.Subject or "Email"
        doc = UploadedDoc(
            project_id=project.id,
            user_id=sender.id,
            original_name=f"Email: {subject}"[:200],
            file_type="text",
            extracted_text=payload.TextBody,
            char_count=len(payload.TextBody),
            insight_status="pending",
        )
        db.add(doc)
        db.flush()
        db.commit()
        extract_insights_task.delay(str(doc.id))

    # 5. Handle attachments
    for attachment in payload.Attachments:
        content_type = attachment.ContentType.split(";")[0].strip().lower()
        if content_type not in SUPPORTED_ATTACHMENT_TYPES:
            # TODO: audio attachments via Whisper — see uploads router
            continue

        try:
            file_bytes = base64.b64decode(attachment.Content)
        except Exception:
            continue

        extracted_text = _extract_attachment_text(file_bytes, content_type, attachment.Name)
        if not extracted_text:
            continue

        file_type = _content_type_to_ext(content_type)
        doc = UploadedDoc(
            project_id=project.id,
            user_id=sender.id,
            original_name=attachment.Name[:200],
            file_type=file_type,
            extracted_text=extracted_text,
            char_count=len(extracted_text),
            insight_status="pending",
        )
        db.add(doc)
        db.flush()
        db.commit()
        extract_insights_task.delay(str(doc.id))

    return {"ok": True}


def _content_type_to_ext(content_type: str) -> str:
    mapping = {
        "application/pdf": "pdf",
        "text/plain": "txt",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    }
    return mapping.get(content_type, "txt")


def _extract_attachment_text(file_bytes: bytes, content_type: str, filename: str) -> str | None:
    """Extract text from attachment bytes using existing parser utilities."""
    from app.services.parser import parse_pdf, parse_docx, parse_text, truncate_doc

    try:
        if content_type == "application/pdf":
            text = parse_pdf(file_bytes)
        elif content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            text = parse_docx(file_bytes)
        else:
            text = parse_text(file_bytes)

        if not text.strip():
            return None

        return truncate_doc(text)
    except Exception:
        return None


# ── Regenerate ingest token ───────────────────────────────────────────────────

@projects_router.post("/{project_id}/ingest-token/regenerate")
async def regenerate_ingest_token(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Regenerate the ingest email token for a project."""
    project = get_accessible_project(project_id, str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "PROJECT_NOT_FOUND"})
    require_editor_role(project, str(current_user.id), db)

    project.ingest_email_token = secrets.token_hex(16)
    db.commit()

    return {"ingest_email": f"{project.ingest_email_token}@ingest.pmread.org"}
