from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user
from app.database import get_db
from app.models.analysis import Analysis
from app.models.project import Project
from app.models.prd_version import PrdVersion
from app.models.user import User
from sqlalchemy.orm import Session as DBSession

router = APIRouter()


@router.get("/{prd_id}/versions")
async def list_prd_versions(
    prd_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    analysis = db.query(Analysis).filter(Analysis.id == prd_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail={"error": "PRD not found", "code": "PRD_NOT_FOUND"})

    project = db.query(Project).filter(
        Project.id == analysis.project_id, Project.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=403, detail={"error": "Forbidden", "code": "FORBIDDEN"})

    versions = (
        db.query(PrdVersion)
        .filter(PrdVersion.prd_id == prd_id)
        .order_by(PrdVersion.created_at.desc())
        .all()
    )

    author_ids = [str(v.triggered_by) for v in versions if v.triggered_by]
    author_map: dict = {}
    if author_ids:
        authors = db.query(User).filter(User.id.in_(author_ids)).all()
        author_map = {str(u.id): (u.display_name or u.email.split("@")[0]) for u in authors}

    return [
        {
            "id": str(v.id),
            "trigger": v.trigger,
            "triggered_by": author_map.get(str(v.triggered_by)) if v.triggered_by else None,
            "created_at": v.created_at.isoformat(),
        }
        for v in versions
    ]
