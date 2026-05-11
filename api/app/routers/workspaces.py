import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.database import get_db
from app.models.user import User
from app.models.project import Project
from app.models.workspace import Workspace
from app.models.workspace_member import WorkspaceMember

router = APIRouter()


# ── Schemas ─────────────────────────────────────────────────────────────────

class CreateWorkspaceRequest(BaseModel):
    name: str

class RenameWorkspaceRequest(BaseModel):
    name: str

class InviteMemberRequest(BaseModel):
    email: str
    role: str = "editor"  # editor | viewer

class ChangeRoleRequest(BaseModel):
    role: str


class MemberOut(BaseModel):
    id: str
    user_id: str | None
    display_name: str | None
    email: str
    role: str
    accepted: bool
    invited_at: str

class WorkspaceOut(BaseModel):
    id: str
    name: str
    owner_id: str
    member_count: int
    my_role: str
    created_at: str

class WorkspaceDetailOut(BaseModel):
    id: str
    name: str
    owner_id: str
    members: list[MemberOut]
    project_count: int
    prd_count: int
    created_at: str

class PRDTemplateOut(BaseModel):
    disabled_sections: list[str]
    section_hints: dict[str, str]
    updated_at: str | None

class PRDTemplateUpdate(BaseModel):
    disabled_sections: list[str] = []
    section_hints: dict[str, str] = {}

class AuditLogEntry(BaseModel):
    id: str
    user_id: str | None
    action: str
    resource_type: str | None
    resource_id: str | None
    meta: dict
    created_at: str


# ── Internal helpers ─────────────────────────────────────────────────────────

def _get_workspace_or_404(workspace_id: str, db: DBSession) -> Workspace:
    w = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not w:
        raise HTTPException(status_code=404, detail={"error": "Workspace not found", "code": "WORKSPACE_NOT_FOUND"})
    return w

def _require_owner(workspace: Workspace, user: User) -> None:
    if str(workspace.owner_id) != str(user.id):
        raise HTTPException(status_code=403, detail={"error": "Only the workspace owner can do this", "code": "FORBIDDEN"})

def _is_member(workspace_id: str, user_id: str, db: DBSession) -> bool:
    return db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == user_id,
        WorkspaceMember.accepted_at.isnot(None),
    ).first() is not None

def _member_count(workspace_id: str, db: DBSession) -> int:
    return db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.accepted_at.isnot(None),
    ).count()

def _get_my_role(workspace_id: str, user_id: str, db: DBSession) -> str:
    m = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == user_id,
        WorkspaceMember.accepted_at.isnot(None),
    ).first()
    return m.role if m else "viewer"


def _workspace_out(w: Workspace, db: DBSession, user_id: str | None = None) -> WorkspaceOut:
    return WorkspaceOut(
        id=str(w.id),
        name=w.name,
        owner_id=str(w.owner_id),
        member_count=_member_count(str(w.id), db),
        my_role=_get_my_role(str(w.id), user_id, db) if user_id else "owner",
        created_at=w.created_at.isoformat(),
    )


# ── Create ───────────────────────────────────────────────────────────────────

