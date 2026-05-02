"""add decision_log tables

Revision ID: 021
Revises: 020
"""
revision = "021"
down_revision = "020"

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.execute("""
        CREATE TABLE decisions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            what_we_decided TEXT NOT NULL,
            why TEXT,
            status VARCHAR(20) NOT NULL DEFAULT 'active',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    """)
    op.execute("CREATE INDEX ix_decisions_project_id ON decisions(project_id)")
    op.execute("""
        CREATE TABLE decision_evidence_links (
            decision_id UUID NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
            insight_id UUID NOT NULL REFERENCES insights(id) ON DELETE CASCADE,
            PRIMARY KEY (decision_id, insight_id)
        )
    """)


def downgrade():
    op.execute("DROP TABLE IF EXISTS decision_evidence_links")
    op.execute("DROP TABLE IF EXISTS decisions")
