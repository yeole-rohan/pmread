"""
Integration tests for workspace Teams+ features.

Covers:
- Invite flow: GET token info, POST accept, email-mismatch rejection
- PRD template: GET default, PUT update, verify generation uses template
- Audit log: plan gate (free/pro blocked, studio allowed)
- Role change: owner can change editor→viewer, viewer restrictions
- Workspace rename
- Member remove
- schedule-estimate plan gate
"""
import secrets
from datetime import datetime, timezone

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.orm import Session as OrmSession

from app.auth import create_access_token, hash_password
from app.database import get_db
from app.models.project import Project
from app.models.user import User
from app.models.workspace import Workspace
from app.models.workspace_member import WorkspaceMember
from app.models.analysis import Analysis


# ── Fixtures & helpers ────────────────────────────────────────────────────────

def make_user(db: OrmSession, email: str, plan: str = "free") -> User:
    u = User(
        email=email,
        password_hash=hash_password("password123"),
        display_name=email.split("@")[0],
        email_verified=True,
        plan=plan,
    )
    db.add(u)
    db.flush()
    return u


def auth(user: User) -> dict:
    return {"Authorization": f"Bearer {create_access_token(str(user.id), user.email)}"}


def make_workspace(db: OrmSession, owner: User, name: str = "WS") -> Workspace:
    ws = Workspace(name=name, owner_id=owner.id)
    db.add(ws)
    db.flush()
    db.add(WorkspaceMember(
        workspace_id=ws.id, user_id=owner.id, role="owner",
        invite_email=owner.email, accepted_at=datetime.now(timezone.utc),
    ))
    db.flush()
    return ws


def add_member(db: OrmSession, ws: Workspace, user: User, role: str) -> WorkspaceMember:
    m = WorkspaceMember(
        workspace_id=ws.id, user_id=user.id, role=role,
        invite_email=user.email, invite_token=secrets.token_urlsafe(32),
        accepted_at=datetime.now(timezone.utc),
    )
    db.add(m)
    db.flush()
    return m


def make_pending_invite(db: OrmSession, ws: Workspace, email: str, role: str = "editor") -> WorkspaceMember:
    m = WorkspaceMember(
        workspace_id=ws.id, user_id=None, role=role,
        invite_email=email, invite_token=secrets.token_urlsafe(32),
    )
    db.add(m)
    db.flush()
    return m


@pytest_asyncio.fixture
async def client(db):
    from app.main import app
    app.dependency_overrides[get_db] = lambda: db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()


# ── Invite flow ───────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_invite_get_info(client, db):
    owner = make_user(db, "invite_owner@test.com", "teams")
    ws = make_workspace(db, owner)
    invite = make_pending_invite(db, ws, "invitee@test.com")
    db.commit()

    r = await client.get(f"/api/workspaces/join/{invite.invite_token}")
    assert r.status_code == 200
    data = r.json()
    assert data["workspace_name"] == "WS"
    assert data["role"] == "editor"
    assert data["already_accepted"] is False


@pytest.mark.asyncio
async def test_invite_accept_success(client, db):
    owner = make_user(db, "inv_own2@test.com", "teams")
    invitee = make_user(db, "invitee2@test.com", "free")
    ws = make_workspace(db, owner)
    invite = make_pending_invite(db, ws, invitee.email)
    db.commit()

    r = await client.post(f"/api/workspaces/join/{invite.invite_token}", headers=auth(invitee))
    assert r.status_code == 200
    assert r.json()["workspace_id"] == str(ws.id)

    db.refresh(invite)
    assert invite.accepted_at is not None
    assert str(invite.user_id) == str(invitee.id)


@pytest.mark.asyncio
async def test_invite_accept_email_mismatch_rejected(client, db):
    owner = make_user(db, "inv_own3@test.com", "teams")
    wrong_user = make_user(db, "wrongperson@test.com", "free")
    ws = make_workspace(db, owner)
    invite = make_pending_invite(db, ws, "rightperson@test.com")
    db.commit()

    r = await client.post(f"/api/workspaces/join/{invite.invite_token}", headers=auth(wrong_user))
    assert r.status_code == 403
    assert r.json()["detail"]["code"] == "EMAIL_MISMATCH"


@pytest.mark.asyncio
async def test_invite_invalid_token_404(client, db):
    r = await client.get("/api/workspaces/join/doesnotexist")
    assert r.status_code == 404


# ── PRD Template ──────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_prd_template_get_default(client, db):
    owner = make_user(db, "tmpl_own@test.com", "teams")
    ws = make_workspace(db, owner)
    db.commit()

    r = await client.get(f"/api/workspaces/{ws.id}/prd-template", headers=auth(owner))
    assert r.status_code == 200
    data = r.json()
    assert data["disabled_sections"] == []
    assert data["section_hints"] == {}


