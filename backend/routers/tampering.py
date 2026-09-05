"""FastAPI Router — Module 3: Tampering Detection"""

import uuid, shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
from services.tampering_detector import run_full_tampering_analysis
from utils.pdf_handler import process_uploaded_document

router = APIRouter()
UPLOAD_DIR = Path(__file__).parent.parent / "uploads"


@router.post("/analyze")
async def analyze_tampering(file: UploadFile = File(...)):
    """
    Upload a document image or PDF and run full tampering analysis.
    Returns ELA, CMFD, EXIF forensics, and noise analysis results with heatmaps.
    """
    path, url, _ = process_uploaded_document(
        upload_file=file,
        dest_dir=UPLOAD_DIR,
        prefix="tamper"
    )

    result = run_full_tampering_analysis(str(path))
    return {"status": "success", "image_path": str(path), "image_url": url, **result}
