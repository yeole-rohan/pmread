"""Add starred + used_in_prd on insights, share_token on analyses

Revision ID: 005
Revises: 004
"""

from alembic import op
import sqlalchemy as sa

revision = "005"
down_revision = "004"
branch_labels = None
depends_on = None


def upgrade():
    # ── insights ─────────────────────────────────────────────────────────
    op.add_column("insights", sa.Column(
        "starred", sa.Boolean(), nullable=False, server_default="false"
    ))
    op.add_column("insights", sa.Column(
        "used_in_prd", sa.Boolean(), nullable=False, server_default="false"
    ))
    op.create_index("idx_insights_starred", "insights", ["project_id", "starred"])

    # ── analyses ─────────────────────────────────────────────────────────
    op.add_column("analyses", sa.Column(
        "share_token", sa.String(64), nullable=True
    ))
    op.create_index("idx_analyses_share_token", "analyses", ["share_token"], unique=True)


def downgrade():
    op.drop_index("idx_analyses_share_token", table_name="analyses")
    op.drop_column("analyses", "share_token")
    op.drop_index("idx_insights_starred", table_name="insights")
    op.drop_column("insights", "used_in_prd")
    op.drop_column("insights", "starred")