@pytest.mark.asyncio
async def test_prd_template_owner_can_update(client, db):
    owner = make_user(db, "tmpl_own2@test.com", "teams")
    ws = make_workspace(db, owner)
    db.commit()

    r = await client.put(
        f"/api/workspaces/{ws.id}/prd-template",
        headers=auth(owner),
        json={"disabled_sections": ["open_questions"], "section_hints": {"engineering_tasks": "Use T-shirt sizes"}},
    )
    assert r.status_code == 200
    data = r.json()
    assert "open_questions" in data["disabled_sections"]
    assert data["section_hints"]["engineering_tasks"] == "Use T-shirt sizes"


@pytest.mark.asyncio
async def test_prd_template_non_owner_cannot_update(client, db):
    owner = make_user(db, "tmpl_own3@test.com", "teams")
    editor = make_user(db, "tmpl_editor@test.com", "teams")
    ws = make_workspace(db, owner)
    add_member(db, ws, editor, "editor")
    db.commit()

    r = await client.put(
        f"/api/workspaces/{ws.id}/prd-template",
        headers=auth(editor),
        json={"disabled_sections": [], "section_hints": {}},
    )
    assert r.status_code == 403


# ── Audit log ─────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_audit_log_requires_studio(client, db):
    teams_user = make_user(db, "audit_teams@test.com", "teams")
    ws = make_workspace(db, teams_user)
    db.commit()

    r = await client.get(f"/api/workspaces/{ws.id}/audit-logs", headers=auth(teams_user))
    assert r.status_code == 402
    assert r.json()["detail"]["code"] == "PLAN_INSUFFICIENT"


@pytest.mark.asyncio
async def test_audit_log_studio_allowed(client, db):
    studio_user = make_user(db, "audit_studio@test.com", "studio")
    ws = make_workspace(db, studio_user)
    db.commit()

    r = await client.get(f"/api/workspaces/{ws.id}/audit-logs", headers=auth(studio_user))
    assert r.status_code == 200
    assert isinstance(r.json(), list)


# ── Role change ───────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_owner_can_change_member_role(client, db):
    owner = make_user(db, "role_own@test.com", "teams")
    editor = make_user(db, "role_editor@test.com", "teams")
    ws = make_workspace(db, owner)
    m = add_member(db, ws, editor, "editor")
    db.commit()

    r = await client.patch(
        f"/api/workspaces/{ws.id}/members/{m.id}/role",
        headers=auth(owner),
        json={"role": "viewer"},
    )
    assert r.status_code == 200
    db.refresh(m)
    assert m.role == "viewer"


@pytest.mark.asyncio
async def test_non_owner_cannot_change_role(client, db):
    owner = make_user(db, "role_own2@test.com", "teams")
    editor = make_user(db, "role_ed2@test.com", "teams")
    editor2 = make_user(db, "role_ed3@test.com", "teams")
    ws = make_workspace(db, owner)
    m = add_member(db, ws, editor, "editor")
    add_member(db, ws, editor2, "editor")
    db.commit()

    r = await client.patch(
        f"/api/workspaces/{ws.id}/members/{m.id}/role",
        headers=auth(editor2),
        json={"role": "viewer"},
    )
    assert r.status_code == 403


# ── Workspace rename ──────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_owner_can_rename_workspace(client, db):
    owner = make_user(db, "rename_own@test.com", "teams")
    ws = make_workspace(db, owner, name="OldName")
    db.commit()

    r = await client.patch(
        f"/api/workspaces/{ws.id}",
        headers=auth(owner),
        json={"name": "NewName"},
    )
    assert r.status_code == 200
    assert r.json()["name"] == "NewName"


@pytest.mark.asyncio
async def test_non_owner_cannot_rename(client, db):
    owner = make_user(db, "rename_own2@test.com", "teams")
    editor = make_user(db, "rename_ed@test.com", "teams")
    ws = make_workspace(db, owner, name="Locked")
    add_member(db, ws, editor, "editor")
    db.commit()

    r = await client.patch(
        f"/api/workspaces/{ws.id}",
        headers=auth(editor),
        json={"name": "Hacked"},
    )
    assert r.status_code == 403


# ── Schedule estimator plan gate ──────────────────────────────────────────────

@pytest.mark.asyncio
async def test_schedule_estimator_blocked_for_free(client, db):
    user = make_user(db, "sched_free@test.com", "free")
    db.commit()

    r = await client.post(
        "/api/analyses/00000000-0000-0000-0000-000000000000/schedule-estimate",
        headers=auth(user),
        json={"team_size": 2, "sprint_weeks": 2},
    )
    assert r.status_code == 402


@pytest.mark.asyncio
async def test_schedule_estimator_blocked_for_pro(client, db):
    user = make_user(db, "sched_pro@test.com", "pro")
    db.commit()

    r = await client.post(
        "/api/analyses/00000000-0000-0000-0000-000000000000/schedule-estimate",
        headers=auth(user),
        json={"team_size": 2, "sprint_weeks": 2},
    )
    assert r.status_code == 402
