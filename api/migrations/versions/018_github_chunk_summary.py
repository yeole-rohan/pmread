"""Add file_summary column to github_code_chunks

Revision ID: 018
Revises: 017
Create Date: 2026-04-19
"""
from alembic import op
import sqlalchemy as sa

revision = "018"
down_revision = "017"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "github_code_chunks",
        sa.Column("file_summary", sa.Text(), nullable=True),
    )


def downgrade():
    op.drop_column("github_code_chunks", "file_summary")
