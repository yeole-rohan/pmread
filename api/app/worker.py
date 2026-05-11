"""Celery application entry point.

Run workers with:
    celery -A app.worker worker --loglevel=info
    celery -A app.worker beat --loglevel=info
"""
from celery import Celery
from celery.schedules import crontab

from app.config import settings

celery_app = Celery(
    "pmread",
    broker=settings.REDIS_URL,
    backend="db+" + settings.DATABASE_URL,
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    broker_connection_retry_on_startup=True,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    beat_schedule={
        "weekly-digest": {
            "task": "app.tasks.digest.send_weekly_digest_task",
            "schedule": crontab(day_of_week="mon", hour=8, minute=0),
        },
        "monthly-prd-reset": {
            "task": "app.tasks.billing.reset_monthly_prd_counters_task",
            "schedule": crontab(day_of_month="1", hour=0, minute=0),
        },
    },
)

# Register task modules so Celery discovers all tasks at startup
celery_app.autodiscover_tasks([
    "app.tasks.extraction",
    "app.tasks.digest",
    "app.tasks.billing",
    "app.tasks.email_tasks",
    "app.tasks.github_index",
])

# Re-export tasks for backward-compat imports elsewhere in the codebase
from app.tasks.extraction import extract_insights_task  # noqa: E402, F401
from app.tasks.email_tasks import send_verification_email_task, send_workspace_invite_task, send_teams_welcome_email_task  # noqa: E402, F401
