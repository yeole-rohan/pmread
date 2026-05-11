"""Shared helpers for project/analysis access and role enforcement."""
from fastapi import HTTPException
from sqlalchemy.orm import Session as DBSession

from app.models.project import Project


def get_accessible_project(
    project_id: str,
    user_id: str,
    db: DBSession,
) -> "Project | None":
    """Return project if user owns it or is an accepted workspace member."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return None
    if str(project.user_id) == str(user_id):
        return project
    if project.workspace_id:
        from app.models.workspace_member import WorkspaceMember
        member = db.query(WorkspaceMember).filter(
            WorkspaceMember.workspace_id == project.workspace_id,
            WorkspaceMember.user_id == user_id,
            WorkspaceMember.accepted_at.isnot(None),
        ).first()
        if member:
            return project
    return None


def get_project_role(project: "Project", user_id: str, db: DBSession) -> str:
    """
    Return the effective role for user on this project.

    Returns "owner" if the user created the project (personal or workspace).
    Returns the workspace member role ("owner" / "editor" / "viewer") otherwise.
    Call only after confirming access via get_accessible_project.
    """
    if str(project.user_id) == str(user_id):
        return "owner"
    if project.workspace_id:
        from app.models.workspace_member import WorkspaceMember
        member = db.query(WorkspaceMember).filter(
            WorkspaceMember.workspace_id == project.workspace_id,
            WorkspaceMember.user_id == user_id,
            WorkspaceMember.accepted_at.isnot(None),
        ).first()
        if member:
            return member.role
    return "viewer"  # should not reach here if called after access check


def require_editor_role(project: "Project", user_id: str, db: DBSession) -> None:
    """Raise HTTP 403 if the user is a viewer (read-only)."""
    if get_project_role(project, user_id, db) == "viewer":
        raise HTTPException(
            status_code=403,
            detail={
                "error": "Viewers have read-only access and cannot make changes.",
                "code": "VIEWER_READONLY",
            },
        )


def require_owner_role(project: "Project", user_id: str, db: DBSession) -> None:
    """Raise HTTP 403 if the user is not an owner (editor or viewer)."""
    if get_project_role(project, user_id, db) != "owner":
        raise HTTPException(
            status_code=403,
            detail={
                "error": "Only the workspace owner can perform this action.",
                "code": "OWNER_REQUIRED",
            },
        )


def get_accessible_analysis(
    analysis_id: str,
    user_id: str,
    db: DBSession,
) -> "tuple[Analysis | None, Project | None]":
    """
    Return (analysis, project) if the user can access the analysis.
    Returns (None, None) if not found or no access.
    Use get_project_role(project, user_id, db) on the returned project to enforce roles.
    """
    from app.models.analysis import Analysis
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        return None, None
    project = get_accessible_project(str(analysis.project_id), user_id, db)
    if not project:
        return None, None
    return analysis, project
