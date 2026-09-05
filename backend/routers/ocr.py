"""FastAPI Router — Module 1: OCR Extraction"""

import uuid, os, shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
from services.ocr_engine import (
    parse_mrz,
    extract_text_easyocr,
    extract_fields_by_regex,
    extract_document_fields,
    preprocess_image,
)

from utils.pdf_handler import process_uploaded_document

router = APIRouter()
UPLOAD_DIR = Path(__file__).parent.parent / "uploads"


@router.post("/extract")
async def extract_document(
    file:          UploadFile = File(...),
    document_type: str = "PASSPORT",
):
    """
    Upload a document image or PDF and extract all text fields.
    Returns structured JSON with extracted data and confidence score.
    """
    save_path, url, embedded_text = process_uploaded_document(
        upload_file=file,
        dest_dir=UPLOAD_DIR,
        prefix="doc"
    )

    # OCR
    raw_text, confidence = extract_text_easyocr(str(save_path))
    if embedded_text and embedded_text.strip():
        combined_text = f"{embedded_text}\n{raw_text}".strip()
        confidence = max(confidence, 0.95)
    else:
        combined_text = raw_text

    regex_fields         = extract_fields_by_regex(combined_text)
    doc_fields           = extract_document_fields(combined_text, doc_type=document_type, image_path=str(save_path))
    extracted            = {**regex_fields, **doc_fields}

    # MRZ (if passport)
    mrz_data = None
    if document_type.upper() == "PASSPORT":
        mrz_data = parse_mrz(str(save_path))
        if mrz_data and not mrz_data.get("error"):
            extracted.update(mrz_data)

    return {
        "status":           "success",
        "document_type":    document_type,
        "image_url":        url,
        "raw_text":         raw_text,
        "confidence":       round(confidence, 3),
        "ocr_engine":       "easyocr",
        "extracted_fields": extracted,
        "mrz":              mrz_data,
    }
