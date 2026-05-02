from datetime import datetime, timezone
from typing import Literal
from fastapi import Depends, HTTPException
from app.auth import get_current_user
from app.models.user import User

PLAN_RANK: dict[str, int] = {
    "free": 0,
    "pro": 1,
    "teams": 2,
    "studio": 3,
}

PlanName = Literal["free", "pro", "teams", "studio"]


def plan_rank(plan: str) -> int:
    return PLAN_RANK.get(plan, 0)


def subscription_status(user: User) -> Literal["active", "expired"]:
    if user.plan == "free":
        return "active"
    if user.plan_expires_at is None:
        return "active"
    if datetime.now(timezone.utc) <= user.plan_expires_at:
        return "active"
    return "expired"


def require_plan(minimum: PlanName):
    """
    FastAPI dependency. Use as: user: User = Depends(require_plan("pro"))
    Returns the user if plan is active and meets the minimum tier.
    Raises 402 if plan is expired. Raises 403 if plan is insufficient.
    """
    def _check(user: User = Depends(get_current_user)) -> User:
        if subscription_status(user) == "expired":
            raise HTTPException(
                status_code=402,
                detail={
                    "error": "Your plan has expired. Please upgrade to continue.",
                    "code": "PLAN_EXPIRED",
                },
            )
        if plan_rank(user.plan) < plan_rank(minimum):
            raise HTTPException(
                status_code=403,
                detail={
                    "error": f"This feature requires the {minimum} plan or higher.",
                    "code": "PLAN_INSUFFICIENT",
                    "required_plan": minimum,
                },
            )
        return user
    return _check
