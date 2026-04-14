from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.database import get_db
from app.models.user import User
from app.models.project import Project
from app.models.analysis import Analysis
from app.schemas.project import ProjectOut

router = APIRouter()


class CreateProjectRequest(BaseModel):
    name: str | None = None


class RenameProjectRequest(BaseModel):
    name: str


@router.post("/", response_model=ProjectOut)
async def create_project(
    body: CreateProjectRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    project = Project(
        user_id=current_user.id,
        name=body.name or "New Project",
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return ProjectOut(id=str(project.id), name=project.name, created_at=project.created_at, updated_at=project.updated_at)


@router.get("/", response_model=list[ProjectOut])
async def list_projects(
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    projects = (
        db.query(Project)
        .filter(Project.user_id == current_user.id)
        .order_by(Project.updated_at.desc())
        .all()
    )

    result = []
    for p in projects:
        analysis_count = db.query(func.count(Analysis.id)).filter(Analysis.project_id == p.id).scalar() or 0
        last_analysis = (
            db.query(Analysis.created_at)
            .filter(Analysis.project_id == p.id)
            .order_by(Analysis.created_at.desc())
            .first()
        )
        result.append(ProjectOut(
            id=str(p.id),
            name=p.name,
            created_at=p.created_at,
            updated_at=p.updated_at,
            analysis_count=analysis_count,
            last_analysis_at=last_analysis[0] if last_analysis else None,
        ))
    return result


@router.patch("/{project_id}", response_model=ProjectOut)
async def rename_project(
    project_id: str,
    body: RenameProjectRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    project = db.query(Project).filter(
        Project.id == project_id, Project.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "PROJECT_NOT_FOUND"})

    project.name = body.name
    project.updated_at = datetime.now(timezone.utc)
    db.commit()
    return ProjectOut(id=str(project.id), name=project.name, created_at=project.created_at, updated_at=project.updated_at)


@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    project = db.query(Project).filter(
        Project.id == project_id, Project.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "PROJECT_NOT_FOUND"})

    db.delete(project)
    db.commit()
    return {"success": True}
