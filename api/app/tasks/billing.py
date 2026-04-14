"""Celery task: monthly PRD counter reset."""
from app.worker import celery_app


@celery_app.task
def reset_monthly_prd_counters_task() -> None:
    """
    Runs on the 1st of every month at midnight UTC.
    Resets prds_generated_this_month to 0 for all active users.
    """
    from datetime import datetime, timezone
    from app.database import SessionLocal
    from app.models.user import User

    db = SessionLocal()
    try:
        now = datetime.now(timezone.utc)
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        updated = (
            db.query(User)
            .filter(User.deleted_at.is_(None))
            .update(
                {"prds_generated_this_month": 0, "prds_reset_at": month_start},
                synchronize_session=False,
            )
        )
        db.commit()
        print(f"[MONTHLY RESET] Reset PRD counters for {updated} users at {now.isoformat()}")
    finally:
        db.close()
