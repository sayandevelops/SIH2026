"""FastAPI Router — Module 4: Face Verification"""

import uuid, shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi import Form
from pydantic import BaseModel
from typing import Optional
from pathlib import Path
from services.face_matcher import run_face_verification

router = APIRouter()
UPLOAD_DIR = Path(__file__).parent.parent / "uploads"


class FaceVerifyRequest(BaseModel):
    doc_image_url:   str            # path or URL of already-uploaded document image
    live_image_b64:  Optional[str]  # base64-encoded webcam frame


@router.post("/verify")
async def verify_face(req: FaceVerifyRequest):
    """
    Compare face in document vs live webcam image.
    Accepts document path + base64 live image.
    """
    result = run_face_verification(req.doc_image_url, req.live_image_b64)
    return {"status": "success", **result}


@router.post("/verify-files")
async def verify_face_files(
    doc_file:  UploadFile = File(...),
    live_file: UploadFile = File(...),
):
    """Alternative endpoint accepting two image files directly."""
    def save(f: UploadFile, prefix: str) -> str:
        ext  = Path(f.filename).suffix or ".jpg"
        name = f"{prefix}_{uuid.uuid4().hex[:8]}{ext}"
        path = UPLOAD_DIR / name
        with open(str(path), "wb") as out:
            shutil.copyfileobj(f.file, out)
        return str(path)

    doc_path  = save(doc_file,  "doc")
    live_path = save(live_file, "live")

    result = run_face_verification(doc_path, None)
    # For file-based: use live_path directly
    from services.face_matcher import match_faces, check_liveness_mediapipe
    match   = match_faces(doc_path, live_path)
    liveness = check_liveness_mediapipe(live_path)
    result.update(match)
    result["liveness_passed"] = liveness.get("liveness_passed")
    result["liveness_score"]  = liveness.get("liveness_score")

    return {"status": "success", **result}
