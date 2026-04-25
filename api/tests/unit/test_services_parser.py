import pytest
from fastapi import HTTPException

from app.services.parser import clean_text, truncate_doc, parse_file, MAX_CHARS_PER_DOC


# ── clean_text ─────────────────────────────────────────────────────────────


def test_clean_text_removes_null_bytes():
    assert "\x00" not in clean_text("hello\x00world")


def test_clean_text_collapses_triple_newlines():
    result = clean_text("a\n\n\n\nb")
    assert "\n\n\n" not in result
    assert "a" in result and "b" in result


def test_clean_text_strips_line_whitespace():
    result = clean_text("  hello  \n  world  ")
    for line in result.splitlines():
        assert line == line.strip()


def test_clean_text_strips_leading_trailing():
    assert clean_text("\n\nhello\n\n") == "hello"


def test_clean_text_preserves_content():
    text = "First paragraph\n\nSecond paragraph"
    result = clean_text(text)
    assert "First paragraph" in result
    assert "Second paragraph" in result


def test_clean_text_empty_string():
    assert clean_text("") == ""


# ── truncate_doc ───────────────────────────────────────────────────────────


def test_truncate_doc_short_passthrough():
    text = "x" * 100
    assert truncate_doc(text) == text


def test_truncate_doc_exact_limit_passthrough():
    text = "x" * MAX_CHARS_PER_DOC
    assert truncate_doc(text) == text


def test_truncate_doc_long_text_is_shortened():
    text = "x" * (MAX_CHARS_PER_DOC + 1000)
    result = truncate_doc(text)
    assert len(result) < len(text)


def test_truncate_doc_contains_truncation_marker():
    text = "a" * 20_000
    result = truncate_doc(text)
    assert "[...truncated...]" in result


def test_truncate_doc_preserves_start_and_end():
    start = "START_MARKER " * 1000   # ~13k chars
    end = "END_MARKER " * 500        # ~5.5k chars
    text = start + "MIDDLE " * 5000 + end
    result = truncate_doc(text)
    assert "START_MARKER" in result
    assert "END_MARKER" in result


# ── parse_file ─────────────────────────────────────────────────────────────


def test_parse_file_unsupported_extension_raises_415():
    with pytest.raises(HTTPException) as exc_info:
        parse_file(b"content", "file.xyz")
    assert exc_info.value.status_code == 415
    assert exc_info.value.detail["code"] == "UNSUPPORTED_FILE_TYPE"


def test_parse_file_no_extension_raises_415():
    with pytest.raises(HTTPException) as exc_info:
        parse_file(b"content", "noextension")
    assert exc_info.value.status_code == 415


def test_parse_file_pdf_with_wrong_magic_raises_415():
    with pytest.raises(HTTPException) as exc_info:
        parse_file(b"not a real pdf content here", "document.pdf")
    assert exc_info.value.status_code == 415
    assert exc_info.value.detail["code"] == "INVALID_FILE_CONTENT"


def test_parse_file_docx_with_wrong_magic_raises_415():
    with pytest.raises(HTTPException) as exc_info:
        parse_file(b"not a zip file at all", "document.docx")
    assert exc_info.value.status_code == 415
    assert exc_info.value.detail["code"] == "INVALID_FILE_CONTENT"


def test_parse_file_plain_text():
    content = b"Hello this is a plain text file with enough content to pass empty check."
    text, file_type = parse_file(content, "notes.txt")
    assert file_type == "txt"
    assert "Hello" in text


def test_parse_file_markdown():
    content = b"# Title\n\nThis is markdown content with some text."
    text, file_type = parse_file(content, "readme.md")
    assert file_type == "md"
    assert "Title" in text


def test_parse_file_empty_text_raises_400():
    with pytest.raises(HTTPException) as exc_info:
        parse_file(b"   \n  \n  ", "empty.txt")
    assert exc_info.value.status_code == 400
    assert exc_info.value.detail["code"] == "EMPTY_FILE"


def test_parse_file_returns_truncated_text_for_large_input():
    big_content = ("word " * 10_000).encode()
    text, _ = parse_file(big_content, "big.txt")
    assert len(text) <= MAX_CHARS_PER_DOC + len("\n\n[...truncated...]\n\n") + 3000
