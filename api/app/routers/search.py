import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.database import get_db
from app.models.insight import Insight
from app.models.project import Project
from app.models.user import User

router = APIRouter()

MAX_RESULTS = 20


@router.get("")
async def search(
    q: str = Query(..., min_length=2),
    project_id: str | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """Full-text ILIKE search across insights and project names."""
    term = f"%{q}%"

    # Project search (always global — only user's own projects)
    proj_q = db.query(Project).filter(
        Project.user_id == current_user.id,
        Project.name.ilike(term),
    ).limit(5).all()

    projects = [{"id": str(p.id), "name": p.name} for p in proj_q]

    # Insight search
    ins_q = db.query(Insight).join(
        Project, Insight.project_id == Project.id
    ).filter(
        Project.user_id == current_user.id,
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

    return {"projects": projects, "insights": insights}
