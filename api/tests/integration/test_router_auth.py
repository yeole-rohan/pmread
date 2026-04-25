from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import pytest
from httpx import AsyncClient
from sqlalchemy.orm import Session as OrmSession

from app.auth import create_access_token, hash_password
from app.models.founding_member import FoundingMember
from app.models.user import User

MOCK_CELERY = "app.routers.auth.send_verification_email_task"


# ── POST /api/auth/signup ─────────────────────────────────────────────────


@pytest.mark.asyncio
async def test_signup_creates_user(client: AsyncClient, db: OrmSession):
    with patch(MOCK_CELERY) as mock_task:
        mock_task.delay.return_value = None
        resp = await client.post(
            "/api/auth/signup",
            json={"email": "new@example.com", "password": "securepass123"},
        )

    assert resp.status_code == 200
    body = resp.json()
    assert "access_token" in body
    assert body["user"]["email"] == "new@example.com"
    assert body["user"]["plan"] == "free"

    user = db.query(User).filter(User.email == "new@example.com").first()
    assert user is not None
    assert user.email_verified is False


@pytest.mark.asyncio
async def test_signup_with_display_name(client: AsyncClient):
    with patch(MOCK_CELERY) as mock_task:
        mock_task.delay.return_value = None
        resp = await client.post(
            "/api/auth/signup",
            json={"email": "named@example.com", "password": "password123", "display_name": "Alice"},
        )

    assert resp.status_code == 200
    assert resp.json()["user"]["display_name"] == "Alice"


@pytest.mark.asyncio
async def test_signup_duplicate_email_returns_409(client: AsyncClient):
    with patch(MOCK_CELERY) as mock_task:
        mock_task.delay.return_value = None
        await client.post(
            "/api/auth/signup",
            json={"email": "dupe@example.com", "password": "password123"},
        )
        resp = await client.post(
            "/api/auth/signup",
            json={"email": "dupe@example.com", "password": "differentpass"},
        )

    assert resp.status_code == 409
    assert resp.json()["detail"]["code"] == "EMAIL_EXISTS"


@pytest.mark.asyncio
async def test_signup_weak_password_returns_422(client: AsyncClient):
    resp = await client.post(
        "/api/auth/signup",
        json={"email": "weak@example.com", "password": "short"},
    )
    assert resp.status_code == 422
    assert resp.json()["detail"]["code"] == "WEAK_PASSWORD"


@pytest.mark.asyncio
async def test_signup_sends_verification_email(client: AsyncClient):
    with patch(MOCK_CELERY) as mock_task:
        mock_task.delay.return_value = None
        await client.post(
            "/api/auth/signup",
            json={"email": "verify@example.com", "password": "password123"},
        )
    mock_task.delay.assert_called_once()
    call_email = mock_task.delay.call_args[0][0]
    assert call_email == "verify@example.com"


# ── POST /api/auth/login ──────────────────────────────────────────────────


@pytest.fixture
def verified_user(db: OrmSession) -> User:
    user = User(
        email="login@example.com",
        password_hash=hash_password("correct_password"),
        email_verified=True,
    )
    db.add(user)
    db.flush()
    return user


