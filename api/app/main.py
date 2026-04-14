from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, projects, analyses, stream, export, billing, waitlist
from app.routers import uploads, insights, share
if settings.SENTRY_DSN:
    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration
    from sentry_sdk.integrations.starlette import StarletteIntegration
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENVIRONMENT,
        integrations=[StarletteIntegration(), FastApiIntegration()],
        traces_sample_rate=0.2,
        send_default_pii=False,
    )

app = FastAPI(
    title="PMRead API",
    version="1.0.0",
    docs_url="/api/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(uploads.router, prefix="/api/projects", tags=["uploads"])
app.include_router(insights.router, prefix="/api/projects", tags=["insights"])
app.include_router(analyses.router, prefix="/api/analyses", tags=["analyses"])
app.include_router(stream.router, prefix="/api/stream", tags=["stream"])
app.include_router(export.router, prefix="/api/export", tags=["export"])
app.include_router(billing.router, prefix="/api/billing", tags=["billing"])
app.include_router(waitlist.router, prefix="/api/waitlist", tags=["waitlist"])
app.include_router(share.router, prefix="/api/share", tags=["share"])


@app.get("/api/health")
def health():
    return {"status": "ok"}
