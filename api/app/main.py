from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from sqladmin import Admin, ModelView
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request

from app.config import settings
from app.database import engine
from app.models.user import User
from app.models.project import Project
from app.models.analysis import Analysis
from app.models.feedback import Feedback
from app.models.insight import Insight
from app.models.founding_member import FoundingMember
from app.models.uploaded_doc import UploadedDoc
from app.models.session import Session
from app.models.waitlist import WaitlistEmail
from app.models.github_chunk import GithubCodeChunk
from app.models.celery_task import CeleryTask
from app.routers import auth, projects, analyses, stream, export, billing, waitlist
from app.routers import uploads, insights, share, feedback as feedback_router, chat, search, ingest, events, slack as slack_router
from app.routers import admin as admin_router
from app.routers import decisions as decisions_router
from app.routers import ingest_email as ingest_email_router
from app.routers import prd_versions as prd_versions_router
from app.routers import integrations as integrations_router
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

@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Ensure Celery's result-backend tables exist in Postgres
    from celery.backends.database.models import ResultModelBase
    ResultModelBase.metadata.create_all(engine)
    yield


app = FastAPI(
    title="PMRead API",
    version="1.0.0",
    docs_url="/api/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url=None,
    lifespan=lifespan,
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SESSION_SECRET,
    https_only=settings.ENVIRONMENT != "development",
    same_site="lax",
)
# M3 fix: only include localhost in development — never expose in production
_cors_origins = [settings.FRONTEND_URL]
if settings.ENVIRONMENT == "development":
    _cors_origins.append("http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Admin ─────────────────────────────────────────────────────────────────────

class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        import secrets as _secrets
        form = await request.form()
        username_ok = _secrets.compare_digest(
            str(form.get("username", "")), settings.ADMIN_USERNAME
        )
        password_ok = _secrets.compare_digest(
            str(form.get("password", "")), settings.ADMIN_PASSWORD
        )
        if username_ok and password_ok:
            request.session["admin_authenticated"] = True
            return True
        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        return request.session.get("admin_authenticated", False)


admin = Admin(
    app,
    engine,
    base_url="/api/admin",
    authentication_backend=AdminAuth(secret_key=settings.JWT_SECRET),
)


class UserAdmin(ModelView, model=User):
    name = "User"
    name_plural = "Users"
    icon = "fa-solid fa-users"
    column_list = [User.email, User.plan, User.billing_provider, User.analyses_used, User.prds_generated_this_month, User.email_verified, User.created_at]
    column_searchable_list = [User.email]
    column_sortable_list = [User.created_at, User.plan, User.analyses_used]
    column_default_sort = [(User.created_at, True)]
    can_delete = False  # soft-delete only


class ProjectAdmin(ModelView, model=Project):
    name = "Project"
    name_plural = "Projects"
    icon = "fa-solid fa-folder"
    column_list = [Project.name, Project.user_id, Project.created_at]
    column_sortable_list = [Project.created_at]
    column_default_sort = [(Project.created_at, True)]
    can_delete = False  # M11 fix: prevent accidental cascade-delete of customer data


class AnalysisAdmin(ModelView, model=Analysis):
    name = "PRD"
    name_plural = "PRDs"
    icon = "fa-solid fa-file-lines"
    column_list = [Analysis.question, Analysis.status, Analysis.tokens_used, Analysis.created_at]
    column_searchable_list = [Analysis.question]
    column_sortable_list = [Analysis.created_at, Analysis.status]
    column_default_sort = [(Analysis.created_at, True)]
    can_delete = True


class InsightAdmin(ModelView, model=Insight):
    name = "Insight"
    name_plural = "Insights"
    icon = "fa-solid fa-lightbulb"
    column_list = [Insight.type, Insight.content, Insight.frequency, Insight.starred, Insight.created_at]
    column_searchable_list = [Insight.content]
    column_sortable_list = [Insight.created_at, Insight.frequency]
    column_default_sort = [(Insight.created_at, True)]
    can_delete = True


class FeedbackAdmin(ModelView, model=Feedback):
    name = "Feedback"
    name_plural = "Feedback"
    icon = "fa-solid fa-comment"
    column_list = [Feedback.category, Feedback.message, Feedback.page, Feedback.user_id, Feedback.created_at]
    column_sortable_list = [Feedback.created_at, Feedback.category]
    column_default_sort = [(Feedback.created_at, True)]
    can_delete = True


class FoundingMemberAdmin(ModelView, model=FoundingMember):
    name = "Founding Member"
    name_plural = "Founding Members"
    icon = "fa-solid fa-star"
    column_list = [FoundingMember.email, FoundingMember.claimed_by, FoundingMember.claimed_at, FoundingMember.added_at]
    column_searchable_list = [FoundingMember.email]
    column_sortable_list = [FoundingMember.added_at, FoundingMember.claimed_at]
    column_default_sort = [(FoundingMember.added_at, True)]
    can_delete = True


class UploadedDocAdmin(ModelView, model=UploadedDoc):
    name = "Uploaded Doc"
    name_plural = "Uploaded Docs"
    icon = "fa-solid fa-file-arrow-up"
    column_list = [UploadedDoc.original_name, UploadedDoc.file_type, UploadedDoc.insight_status, UploadedDoc.project_id, UploadedDoc.created_at]
    column_sortable_list = [UploadedDoc.created_at]
    column_default_sort = [(UploadedDoc.created_at, True)]
    can_delete = True


class SessionAdmin(ModelView, model=Session):
    name = "Session"
    name_plural = "Sessions"
    icon = "fa-solid fa-clock"
    column_list = [Session.user_id, Session.created_at, Session.expires_at]
    column_sortable_list = [Session.created_at, Session.expires_at]
    column_default_sort = [(Session.created_at, True)]
    can_delete = True


class WaitlistAdmin(ModelView, model=WaitlistEmail):
    name = "Waitlist"
    name_plural = "Waitlist"
    icon = "fa-solid fa-envelope"
    column_list = [WaitlistEmail.email, WaitlistEmail.created_at]
    column_searchable_list = [WaitlistEmail.email]
    column_sortable_list = [WaitlistEmail.created_at]
    column_default_sort = [(WaitlistEmail.created_at, True)]
    can_delete = True


class GithubChunkAdmin(ModelView, model=GithubCodeChunk):
    name = "GitHub Chunk"
    name_plural = "GitHub Chunks"
    icon = "fa-brands fa-github"
    column_list = [GithubCodeChunk.project_id, GithubCodeChunk.file_path, GithubCodeChunk.file_summary, GithubCodeChunk.created_at]
    column_searchable_list = [GithubCodeChunk.file_path]
    column_sortable_list = [GithubCodeChunk.created_at]
    column_default_sort = [(GithubCodeChunk.created_at, True)]
    can_create = False
    can_edit = False
    can_delete = True


admin.add_view(UserAdmin)
admin.add_view(ProjectAdmin)
admin.add_view(AnalysisAdmin)
admin.add_view(InsightAdmin)
admin.add_view(FeedbackAdmin)
admin.add_view(FoundingMemberAdmin)
admin.add_view(UploadedDocAdmin)
admin.add_view(SessionAdmin)
admin.add_view(WaitlistAdmin)
class CeleryTaskAdmin(ModelView, model=CeleryTask):
    name = "Celery Task"
    name_plural = "Celery Tasks"
    icon = "fa-solid fa-list-check"
    column_list = [CeleryTask.task_id, CeleryTask.name, CeleryTask.status, CeleryTask.worker, CeleryTask.queue, CeleryTask.date_done]
    column_searchable_list = [CeleryTask.task_id, CeleryTask.name]
    column_sortable_list = [CeleryTask.date_done, CeleryTask.status]
    column_default_sort = [(CeleryTask.date_done, True)]
    can_create = False
    can_edit = False
    can_delete = True


admin.add_view(GithubChunkAdmin)
admin.add_view(CeleryTaskAdmin)

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
app.include_router(feedback_router.router, prefix="/api/feedback", tags=["feedback"])
app.include_router(chat.router, prefix="/api/projects", tags=["chat"])
app.include_router(search.router, prefix="/api/search", tags=["search"])
app.include_router(ingest.router, prefix="/api/ingest", tags=["ingest"])
app.include_router(ingest_email_router.email_router, prefix="/api/ingest", tags=["ingest"])
app.include_router(ingest_email_router.projects_router, prefix="/api/projects", tags=["ingest"])
app.include_router(slack_router.router, prefix="/api/projects", tags=["slack"])
# app.include_router(github.router, prefix="/api/github", tags=["github"])  # coming soon
app.include_router(events.router, prefix="/api/projects", tags=["events"])
app.include_router(decisions_router.router, prefix="/api/decisions", tags=["decisions"])
app.include_router(prd_versions_router.router, prefix="/api/analyses", tags=["prd-versions"])
app.include_router(integrations_router.router, prefix="/api/integrations", tags=["integrations"])
app.include_router(admin_router.router, prefix="/api/admin", tags=["admin"])


@app.get("/api/health")
def health():
    return {"status": "ok"}
