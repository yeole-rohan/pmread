from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session as DBSession

from app.auth import get_current_user
from app.database import get_db
from app.models.project import Project
from app.models.uploaded_doc import UploadedDoc
from app.models.user import User
from app.services.parser import parse_file, MAX_FILE_SIZE, ALLOWED_TYPES
from app.worker import extract_insights_task

router = APIRouter()

MAX_FILES = 5


@router.post("/{project_id}/upload")
async def upload_files(
    project_id: str,
    files: list[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """
    Upload files to a project. Insight extraction starts automatically in background.
    No PRD limit check — uploads are always free.
    """
    project = db.query(Project).filter(
        Project.id == project_id, Project.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "PROJECT_NOT_FOUND"})

    if not files:
        raise HTTPException(status_code=400, detail={"error": "No files uploaded", "code": "NO_FILES"})

    if len(files) > MAX_FILES:
        raise HTTPException(
            status_code=400,
            detail={"error": f"Max {MAX_FILES} files per upload", "code": "TOO_MANY_FILES"},
        )

    saved = []
    for upload in files:
        file_bytes = await upload.read()

        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail={"error": f"{upload.filename} exceeds 10MB limit", "code": "FILE_TOO_LARGE"},
            )

        extracted_text, file_type = parse_file(file_bytes, upload.filename or "upload")

        doc = UploadedDoc(
            project_id=project.id,
            user_id=current_user.id,
            original_name=upload.filename or "upload",
            file_type=file_type,
            extracted_text=extracted_text,
            char_count=len(extracted_text),
            insight_status="pending",
        )
        db.add(doc)
        db.flush()  # get doc.id before commit
        saved.append(doc)

    db.commit()

    # Fire extraction task per file (background, always free)
    for doc in saved:
        extract_insights_task.delay(str(doc.id))

    return {
        "uploaded": [
            {
                "id": str(doc.id),
                "name": doc.original_name,
                "char_count": doc.char_count,
                "insight_status": doc.insight_status,
            }
            for doc in saved
        ]
    }


@router.get("/{project_id}/docs")
async def list_docs(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    """List all uploaded files for a project with their extraction status."""
    project = db.query(Project).filter(
        Project.id == project_id, Project.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail={"error": "Project not found", "code": "PROJECT_NOT_FOUND"})

    docs = (
        db.query(UploadedDoc)
        .filter(UploadedDoc.project_id == project_id)
        .order_by(UploadedDoc.created_at.desc())
        .all()
    )

    return [
        {
            "id": str(doc.id),
            "name": doc.original_name,
            "file_type": doc.file_type,
            "char_count": doc.char_count,
            "insight_status": doc.insight_status,
            "created_at": doc.created_at,
        }
        for doc in docs
    ]
