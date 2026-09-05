"""
ShieldScan — Developer API Platform (B2B SaaS / GovTech Integration)
Endpoints:
- POST /api/v1/keys/generate : Generate a free Developer API Key
- GET  /api/v1/keys/list     : List registered API Keys & usage
- POST /api/v1/verify        : Unified Document Verification API for Form Fill-up & KYC
"""

import os
import json
import time
import uuid
import secrets
from pathlib import Path
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, Form, Header, HTTPException, Query, Request

from services.ocr_engine import (
    parse_mrz,
    extract_text_easyocr,
    extract_fields_by_regex,
    extract_document_fields,
)
from services.validator import run_full_validation
from services.tampering_detector import run_full_tampering_analysis
from services.risk_engine import compute_risk_score
from services.blockchain_ledger import log_screening_event
from utils.pdf_handler import process_uploaded_document

router = APIRouter()
UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
KEYS_FILE = Path(__file__).parent.parent / "developer_keys.json"

# ── Local Key Store Management (100% Free, Local, No Cloud Dependencies) ──────
DEFAULT_KEYS = {
    "sk_test_shieldscan_demo_2024": {
        "key": "sk_test_shieldscan_demo_2024",
        "app_name": "Demo College Admission Form",
        "developer": "developer@shieldscan.org",
        "tier": "FREE_COMMUNITY",
        "daily_limit": 500,
        "requests_used": 12,
        "created_at": "2024-09-01T10:00:00Z",
        "active": True
    }
}

