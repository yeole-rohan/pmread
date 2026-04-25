import os

os.environ.setdefault("ENVIRONMENT", "development")
os.environ.setdefault("JWT_SECRET", "test-jwt-secret-key-for-testing-only")
os.environ.setdefault("FRONTEND_URL", "http://localhost:3000")
os.environ.setdefault("SESSION_SECRET", "test-session-secret-for-testing")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")

# Point to a dedicated test database — override via TEST_DATABASE_URL env var
TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL",
    "postgresql://pmread_user:password@localhost/pmread_test",
)
os.environ["DATABASE_URL"] = TEST_DATABASE_URL

import uuid
from datetime import datetime, timezone

import pytest
import pytest_asyncio
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session as OrmSession, sessionmaker

from app.database import Base, get_db
from app.auth import create_access_token

# Register all models with Base.metadata
from app.models.user import User  # noqa: F401
from app.models.session import Session as UserSession  # noqa: F401
from app.models.founding_member import FoundingMember  # noqa: F401
from app.models.project import Project  # noqa: F401
from app.models.insight import Insight  # noqa: F401
from app.models.analysis import Analysis  # noqa: F401
from app.models.uploaded_doc import UploadedDoc  # noqa: F401
from app.models.waitlist import WaitlistEmail  # noqa: F401


# ── Session-scoped engine — tables created once per test run ──────────────

@pytest.fixture(scope="session")
def pg_engine():
    from sqlalchemy import text

    engine = create_engine(TEST_DATABASE_URL)
    with engine.connect() as conn:
        conn.execute(text('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'))
        conn.commit()
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)
    engine.dispose()


# ── Per-test transaction isolation via savepoints ─────────────────────────
#
# Outer connection starts a real transaction.
# Session uses join_transaction_mode="create_savepoint" so that
# route-level db.commit() calls create/release savepoints instead of
# committing to the database. The outer transaction is rolled back after
# each test, leaving the DB clean.

@pytest.fixture
def db(pg_engine) -> OrmSession:
    connection = pg_engine.connect()
    transaction = connection.begin()
    session = sessionmaker(
        bind=connection,
        join_transaction_mode="create_savepoint",
    )()
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture
def test_user(db: OrmSession) -> User:
    from app.auth import hash_password

    user = User(
        email="test@example.com",
        password_hash=hash_password("testpassword123"),
        display_name="Test User",
        email_verified=True,
    )
    db.add(user)
    db.flush()
    return user


@pytest.fixture
def auth_headers(test_user: User) -> dict:
    token = create_access_token(str(test_user.id), test_user.email)
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture
async def client(db: OrmSession) -> AsyncClient:
    from app.routers.auth import router as auth_router

    app = FastAPI()
    app.include_router(auth_router, prefix="/api/auth")

    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac
