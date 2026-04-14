"""Celery task: weekly insight digest emails."""
from app.worker import celery_app
from app.config import settings


@celery_app.task
def send_weekly_digest_task() -> None:
    """
    Runs every Monday 8am UTC.
    For each user with new insights in the last 7 days, send a digest email.
    """
    from datetime import datetime, timezone, timedelta
    from app.database import SessionLocal
    from app.models.user import User
    from app.models.project import Project
    from app.models.insight import Insight
    from app.services.email import build_digest_email, _send_smtp

    db = SessionLocal()
    try:
        week_ago = datetime.now(timezone.utc) - timedelta(days=7)

        active_user_ids = (
            db.query(Insight.project_id)
            .filter(Insight.created_at >= week_ago)
            .distinct()
            .subquery()
        )
        projects_with_new = (
            db.query(Project)
            .filter(Project.id.in_(active_user_ids))
            .all()
        )

        user_project: dict = {}
        for project in projects_with_new:
            uid = str(project.user_id)
            if uid not in user_project:
                user_project[uid] = project

        for uid, project in user_project.items():
            user = db.query(User).filter(User.id == uid).first()
            if not user or not user.email or not user.digest_enabled:
                continue

            new_insights = (
                db.query(Insight)
                .filter(Insight.project_id == project.id, Insight.created_at >= week_ago)
                .all()
            )
            if not new_insights:
                continue

            counts = {}
            for ins in new_insights:
                counts[ins.type] = counts.get(ins.type, 0) + 1

            total = db.query(Insight).filter(Insight.project_id == project.id).count()

            html = build_digest_email(
                name=user.display_name or user.email,
                project_name=project.name,
                project_id=str(project.id),
                counts=counts,
                total_insights=total,
                frontend_url=settings.FRONTEND_URL,
            )
            if not html:
                continue

            if settings.SMTP_HOST:
                try:
                    _send_smtp(user.email, f"Your week in insights — {project.name}", html)
                except Exception:
                    pass
            else:
                print(f"[DIGEST DEV] Would send digest to {user.email} for project {project.name}: {counts}")
    finally:
        db.close()
