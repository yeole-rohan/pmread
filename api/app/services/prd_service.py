"""PRD generation business logic: limit enforcement and monthly resets."""
from datetime import datetime, timezone

from sqlalchemy import text
from sqlalchemy.orm import Session as DBSession

# Free: 2 PRDs/month | Pro: 15 PRDs/month
PLAN_PRD_LIMITS: dict[str, int] = {"free": 2, "pro": 15}


def check_and_increment_prd_limit(user_id: str, plan: str, db: DBSession) -> bool:
    """
    Atomically checks whether the user is within their monthly PRD limit and,
    if so, increments the counter in the same statement.

    Returns True if the PRD is allowed (counter was incremented).
    Returns False if the monthly limit has been reached.

    Handles the monthly reset in a separate idempotent UPDATE so the main
    increment is a single atomic read-modify-write — no TOCTOU race.
    """
    limit = PLAN_PRD_LIMITS.get(plan)
    if limit is None:
        # Unknown plan — allow (fail open; should not happen in practice)
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
