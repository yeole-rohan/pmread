"""add github token to users and github_repo to projects

Revision ID: 010
Revises: 009
Create Date: 2026-04-15
"""
from alembic import op
import sqlalchemy as sa

revision = "010"
down_revision = "009"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("github_access_token", sa.String(), nullable=True))
    op.add_column("projects", sa.Column("github_repo", sa.String(), nullable=True))


def downgrade():
    op.drop_column("users", "github_access_token")
    op.drop_column("projects", "github_repo")
