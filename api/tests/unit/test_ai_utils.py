from app.ai.utils import insight_fingerprint, extract_project_name


# ── insight_fingerprint ────────────────────────────────────────────────────


def test_fingerprint_is_64_hex_chars():
    fp = insight_fingerprint("some content")
    assert len(fp) == 64
    assert all(c in "0123456789abcdef" for c in fp)


def test_fingerprint_same_content_same_hash():
    assert insight_fingerprint("hello world") == insight_fingerprint("hello world")


def test_fingerprint_different_content_different_hash():
    assert insight_fingerprint("content a") != insight_fingerprint("content b")


def test_fingerprint_case_insensitive():
    assert insight_fingerprint("Hello World") == insight_fingerprint("hello world")


def test_fingerprint_strips_punctuation():
    # Punctuation is removed during normalization
    assert insight_fingerprint("Hello, World!") == insight_fingerprint("Hello World")


def test_fingerprint_collapses_whitespace():
    assert insight_fingerprint("hello   world") == insight_fingerprint("hello world")


def test_fingerprint_leading_trailing_whitespace():
    assert insight_fingerprint("  hello  ") == insight_fingerprint("hello")


def test_fingerprint_empty_string():
    # Should not raise; deterministic empty hash
    fp = insight_fingerprint("")
    assert len(fp) == 64


# ── extract_project_name ──────────────────────────────────────────────────


def test_extract_project_name_for_pattern():
    assert extract_project_name("Build a PRD for Checkout") == "Checkout"


def test_extract_project_name_in_pattern():
    assert extract_project_name("Improve performance in Dashboard") == "Dashboard"


def test_extract_project_name_about_pattern():
    assert extract_project_name("Write a spec about Notifications") == "Notifications"


def test_extract_project_name_improve_pattern():
    assert extract_project_name("Improve Onboarding flow") == "Onboarding"


def test_extract_project_name_with_pattern():
    assert extract_project_name("Design a feature with Analytics") == "Analytics"


def test_extract_project_name_fallback_to_first_three_words():
    result = extract_project_name("Customer billing export requirements")
    assert result == "Customer Billing Export"


def test_extract_project_name_title_cases_result():
    result = extract_project_name("PRD for checkout")
    assert result == result.title()


def test_extract_project_name_short_input():
    result = extract_project_name("PRD")
    assert result == "Prd"
