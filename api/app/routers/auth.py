from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session as DBSession

from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    generate_verify_token,
    generate_session_token,
    get_current_user,
    _DUMMY_HASH,
)
from app.worker import send_verification_email_task
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.models.session import Session
from app.models.founding_member import FoundingMember
from app.schemas.user import UserOut
from app.utils.plan import subscription_status

router = APIRouter()


# ---------- request schemas ----------


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    display_name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False


# ---------- helpers ----------


def _user_response(user: User) -> UserOut:
    return UserOut(
        id=str(user.id),
        email=user.email,
        display_name=user.display_name,
        plan=user.plan,
        subscription_status=subscription_status(user),
        billing_provider=user.billing_provider,
        billing_period=user.billing_period,
        plan_started_at=user.plan_started_at,
        plan_expires_at=user.plan_expires_at,
        plan_renews_at=user.plan_renews_at,
        analyses_used=user.analyses_used,
        prds_generated_this_month=user.prds_generated_this_month,
        prds_reset_at=user.prds_reset_at,
        prd_credits=user.prd_credits,
        email_verified=user.email_verified,
        digest_enabled=user.digest_enabled,
        github_connected=bool(user.github_access_token),
        created_at=user.created_at,
    )


# ---------- routes ----------


@router.post("/signup")
async def signup(
    body: SignupRequest,
    db: DBSession = Depends(get_db),
):
    if len(body.password) < 8:
        raise HTTPException(status_code=422, detail={"error": "Password must be at least 8 characters", "code": "WEAK_PASSWORD"})

    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(status_code=409, detail={"error": "Email already in use", "code": "EMAIL_EXISTS"})

    verify_token, verify_exp = generate_verify_token()
    user = User(
        email=body.email,
        password_hash=hash_password(body.password),
        display_name=body.display_name,
        verify_token=verify_token,
        verify_token_exp=verify_exp,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # H11 fix: founding-member credits granted AFTER email verification, not here
    send_verification_email_task.delay(user.email, verify_token, user.display_name or user.email)

    access_token = create_access_token(str(user.id), user.email)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": _user_response(user),
        "message": "Account created. Check your email to verify your account.",
    }


@router.post("/login")
async def login(
    body: LoginRequest,
    db: DBSession = Depends(get_db),
):
    user = db.query(User).filter(User.email == body.email).first()

    # L5 fix: always run bcrypt to prevent email enumeration via timing side-channel
    _hash = user.password_hash if (user and not user.deleted_at) else _DUMMY_HASH
    if not user or user.deleted_at or not verify_password(body.password, _hash):
        raise HTTPException(status_code=401, detail={"error": "Invalid email or password", "code": "INVALID_CREDENTIALS"})

    if body.remember_me:
        # Long-lived session token stored in DB
        session_token = generate_session_token()
        session = Session(
            token=session_token,
            user_id=user.id,
            expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REMEMBER_ME_EXPIRE_DAYS),
        )
        db.add(session)
        db.commit()
        access_token = session_token
    else:
        access_token = create_access_token(str(user.id), user.email)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": _user_response(user),
    }


@router.get("/verify-email")
async def verify_email(token: str, db: DBSession = Depends(get_db)):
    user = db.query(User).filter(User.verify_token == token).first()

    if not user:
        raise HTTPException(status_code=400, detail={"error": "Invalid verification link", "code": "INVALID_TOKEN"})

    if user.verify_token_exp and user.verify_token_exp < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail={"error": "Verification link has expired", "code": "TOKEN_EXPIRED"})

    user.email_verified = True
    user.verify_token = None
    user.verify_token_exp = None

    # H11 fix: grant founding-member credits only after email ownership is proven
    founding = db.query(FoundingMember).filter(
        FoundingMember.email == user.email.lower(),
        FoundingMember.claimed_by.is_(None),
    ).first()
    if founding:
        user.prd_credits = 100
        founding.claimed_by = user.id
        founding.claimed_at = datetime.now(timezone.utc)

    db.commit()

    return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?verified=true")


