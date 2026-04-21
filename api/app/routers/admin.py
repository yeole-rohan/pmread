"""Admin-only endpoints. Protected by HTTP Basic Auth using ADMIN_USERNAME / ADMIN_PASSWORD."""
import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session as DBSession

from app.config import settings
from app.database import get_db
from app.models.founding_member import FoundingMember
from app.models.user import User

router = APIRouter()
security = HTTPBasic()

FOUNDING_MEMBER_CREDITS = 100


def _require_admin(credentials: HTTPBasicCredentials = Depends(security)):
    username_ok = secrets.compare_digest(credentials.username, settings.ADMIN_USERNAME)
    password_ok = secrets.compare_digest(credentials.password, settings.ADMIN_PASSWORD)
    if not (username_ok and password_ok):
        raise HTTPException(
            status_code=401,
            detail="Invalid admin credentials",
            headers={"WWW-Authenticate": "Basic"},
        )


# ── Request / Response schemas ─────────────────────────────────────────────────

class AddFoundingMembersRequest(BaseModel):
    # M2 fix: cap list size to prevent bulk-insert DoS
    emails: list[EmailStr] = Field(..., max_length=1000)


class AddFoundingMembersResponse(BaseModel):
    added: int
    already_existed: int
    total_in_table: int


class GrantRetroactiveResponse(BaseModel):
    granted: int          # users who just received credits
    already_granted: int  # emails already claimed
    not_signed_up: int    # emails in table but no user account yet


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.post(
    "/founding-members",
    response_model=AddFoundingMembersResponse,
    dependencies=[Depends(_require_admin)],
)
def add_founding_members(
    body: AddFoundingMembersRequest,
    db: DBSession = Depends(get_db),
):
    """
    Bulk-add emails to the founding_member_emails table.
    Silently skips duplicates. Safe to call multiple times with overlapping lists.
    """
    added = 0
    already_existed = 0

    for raw_email in body.emails:
        email = raw_email.lower().strip()
        exists = db.query(FoundingMember).filter(FoundingMember.email == email).first()
        if exists:
            already_existed += 1
        else:
            db.add(FoundingMember(email=email))
            added += 1

    db.commit()

    total = db.query(FoundingMember).count()
    return AddFoundingMembersResponse(
        added=added,
        already_existed=already_existed,
        total_in_table=total,
    )


@router.post(
    "/founding-members/grant-retroactive",
    response_model=GrantRetroactiveResponse,
    dependencies=[Depends(_require_admin)],
)
def grant_retroactive(db: DBSession = Depends(get_db)):
    """
    Grant 100 PRD credits to any user whose email is in founding_member_emails
    but hasn't been claimed yet (i.e. they signed up before their email was added,
    or the signup hook was missed).

    Safe to run multiple times — only processes unclaimed rows.
    """
    unclaimed = db.query(FoundingMember).filter(
        FoundingMember.claimed_by.is_(None)
    ).all()

    granted = 0
    already_granted = 0
    not_signed_up = 0

    for fm in unclaimed:
        user = db.query(User).filter(
            User.email == fm.email,
            User.deleted_at.is_(None),
        ).first()

        if not user:
            not_signed_up += 1
            continue

        if user.prd_credits >= FOUNDING_MEMBER_CREDITS:
            # Already has credits from a previous grant
            already_granted += 1
            # Still mark as claimed so it doesn't re-appear
            fm.claimed_by = user.id
            fm.claimed_at = datetime.now(timezone.utc)
        else:
            user.prd_credits = FOUNDING_MEMBER_CREDITS
            fm.claimed_by = user.id
            fm.claimed_at = datetime.now(timezone.utc)
            granted += 1

    db.commit()
    return GrantRetroactiveResponse(
        granted=granted,
        already_granted=already_granted,
        not_signed_up=not_signed_up,
    )


@router.get(
    "/founding-members",
    dependencies=[Depends(_require_admin)],
)
def list_founding_members(db: DBSession = Depends(get_db)):
    """List all founding member emails with claim status."""
    rows = db.query(FoundingMember).order_by(FoundingMember.added_at.desc()).all()
    return [
        {
            "id": r.id,
            "email": r.email,
            "claimed": r.claimed_by is not None,
            "claimed_at": r.claimed_at,
            "added_at": r.added_at,
        }
        for r in rows
    ]
