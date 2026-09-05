"""
FastAPI Router — Unified Screening Pipeline
One endpoint that runs all 6 modules in sequence and returns a complete ScreeningResult.
This is the main endpoint used by the frontend dashboard.
"""

import uuid, shutil
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pathlib import Path
from typing import Optional

from services.ocr_engine          import (
    parse_mrz,
    extract_text_easyocr,
    extract_fields_by_regex,
    extract_document_fields,
)
from services.validator           import run_full_validation
from services.tampering_detector  import run_full_tampering_analysis
from services.face_matcher        import run_face_verification
from services.risk_engine         import compute_risk_score
from services.blockchain_ledger   import log_screening_event
from utils.pdf_handler            import process_uploaded_document

router    = APIRouter()
UPLOAD_DIR = Path(__file__).parent.parent / "uploads"


@router.post("/screen")
async def full_screen(
    document_file:   UploadFile = File(...),
    document_type:   str        = Form("PASSPORT"),
    live_image_b64:  Optional[str] = Form(None),
    officer_id:      str        = Form("OFFICER-01"),
    checkpoint:      str        = Form("CHECKPOINT-ALPHA"),
):
    """
    🔴 MASTER SCREENING ENDPOINT
    Upload a document image or PDF + optional base64 live face.
    Runs PDF Rendering → OCR → Validation → Tampering → Face → Risk Score → Audit Log.
    Returns complete ScreeningResult JSON.
    """
    session_id = str(uuid.uuid4())

    # ── Save uploaded document (Images or PDFs rendered to image) ────────────
    doc_path, doc_url, embedded_pdf_text = process_uploaded_document(
        upload_file=document_file,
        dest_dir=UPLOAD_DIR,
        prefix=f"screen_{session_id[:8]}"
    )

    # ── MODULE 1: OCR ────────────────────────────────────────────────────────
    raw_text, ocr_confidence = extract_text_easyocr(str(doc_path))

    # If PDF has embedded digital text, combine with OCR for maximum accuracy
    if embedded_pdf_text and embedded_pdf_text.strip():
        combined_text = f"{embedded_pdf_text}\n{raw_text}".strip()
        ocr_confidence = max(ocr_confidence, 0.95)
    else:
        combined_text = raw_text

    regex_fields = extract_fields_by_regex(combined_text)
    doc_fields   = extract_document_fields(combined_text, doc_type=document_type, image_path=str(doc_path))
    mrz_data     = None

    extracted = {**regex_fields, **doc_fields}

    if document_type.upper() == "PASSPORT":
        mrz_data = parse_mrz(str(doc_path))
        if mrz_data and not mrz_data.get("error"):
            extracted.update({
                "name":            mrz_data.get("name"),
                "passport_number": mrz_data.get("passport_number"),
                "nationality":     mrz_data.get("nationality"),
                "date_of_birth":   mrz_data.get("date_of_birth"),
                "date_of_expiry":  mrz_data.get("date_of_expiry"),
                "gender":          mrz_data.get("gender"),
                "dob_mrz":         mrz_data.get("dob_mrz", ""),
                "expiry_mrz":      mrz_data.get("expiry_mrz", ""),
                "mrz_cd_passport": mrz_data.get("mrz_cd_passport", ""),
                "mrz_cd_dob":      mrz_data.get("mrz_cd_dob", ""),
                "mrz_cd_expiry":   mrz_data.get("mrz_cd_expiry", ""),
            })

    ocr_result = {
        "document_type": document_type,
        "raw_text":      combined_text,
        "confidence":    ocr_confidence,
        "ocr_engine":    "easyocr + pymupdf" if embedded_pdf_text else "easyocr",
        "extracted":     extracted,
        "mrz":           mrz_data,
        "image_url":     doc_url,
    }

    # ── MODULE 2: VALIDATION ─────────────────────────────────────────────────
    validation_result = run_full_validation(extracted, doc_type=document_type)

    # ── MODULE 3: TAMPERING DETECTION ────────────────────────────────────────
    tampering_result = run_full_tampering_analysis(str(doc_path))

    # ── MODULE 4: FACE VERIFICATION ─────────────────────────────────────────
    face_result = None
    if live_image_b64 and isinstance(live_image_b64, str) and live_image_b64.strip():
        face_result = run_face_verification(str(doc_path), live_image_b64)

    # ── MODULE 5: RISK SCORE ─────────────────────────────────────────────────
    risk_result = compute_risk_score(
        validation_result = validation_result,
        tampering_result  = tampering_result,
        face_result       = face_result,
    )

    # ── MODULE 6: AUDIT LOG ──────────────────────────────────────────────────
    full_payload = {
        "session_id":  session_id,
        "ocr":         ocr_result,
        "validation":  validation_result,
        "tampering":   {k: v for k, v in tampering_result.items() if k != "techniques"},
        "face":        face_result,
        "risk":        risk_result,
    }

    doc_number = (
        extracted.get("passport_number")
        or extracted.get("aadhaar_number")
        or extracted.get("pan_number")
        or extracted.get("driving_license_number")
        or extracted.get("doc_number")
        or "UNKNOWN"
    )

    audit_entry = log_screening_event(
        session_id      = session_id,
        officer_id      = officer_id,
        checkpoint      = checkpoint,
        doc_type        = document_type,
        extracted_name  = extracted.get("name", "UNKNOWN"),
        doc_number      = doc_number,
        risk_score      = risk_result["total_score"],
        risk_band       = risk_result["band"],
        action_taken    = risk_result["recommended_action"],
        full_payload    = full_payload,
    )

    # ── FINAL RESPONSE ────────────────────────────────────────────────────────
    return {
        "status":     "success",
        "session_id": session_id,
        "timestamp":  datetime.utcnow().isoformat() + "Z",
        "ocr":        ocr_result,
        "validation": validation_result,
        "tampering":  tampering_result,
        "face":       face_result,
        "risk":       risk_result,
        "audit":      audit_entry,
    }
