"""Celery task: transactional emails (verification, etc.)."""
from app.worker import celery_app
from app.config import settings


@celery_app.task(bind=True, max_retries=3, default_retry_delay=30)
def send_verification_email_task(self, email: str, token: str, name: str) -> None:
    from app.services.email import _send_smtp, VERIFY_EMAIL_HTML

    verify_url = f"{settings.FRONTEND_URL}/api/auth/verify-email?token={token}"

    if not settings.SMTP_HOST:
        print(f"[DEV] Verify link for {email}: {verify_url}")
        return

    html = VERIFY_EMAIL_HTML.format(name=name or email, verify_url=verify_url)
    try:
        _send_smtp(email, "Verify your PMRead account", html)
    except Exception as exc:
        raise self.retry(exc=exc)