@router.post("/resend-verification")
async def resend_verification(
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    if current_user.email_verified:
        return {"message": "Email already verified"}

    # L6 fix: 60-second cooldown — infer issue time from expiry (token valid for 48h)
    if current_user.verify_token_exp:
        token_issued_at = current_user.verify_token_exp - timedelta(hours=48)
        if token_issued_at > datetime.now(timezone.utc) - timedelta(seconds=60):
            raise HTTPException(
                status_code=429,
                detail={"error": "Please wait before requesting another verification email", "code": "COOLDOWN"},
            )

    verify_token, verify_exp = generate_verify_token()
    current_user.verify_token = verify_token
    current_user.verify_token_exp = verify_exp
    db.commit()

    send_verification_email_task.delay(
        current_user.email,
        verify_token,
        current_user.display_name or current_user.email,
    )

    return {"message": "Verification email sent"}


@router.get("/me", response_model=UserOut)
async def me(current_user: User = Depends(get_current_user)):
    return _user_response(current_user)


class UpdateUserRequest(BaseModel):
    display_name: str | None = Field(None, max_length=100)
    digest_enabled: bool | None = None


@router.patch("/me", response_model=UserOut)
async def update_me(
    body: UpdateUserRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    # M8 fix: typed schema replaces raw dict — prevents arbitrary field injection
    if body.display_name is not None:
        current_user.display_name = body.display_name
    if body.digest_enabled is not None:
        current_user.digest_enabled = body.digest_enabled
    db.commit()
    return _user_response(current_user)


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@router.post("/change-password")
async def change_password(
    body: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    if not verify_password(body.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail={"error": "Current password is incorrect", "code": "WRONG_PASSWORD"})
    if len(body.new_password) < 8:
        raise HTTPException(status_code=422, detail={"error": "Password must be at least 8 characters", "code": "WEAK_PASSWORD"})
    current_user.password_hash = hash_password(body.new_password)
    # M7 fix: invalidate all remember-me sessions so old tokens can't authenticate after a password change
    db.query(Session).filter(Session.user_id == current_user.id).delete()
    db.commit()
    return {"success": True}


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/forgot-password")
async def forgot_password(
    body: ForgotPasswordRequest,
    db: DBSession = Depends(get_db),
):
    """
    Send a password-reset link. Always returns 200 to prevent email enumeration.
    Token is valid for 1 hour.
    """
    import secrets
    from datetime import timedelta
    from app.services.email import RESET_PASSWORD_HTML

    user = db.query(User).filter(
        User.email == body.email, User.deleted_at.is_(None)
    ).first()

    if user:
        token = secrets.token_urlsafe(32)
        user.password_reset_token = token
        user.password_reset_exp = datetime.now(timezone.utc) + timedelta(hours=1)
        db.commit()

        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        html = RESET_PASSWORD_HTML.format(
            name=user.display_name or user.email,
            reset_url=reset_url,
        )

        if settings.SMTP_HOST:
            from app.services.email import _send_smtp
            try:
                _send_smtp(user.email, "Reset your PMRead password", html)
            except Exception:
                pass
        else:
            print(f"[DEV] Password reset link for {user.email}: {reset_url}")

    return {"message": "If that email is registered, a reset link has been sent."}


@router.post("/reset-password")
async def reset_password(
    body: ResetPasswordRequest,
    db: DBSession = Depends(get_db),
):
    """Verify reset token and set a new password."""
    if len(body.new_password) < 8:
        raise HTTPException(status_code=422, detail={"error": "Password must be at least 8 characters", "code": "WEAK_PASSWORD"})

    user = db.query(User).filter(
        User.password_reset_token == body.token,
        User.deleted_at.is_(None),
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail={"error": "Invalid or expired reset link.", "code": "INVALID_TOKEN"})

    if user.password_reset_exp and user.password_reset_exp < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail={"error": "Reset link has expired. Request a new one.", "code": "TOKEN_EXPIRED"})

    user.password_hash = hash_password(body.new_password)
    user.password_reset_token = None
    user.password_reset_exp = None
    db.commit()

    return {"message": "Password updated. You can now sign in."}


@router.delete("/me")
async def delete_account(
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    current_user.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return {"success": True}
