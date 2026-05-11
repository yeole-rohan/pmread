"""PRD generation business logic: limit enforcement, monthly resets, and founding-member credits."""
from datetime import datetime, timezone

from sqlalchemy import text
from sqlalchemy.orm import Session as DBSession

from app.plan_config import PLAN_LIMITS

# Kept for backwards-compat import by analyses.py (PLAN_PRD_LIMITS["free"], etc.)
PLAN_PRD_LIMITS: dict[str, int] = {
    plan: cfg["prds_per_month"]
    for plan, cfg in PLAN_LIMITS.items()
    if cfg["prds_per_month"] is not None
}


def try_use_prd_credit(user_id: str, db: DBSession) -> bool:
    """
    Atomically decrement prd_credits by 1 if the user has any remaining.
    Also increments analyses_used for tracking.

    Returns True if a credit was consumed (PRD is allowed).
    Returns False if the user has no credits.
    """
    result = db.execute(
        text("""
            UPDATE users
            SET prd_credits   = prd_credits - 1,
                analyses_used = analyses_used + 1
            WHERE id = :user_id
              AND prd_credits > 0
            RETURNING prd_credits
        """),
        {"user_id": user_id},
    ).fetchone()
    db.commit()
    return result is not None


def check_and_increment_prd_limit(user_id: str, plan: str, db: DBSession) -> bool:
    """
    Atomically checks whether the user is within their monthly PRD limit and,
    if so, increments the counter in the same statement.

    Returns True if the PRD is allowed (counter was incremented).
    Returns False if the monthly limit has been reached.

    Handles the monthly reset in a separate idempotent UPDATE so the main
    increment is a single atomic read-modify-write — no TOCTOU race.
    """
    from app.plan_config import get_limit
    limit = get_limit(plan, "prds_per_month")
    if limit is None:
        # Unlimited plan (teams / studio) or unknown plan — allow
        return True

    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # Step 1: Reset counter if we've crossed into a new billing month.
    # Idempotent — only fires once per month even under concurrent requests.
    db.execute(
        text("""
            UPDATE users
            SET prds_generated_this_month = 0,
                prds_reset_at = :month_start
            WHERE id = :user_id
              AND (prds_reset_at IS NULL OR prds_reset_at < :month_start)
        """),
        {"user_id": user_id, "month_start": month_start},
    )

    # Step 2: Atomic increment — only succeeds if still under limit.
    # RETURNING ensures we know if the UPDATE matched a row.
    result = db.execute(
        text("""
            UPDATE users
            SET prds_generated_this_month = prds_generated_this_month + 1,
                analyses_used = analyses_used + 1
            WHERE id = :user_id
              AND prds_generated_this_month < :limit
            RETURNING prds_generated_this_month
        """),
        {"user_id": user_id, "limit": limit},
    ).fetchone()

    db.commit()
    return result is not None
