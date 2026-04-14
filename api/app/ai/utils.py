"""Miscellaneous AI-layer utilities."""
import hashlib
import re


def insight_fingerprint(content: str) -> str:
    """SHA-256 of normalized content — used for dedup within a project."""
    normalized = re.sub(r'[^a-z0-9 ]', '', content.lower())
    normalized = re.sub(r'\s+', ' ', normalized).strip()
    return hashlib.sha256(normalized.encode()).hexdigest()


def extract_project_name(question: str) -> str:
    """Derive a short project name from a PRD question."""
    patterns = [
        r"\bfor\s+(\w+)",
        r"\bin\s+(\w+)",
        r"\babout\s+(\w+)",
        r"\bimprove\s+(\w+)",
        r"\bwith\s+(\w+)",
    ]
    for pattern in patterns:
        m = re.search(pattern, question, re.IGNORECASE)
        if m:
            return m.group(1).title()
    words = question.split()[:3]
    return " ".join(words).title()
