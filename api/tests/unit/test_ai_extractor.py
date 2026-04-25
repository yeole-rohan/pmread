from app.ai.extractor import parse_extraction


def test_parses_pain_point():
    raw = """
    <insights>
      <pain_point>
        <content>Users cannot export billing data</content>
        <quote>I spend 2 hours every month manually copying invoices</quote>
      </pain_point>
    </insights>
    """
    results = parse_extraction(raw)
    assert len(results) == 1
    assert results[0]["type"] == "pain_point"
    assert results[0]["content"] == "Users cannot export billing data"
    assert "2 hours" in results[0]["quote"]


def test_parses_all_four_types():
    raw = """
    <insights>
      <pain_point><content>Pain</content><quote>q1</quote></pain_point>
      <feature_request><content>Feature</content><quote>q2</quote></feature_request>
      <decision><content>Decision</content><quote></quote></decision>
      <action_item><content>Action</content><quote></quote></action_item>
    </insights>
    """
    results = parse_extraction(raw)
    types = [r["type"] for r in results]
    assert "pain_point" in types
    assert "feature_request" in types
    assert "decision" in types
    assert "action_item" in types


def test_empty_quote_becomes_none():
    raw = "<insights><pain_point><content>Some pain</content><quote></quote></pain_point></insights>"
    results = parse_extraction(raw)
    assert results[0]["quote"] is None


def test_missing_quote_tag_becomes_none():
    raw = "<insights><feature_request><content>Add CSV export</content></feature_request></insights>"
    results = parse_extraction(raw)
    assert results[0]["quote"] is None


def test_empty_content_is_skipped():
    raw = "<insights><pain_point><content></content><quote>orphan quote</quote></pain_point></insights>"
    results = parse_extraction(raw)
    assert results == []


def test_multiple_same_type():
    raw = """
    <insights>
      <pain_point><content>First pain</content><quote></quote></pain_point>
      <pain_point><content>Second pain</content><quote>evidence</quote></pain_point>
    </insights>
    """
    results = parse_extraction(raw)
    pain_points = [r for r in results if r["type"] == "pain_point"]
    assert len(pain_points) == 2
    assert pain_points[0]["content"] == "First pain"
    assert pain_points[1]["content"] == "Second pain"


def test_empty_string_returns_empty_list():
    assert parse_extraction("") == []


def test_no_xml_tags_returns_empty_list():
    assert parse_extraction("This is just plain text with no XML.") == []


def test_whitespace_is_stripped_from_content():
    raw = "<insights><pain_point><content>  padded content  </content><quote>  padded quote  </quote></pain_point></insights>"
    results = parse_extraction(raw)
    assert results[0]["content"] == "padded content"
    assert results[0]["quote"] == "padded quote"


def test_multiline_content_is_preserved():
    raw = """<insights>
      <feature_request>
        <content>Users want CSV export
for billing data</content>
        <quote>Can you add export?</quote>
      </feature_request>
    </insights>"""
    results = parse_extraction(raw)
    assert "CSV export" in results[0]["content"]
