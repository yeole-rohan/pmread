"""Builds the insight context block fed to Claude."""


def build_insight_context(insights: list) -> str:
    """Format all project insights into a structured context block for Claude."""
    sections: dict[str, list] = {
        "pain_point": [],
        "feature_request": [],
        "decision": [],
        "action_item": [],
    }
    for ins in insights:
        sections[ins.type].append(ins)

    labels = {
        "pain_point": "PAIN POINTS",
        "feature_request": "FEATURE REQUESTS",
        "decision": "DECISIONS",
        "action_item": "ACTION ITEMS",
    }

    parts = []
    for itype, label in labels.items():
        items = sections[itype]
        if not items:
            continue
        parts.append(f"=== {label} ===")
        for ins in items:
            freq = f" (mentioned {ins.frequency}x)" if ins.frequency > 1 else ""
            parts.append(f"• {ins.content}{freq}")
            if ins.quote:
                parts.append(f'  Quote: "{ins.quote}"')
    return "\n".join(parts)
