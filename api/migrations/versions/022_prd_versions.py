"""add prd_versions table

Revision ID: 022
Revises: 021
"""
revision = "022"
down_revision = "021"

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB


def upgrade():
    op.execute("""
        CREATE TABLE prd_versions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            prd_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
            brief JSONB,
            brief_markdown TEXT,
            trigger VARCHAR(20) NOT NULL DEFAULT 'creation',
            triggered_by UUID REFERENCES users(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    """)
    op.execute("CREATE INDEX ix_prd_versions_prd_id ON prd_versions(prd_id)")


def downgrade():
    op.execute("DROP INDEX IF EXISTS ix_prd_versions_prd_id")
    op.drop_table("prd_versions")
