"""Add extension_count and extended_at to analyses table

Revision ID: 016
Revises: 015
Create Date: 2026-04-18
"""
from alembic import op
import sqlalchemy as sa

revision = "016"
down_revision = "015"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "analyses",
        sa.Column("extension_count", sa.Integer(), nullable=False, server_default="0"),
    )
    op.add_column(
        "analyses",
        sa.Column("extended_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade():
    op.drop_column("analyses", "extended_at")
    op.drop_column("analyses", "extension_count")
