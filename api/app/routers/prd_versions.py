from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user
from app.database import get_db
from app.models.analysis import Analysis
from app.models.project import Project
from app.models.prd_version import PrdVersion
from app.models.user import User
from app.plan_config import get_limit
from app.project_access import get_accessible_project
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

    project = get_accessible_project(str(analysis.project_id), str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=403, detail={"error": "Forbidden", "code": "FORBIDDEN"})

    retention_days = get_limit(current_user.plan, "version_history_days")
    cutoff: datetime | None = None
    if retention_days is not None:
        cutoff = datetime.now(timezone.utc) - timedelta(days=retention_days)

    query = db.query(PrdVersion).filter(PrdVersion.prd_id == prd_id)
    if cutoff is not None:
        query = query.filter(PrdVersion.created_at >= cutoff)
    versions = query.order_by(PrdVersion.created_at.desc()).all()

    author_ids = [str(v.triggered_by) for v in versions if v.triggered_by]
    author_map: dict = {}
    if author_ids:
        authors = db.query(User).filter(User.id.in_(author_ids)).all()
        author_map = {str(u.id): (u.display_name or u.email.split("@")[0]) for u in authors}

    return {
        "limited": cutoff is not None,
        "retention_days": retention_days,
        "versions": [
            {
                "id": str(v.id),
                "trigger": v.trigger,
                "triggered_by": author_map.get(str(v.triggered_by)) if v.triggered_by else None,
                "created_at": v.created_at.isoformat(),
            }
            for v in versions
        ],
    }
