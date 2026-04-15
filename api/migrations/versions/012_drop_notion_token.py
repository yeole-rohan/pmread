"""drop notion_access_token from users

Revision ID: 012
Revises: 011
Create Date: 2026-04-15
"""
from alembic import op

revision = "012"
down_revision = "011"
branch_labels = None
depends_on = None


def upgrade():
    op.drop_column("users", "notion_access_token")


def downgrade():
    import sqlalchemy as sa
    op.add_column("users", sa.Column("notion_access_token", sa.String(), nullable=True))