def load_keys() -> dict:
    if not KEYS_FILE.exists():
        save_keys(DEFAULT_KEYS)
        return DEFAULT_KEYS
    try:
        with open(KEYS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return DEFAULT_KEYS

def save_keys(keys_data: dict):
    with open(KEYS_FILE, "w", encoding="utf-8") as f:
        json.dump(keys_data, f, indent=2)

def authenticate_key(api_key: Optional[str]) -> dict:
    if not api_key:
        raise HTTPException(
            status_code=401,
            detail={
                "error": "Unauthorized",
                "message": "Missing 'X-API-Key' header. Generate your free key at http://localhost:5173/developers",
                "docs_url": "http://localhost:5173/developers"
            }
        )
    keys = load_keys()
    # Also support stripping 'Bearer ' if sent in Authorization
    cleaned_key = api_key.replace("Bearer ", "").strip()
    if cleaned_key not in keys or not keys[cleaned_key].get("active", True):
        raise HTTPException(
            status_code=401,
            detail={
                "error": "Invalid API Key",
                "message": f"API key '{cleaned_key[:12]}...' is invalid or revoked. Generate a new key at /developers",
                "docs_url": "http://localhost:5173/developers"
            }
        )
    # Increment usage
    keys[cleaned_key]["requests_used"] = keys[cleaned_key].get("requests_used", 0) + 1
    save_keys(keys)
    return keys[cleaned_key]


# ── KEY GENERATION & MANAGEMENT ───────────────────────────────────────────────
@router.post("/keys/generate")
async def generate_api_key(
    app_name: str = Form("My Form App"),
    developer_email: str = Form("developer@example.com"),
):
    """
    Generate a 100% Free Developer API Key.
    No credit card or cloud account required.
    """
    keys = load_keys()
    random_token = secrets.token_hex(16)
    new_key = f"sk_live_sh_{random_token}"

    key_record = {
        "key": new_key,
        "app_name": app_name,
        "developer": developer_email,
        "tier": "FREE_TIER",
        "daily_limit": 500,
        "requests_used": 0,
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "active": True
    }

    keys[new_key] = key_record
    save_keys(keys)

    return {
        "success": True,
        "message": "Developer API Key successfully created!",
        "api_key": new_key,
        "app_name": app_name,
        "tier": "FREE_TIER (500 req/day)",
        "docs_url": "http://localhost:5173/developers"
    }


@router.get("/keys/list")
async def list_api_keys():
    """List all registered API keys (for Developer Dashboard)."""
    keys = load_keys()
    return {"total_keys": len(keys), "keys": list(keys.values())}


# ── THE CORE DOCUMENT VERIFICATION API ────────────────────────────────────────
@router.post("/verify")
async def verify_document_api(
    file: UploadFile = File(...),
    document_type: str = Form("AUTO"),
    strict_mode: bool = Form(False),
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
    authorization: Optional[str] = Header(None),
):
    """
    ⚡ CENTRAL DOCUMENT VERIFICATION API
    Integrate into any college admission form, job portal, or banking KYC workflow.

    Headers:
      X-API-Key: sk_live_sh_...

    Returns:
      Instant JSON decision: is_authentic (true/false), status (APPROVED/REJECTED),
      risk_score, specific rejection reasons, and extracted biographical fields.
    """
    start_time = time.time()
    effective_key = x_api_key or authorization

    # Check API Key validity
    key_info = authenticate_key(effective_key)

    session_id = str(uuid.uuid4())

    # 1. Handle uploaded document (Images or PDFs rendered)
    doc_path, doc_url, embedded_pdf_text = process_uploaded_document(
        upload_file=file,
        dest_dir=UPLOAD_DIR,
        prefix=f"api_{session_id[:8]}"
    )

    # 2. Multi-Engine OCR Extraction
    raw_text, ocr_confidence = extract_text_easyocr(str(doc_path))
    if embedded_pdf_text and embedded_pdf_text.strip():
        combined_text = f"{embedded_pdf_text}\n{raw_text}".strip()
        ocr_confidence = max(ocr_confidence, 0.95)
    else:
        combined_text = raw_text

    # Auto-detect document type if "AUTO"
    doc_type_resolved = document_type.upper()
    if doc_type_resolved == "AUTO":
        lower_text = combined_text.lower()
        if "aadhaar" in lower_text or "uidai" in lower_text or "enrolment" in lower_text:
            doc_type_resolved = "AADHAAR"
        elif "income tax" in lower_text or "permanent account" in lower_text:
            doc_type_resolved = "PAN_CARD"
        elif "driving" in lower_text or "licence" in lower_text or "license" in lower_text:
            doc_type_resolved = "DRIVING_LICENSE"
        elif "republic of india" in lower_text or "passport" in lower_text or "p<ind" in lower_text:
            doc_type_resolved = "PASSPORT"
        elif "visa" in lower_text:
            doc_type_resolved = "VISA"
        else:
            doc_type_resolved = "NATIONAL_ID"

    # Extract fields
    regex_fields = extract_fields_by_regex(combined_text)
    doc_fields = extract_document_fields(combined_text, doc_type=doc_type_resolved, image_path=str(doc_path))
    extracted = {**regex_fields, **doc_fields}

    # If passport, check MRZ
    if doc_type_resolved == "PASSPORT":
        mrz_data = parse_mrz(str(doc_path))
        if mrz_data and not mrz_data.get("error"):
            extracted.update(mrz_data)

    # 3. Rule Validation (Verhoeff Checksum, ICAO 9303, PAN regex)
    validation_res = run_full_validation(extracted, doc_type=doc_type_resolved)

    # 4. Tampering Forensics (Error Level Analysis ELA, Copy-Move CMFD, EXIF)
    tampering_res = run_full_tampering_analysis(str(doc_path))

    # 5. Composite Risk Score Engine
    # (For API verification without live selfie, face_contrib defaults to baseline)
    risk_res = compute_risk_score(
        validation_result=validation_res,
        tampering_result=tampering_res,
        face_result=None,
        watchlist_hit=False
    )

    total_score = risk_res.get("total_score", 0.0)
    risk_band = risk_res.get("band", "GREEN")

    # Determine Rejection / Approval
    # In strict mode: reject if score > 35. Normal mode: reject if score > 50 or tamper detected.
    threshold = 35.0 if strict_mode else 50.0
    is_tampered = bool(tampering_res.get("overall_tampered", False))
    is_valid = bool(validation_res.get("overall_valid", True))

    rejection_reasons = []

    # Collect specific human-readable reasons for developers to show in their UI
    if not is_valid:
        for chk in validation_res.get("checks", []):
            if not chk.get("passed", True):
                rejection_reasons.append(f"{chk.get('check_name')}: {chk.get('detail')}")

    if is_tampered:
        for tech in tampering_res.get("techniques", []):
            if tech.get("tampered"):
                rejection_reasons.append(f"Forensics: {tech.get('technique')} - {tech.get('detail')}")

    if total_score > threshold and not rejection_reasons:
        rejection_reasons.append(f"Composite risk score ({total_score:.1f}/100) exceeded allowable threshold ({threshold}).")

    if total_score <= 25.0 and not is_tampered and is_valid:
        status = "APPROVED"
        is_authentic = True
        verdict = "DOCUMENT_AUTHENTIC"
    elif total_score <= threshold and not is_tampered:
        status = "FLAGGED_FOR_MANUAL_REVIEW"
        is_authentic = True
        verdict = "LOW_CONFIDENCE_REQUIRES_REVIEW"
    else:
        status = "REJECTED"
        is_authentic = False
        verdict = "FORGERY_OR_TAMPERING_DETECTED"

    # 6. Immutable Blockchain Audit Logging
    audit_event = log_screening_event(
        session_id=session_id,
        officer_id=f"API:{key_info.get('app_name', 'EXTERNAL_APP')}",
        checkpoint="DEVELOPER_API_GATEWAY",
        doc_type=doc_type_resolved,
        extracted_name=extracted.get("name", "Unknown"),
        doc_number=extracted.get("passport_number") or extracted.get("aadhaar_number") or extracted.get("pan_number") or extracted.get("dl_number") or "Unknown",
        risk_score=total_score,
        risk_band=risk_band,
        action_taken=verdict,
        full_payload={
            "status": status,
            "verdict": verdict,
            "rejection_reasons": rejection_reasons,
            "extracted": extracted,
            "risk": risk_res,
        },
    )

    execution_time = int((time.time() - start_time) * 1000)

    return {
        "success": True,
        "session_id": session_id,
        "status": status,                       # "APPROVED" | "REJECTED" | "FLAGGED_FOR_MANUAL_REVIEW"
        "is_authentic": is_authentic,           # True / False
        "verdict": verdict,
        "risk_score": round(total_score, 1),
        "risk_band": risk_band,                 # "GREEN" | "YELLOW" | "RED"
        "rejection_reasons": rejection_reasons, # Detailed reasons why document was rejected
        "document_type": doc_type_resolved,
        "extracted_data": {
            "name": extracted.get("name"),
            "document_number": extracted.get("passport_number") or extracted.get("aadhaar_number") or extracted.get("pan_number") or extracted.get("dl_number"),
            "date_of_birth": extracted.get("date_of_birth"),
            "nationality": extracted.get("nationality", "IND"),
            "gender": extracted.get("gender"),
            "date_of_expiry": extracted.get("date_of_expiry"),
        },
        "validation_summary": {
            "is_valid": is_valid,
            "failed_checks": validation_res.get("failure_count", 0),
        },
        "forensics_summary": {
            "is_tampered": is_tampered,
            "ela_heatmap_url": f"http://localhost:8000{tampering_res.get('heatmap_url')}" if tampering_res.get("heatmap_url") else None,
        },
        "blockchain_audit": {
            "event_hash": audit_event.get("event_hash"),
            "block_id": audit_event.get("id"),
        },
        "api_meta": {
            "app_name": key_info.get("app_name"),
            "quota_used": key_info.get("requests_used"),
            "quota_daily_limit": key_info.get("daily_limit"),
            "execution_time_ms": execution_time,
        }
    }
