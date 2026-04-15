"""add notion_access_token to users

Revision ID: 009
Revises: 008
Create Date: 2026-04-15
"""
from alembic import op
import sqlalchemy as sa

revision = "009"
down_revision = "008"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("notion_access_token", sa.String(), nullable=True))


def downgrade():
    op.drop_column("users", "notion_access_token")