@router.post("/", response_model=WorkspaceOut)
async def create_workspace(
    body: CreateWorkspaceRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    from app.plan_config import require_feature
    require_feature(current_user.plan, "team_workspace", "Team Workspace requires a Teams or Studio plan.")

    workspace = Workspace(name=body.name.strip(), owner_id=current_user.id)
    db.add(workspace)
    db.flush()

    owner_member = WorkspaceMember(
        workspace_id=workspace.id,
        user_id=current_user.id,
        role="owner",
        invite_email=current_user.email,
        accepted_at=datetime.now(timezone.utc),
    )
    db.add(owner_member)
    db.commit()
    db.refresh(workspace)
    return _workspace_out(workspace, db, user_id=str(current_user.id))


# ── List ─────────────────────────────────────────────────────────────────────

@router.get("/", response_model=list[WorkspaceOut])
async def list_workspaces(
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    member_rows = db.query(WorkspaceMember).filter(
        WorkspaceMember.user_id == current_user.id,
        WorkspaceMember.accepted_at.isnot(None),
    ).all()

    result = []
    for m in member_rows:
        w = db.query(Workspace).filter(Workspace.id == m.workspace_id).first()
        if w:
            result.append(_workspace_out(w, db, user_id=str(current_user.id)))
    return result


# ── Accept invite (must be defined before /{workspace_id} routes) ────────────

@router.get("/join/{token}")
async def get_invite_info(token: str, db: DBSession = Depends(get_db)):
    member = db.query(WorkspaceMember).filter(WorkspaceMember.invite_token == token).first()
    if not member:
        raise HTTPException(status_code=404, detail={"error": "Invalid invite link", "code": "INVALID_TOKEN"})
    workspace = db.query(Workspace).filter(Workspace.id == member.workspace_id).first()
    inviter = db.query(User).filter(User.id == member.invited_by_id).first() if member.invited_by_id else None
    return {
        "workspace_id": str(member.workspace_id),
        "workspace_name": workspace.name if workspace else "",
        "role": member.role,
        "invite_email": member.invite_email,
        "inviter_name": (inviter.display_name or inviter.email) if inviter else None,
        "already_accepted": member.accepted_at is not None,
    }


@router.post("/join/{token}")
async def accept_invite(
    token: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    member = db.query(WorkspaceMember).filter(WorkspaceMember.invite_token == token).first()
    if not member:
        raise HTTPException(status_code=404, detail={"error": "Invalid invite link", "code": "INVALID_TOKEN"})
    if member.accepted_at:
        return {"message": "Already accepted", "workspace_id": str(member.workspace_id)}

    # Security: the invite was issued to a specific email address.
    # Reject if a different account tries to accept it.
    if member.invite_email and member.invite_email.lower() != current_user.email.lower():
        raise HTTPException(
            status_code=403,
            detail={
                "error": "This invite was sent to a different email address.",
                "code": "EMAIL_MISMATCH",
            },
        )

    member.user_id = current_user.id
    member.accepted_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Joined workspace", "workspace_id": str(member.workspace_id)}


# ── Single workspace ─────────────────────────────────────────────────────────

@router.get("/{workspace_id}", response_model=WorkspaceDetailOut)
async def get_workspace(
    workspace_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    workspace = _get_workspace_or_404(workspace_id, db)
    is_owner = str(workspace.owner_id) == str(current_user.id)
    if not is_owner and not _is_member(workspace_id, str(current_user.id), db):
        raise HTTPException(status_code=403, detail={"error": "Access denied", "code": "FORBIDDEN"})

    members = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id).all()
    member_out = []
    for m in members:
        u = db.query(User).filter(User.id == m.user_id).first() if m.user_id else None
        member_out.append(MemberOut(
            id=str(m.id),
            user_id=str(m.user_id) if m.user_id else None,
            display_name=u.display_name if u else None,
            email=(u.email if u else None) or m.invite_email or "",
            role=m.role,
            accepted=m.accepted_at is not None,
            invited_at=m.invited_at.isoformat(),
        ))

    from app.models.project import Project
    from app.models.analysis import Analysis
    from sqlalchemy import func
    project_ids = [r[0] for r in db.query(Project.id).filter(Project.workspace_id == workspace_id).all()]
    project_count = len(project_ids)
    prd_count = 0
    if project_ids:
        prd_count = db.query(func.count(Analysis.id)).filter(
            Analysis.project_id.in_(project_ids),
            Analysis.status == "complete",
        ).scalar() or 0

    return WorkspaceDetailOut(
        id=str(workspace.id),
        name=workspace.name,
        owner_id=str(workspace.owner_id),
        members=member_out,
        project_count=project_count,
        prd_count=prd_count,
        created_at=workspace.created_at.isoformat(),
    )


@router.patch("/{workspace_id}", response_model=WorkspaceOut)
async def rename_workspace(
    workspace_id: str,
    body: RenameWorkspaceRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    workspace = _get_workspace_or_404(workspace_id, db)
    _require_owner(workspace, current_user)
    workspace.name = body.name.strip()
    db.commit()
    return _workspace_out(workspace, db, user_id=str(current_user.id))


@router.delete("/{workspace_id}")
async def delete_workspace(
    workspace_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    workspace = _get_workspace_or_404(workspace_id, db)
    _require_owner(workspace, current_user)
    # Unlink projects instead of cascading delete — preserve data
    db.query(Project).filter(Project.workspace_id == workspace.id).update({"workspace_id": None})
    db.delete(workspace)
    db.commit()
    return {"success": True}


# ── Invite ───────────────────────────────────────────────────────────────────

@router.post("/{workspace_id}/invite")
async def invite_member(
    workspace_id: str,
    body: InviteMemberRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    workspace = _get_workspace_or_404(workspace_id, db)
    _require_owner(workspace, current_user)

    if body.role not in ("editor", "viewer"):
        raise HTTPException(status_code=400, detail={"error": "Role must be editor or viewer", "code": "INVALID_ROLE"})

    email = body.email.lower().strip()

    # Idempotent — return existing invite if already pending
    existing = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.invite_email == email,
    ).first()
    if existing:
        return {"message": "Already invited", "invite_token": existing.invite_token}

    invited_user = db.query(User).filter(User.email == email).first()
    token = secrets.token_urlsafe(32)
    member = WorkspaceMember(
        workspace_id=workspace.id,
        user_id=invited_user.id if invited_user else None,
        role=body.role,
        invite_email=email,
        invite_token=token,
        invited_by_id=current_user.id,
    )
    db.add(member)
    db.flush()

    from app.audit import audit
    audit(db, workspace_id=workspace_id, user_id=str(current_user.id),
          action="member_invited", resource_type="workspace_member",
          meta={"email": email, "role": body.role})
    db.commit()

    from app.worker import send_workspace_invite_task
    inviter_name = current_user.display_name or current_user.email
    send_workspace_invite_task.delay(email, inviter_name, workspace.name, body.role, token)

    return {"message": "Invited", "invite_token": token}


# ── Member management ────────────────────────────────────────────────────────

@router.patch("/{workspace_id}/members/{member_id}/role")
async def change_member_role(
    workspace_id: str,
    member_id: str,
    body: ChangeRoleRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    workspace = _get_workspace_or_404(workspace_id, db)
    _require_owner(workspace, current_user)

    if body.role not in ("editor", "viewer"):
        raise HTTPException(status_code=400, detail={"error": "Role must be editor or viewer", "code": "INVALID_ROLE"})

    member = db.query(WorkspaceMember).filter(
        WorkspaceMember.id == member_id,
        WorkspaceMember.workspace_id == workspace_id,
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail={"error": "Member not found", "code": "MEMBER_NOT_FOUND"})
    if member.role == "owner":
        raise HTTPException(status_code=400, detail={"error": "Cannot change owner role", "code": "CANNOT_CHANGE_OWNER"})

    member.role = body.role
    db.commit()
    return {"success": True}


@router.delete("/{workspace_id}/members/{member_id}")
async def remove_member(
    workspace_id: str,
    member_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    workspace = _get_workspace_or_404(workspace_id, db)
    _require_owner(workspace, current_user)

    member = db.query(WorkspaceMember).filter(
        WorkspaceMember.id == member_id,
        WorkspaceMember.workspace_id == workspace_id,
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail={"error": "Member not found", "code": "MEMBER_NOT_FOUND"})
    if member.role == "owner":
        raise HTTPException(status_code=400, detail={"error": "Cannot remove workspace owner", "code": "CANNOT_REMOVE_OWNER"})

    from app.audit import audit
    audit(db, workspace_id=workspace_id, user_id=str(current_user.id),
          action="member_removed", resource_type="workspace_member",
          meta={"removed_user_id": str(member.user_id) if member.user_id else None,
                "email": member.invite_email})
    db.delete(member)
    db.commit()
    return {"success": True}


# ── Add project to workspace ─────────────────────────────────────────────────

@router.post("/{workspace_id}/projects/{project_id}")
async def add_project_to_workspace(
    workspace_id: str,
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    workspace = _get_workspace_or_404(workspace_id, db)
    _require_owner(workspace, current_user)

    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id,
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "PROJECT_NOT_FOUND"})

    project.workspace_id = workspace.id
    db.commit()
    return {"success": True}


# ── PRD Template (Teams+) ────────────────────────────────────────────────────

@router.get("/{workspace_id}/prd-template", response_model=PRDTemplateOut)
async def get_prd_template(
    workspace_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    workspace = _get_workspace_or_404(workspace_id, db)
    if not _is_member(workspace_id, str(current_user.id), db) and str(workspace.owner_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail={"error": "Access denied", "code": "FORBIDDEN"})

    from app.models.workspace_prd_template import WorkspacePRDTemplate
    tmpl = db.query(WorkspacePRDTemplate).filter(WorkspacePRDTemplate.workspace_id == workspace_id).first()
    if not tmpl:
        return PRDTemplateOut(disabled_sections=[], section_hints={}, updated_at=None)
    return PRDTemplateOut(
        disabled_sections=tmpl.disabled_sections or [],
        section_hints=tmpl.section_hints or {},
        updated_at=tmpl.updated_at.isoformat(),
    )


@router.put("/{workspace_id}/prd-template", response_model=PRDTemplateOut)
async def update_prd_template(
    workspace_id: str,
    body: PRDTemplateUpdate,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    workspace = _get_workspace_or_404(workspace_id, db)
    _require_owner(workspace, current_user)

    from app.models.workspace_prd_template import WorkspacePRDTemplate
    from datetime import datetime, timezone
    tmpl = db.query(WorkspacePRDTemplate).filter(WorkspacePRDTemplate.workspace_id == workspace_id).first()
    if tmpl:
        tmpl.disabled_sections = body.disabled_sections
        tmpl.section_hints = body.section_hints
        tmpl.updated_at = datetime.now(timezone.utc)
    else:
        tmpl = WorkspacePRDTemplate(
            workspace_id=workspace_id,
            disabled_sections=body.disabled_sections,
            section_hints=body.section_hints,
        )
        db.add(tmpl)
    db.commit()
    db.refresh(tmpl)
    return PRDTemplateOut(
        disabled_sections=tmpl.disabled_sections or [],
        section_hints=tmpl.section_hints or {},
        updated_at=tmpl.updated_at.isoformat(),
    )


# ── Audit Log (Studio only) ──────────────────────────────────────────────────

@router.get("/{workspace_id}/audit-logs", response_model=list[AuditLogEntry])
async def get_audit_logs(
    workspace_id: str,
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    from app.plan_config import require_feature
    require_feature(current_user.plan, "audit_log", "Audit log requires a Studio plan.")

    workspace = _get_workspace_or_404(workspace_id, db)
    if str(workspace.owner_id) != str(current_user.id) and not _is_member(workspace_id, str(current_user.id), db):
        raise HTTPException(status_code=403, detail={"error": "Access denied", "code": "FORBIDDEN"})

    from app.models.audit_log import AuditLog
    rows = (
        db.query(AuditLog)
        .filter(AuditLog.workspace_id == workspace_id)
        .order_by(AuditLog.created_at.desc())
        .offset(offset)
        .limit(min(limit, 200))
        .all()
    )
    return [
        AuditLogEntry(
            id=str(r.id),
            user_id=str(r.user_id) if r.user_id else None,
            action=r.action,
            resource_type=r.resource_type,
            resource_id=r.resource_id,
            meta=r.meta or {},
            created_at=r.created_at.isoformat(),
        )
        for r in rows
    ]
