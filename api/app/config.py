from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://pmread_user:password@localhost/pmread"

    # Auth
    JWT_SECRET: str = "change-me-in-production-use-openssl-rand-hex-32"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24
    REMEMBER_ME_EXPIRE_DAYS: int = 30

    # Claude
    ANTHROPIC_API_KEY: str = ""

    # Email (SMTP)
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_TLS: bool = True        # STARTTLS on port 587; set False for SSL-only port 465
    EMAIL_FROM: str = "hello@rohanyeole.com"
    EMAIL_FROM_NAME: str = "PMRead"

    # Razorpay
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""
    RAZORPAY_PRO_PLAN_ID: str = ""         # monthly plan — ₹1,699/mo, create in Razorpay dashboard
    RAZORPAY_PRO_ANNUAL_PLAN_ID: str = ""  # annual plan  — ₹16,990/yr, create in Razorpay dashboard

    # App
    ENVIRONMENT: str = "development"
    FRONTEND_URL: str = "https://pmread.org"
    SENTRY_DSN: str = ""

    # Admin
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "change-me"
    SESSION_SECRET: str = ""   # separate cookie-signing key; falls back to JWT_SECRET in dev

    # GitHub OAuth
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    # Groq — fast free-tier LLM (Llama via Groq cloud); free-user chat + clarify calls
    GROQ_API_KEY: str = ""
    # VoyageAI — primary embedding provider for code (voyage-code-3, 1024-dim)
    VOYAGE_API_KEY: str = ""
    # OpenAI — fallback embedding provider if VOYAGE_API_KEY not set
    OPENAI_API_KEY: str = ""
    # Backend public URL (used for OAuth callbacks — same as FRONTEND_URL in prod behind Nginx)
    BACKEND_URL: str = "http://localhost:8000"

    # Celery
    REDIS_URL: str = "redis://127.0.0.1:6379/0"

    # Storage
    EXPORTS_DIR: str = "./exports"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()

# ── Startup security guards ────────────────────────────────────────────────
_INSECURE_JWT = "change-me-in-production-use-openssl-rand-hex-32"
_INSECURE_ADMIN_PW = "change-me"

if settings.ENVIRONMENT != "development":
    if settings.JWT_SECRET == _INSECURE_JWT:
        raise RuntimeError(
            "SECURITY: JWT_SECRET is still the default value. "
            "Run: openssl rand -hex 32  and set it in .env"
        )
    if settings.ADMIN_PASSWORD == _INSECURE_ADMIN_PW:
        raise RuntimeError(
            "SECURITY: ADMIN_PASSWORD is still 'change-me'. "
            "Set a strong password in .env"
        )
    # M12 fix: prevent open-redirect if FRONTEND_URL is accidentally misconfigured
    if not settings.FRONTEND_URL.startswith("https://"):
        raise RuntimeError(
            "SECURITY: FRONTEND_URL must start with https:// in production."
        )

# SESSION_SECRET defaults to JWT_SECRET if not set separately (dev only)
if not hasattr(settings, "SESSION_SECRET") or not settings.SESSION_SECRET:
    settings.SESSION_SECRET = settings.JWT_SECRET
