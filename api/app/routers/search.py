import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.database import get_db
from app.models.analysis import Analysis
from app.models.insight import Insight
from app.models.project import Project
from app.models.user import User
from app.models.workspace_member import WorkspaceMember
from app.schemas.analysis import split_question

router = APIRouter()

MAX_RESULTS = 20


def _accessible_project_ids(user_id, db: DBSession) -> list:
    """Return all project IDs the user can access (own + workspace membership)."""
    own = [r[0] for r in db.query(Project.id).filter(Project.user_id == user_id).all()]

    member_ws_ids = [
        r[0] for r in
        db.query(WorkspaceMember.workspace_id).filter(
            WorkspaceMember.user_id == user_id,
            WorkspaceMember.accepted_at.isnot(None),
        ).all()
    ]
    ws_projects = []
    if member_ws_ids:
        ws_projects = [
            r[0] for r in
            db.query(Project.id).filter(Project.workspace_id.in_(member_ws_ids)).all()
        ]

    return list({str(i) for i in own + ws_projects})


@router.get("")
async def search(
    q: str = Query(..., min_length=2),
    project_id: str | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Full-text ILIKE search across insights, project names, and PRD titles."""
    term = f"%{q}%"
    accessible_ids = _accessible_project_ids(current_user.id, db)

    # Project search
    proj_q = db.query(Project).filter(
        Project.id.in_(accessible_ids),
        Project.name.ilike(term),
    ).limit(5).all()

    projects = [{"id": str(p.id), "name": p.name} for p in proj_q]

    # Insight search
    ins_q = db.query(Insight).filter(
        Insight.project_id.in_(accessible_ids),
    )

    if project_id:
        try:
            ins_q = ins_q.filter(Insight.project_id == uuid.UUID(project_id))
        except ValueError:
            pass

    ins_q = ins_q.filter(
        Insight.content.ilike(term)
    ).order_by(Insight.frequency.desc()).limit(MAX_RESULTS).all()

    insights = [
        {
            "id": str(i.id),
            "project_id": str(i.project_id),
            "type": i.type,
            "content": i.content,
            "frequency": i.frequency,
        }
        for i in ins_q
    ]

    # PRD search — search question field, completed PRDs only
    prd_q = db.query(Analysis).filter(
        Analysis.project_id.in_(accessible_ids),
        Analysis.status == "complete",
        Analysis.question.ilike(term),
    )

    if project_id:
        try:
            prd_q = prd_q.filter(Analysis.project_id == uuid.UUID(project_id))
        except ValueError:
            pass

    prd_q = prd_q.order_by(Analysis.created_at.desc()).limit(10).all()

    prds = [
        {
            "id": str(a.id),
            "project_id": str(a.project_id),
            "title": split_question(a.question)[0],
        }
        for a in prd_q
    ]

    return {"projects": projects, "insights": insights, "prds": prds}