@pytest.mark.asyncio
async def test_login_valid_credentials(client: AsyncClient, verified_user: User):
    resp = await client.post(
        "/api/auth/login",
        json={"email": "login@example.com", "password": "correct_password"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert "access_token" in body
    assert body["user"]["email"] == "login@example.com"


@pytest.mark.asyncio
async def test_login_wrong_password_returns_401(client: AsyncClient, verified_user: User):
    resp = await client.post(
        "/api/auth/login",
        json={"email": "login@example.com", "password": "wrong_password"},
    )
    assert resp.status_code == 401
    assert resp.json()["detail"]["code"] == "INVALID_CREDENTIALS"


@pytest.mark.asyncio
async def test_login_nonexistent_email_returns_401(client: AsyncClient):
    resp = await client.post(
        "/api/auth/login",
        json={"email": "ghost@example.com", "password": "anything"},
    )
    assert resp.status_code == 401
    assert resp.json()["detail"]["code"] == "INVALID_CREDENTIALS"


@pytest.mark.asyncio
async def test_login_deleted_user_returns_401(client: AsyncClient, db: OrmSession):
    user = User(
        email="deleted@example.com",
        password_hash=hash_password("password123"),
        email_verified=True,
        deleted_at=datetime.now(timezone.utc),
    )
    db.add(user)
    db.flush()

    resp = await client.post(
        "/api/auth/login",
        json={"email": "deleted@example.com", "password": "password123"},
    )
    assert resp.status_code == 401


# ── GET /api/auth/me ──────────────────────────────────────────────────────


@pytest.mark.asyncio
async def test_me_returns_current_user(client: AsyncClient, test_user: User, auth_headers: dict):
    resp = await client.get("/api/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["email"] == test_user.email


@pytest.mark.asyncio
async def test_me_without_token_returns_401(client: AsyncClient):
    resp = await client.get("/api/auth/me")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_me_with_invalid_token_returns_401(client: AsyncClient):
    resp = await client.get("/api/auth/me", headers={"Authorization": "Bearer not.a.valid.token"})
    assert resp.status_code == 401


# ── PATCH /api/auth/me ────────────────────────────────────────────────────


@pytest.mark.asyncio
async def test_update_me_display_name(client: AsyncClient, test_user: User, auth_headers: dict, db: OrmSession):
    resp = await client.patch(
        "/api/auth/me",
        json={"display_name": "New Name"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["display_name"] == "New Name"

    db.refresh(test_user)
    assert test_user.display_name == "New Name"


# ── POST /api/auth/change-password ────────────────────────────────────────


@pytest.mark.asyncio
async def test_change_password_success(client: AsyncClient, db: OrmSession):
    user = User(
        email="chpwd@example.com",
        password_hash=hash_password("oldpassword"),
        email_verified=True,
    )
    db.add(user)
    db.flush()

    token = create_access_token(str(user.id), user.email)
    headers = {"Authorization": f"Bearer {token}"}

    resp = await client.post(
        "/api/auth/change-password",
        json={"current_password": "oldpassword", "new_password": "newpassword123"},
        headers=headers,
    )
    assert resp.status_code == 200
    assert resp.json()["success"] is True


@pytest.mark.asyncio
async def test_change_password_wrong_current_returns_400(
    client: AsyncClient, test_user: User, auth_headers: dict
):
    resp = await client.post(
        "/api/auth/change-password",
        json={"current_password": "wrongpassword", "new_password": "newpassword123"},
        headers=auth_headers,
    )
    assert resp.status_code == 400
    assert resp.json()["detail"]["code"] == "WRONG_PASSWORD"


# ── POST /api/auth/forgot-password ────────────────────────────────────────


@pytest.mark.asyncio
async def test_forgot_password_always_returns_200(client: AsyncClient):
    resp = await client.post(
        "/api/auth/forgot-password",
        json={"email": "ghost@example.com"},
    )
    assert resp.status_code == 200
    assert "message" in resp.json()


@pytest.mark.asyncio
async def test_forgot_password_sets_reset_token(client: AsyncClient, test_user: User, db: OrmSession):
    resp = await client.post(
        "/api/auth/forgot-password",
        json={"email": test_user.email},
    )
    assert resp.status_code == 200
    db.refresh(test_user)
    assert test_user.password_reset_token is not None


# ── POST /api/auth/reset-password ────────────────────────────────────────


@pytest.mark.asyncio
async def test_reset_password_valid_token(client: AsyncClient, test_user: User, db: OrmSession):
    test_user.password_reset_token = "valid-reset-token-abc"
    test_user.password_reset_exp = datetime.now(timezone.utc) + timedelta(hours=1)
    db.flush()

    resp = await client.post(
        "/api/auth/reset-password",
        json={"token": "valid-reset-token-abc", "new_password": "brandnewpass"},
    )
    assert resp.status_code == 200
    db.refresh(test_user)
    assert test_user.password_reset_token is None


@pytest.mark.asyncio
async def test_reset_password_invalid_token_returns_400(client: AsyncClient):
    resp = await client.post(
        "/api/auth/reset-password",
        json={"token": "nonexistent-token", "new_password": "brandnewpass"},
    )
    assert resp.status_code == 400
    assert resp.json()["detail"]["code"] == "INVALID_TOKEN"


@pytest.mark.asyncio
async def test_reset_password_expired_token_returns_400(
    client: AsyncClient, test_user: User, db: OrmSession
):
    test_user.password_reset_token = "expired-token-xyz"
    test_user.password_reset_exp = datetime.now(timezone.utc) - timedelta(hours=2)
    db.flush()

    resp = await client.post(
        "/api/auth/reset-password",
        json={"token": "expired-token-xyz", "new_password": "brandnewpass"},
    )
    assert resp.status_code == 400
    assert resp.json()["detail"]["code"] == "TOKEN_EXPIRED"


@pytest.mark.asyncio
async def test_reset_password_weak_password_returns_422(client: AsyncClient, test_user: User, db: OrmSession):
    test_user.password_reset_token = "token-for-weak-test"
    test_user.password_reset_exp = datetime.now(timezone.utc) + timedelta(hours=1)
    db.flush()

    resp = await client.post(
        "/api/auth/reset-password",
        json={"token": "token-for-weak-test", "new_password": "short"},
    )
    assert resp.status_code == 422


# ── DELETE /api/auth/me ───────────────────────────────────────────────────


@pytest.mark.asyncio
async def test_delete_account_soft_deletes(
    client: AsyncClient, test_user: User, auth_headers: dict, db: OrmSession
):
    resp = await client.delete("/api/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["success"] is True

    db.refresh(test_user)
    assert test_user.deleted_at is not None


# ── GET /api/auth/verify-email ────────────────────────────────────────────


@pytest.mark.asyncio
async def test_verify_email_valid_token_redirects(
    client: AsyncClient, test_user: User, db: OrmSession
):
    test_user.email_verified = False
    test_user.verify_token = "valid-verify-token-123"
    test_user.verify_token_exp = datetime.now(timezone.utc) + timedelta(hours=24)
    db.flush()

    resp = await client.get(
        "/api/auth/verify-email",
        params={"token": "valid-verify-token-123"},
        follow_redirects=False,
    )
    assert resp.status_code in (307, 302)
    assert "verified=true" in resp.headers["location"]

    db.refresh(test_user)
    assert test_user.email_verified is True
    assert test_user.verify_token is None


@pytest.mark.asyncio
async def test_verify_email_invalid_token_returns_400(client: AsyncClient):
    resp = await client.get(
        "/api/auth/verify-email",
        params={"token": "bad-token"},
        follow_redirects=False,
    )
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_verify_email_grants_founding_member_credits(
    client: AsyncClient, db: OrmSession
):
    user = User(
        email="founder@example.com",
        password_hash=hash_password("password123"),
        email_verified=False,
        verify_token="founder-verify-token",
        verify_token_exp=datetime.now(timezone.utc) + timedelta(hours=24),
    )
    db.add(user)

    founding = FoundingMember(email="founder@example.com")
    db.add(founding)
    db.flush()

    resp = await client.get(
        "/api/auth/verify-email",
        params={"token": "founder-verify-token"},
        follow_redirects=False,
    )
    assert resp.status_code in (307, 302)

    db.refresh(user)
    assert user.prd_credits == 100
