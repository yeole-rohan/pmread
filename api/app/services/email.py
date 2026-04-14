import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.config import settings

VERIFY_EMAIL_HTML = """
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; max-width: 480px; margin: 40px auto; color: #1a1a1a;">
  <h2 style="color: #7F77DD;">Verify your PMRead account</h2>
  <p>Hi {name},</p>
  <p>Click the link below to verify your email address:</p>
  <p>
    <a href="{verify_url}"
       style="background: #7F77DD; color: white; padding: 12px 24px;
              border-radius: 6px; text-decoration: none; display: inline-block;">
      Verify Email
    </a>
  </p>
  <p style="color: #888; font-size: 13px;">This link expires in 48 hours.</p>
  <p style="color: #888; font-size: 13px;">
    If you didn't create a PMRead account, ignore this email.
  </p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="color: #aaa; font-size: 12px;">— PMRead</p>
</body>
</html>
"""


def _send_smtp(to_email: str, subject: str, html: str) -> None:
    """Synchronous SMTP send — called from BackgroundTasks (runs in thread pool)."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>"
    msg["To"] = to_email
    msg.attach(MIMEText(html, "html"))

    if settings.SMTP_TLS:
        # STARTTLS (port 587)
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
            server.ehlo()
            server.starttls(context=ssl.create_default_context())
            server.ehlo()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.EMAIL_FROM, to_email, msg.as_string())
    else:
        # SSL (port 465)
        ctx = ssl.create_default_context()
        with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, context=ctx, timeout=15) as server:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.EMAIL_FROM, to_email, msg.as_string())


DIGEST_EMAIL_HTML = """
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; max-width: 520px; margin: 40px auto; color: #1a1a1a;">
  <div style="margin-bottom: 24px;">
    <span style="background: #7F77DD; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; letter-spacing: 1px;">PMREAD</span>
  </div>
  <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 4px;">Your week in insights</h2>
  <p style="color: #888; font-size: 14px; margin-top: 0;">{project_name}</p>

  <div style="background: #f8f7ff; border-radius: 12px; padding: 20px; margin: 24px 0;">
    <p style="margin: 0 0 12px 0; font-size: 14px; color: #555;">New this week:</p>
    {insight_rows}
  </div>

  <p style="font-size: 14px; color: #444;">
    Your evidence is building up.
    {prd_nudge}
  </p>

  <p style="margin-top: 28px;">
    <a href="{project_url}"
       style="background: #7F77DD; color: white; padding: 12px 24px;
              border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
      Review insights →
    </a>
  </p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
  <p style="color: #aaa; font-size: 12px;">
    You're receiving this because you have a PMRead account.
    <a href="{unsubscribe_url}" style="color: #aaa;">Unsubscribe</a>
  </p>
</body>
</html>
"""

INSIGHT_ROW_HTML = """
  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
    <span style="width: 8px; height: 8px; border-radius: 50%; background: {color}; display: inline-block; flex-shrink: 0;"></span>
    <span style="font-size: 14px; color: #333; font-weight: 600;">{count}</span>
    <span style="font-size: 14px; color: #666;">{label}</span>
  </div>
"""

TYPE_COLORS = {
    "pain_point": "#f87171",
    "feature_request": "#60a5fa",
    "decision": "#fbbf24",
    "action_item": "#34d399",
}

TYPE_LABELS = {
    "pain_point": "pain points",
    "feature_request": "feature requests",
    "decision": "decisions",
    "action_item": "action items",
}


def build_digest_email(
    name: str,
    project_name: str,
    project_id: str,
    counts: dict,
    total_insights: int,
    frontend_url: str,
) -> str:
    rows = ""
    for itype, color in TYPE_COLORS.items():
        c = counts.get(itype, 0)
        if c > 0:
            rows += INSIGHT_ROW_HTML.format(color=color, count=c, label=TYPE_LABELS[itype])

    if not rows:
        return ""

    prd_nudge = (
        f"You now have {total_insights} total insights. Ready to generate a PRD?"
        if total_insights >= 5
        else "Keep uploading — the more evidence, the stronger your PRDs."
    )

    project_url = f"{frontend_url}/project/{project_id}"
    unsubscribe_url = f"{frontend_url}/settings"

    return DIGEST_EMAIL_HTML.format(
        project_name=project_name,
        insight_rows=rows,
        prd_nudge=prd_nudge,
        project_url=project_url,
        unsubscribe_url=unsubscribe_url,
    )


RESET_PASSWORD_HTML = """
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; max-width: 480px; margin: 40px auto; color: #1a1a1a;">
  <h2 style="color: #7F77DD;">Reset your PMRead password</h2>
  <p>Hi {name},</p>
  <p>We received a request to reset your password. Click below to choose a new one:</p>
  <p>
    <a href="{reset_url}"
       style="background: #7F77DD; color: white; padding: 12px 24px;
              border-radius: 6px; text-decoration: none; display: inline-block;">
      Reset Password
    </a>
  </p>
  <p style="color: #888; font-size: 13px;">This link expires in 1 hour.</p>
  <p style="color: #888; font-size: 13px;">
    If you didn't request a password reset, you can safely ignore this email.
  </p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="color: #aaa; font-size: 12px;">— PMRead</p>
</body>
</html>
"""


async def send_verification_email(email: str, token: str, name: str) -> None:
    verify_url = f"{settings.FRONTEND_URL}/api/auth/verify-email?token={token}"

    if not settings.SMTP_HOST:
        # Dev mode — print link to console
        print(f"[DEV] Verify link for {email}: {verify_url}")
        return

    html = VERIFY_EMAIL_HTML.format(name=name or email, verify_url=verify_url)
    # smtplib is blocking; FastAPI BackgroundTasks runs in a thread pool so this is fine
    _send_smtp(email, "Verify your PMRead account", html)
