"""Celery task: transactional emails (verification, pro welcome, etc.)."""
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


@celery_app.task(bind=True, max_retries=3, default_retry_delay=30)
def send_workspace_invite_task(
    self,
    to_email: str,
    inviter_name: str,
    workspace_name: str,
    role: str,
    invite_token: str,
) -> None:
    from app.services.email import _send_smtp, WORKSPACE_INVITE_HTML

    invite_url = f"{settings.FRONTEND_URL}/join/{invite_token}"

    if not settings.SMTP_HOST:
        print(f"[DEV] Workspace invite for {to_email}: {invite_url}")
        return

    html = WORKSPACE_INVITE_HTML.format(
        inviter_name=inviter_name,
        workspace_name=workspace_name,
        role=role,
        invite_url=invite_url,
    )
    try:
        _send_smtp(to_email, f"{inviter_name} invited you to {workspace_name} on PMRead", html)
    except Exception as exc:
        raise self.retry(exc=exc)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def send_teams_welcome_email_task(self, email: str, name: str) -> None:
    from app.services.email import _send_smtp, TEAMS_WELCOME_HTML

    if not settings.SMTP_HOST:
        print(f"[DEV] Teams welcome email would be sent to {email}")
        return

    html = TEAMS_WELCOME_HTML.format(
        name=name or email.split("@")[0],
        app_url=settings.FRONTEND_URL,
    )
    try:
        _send_smtp(email, "Your team is on PMRead Teams 🚀", html)
    except Exception as exc:
        raise self.retry(exc=exc)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def send_pro_welcome_email_task(self, email: str, name: str) -> None:
    """Send a welcome-to-Pro email after payment is verified. Retries up to 3x."""
    from app.services.email import _send_smtp, PRO_WELCOME_HTML

    if not settings.SMTP_HOST:
        print(f"[DEV] Pro welcome email would be sent to {email}")
        return

    html = PRO_WELCOME_HTML.format(
        name=name or email.split("@")[0],
        app_url=settings.FRONTEND_URL,
    )
    try:
        _send_smtp(email, "You're on PMRead Pro 🎉", html)
    except Exception as exc:
        raise self.retry(exc=exc)
