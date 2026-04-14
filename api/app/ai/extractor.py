"""Pipeline A — insight extraction prompt and response parser."""
import re

EXTRACTION_SYSTEM_PROMPT = """You are a product research analyst. Extract structured insights from the document below.

For each insight found, identify:
- Type: pain_point | feature_request | decision | action_item
- Content: the insight in 1-2 clear sentences
- Quote: exact verbatim text from the document that supports it (leave empty if none)

Rules:
- Extract only what is explicitly stated or strongly implied
- Be specific — avoid generic statements like "users want better UX"
- Output ONLY the XML structure below, nothing else

<insights>
  <pain_point>
    <content>Users cannot export billing data, forcing manual copy-paste into spreadsheets</content>
    <quote>I spend 2 hours every month manually copying invoice data into our accounting tool</quote>
  </pain_point>
  <feature_request>
    <content>CSV export for billing and invoice data</content>
    <quote>Can you just add a CSV export button on the billing page?</quote>
  </feature_request>
  <decision>
    <content>Team decided to prioritize mobile app over web improvements for Q3</content>
    <quote></quote>
  </decision>
  <action_item>
    <content>Schedule follow-up call with enterprise prospect by end of week</content>
    <quote></quote>
  </action_item>
</insights>"""


def parse_extraction(raw: str) -> list[dict]:
    """Parse Claude's XML extraction response into a list of insight dicts."""
    results = []
    for itype in ("pain_point", "feature_request", "decision", "action_item"):
        for match in re.finditer(rf'<{itype}>(.*?)</{itype}>', raw, re.DOTALL):
            block = match.group(1)
            content_m = re.search(r'<content>(.*?)</content>', block, re.DOTALL)
            quote_m = re.search(r'<quote>(.*?)</quote>', block, re.DOTALL)
            content = content_m.group(1).strip() if content_m else ""
            quote = quote_m.group(1).strip() if quote_m else None
            if content:
                results.append({
                    "type": itype,
                    "content": content,
                    "quote": quote or None,
                })
    return results
