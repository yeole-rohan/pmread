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
from app.routers import auth, projects, analyses, stream, export, billing, waitlist
from app.routers import uploads, insights, share, feedback as feedback_router
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

app.add_middleware(SessionMiddleware, secret_key=settings.JWT_SECRET)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Admin ─────────────────────────────────────────────────────────────────────

class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username_ok = form.get("username") == settings.ADMIN_USERNAME
        password_ok = form.get("password") == settings.ADMIN_PASSWORD
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
    can_delete = True


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


admin.add_view(UserAdmin)
admin.add_view(ProjectAdmin)
admin.add_view(AnalysisAdmin)
admin.add_view(InsightAdmin)
admin.add_view(FeedbackAdmin)

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


@app.get("/api/health")
def health():
    return {"status": "ok"}
