from app.ai.parser import parse_prd_response, prd_to_markdown

FULL_PRD_XML = """
<problem>Users cannot export billing data</problem>
<quote>I spend 2 hours every month</quote>
<quote>This is a blocker for our finance team</quote>
<proposed_feature>CSV export for invoices</proposed_feature>
<why_worth_building>Reduces churn from billing-heavy customers</why_worth_building>
<goals><goal>One-click CSV download</goal><goal>Filter by date range</goal></goals>
<non_goals><non_goal>PDF export (future)</non_goal></non_goals>
<user_stories>
  <story>
    <text>As a finance manager, I want to export invoices as CSV</text>
    <given>The user has at least one paid invoice</given>
    <when>They click Export on the Billing page</when>
    <then>A CSV file downloads with all invoice rows</then>
  </story>
</user_stories>
<what_needs_to_change>
  <ui>Add Export button to Billing page</ui>
  <data_model>No schema change needed</data_model>
  <workflows>New GET /billing/export endpoint</workflows>
</what_needs_to_change>
<engineering_tasks>
  <task>
    <title>Build export endpoint</title>
    <description>GET /billing/export?from=&to=</description>
    <estimate>S</estimate>
  </task>
</engineering_tasks>
<edge_cases><case>Empty billing history returns empty CSV</case></edge_cases>
<analytics_events><event>billing_export_clicked</event></analytics_events>
<open_questions><question>Should we include tax breakdown?</question></open_questions>
"""


def test_parse_prd_all_fields():
    result = parse_prd_response(FULL_PRD_XML)
    assert result["problem"] == "Users cannot export billing data"
    assert len(result["problem_quotes"]) == 2
    assert result["proposed_feature"] == "CSV export for invoices"
    assert result["why_worth_building"] == "Reduces churn from billing-heavy customers"
    assert result["goals"] == ["One-click CSV download", "Filter by date range"]
    assert result["non_goals"] == ["PDF export (future)"]
    assert len(result["user_stories"]) == 1
    story = result["user_stories"][0]
    assert isinstance(story, dict)
    assert story["story"] == "As a finance manager, I want to export invoices as CSV"
    assert story["given"] == "The user has at least one paid invoice"
    assert story["when"] == "They click Export on the Billing page"
    assert story["then"] == "A CSV file downloads with all invoice rows"
    assert result["what_needs_to_change"]["ui"] == "Add Export button to Billing page"
    assert result["what_needs_to_change"]["data_model"] == "No schema change needed"
    assert result["what_needs_to_change"]["workflows"] == "New GET /billing/export endpoint"
    assert len(result["engineering_tasks"]) == 1
    assert result["engineering_tasks"][0]["title"] == "Build export endpoint"
    assert result["engineering_tasks"][0]["estimate"] == "S"
    assert result["edge_cases"] == ["Empty billing history returns empty CSV"]
    assert result["analytics_events"] == ["billing_export_clicked"]
    assert result["open_questions"] == ["Should we include tax breakdown?"]


def test_parse_prd_missing_tags_return_empty():
    result = parse_prd_response("<problem>Only a problem</problem>")
    assert result["problem"] == "Only a problem"
    assert result["proposed_feature"] == ""
    assert result["goals"] == []
    assert result["engineering_tasks"] == []


def test_parse_prd_empty_string():
    result = parse_prd_response("")
    assert result["problem"] == ""
    assert result["goals"] == []
    assert result["engineering_tasks"] == []


def test_engineering_task_missing_estimate_defaults_to_m():
    raw = """
    <engineering_tasks>
      <task>
        <title>Some task</title>
        <description>Do it</description>
      </task>
    </engineering_tasks>
    """
    result = parse_prd_response(raw)
    assert result["engineering_tasks"][0]["estimate"] == "M"


