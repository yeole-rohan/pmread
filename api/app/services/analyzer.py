"""
Backward-compatibility shim. All logic has moved to app/ai/.
Import directly from app.ai.generator / app.ai.utils instead.
"""
from app.ai.generator import (  # noqa: F401
    run_analysis,
    get_or_create_queue,
    emit_sse,
    detect_section,
)
from app.ai.utils import extract_project_name  # noqa: F401
from app.ai.prompts import (  # noqa: F401
    PRD_SYSTEM_PROMPT,
    SECTION_STATUS_MESSAGES,
    build_prd_user_message,
)
from app.ai.context import build_insight_context  # noqa: F401
from app.ai.parser import parse_prd_response, prd_to_markdown  # noqa: F401
