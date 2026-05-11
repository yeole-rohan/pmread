import secrets
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
from app.project_access import get_accessible_project, require_owner_role

router = APIRouter()


class CreateProjectRequest(BaseModel):
    name: str | None = None
    workspace_id: str | None = None


class RenameProjectRequest(BaseModel):
    name: str


def _project_out(p: Project, db: DBSession, workspace_name: str | None = None, workspace_role: str | None = None) -> ProjectOut:
    analysis_count = db.query(func.count(Analysis.id)).filter(Analysis.project_id == p.id).scalar() or 0
    last_analysis = (
        db.query(Analysis.created_at)
        .filter(Analysis.project_id == p.id)
        .order_by(Analysis.created_at.desc())
        .first()
    )
    return ProjectOut(
        id=str(p.id),
        name=p.name,
        created_at=p.created_at,
        updated_at=p.updated_at,
        analysis_count=analysis_count,
        last_analysis_at=last_analysis[0] if last_analysis else None,
        ingest_email_token=p.ingest_email_token,
        workspace_id=str(p.workspace_id) if p.workspace_id else None,
        workspace_name=workspace_name,
        workspace_role=workspace_role,
    )


@router.post("/", response_model=ProjectOut)
async def create_project(
    body: CreateProjectRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    from app.plan_config import get_limit
    project_limit = get_limit(current_user.plan, "projects")
    if project_limit is not None:
        existing = db.query(func.count(Project.id)).filter(Project.user_id == current_user.id).scalar() or 0
        if existing >= project_limit:
            raise HTTPException(
                status_code=402,
                detail={
                    "error": f"Free plan is limited to {project_limit} project. Upgrade to Pro for unlimited projects.",
                    "code": "PROJECT_LIMIT_REACHED",
                    "limit": project_limit,
                    "upgrade_url": "/settings?upgrade=true",
                },
            )

    workspace_name = None
    workspace_id = None
    if body.workspace_id:
        from app.models.workspace import Workspace
        from app.models.workspace_member import WorkspaceMember
        ws = db.query(Workspace).filter(Workspace.id == body.workspace_id).first()
        if ws:
            is_member = db.query(WorkspaceMember).filter(
                WorkspaceMember.workspace_id == ws.id,
                WorkspaceMember.user_id == current_user.id,
                WorkspaceMember.accepted_at.isnot(None),
            ).first()
            if is_member:
                if is_member.role == "viewer":
                    raise HTTPException(
                        status_code=403,
                        detail={"error": "Viewers cannot create projects in a workspace.", "code": "VIEWER_READONLY"},
                    )
                workspace_id = ws.id
                workspace_name = ws.name

    project = Project(
        user_id=current_user.id,
        name=body.name or "New Project",
        workspace_id=workspace_id,
    )
    project.ingest_email_token = secrets.token_hex(16)
    db.add(project)
    db.commit()
    db.refresh(project)
    return ProjectOut(
        id=str(project.id),
        name=project.name,
        created_at=project.created_at,
        updated_at=project.updated_at,
        ingest_email_token=project.ingest_email_token,
        workspace_id=str(project.workspace_id) if project.workspace_id else None,
        workspace_name=workspace_name,
    )


@router.get("/", response_model=list[ProjectOut])
async def list_projects(
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    # Own projects
    own_projects = (
        db.query(Project)
        .filter(Project.user_id == current_user.id)
        .order_by(Project.updated_at.desc())
        .all()
    )

    # Workspace projects where user is an accepted member (but doesn't own them)
    from app.models.workspace_member import WorkspaceMember
    member_ws_ids = [
        str(r[0]) for r in
        db.query(WorkspaceMember.workspace_id)
        .filter(
            WorkspaceMember.user_id == current_user.id,
            WorkspaceMember.accepted_at.isnot(None),
        )
        .all()
    ]

    ws_projects = []
    if member_ws_ids:
        ws_projects = (
            db.query(Project)
            .filter(
                Project.workspace_id.in_(member_ws_ids),
                Project.user_id != current_user.id,  # exclude own (already in own_projects)
            )
            .order_by(Project.updated_at.desc())
            .all()
        )

    # Build workspace name lookup and role lookup
    ws_name_map: dict[str, str] = {}
    ws_role_map: dict[str, str] = {}  # workspace_id -> role for current user

    all_ws_ids = set(member_ws_ids)
    if member_ws_ids:
        from app.models.workspace import Workspace
        rows = db.query(Workspace.id, Workspace.name).filter(Workspace.id.in_(member_ws_ids)).all()
        ws_name_map = {str(r[0]): r[1] for r in rows}
        role_rows = db.query(WorkspaceMember.workspace_id, WorkspaceMember.role).filter(
            WorkspaceMember.user_id == current_user.id,
            WorkspaceMember.workspace_id.in_(member_ws_ids),
            WorkspaceMember.accepted_at.isnot(None),
        ).all()
        ws_role_map = {str(r[0]): r[1] for r in role_rows}

    # Also include own projects that belong to a workspace
    own_ws_ids = {str(p.workspace_id) for p in own_projects if p.workspace_id}
    new_ws_ids = own_ws_ids - all_ws_ids
    if new_ws_ids:
        from app.models.workspace import Workspace
        extra_rows = db.query(Workspace.id, Workspace.name).filter(
            Workspace.id.in_(list(new_ws_ids))
        ).all()
        ws_name_map.update({str(r[0]): r[1] for r in extra_rows})
        # Owner's own workspace projects — role is "owner"
        for wid in new_ws_ids:
            ws_role_map[wid] = "owner"

    all_projects = own_projects + ws_projects
    result = []
    for p in all_projects:
        wid = str(p.workspace_id) if p.workspace_id else None
        wname = ws_name_map.get(wid) if wid else None
        wrole = ws_role_map.get(wid) if wid else None
        result.append(_project_out(p, db, workspace_name=wname, workspace_role=wrole))
    return result


@router.patch("/{project_id}", response_model=ProjectOut)
async def rename_project(
    project_id: str,
    body: RenameProjectRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    project = get_accessible_project(project_id, str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "PROJECT_NOT_FOUND"})
    require_owner_role(project, str(current_user.id), db)

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
    project = get_accessible_project(project_id, str(current_user.id), db)
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "PROJECT_NOT_FOUND"})
    require_owner_role(project, str(current_user.id), db)

    db.delete(project)
    db.commit()
    return {"success": True}
