import re
import tempfile
import os

MAX_CHARS_PER_DOC = 15_000
ALLOWED_TYPES = {"pdf", "txt", "docx", "md"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def clean_text(text: str) -> str:
    text = text.replace("\x00", "")
    text = re.sub(r"\n{3,}", "\n\n", text)
    lines = [line.strip() for line in text.split("\n")]
    text = "\n".join(lines)
    text = re.sub(r"^\W+$", "", text, flags=re.MULTILINE)
    return text.strip()


def truncate_doc(text: str) -> str:
    if len(text) <= MAX_CHARS_PER_DOC:
        return text
    return text[:12_000] + "\n\n[...truncated...]\n\n" + text[-3_000:]


def parse_pdf(file_bytes: bytes) -> str:
    import fitz  # pymupdf

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    try:
        doc = fitz.open(tmp_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return clean_text(text)
    finally:
        os.unlink(tmp_path)


def parse_docx(file_bytes: bytes) -> str:
    from docx import Document
    import io

    doc = Document(io.BytesIO(file_bytes))
    text = "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
    return clean_text(text)


def parse_text(file_bytes: bytes) -> str:
    text = file_bytes.decode("utf-8", errors="ignore")
    return clean_text(text)


# H8 fix: magic bytes for supported binary types — txt/md are skipped (no magic)
_MAGIC: dict[str, bytes] = {
    "pdf":  b"%PDF",
    "docx": b"PK\x03\x04",  # ZIP container (Office Open XML)
}


def _check_magic(file_bytes: bytes, ext: str) -> None:
    expected = _MAGIC.get(ext)
    if expected and not file_bytes[:4].startswith(expected):
        from fastapi import HTTPException
        raise HTTPException(
            status_code=415,
            detail={"error": f"File content does not match .{ext} format", "code": "INVALID_FILE_CONTENT"},
        )


def parse_file(file_bytes: bytes, filename: str) -> tuple[str, str]:
    """Returns (extracted_text, file_type)."""
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if ext not in ALLOWED_TYPES:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=415,
            detail={"error": f"Unsupported file type: .{ext}", "code": "UNSUPPORTED_FILE_TYPE"},
        )

    # Verify actual file bytes match the declared extension (H8 fix)
    _check_magic(file_bytes, ext)

    if ext == "pdf":
        text = parse_pdf(file_bytes)
    elif ext == "docx":
        text = parse_docx(file_bytes)
    else:
        text = parse_text(file_bytes)

    if not text.strip():
        from fastapi import HTTPException
        raise HTTPException(
            status_code=400,
            detail={"error": f"Could not extract text from {filename}. File may be empty or image-only.", "code": "EMPTY_FILE"},
        )

    return truncate_doc(text), ext
