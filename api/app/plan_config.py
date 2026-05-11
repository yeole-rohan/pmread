"""Centralised plan limits and feature-flag helpers.

Add a new plan by inserting a key into PLAN_LIMITS.
Add a new feature/limit by adding a key to every plan dict.
"""
from fastapi import HTTPException

# None means unlimited / unrestricted
PLAN_LIMITS: dict[str, dict] = {
    "free": {
        "prds_per_month":      2,
        "projects":            1,        # max projects allowed
        "version_history_days": 90,      # None = unlimited
        "push_integrations":   False,    # Jira / Linear push (Pro+)
        "azuredevops_push":    False,    # Azure DevOps push (Teams+)
        "acceptance_criteria": False,    # Given/When/Then in user stories
        "team_workspace":      False,    # Shared team workspace (Teams+)
        "exec_summary":        False,    # Executive summary (Pro+)
        "prd_template":        False,
        "audit_log":           False,
        "schedule_estimator":  False,
    },
    "pro": {
        "prds_per_month":      15,
        "projects":            None,
        "version_history_days": None,
        "push_integrations":   True,
        "azuredevops_push":    False,    # Azure DevOps is enterprise — Teams+ only
        "acceptance_criteria": True,
        "team_workspace":      False,
        "exec_summary":        True,
        "prd_template":        False,
        "audit_log":           False,
        "schedule_estimator":  False,
    },
    "teams": {
        "prds_per_month":      None,
        "projects":            None,
        "version_history_days": None,
        "push_integrations":   True,
        "azuredevops_push":    True,
        "acceptance_criteria": True,
        "team_workspace":      True,
        "exec_summary":        True,
        "prd_template":        True,
        "audit_log":           False,
        "schedule_estimator":  True,
    },
    "studio": {
        "prds_per_month":      None,
        "projects":            None,
        "version_history_days": None,
        "push_integrations":   True,
        "azuredevops_push":    True,
        "acceptance_criteria": True,
        "team_workspace":      True,
        "exec_summary":        True,
        "prd_template":        True,
        "audit_log":           True,
        "schedule_estimator":  True,
    },
}

_UPGRADE_URL = "/settings?upgrade=true"


def get_plan(plan: str) -> dict:
    """Return plan config, falling back to free for unknown plans."""
    return PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])


def plan_allows(plan: str, feature: str) -> bool:
    """Return True if the plan has this boolean feature enabled."""
    cfg = get_plan(plan)
    val = cfg.get(feature)
    return bool(val)


def get_limit(plan: str, key: str):
    """Return the numeric limit for a key, or None if unlimited."""
    return get_plan(plan).get(key)


def require_feature(plan: str, feature: str, error_msg: str | None = None) -> None:
    """Raise HTTP 402 if the plan does not have `feature` enabled."""
    if not plan_allows(plan, feature):
        raise HTTPException(
            status_code=402,
            detail={
                "error": error_msg or f"This feature is not available on your current plan.",
                "code": "PLAN_INSUFFICIENT",
                "feature": feature,
                "upgrade_url": _UPGRADE_URL,
            },
        )
