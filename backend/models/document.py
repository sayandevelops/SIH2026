"""
Pydantic schemas — Document & Screening Result models
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from enum import Enum


class RiskBand(str, Enum):
    GREEN  = "GREEN"
    YELLOW = "YELLOW"
    RED    = "RED"


class DocumentType(str, Enum):
    PASSPORT = "PASSPORT"
    AADHAAR = "AADHAAR"
    PAN_CARD = "PAN_CARD"
    VISA = "VISA"
    NATIONAL_ID = "NATIONAL_ID"
    DRIVING_LICENSE = "DRIVING_LICENSE"


# ─── OCR Extraction Results ───────────────────────────────────────────────────

class PassportData(BaseModel):
    name:            Optional[str] = None
    passport_number: Optional[str] = None
    nationality:     Optional[str] = None
    date_of_birth:   Optional[str] = None
    date_of_expiry:  Optional[str] = None
    gender:          Optional[str] = None
    issuing_country: Optional[str] = None
    mrz_line1:       Optional[str] = None
    mrz_line2:       Optional[str] = None


class AadhaarData(BaseModel):
    aadhaar_number:         Optional[str] = None
    name:                   Optional[str] = None
    date_of_birth:          Optional[str] = None
    year_of_birth:          Optional[str] = None
    gender:                 Optional[str] = None
    father_or_spouse_name:  Optional[str] = None
    virtual_id:             Optional[str] = None
    qr_code:                Optional[str] = None


class PANCardData(BaseModel):
    pan_number:             Optional[str] = None
    name:                   Optional[str] = None
    father_name:            Optional[str] = None
    date_of_birth:          Optional[str] = None
    pan_category:           Optional[str] = None
    pan_surname_initial:    Optional[str] = None


class VisaData(BaseModel):
    visa_number:    Optional[str] = None
    visa_type:      Optional[str] = None
    valid_from:     Optional[str] = None
    valid_to:       Optional[str] = None
    entry_type:     Optional[str] = None  # Single / Double / Multiple
    stay_duration:  Optional[str] = None


class NationalIDData(BaseModel):
    id_number:   Optional[str] = None
    name:        Optional[str] = None
    date_of_birth: Optional[str] = None
    address:     Optional[str] = None
    gender:      Optional[str] = None


class OCRResult(BaseModel):
    document_type: DocumentType
    raw_text:      str
    passport:      Optional[PassportData]       = None
    aadhaar:       Optional[AadhaarData]        = None
    pan_card:      Optional[PANCardData]        = None
    visa:          Optional[VisaData]           = None
    national_id:   Optional[NationalIDData]     = None
    confidence:    float = Field(..., ge=0.0, le=1.0)
    ocr_engine:    str = "easyocr"


# ─── Validation Results ───────────────────────────────────────────────────────

class ValidationCheck(BaseModel):
    check_name:   str
    passed:       bool
    detail:       str
    severity:     str = "HIGH"   # HIGH / MEDIUM / LOW


class ValidationResult(BaseModel):
    overall_valid: bool
    checks:        List[ValidationCheck]
    failure_count: int
    risk_contribution: float = Field(..., ge=0.0, le=100.0)


# ─── Tampering Detection Results ──────────────────────────────────────────────

class TamperingTechnique(BaseModel):
    technique:    str
    tampered:     bool
    confidence:   float = Field(..., ge=0.0, le=1.0)
    detail:       str
    heatmap_path: Optional[str] = None


class TamperingResult(BaseModel):
    overall_tampered:  bool
    techniques:        List[TamperingTechnique]
    composite_score:   float = Field(..., ge=0.0, le=100.0)
    heatmap_url:       Optional[str] = None


# ─── Face Verification Results ────────────────────────────────────────────────

class FaceResult(BaseModel):
    face_detected_doc:  bool
    face_detected_live: bool
    match_score:        Optional[float] = Field(None, ge=0.0, le=100.0)
    verified:           Optional[bool]  = None
    liveness_passed:    Optional[bool]  = None
    liveness_score:     Optional[float] = None
    decision:           str = "UNKNOWN"   # VERIFIED / UNCERTAIN / MISMATCH


# ─── Risk Score ───────────────────────────────────────────────────────────────

class RiskScore(BaseModel):
    total_score:        float = Field(..., ge=0.0, le=100.0)
    band:               RiskBand
    validation_contrib: float
    tampering_contrib:  float
    face_contrib:       float
    watchlist_contrib:  float
    recommended_action: str
    breakdown:          dict


# ─── Full Screening Result ────────────────────────────────────────────────────

class ScreeningResult(BaseModel):
    session_id:        str
    timestamp:         datetime
    document_type:     DocumentType
    officer_id:        Optional[str] = "SYSTEM"
    checkpoint:        Optional[str] = "DEMO-01"
    ocr:               Optional[OCRResult]       = None
    validation:        Optional[ValidationResult] = None
    tampering:         Optional[TamperingResult] = None
    face:              Optional[FaceResult]      = None
    risk:              Optional[RiskScore]       = None
    block_hash:        Optional[str]             = None
    prev_block_hash:   Optional[str]             = None
    report_url:        Optional[str]             = None
