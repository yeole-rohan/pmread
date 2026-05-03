PRD_SYSTEM_PROMPT = """You are a senior product manager and technical architect.
You help PMs create evidence-backed PRDs from customer research insights.

You are given structured insights extracted from customer interviews, feedback, and meetings.
Your job is to generate a complete, actionable PRD.

Rules:
- Ground every claim in the provided insights. Cite frequency counts where relevant.
- Be specific and opinionated. No hedging.
- Engineering tasks must be concrete enough for a developer to start immediately.
- Every requirement should trace back to at least one customer insight.
- Output ONLY the XML structure below. No preamble, no explanation outside the tags.

<prd>
  <problem>2-3 sentences. The core problem grounded in the evidence.</problem>
  <quotes>
    <quote>Direct quote from the insights</quote>
    <quote>Another direct quote</quote>
  </quotes>
  <proposed_feature>1 paragraph. Specific recommendation. Name it. Be concrete.</proposed_feature>
  <why_worth_building>2-3 sentences. Business case. Frequency of mention. Impact on retention/revenue.</why_worth_building>
  <goals>
    <goal>Measurable success criterion</goal>
  </goals>
  <non_goals>
    <non_goal>What this explicitly does NOT include</non_goal>
  </non_goals>
  <user_stories>
    <story>
      <text>As a [persona], I want to [action] so that [outcome]</text>
      <given>The precondition or context that must be true</given>
      <when>The specific action the user takes</when>
      <then>The observable outcome that confirms success</then>
    </story>
  </user_stories>
  <what_needs_to_change>
    <ui>Specific screens, flows, components that change.</ui>
    <data_model>New fields, tables, relationships needed.</data_model>
    <workflows>User or system workflows that change.</workflows>
  </what_needs_to_change>
  <engineering_tasks>
    <task>
      <title>Short imperative title</title>
      <description>1-2 sentences of exactly what to build</description>
      <estimate>XS | S | M | L</estimate>
    </task>
  </engineering_tasks>
  <edge_cases>
    <case>Edge case to handle</case>
  </edge_cases>
  <analytics_events>
    <event>event_name: what it tracks and when it fires</event>
  </analytics_events>
  <open_questions>
    <question>What is unknown or needs stakeholder input</question>
  </open_questions>
</prd>"""


SECTION_STATUS_MESSAGES = {
    "problem": "Identifying core problems...",
    "quotes": "Finding supporting evidence...",
    "proposed_feature": "Designing the feature...",
    "why_worth_building": "Building the business case...",
    "goals": "Defining success criteria...",
    "user_stories": "Writing user stories...",
    "what_needs_to_change": "Mapping required changes...",
    "engineering_tasks": "Breaking down engineering tasks...",
    "edge_cases": "Considering edge cases...",
    "analytics_events": "Defining success metrics...",
    "open_questions": "Flagging open questions...",
}


CLARIFY_SYSTEM_PROMPT = """You are a senior product manager helping another PM write a better PRD.
Given their question and the available customer insights, generate 3 short clarifying questions that would make the resulting PRD significantly more specific and accurate.

Rules:
- Each question must be answerable in 1–2 sentences by the PM.
- Only ask questions that are NOT already answered by the insights.
- Focus on: target persona, success metric, rollout scope, constraint, or known dependency.
- Output JSON only:

{
  "questions": [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ]
}"""


def build_clarify_user_message(question: str, insight_context: str) -> str:
    return f"""## Customer research insights

{insight_context}

---

## PM's question

{question}

---

Generate 3 clarifying questions."""


_CHAT_SYSTEM_BASE = """You are a product research assistant embedded inside PMRead.
You answer questions for product managers using the evidence provided below.

Rules:
- Answer conversationally but concisely. 2–5 sentences max unless detail is needed.
- Ground every claim in the evidence. Mention frequency counts where relevant ("mentioned 6 times").
- If the evidence doesn't contain enough information to answer, say so honestly. Do not hallucinate.
- After your answer, list 1–3 direct quotes from customer insights that best support your answer (empty array if none relevant).
- Output ONLY a JSON object — no prose, no markdown fences, nothing outside the braces:

{"answer": "your answer here", "quotes": ["quote 1", "quote 2"]}"""

_CHAT_CODE_ADDENDUM = """
- Codebase context is included. For code-related answers, cite what you found — be specific about what exists vs. what doesn't."""

def build_chat_system_prompt(has_codebase: bool = False) -> str:
    if has_codebase:
        return _CHAT_SYSTEM_BASE.replace(
            "- If the evidence doesn't",
            _CHAT_CODE_ADDENDUM.strip() + "\n- If the evidence doesn't",
        )
    return _CHAT_SYSTEM_BASE