def test_prd_to_markdown_contains_sections():
    brief = parse_prd_response(FULL_PRD_XML)
    md = prd_to_markdown(brief)
    assert "# PRD" in md
    assert "## Problem" in md
    assert "## Proposed Feature" in md
    assert "## Goals" in md
    assert "## Non-Goals" in md
    assert "## User Stories" in md
    assert "## Engineering Tasks" in md
    assert "## Edge Cases" in md
    assert "## Analytics Events" in md
    assert "## Open Questions" in md
    assert "pmread.org" in md


def test_prd_to_markdown_includes_quotes_as_blockquotes():
    brief = parse_prd_response(FULL_PRD_XML)
    md = prd_to_markdown(brief)
    assert '> "I spend 2 hours every month"' in md


def test_prd_to_markdown_task_includes_estimate():
    brief = parse_prd_response(FULL_PRD_XML)
    md = prd_to_markdown(brief)
    assert "`S`" in md


def test_prd_to_markdown_empty_brief():
    brief = parse_prd_response("")
    md = prd_to_markdown(brief)
    assert "# PRD" in md


# --- Given/When/Then acceptance criteria ---

NEW_STORY_XML = """
<user_stories>
  <story>
    <text>As a PM, I want to generate a PRD so that I save time</text>
    <given>The user has uploaded at least one insight</given>
    <when>They click Generate PRD</when>
    <then>A structured PRD appears within 30 seconds</then>
  </story>
</user_stories>
"""

OLD_STORY_XML = """
<user_stories>
  <story>As a PM, I want to generate a PRD so that I save time</story>
</user_stories>
"""

MIXED_STORY_XML = """
<user_stories>
  <story>
    <text>As a PM, I want to share a PRD</text>
    <given>A PRD has been generated</given>
    <when>They click Share</when>
    <then>A shareable link is copied to clipboard</then>
  </story>
  <story>As an engineer, I want to read the PRD so that I understand scope</story>
</user_stories>
"""


def test_new_story_format_parses_as_dict():
    result = parse_prd_response(NEW_STORY_XML)
    assert len(result["user_stories"]) == 1
    s = result["user_stories"][0]
    assert isinstance(s, dict)
    assert s["story"] == "As a PM, I want to generate a PRD so that I save time"
    assert s["given"] == "The user has uploaded at least one insight"
    assert s["when"] == "They click Generate PRD"
    assert s["then"] == "A structured PRD appears within 30 seconds"


def test_old_story_format_parses_as_string():
    result = parse_prd_response(OLD_STORY_XML)
    assert len(result["user_stories"]) == 1
    assert result["user_stories"][0] == "As a PM, I want to generate a PRD so that I save time"


def test_mixed_story_format_backward_compat():
    result = parse_prd_response(MIXED_STORY_XML)
    assert len(result["user_stories"]) == 2
    assert isinstance(result["user_stories"][0], dict)
    assert isinstance(result["user_stories"][1], str)


def test_story_missing_given_when_then_still_parses():
    xml = "<user_stories><story><text>As a user, I want X</text></story></user_stories>"
    result = parse_prd_response(xml)
    s = result["user_stories"][0]
    assert isinstance(s, dict)
    assert s["story"] == "As a user, I want X"
    assert s["given"] == ""
    assert s["when"] == ""
    assert s["then"] == ""


def test_prd_to_markdown_new_story_includes_ac():
    brief = parse_prd_response(NEW_STORY_XML)
    md = prd_to_markdown(brief)
    assert "As a PM, I want to generate a PRD" in md
    assert "**Given:**" in md
    assert "The user has uploaded at least one insight" in md
    assert "**When:**" in md
    assert "They click Generate PRD" in md
    assert "**Then:**" in md
    assert "A structured PRD appears within 30 seconds" in md


def test_prd_to_markdown_old_story_no_ac_labels():
    brief = parse_prd_response(OLD_STORY_XML)
    md = prd_to_markdown(brief)
    assert "As a PM, I want to generate a PRD" in md
    assert "**Given:**" not in md
    assert "**When:**" not in md
    assert "**Then:**" not in md
