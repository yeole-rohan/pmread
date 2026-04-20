"""Add extensions JSONB column to analyses table

Revision ID: 017
Revises: 016
Create Date: 2026-04-19
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import text

revision = "017"
down_revision = "016"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "analyses",
        sa.Column("extensions", JSONB, nullable=True, server_default=text("'[]'::jsonb")),
    )


def downgrade():
    op.drop_column("analyses", "extensions")
