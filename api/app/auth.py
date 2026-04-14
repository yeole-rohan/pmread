import uuid
import secrets
from datetime import datetime, timedelta, timezone

import bcrypt

from fastapi import Depends, HTTPException, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session as DBSession

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.models.session import Session

security = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=settings.ACCESS_TOKEN_EXPIRE_HOURS),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def generate_verify_token() -> tuple[str, datetime]:
    token = str(uuid.uuid4())
    expires = datetime.now(timezone.utc) + timedelta(hours=48)
    return token, expires


def generate_session_token() -> str:
    return secrets.token_hex(32)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    token: str | None = Query(None),
    db: DBSession = Depends(get_db),
) -> User:
    raw_token = None
    session_mode = False

    if credentials:
        raw_token = credentials.credentials
    elif token:
        raw_token = token

    if not raw_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # Try JWT first
    try:
        payload = verify_token(raw_token)
        user = db.query(User).filter(User.id == payload["sub"]).first()
    except HTTPException:
        # Fall back to session token (remember-me)
        session = (
            db.query(Session)
            .filter(Session.token == raw_token, Session.expires_at > datetime.now(timezone.utc))
            .first()
        )
        if not session:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        user = db.query(User).filter(User.id == session.user_id).first()
        session_mode = True

    if not user or user.deleted_at:
        raise HTTPException(status_code=401, detail="User not found")

    return user