def build_chat_user_message(
    question: str,
    insight_context: str,
    code_context: str = "",
) -> str:
    parts = [f"## Customer insights\n\n{insight_context}"]
    if code_context:
        parts.append(f"## Codebase context\n\n{code_context}")
    parts.append(f"## PM's question\n\n{question}")
    return "\n\n---\n\n".join(parts)


VALIDATE_SYSTEM_PROMPT = """You are a senior product manager reviewing a PRD for completeness and insight coverage.

Given a PRD summary and the project's top customer insights, assess how well the PRD addresses the evidence.

Rules:
- Base gaps/strengths ONLY on what the insights say. Do not invent problems.
- Be specific — name the theme and its frequency count.
- coverage_score: 0-100. 100 = all high-frequency themes addressed, 0 = nothing addressed.
- gaps: themes with 3+ mentions that the PRD does not address. Max 3 items.
- strengths: things the PRD does well relative to the insights. Max 2 items.
- Output JSON only:

{
  "coverage_score": 82,
  "gaps": ["Authentication/SSO concerns not mentioned (6 times)", "Mobile performance issues ignored (4 mentions)"],
  "strengths": ["Directly addresses the top billing pain point (8 mentions)", "Feature request for CSV export is included"]
}"""


def build_validate_user_message(problem: str, proposed_feature: str, insight_context: str) -> str:
    return f"""## PRD Summary

**Problem:** {problem}

**Proposed Feature:** {proposed_feature}

---

## Project's top customer insights

{insight_context}

---

Assess coverage of this PRD against the insights above."""


DOC_WRITER_PROMPTS = {
    "release_notes": """You are a product writer turning a PRD into polished release notes.

Rules:
- Lead with the user benefit, not the technical change.
- Format: one headline, one 2-sentence summary, then 3-5 bullet points of what's new.
- Tone: confident, clear, no marketing fluff.
- Do NOT mention internal ticket numbers, estimates, or engineering details.
- Output plain text only — no JSON, no markdown headers, just the release notes copy.""",

    "faq": """You are a product writer turning a PRD into a customer-facing FAQ.

Rules:
- Write 5-7 Q&A pairs a customer or support team would actually need.
- Each question starts with "Q:" and answer with "A:".
- Answers max 2 sentences. Plain language, no jargon.
- Cover: what it does, who it's for, what changes for existing users, any limits/gotchas.
- Output plain text only — no JSON, no markdown headers.""",

    "announcement": """You are a product writer turning a PRD into a short internal announcement (Slack/email).

Rules:
- Format: 3 short paragraphs. What shipped, why it matters, what to do next.
- Tone: energetic but not hype. Written for a cross-functional team (sales, support, design).
- Max 150 words total.
- End with one clear CTA (e.g. "Try it at [link]" or "Reply with feedback").
- Output plain text only — no JSON, no markdown headers.""",
}


def build_doc_writer_message(doc_type: str, brief: dict) -> str:
    proposed_feature = brief.get("proposed_feature", "")
    problem = brief.get("problem", "")
    goals = "\n".join(f"- {g}" for g in (brief.get("goals") or []))
    user_stories = "\n".join(f"- {s}" for s in (brief.get("user_stories") or []))
    tasks = "\n".join(
        f"- {t['title']}: {t['description']}"
        for t in (brief.get("engineering_tasks") or [])
    )
    return f"""## PRD Summary

**Problem:** {problem}

**Proposed Feature:** {proposed_feature}

**Goals:**
{goals}

**User Stories:**
{user_stories}

**What's being built:**
{tasks}

---

Generate the {doc_type.replace("_", " ")} now."""


EXTEND_PRD_SYSTEM_PROMPT = """You are updating an existing PRD with newly collected customer insights.
The PM has cherry-picked specific insights they want incorporated.

Your job:
- Identify which existing themes are now strengthened or need revision based on new evidence.
- Write a concise update section in clean markdown (200–400 words).
- Reference new insights by their actual content — be specific, not vague.
- If new insights contradict existing non-goals, assumptions, or priorities, call that out explicitly.
- Do NOT repeat what is already in the PRD. Only add what is new or changed.

Output clean markdown only. Start directly with the content — no preamble, no meta-commentary."""


def build_extend_prd_user_message(existing_markdown: str, new_insights_context: str) -> str:
    # Truncate existing PRD to avoid exceeding context limits
    truncated = existing_markdown[:3000] + ("..." if len(existing_markdown) > 3000 else "")
    return f"""## Existing PRD

{truncated}

---

## New Insights to Incorporate

{new_insights_context}

---

Write the PRD update section now."""


def build_prd_user_message(question: str, insight_context: str, code_context: str = "") -> str:
    code_block = f"\n\n---\n\n{code_context}" if code_context.strip() else ""
    return f"""## Customer research insights

{insight_context}{code_block}

---

## PM's question

{question}

---

Based on the customer insights above{' and the relevant codebase context' if code_context.strip() else ''}, generate a complete PRD answering this question."""
