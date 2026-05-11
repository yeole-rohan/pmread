"""Schedule Estimator — Teams+ feature.

POST /analyses/{id}/schedule-estimate
Given team_size + sprint_weeks, returns a sprint-by-sprint delivery plan
derived from the PRD's engineering tasks.
"""
import json
from datetime import date, timedelta

import anthropic
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.plan_config import require_feature
from app.project_access import get_accessible_analysis

router = APIRouter()

POINTS = {"XS": 1, "S": 2, "M": 5, "L": 8}

SCHEDULE_SYSTEM_PROMPT = """You are a senior engineering manager helping a product manager estimate delivery timelines.

You will be given a list of engineering tasks with size estimates (XS=1pt, S=2pt, M=5pt, L=8pt), a team size, and a sprint length in weeks.

Your job is to produce a realistic sprint plan. Rules:
- Assume the team's velocity is 80% of theoretical max (team_size × average_points_per_dev_per_sprint).
- Average points per developer per sprint ≈ 8 (2-week sprint) or 4 (1-week sprint). Scale linearly.
- Group tasks into sprints respecting rough sequencing (setup/data model tasks before UI tasks, etc.).
- Flag tasks that are blockers (other tasks depend on them) in a "critical_path" array.
- If a task is ambiguous about sequencing, place it in the earliest feasible sprint.
- Output ONLY valid JSON — no preamble, no markdown code fences.

JSON schema:
{
  "total_points": <int>,
  "velocity_per_sprint": <int>,
  "total_sprints": <int>,
  "estimated_completion": "<YYYY-MM-DD>",
  "sprints": [
    {
      "sprint": <int>,
      "start_date": "<YYYY-MM-DD>",
      "end_date": "<YYYY-MM-DD>",
      "story_points": <int>,
      "tasks": ["Task title 1", "Task title 2"]
    }
  ],
  "critical_path": ["Task title of blocker 1", ...],
  "risks": ["Short risk note 1", "Short risk note 2"]
}"""


class ScheduleRequest(BaseModel):
    team_size: int = 2
    sprint_weeks: int = 2
    start_date: str | None = None  # ISO date; defaults to today


@router.post("/{analysis_id}/schedule-estimate")
async def generate_schedule(
    analysis_id: str,
    body: ScheduleRequest,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    require_feature(current_user.plan, "schedule_estimator", "Schedule Estimator requires a Teams or Studio plan.")

    analysis, _project = get_accessible_analysis(analysis_id, str(current_user.id), db)
    if not analysis:
        raise HTTPException(status_code=404, detail={"error": "PRD not found", "code": "ANALYSIS_NOT_FOUND"})
    if analysis.status != "complete" or not analysis.brief:
        raise HTTPException(status_code=400, detail={"error": "PRD must be complete", "code": "NOT_COMPLETE"})

    tasks = analysis.brief.get("engineering_tasks", [])
    if not tasks:
        raise HTTPException(status_code=400, detail={"error": "No engineering tasks in this PRD", "code": "NO_TASKS"})

    if body.team_size < 1 or body.team_size > 20:
        raise HTTPException(status_code=400, detail={"error": "team_size must be 1–20", "code": "INVALID_INPUT"})
    if body.sprint_weeks < 1 or body.sprint_weeks > 4:
        raise HTTPException(status_code=400, detail={"error": "sprint_weeks must be 1–4", "code": "INVALID_INPUT"})

    start = date.fromisoformat(body.start_date) if body.start_date else date.today()
    total_pts = sum(POINTS.get(t.get("estimate", "M").upper(), 5) for t in tasks)

    task_lines = "\n".join(
        f"- [{t.get('estimate','M')}] {t.get('title','')}: {t.get('description','')}"
        for t in tasks
    )
    user_message = (
        f"Team size: {body.team_size} engineers\n"
        f"Sprint length: {body.sprint_weeks} week(s)\n"
        f"Start date: {start.isoformat()}\n"
        f"Total story points: {total_pts}\n\n"
        f"Engineering tasks:\n{task_lines}"
    )

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2048,
        system=SCHEDULE_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )
    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[-1].rsplit("```", 1)[0].strip()

    try:
        schedule = json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail={"error": "Failed to parse AI response", "code": "AI_PARSE_ERROR"})

    return schedule
