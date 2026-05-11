from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.database import get_db
from app.models.decision import Decision, DecisionEvidenceLink
from app.models.project import Project
from app.models.user import User
from app.project_access import get_accessible_project, require_editor_role

router = APIRouter()

FREE_PLAN_DECISION_LIMIT = 10


def _evidence_ids(db: DBSession, decision_id) -> list[str]:
    links = db.query(DecisionEvidenceLink).filter(
        DecisionEvidenceLink.decision_id == decision_id
    ).all()
    return [str(link.insight_id) for link in links]


def _decision_dict(decision: Decision, evidence_ids: list[str], author: User | None = None) -> dict:
    if author:
        logged_by = author.display_name or author.email.split("@")[0]
    else:
        logged_by = None
    return {
        "id": str(decision.id),
        "project_id": str(decision.project_id),
        "user_id": str(decision.user_id),
        "logged_by": logged_by,
        "title": decision.title,
        "what_we_decided": decision.what_we_decided,
        "why": decision.why,
        "status": decision.status,
        "evidence_insight_ids": evidence_ids,
        "created_at": decision.created_at,
        "updated_at": decision.updated_at,
    }


class DecisionCreate(BaseModel):
    project_id: str
    title: str
    what_we_decided: str
    why: Optional[str] = None
    evidence_insight_ids: list[str] = []


class DecisionUpdate(BaseModel):
    title: Optional[str] = None
    what_we_decided: Optional[str] = None
    why: Optional[str] = None
    status: Optional[str] = None
    evidence_insight_ids: Optional[list[str]] = None


@router.get("/")
async def list_decisions(
    project_id: str = Query(...),
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    project = get_accessible_project(project_id, str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "PROJECT_NOT_FOUND"})

    decisions = db.query(Decision).filter(
        Decision.project_id == project_id
    ).order_by(Decision.created_at.desc()).all()

    author_map: dict = {
        str(u.id): u
        for u in db.query(User).filter(User.id.in_([d.user_id for d in decisions])).all()
    }
    return [
        _decision_dict(d, _evidence_ids(db, d.id), author_map.get(str(d.user_id)))
        for d in decisions
    ]


@router.post("/")
async def create_decision(
    body: DecisionCreate,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    project = get_accessible_project(str(body.project_id), str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "PROJECT_NOT_FOUND"})
    require_editor_role(project, str(current_user.id), db)

    # Free plan limit check
    if current_user.plan == "free":
        existing_count = db.query(Decision).filter(
            Decision.project_id == body.project_id
        ).count()
        if existing_count >= FREE_PLAN_DECISION_LIMIT:
            raise HTTPException(
                status_code=403,
                detail={"code": "DECISION_LIMIT_REACHED", "error": "Free plan is limited to 10 decisions per project."}
            )

    decision = Decision(
        project_id=body.project_id,
        user_id=current_user.id,
        title=body.title,
        what_we_decided=body.what_we_decided,
        why=body.why,
        status="active",
    )
    db.add(decision)
    db.flush()  # get the id before inserting links

    for insight_id in body.evidence_insight_ids:
        link = DecisionEvidenceLink(decision_id=decision.id, insight_id=insight_id)
        db.add(link)

    db.commit()
    db.refresh(decision)

    return _decision_dict(decision, body.evidence_insight_ids, current_user)


@router.patch("/{decision_id}")
async def update_decision(
    decision_id: str,
    body: DecisionUpdate,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    if not decision:
        raise HTTPException(status_code=404, detail={"error": "Decision not found", "code": "DECISION_NOT_FOUND"})

    project = get_accessible_project(str(decision.project_id), str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=403, detail={"error": "Forbidden", "code": "FORBIDDEN"})
    require_editor_role(project, str(current_user.id), db)

    if body.title is not None:
        decision.title = body.title
    if body.what_we_decided is not None:
        decision.what_we_decided = body.what_we_decided
    if body.why is not None:
        decision.why = body.why
    if body.status is not None:
        decision.status = body.status

    decision.updated_at = datetime.now(timezone.utc)

    if body.evidence_insight_ids is not None:
        db.query(DecisionEvidenceLink).filter(
            DecisionEvidenceLink.decision_id == decision.id
        ).delete()
        for insight_id in body.evidence_insight_ids:
            link = DecisionEvidenceLink(decision_id=decision.id, insight_id=insight_id)
            db.add(link)

    db.commit()
    db.refresh(decision)

    evidence_ids = body.evidence_insight_ids if body.evidence_insight_ids is not None else _evidence_ids(db, decision.id)
    return _decision_dict(decision, evidence_ids, current_user)


@router.delete("/{decision_id}")
async def delete_decision(
    decision_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    decision = db.query(Decision).filter(Decision.id == decision_id).first()
    if not decision:
        raise HTTPException(status_code=404, detail={"error": "Decision not found", "code": "DECISION_NOT_FOUND"})

    project = get_accessible_project(str(decision.project_id), str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=403, detail={"error": "Forbidden", "code": "FORBIDDEN"})
    require_editor_role(project, str(current_user.id), db)

    db.delete(decision)
    db.commit()
    return {"success": True}
