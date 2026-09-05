"""
Module 1: OCR Extraction Service
Handles Document Type Detection + MRZ parsing + Aadhaar & PAN Card OCR + QR Code Decoding
"""

import re
import cv2
import numpy as np
from PIL import Image
from pathlib import Path
from typing import Tuple, Optional, Dict, Any

# EasyOCR (lazy-loaded to save startup time)
_ocr_reader = None

def _get_ocr_reader():
    global _ocr_reader
    if _ocr_reader is None:
        try:
            import easyocr
            _ocr_reader = easyocr.Reader(['en'], gpu=False, verbose=False)
        except ImportError:
            print("[WARN] EasyOCR not installed. Run: pip install easyocr")
            _ocr_reader = None
    return _ocr_reader


# ─── Image Pre-processing ─────────────────────────────────────────────────────

def preprocess_image(image_path: str) -> np.ndarray:
    """Deskew, denoise, and enhance contrast for better OCR accuracy."""
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Cannot read image: {image_path}")

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Denoise
    denoised = cv2.fastNlMeansDenoising(gray, h=10)

    # Adaptive threshold for binarization
    binary = cv2.adaptiveThreshold(
        denoised, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 31, 2
    )

    # Deskew
    coords = np.column_stack(np.where(binary > 0))
    if len(coords) > 0:
        angle = cv2.minAreaRect(coords)[-1]
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle
        (h, w) = binary.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        binary = cv2.warpAffine(binary, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

    return binary


# ─── QR Code Extraction ───────────────────────────────────────────────────────

def decode_qr_code(image_path: str) -> Optional[dict]:
    """Extract and decode QR code if present on Aadhaar or other ID."""
    try:
        img = cv2.imread(image_path)
        if img is None:
            return None
        detector = cv2.QRCodeDetector()
        data, bbox, _ = detector.detectAndDecode(img)
        if data:
            return {
                "qr_found": True,
                "raw_data": data[:200] + "..." if len(data) > 200 else data,
                "length": len(data),
            }
    except Exception as e:
        pass
    return None


# ─── Document Type Auto-Detection ─────────────────────────────────────────────

def detect_document_type(text: str) -> str:
    """
    Classify document type based on OCR text keywords and patterns.
    Returns: 'AADHAAR', 'PAN_CARD', 'PASSPORT', 'DRIVING_LICENSE', 'VISA', or 'NATIONAL_ID'
    """
    upper = text.upper()

    # Aadhaar checks
    if any(k in upper for k in ["AADHAAR", "UIDAI", "UNIQUE IDENTIFICATION", "MERA AADHAAR", "GOVERNMENT OF INDIA / UIDAI"]):
        return "AADHAAR"
    if re.search(r"\b[2-9]\d{3}\s\d{4}\s\d{4}\b", text):
        return "AADHAAR"

    # PAN Card checks
    if any(k in upper for k in ["INCOME TAX DEPARTMENT", "PERMANENT ACCOUNT NUMBER", "INCOMETAX"]):
        return "PAN_CARD"
    if re.search(r"\b[A-Z]{5}[0-9]{4}[A-Z]\b", text):
        return "PAN_CARD"

    # Passport checks
    if any(k in upper for k in ["PASSPORT", "REPUBLIC OF INDIA", "P<IND", "P<USA", "P<GBR"]):
        return "PASSPORT"
    if "<<" in text or re.search(r"P<[A-Z]{3}", text):
        return "PASSPORT"

    # Driving License checks
    if any(k in upper for k in ["DRIVING LICENCE", "DRIVING LICENSE", "UNION OF INDIA DRIVING", "TRANSPORT DEPARTMENT"]):
        return "DRIVING_LICENSE"

    # Visa checks
    if any(k in upper for k in ["VISA", "ENTRY PERMIT", "REPUBLIC OF INDIA VISA"]):
        return "VISA"

    return "NATIONAL_ID"


# ─── MRZ Parsing (ICAO 9303 for Passports) ────────────────────────────────────

def parse_mrz(image_path: str) -> Optional[dict]:
    """Extract MRZ fields from passport using PassportEye."""
    try:
        from passporteye import read_mrz
        mrz = read_mrz(image_path)
        if mrz is None:
            return None
        data = mrz.to_dict()
        return {
            "name":            _clean(data.get("names", "") + " " + data.get("surname", "")),
            "passport_number": _clean(data.get("number", "")),
            "nationality":     _clean(data.get("nationality", "")),
            "date_of_birth":   _format_date(data.get("date_of_birth", "")),
            "date_of_expiry":  _format_date(data.get("expiration_date", "")),
            "gender":          _clean(data.get("sex", "")),
            "issuing_country": _clean(data.get("country", "")),
            "mrz_line1":       data.get("raw_text", ["", ""])[0] if isinstance(data.get("raw_text"), list) else "",
            "mrz_line2":       data.get("raw_text", ["", ""])[1] if isinstance(data.get("raw_text"), list) else "",
            "valid_score":     data.get("valid_score", 0),
        }
    except ImportError:
        return {"error": "passporteye not installed. Run: pip install passporteye"}
    except Exception as e:
        return {"error": str(e)}


def _clean(s: str) -> str:
    return s.replace("<", " ").strip() if s else ""


def _format_date(yymmdd: str) -> str:
    """Convert YYMMDD → DD/MM/YYYY with century correction."""
    if not yymmdd or len(yymmdd) != 6:
        return yymmdd or ""
    try:
        yy, mm, dd = int(yymmdd[:2]), yymmdd[2:4], yymmdd[4:6]
        year = 1900 + yy if yy >= 30 else 2000 + yy
        return f"{dd}/{mm}/{year}"
    except:
        return yymmdd


# ─── General OCR ─────────────────────────────────────────────────────────────

def extract_text_easyocr(image_path: str) -> Tuple[str, float]:
    """Run EasyOCR on image, return full text and average confidence."""
    reader = _get_ocr_reader()
    if reader is None:
        return "[EasyOCR not available — install with: pip install easyocr]", 0.0
    results = reader.readtext(image_path, detail=1, paragraph=False)
    if not results:
        return "", 0.0
    texts = [r[1] for r in results]
    confidences = [r[2] for r in results]
    full_text = "\n".join(texts)
    avg_conf = sum(confidences) / len(confidences) if confidences else 0.0
    return full_text, avg_conf


# ─── Aadhaar Card Field Extraction ───────────────────────────────────────────

def extract_aadhaar_fields(text: str, image_path: Optional[str] = None) -> Dict[str, Any]:
    """
    Extract specific fields from an Aadhaar card OCR text.
    Fields: Aadhaar number, Name, DOB/YOB, Gender, Father/Husband Name, VID, Address.
    """
    fields = {}
    lines = [l.strip() for l in text.split("\n") if l.strip()]

    # 1. Aadhaar Number (12 digits, often formatted as 4-4-4)
    # Match standard "XXXX XXXX XXXX" or "XXXXXXXXXXXX"
    aadhaar_match = re.search(r"\b([2-9]\d{3}\s?\d{4}\s?\d{4})\b", text)
    if not aadhaar_match:
        # Match masked Aadhaar (e.g. XXXX XXXX 1234 or **** **** 1234)
        aadhaar_match = re.search(r"\b([X*x]{4}\s?[X*x]{4}\s?\d{4})\b", text)

    if aadhaar_match:
        raw_num = aadhaar_match.group(1).replace(" ", "")
        # Format as XXXX XXXX XXXX
        if len(raw_num) == 12:
            fields["aadhaar_number"] = f"{raw_num[:4]} {raw_num[4:8]} {raw_num[8:]}"
            fields["doc_number"]     = fields["aadhaar_number"]
        else:
            fields["aadhaar_number"] = aadhaar_match.group(1)
            fields["doc_number"]     = fields["aadhaar_number"]

    # 2. Virtual ID (VID) 16 digits
    vid_match = re.search(r"\bVID\s*[:/]?\s*(\d{4}\s?\d{4}\s?\d{4}\s?\d{4})\b", text, re.IGNORECASE)
    if vid_match:
        fields["virtual_id"] = vid_match.group(1)

    # 3. Date of Birth (DOB) or Year of Birth (YOB)
    dob_match = re.search(r"\b(?:DOB|Date of Birth|Birth Date)\s*[:/]?\s*(\d{2}[/-]\d{2}[/-]\d{4})\b", text, re.IGNORECASE)
    if not dob_match:
        dob_match = re.search(r"\b(\d{2}[/-]\d{2}[/-]\d{4})\b", text)

    if dob_match:
        fields["date_of_birth"] = dob_match.group(1).replace("-", "/")
    else:
        yob_match = re.search(r"\b(?:Year of Birth|YOB)\s*[:/]?\s*(\d{4})\b", text, re.IGNORECASE)
        if yob_match:
            fields["year_of_birth"] = yob_match.group(1)
            fields["date_of_birth"] = f"01/01/{yob_match.group(1)}"

    # 4. Gender (Male, Female, Transgender)
    gender_match = re.search(r"\b(MALE|FEMALE|TRANSGENDER|Male|Female|Transgender|M|F)\b", text, re.IGNORECASE)
    if gender_match:
        g = gender_match.group(1).upper()
        if g in ["M", "MALE"]:
            fields["gender"] = "MALE"
        elif g in ["F", "FEMALE"]:
            fields["gender"] = "FEMALE"
        elif "TRANS" in g:
            fields["gender"] = "TRANSGENDER"

    # 5. Care of / Father / Husband Name
    co_match = re.search(r"\b(?:C/O|S/O|D/O|W/O)\s*[:/]?\s*([A-Za-z\s]+)", text, re.IGNORECASE)
    if co_match:
        fields["father_or_spouse_name"] = co_match.group(1).strip()

    # 6. Name Extraction (Heuristics)
    # On Aadhaar card, the name in English is typically located directly above the DOB line or after Government header
    name_candidates = []
    ignored_keywords = [
        "GOVERNMENT", "INDIA", "UIDAI", "UNIQUE", "IDENTIFICATION", "AUTHORITY",
        "MERA", "AADHAAR", "MERI", "PEHCHAN", "ENROLMENT", "HELP", "WWW", "DOB",
        "YEAR OF BIRTH", "FEMALE", "MALE", "ADDRESS", "VID", "DOWNLOAD", "ISSUE"
    ]
    for i, line in enumerate(lines):
        clean_line = re.sub(r"[^A-Za-z\s]", "", line).strip()
        if len(clean_line) >= 3 and len(clean_line.split()) >= 2:
            if not any(k in clean_line.upper() for k in ignored_keywords):
                name_candidates.append(clean_line)

    if name_candidates:
        fields["name"] = name_candidates[0]

    # 7. QR Code Check
    if image_path:
        qr = decode_qr_code(image_path)
        if qr:
            fields["qr_code"] = "QR Code Detected & Decoded ✓"

    return fields


# ─── PAN Card Field Extraction ───────────────────────────────────────────────

def extract_pan_fields(text: str) -> Dict[str, Any]:
    """
    Extract specific fields from an Indian PAN card OCR text.
    Fields: PAN Number, Name, Father's Name, DOB, Category (Individual, etc.)
    """
    fields = {}
    lines = [l.strip() for l in text.split("\n") if l.strip()]

    # 1. PAN Number pattern: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)
    pan_match = re.search(r"\b([A-Z]{5}[0-9]{4}[A-Z])\b", text.upper())
    if pan_match:
        pan_num = pan_match.group(1)
        fields["pan_number"] = pan_num
        fields["doc_number"] = pan_num

        # PAN 4th Character describes Holder Category
        status_map = {
            "P": "Individual / Person",
            "C": "Company",
            "H": "Hindu Undivided Family (HUF)",
            "A": "Association of Persons (AOP)",
            "B": "Body of Individuals (BOI)",
            "G": "Government Agency",
            "J": "Artificial Juridical Person",
            "L": "Local Authority",
            "F": "Firm / LLP",
            "T": "Trust",
        }
        status_char = pan_num[3]
        fields["pan_category"] = status_map.get(status_char, "Other Entity")
        fields["pan_surname_initial"] = pan_num[4]

    # 2. Date of Birth (DOB)
    dob_match = re.search(r"\b(\d{2}[/-]\d{2}[/-]\d{4})\b", text)
    if dob_match:
        fields["date_of_birth"] = dob_match.group(1).replace("-", "/")

    # 3. Name & Father's Name Extraction
    # On PAN cards, lines above DOB are Name and Father's Name
    ignored_keywords = [
        "INCOME", "TAX", "DEPARTMENT", "GOVT", "INDIA", "PERMANENT", "ACCOUNT",
        "NUMBER", "CARD", "FATHER", "NAME", "SIGNATURE", "DATE", "BIRTH"
    ]
    valid_text_lines = []
    for line in lines:
        clean_line = re.sub(r"[^A-Za-z\s]", "", line).strip()
        if len(clean_line) >= 3 and not any(k in clean_line.upper() for k in ignored_keywords):
            valid_text_lines.append(clean_line)

    if len(valid_text_lines) >= 1:
        fields["name"] = valid_text_lines[0]
    if len(valid_text_lines) >= 2:
        fields["father_name"] = valid_text_lines[1]

    return fields


# ─── Driving License & Generic Document Fields ───────────────────────────────

def extract_driving_license_fields(text: str) -> Dict[str, Any]:
    """Extract fields from Indian / International Driving License."""
    fields = {}
    # Indian DL: e.g. MH14 20110062821 or DL-0420110149646
    dl_match = re.search(r"\b([A-Z]{2}[-\s]?\d{2,3}[-\s]?\d{4}[-\s]?\d{7}|\b[A-Z]{2}\d{13,15}\b)\b", text.upper())
    if dl_match:
        fields["driving_license_number"] = dl_match.group(1)
        fields["doc_number"]             = fields["driving_license_number"]

    dob_match = re.search(r"\b(?:DOB|Birth)\s*[:/]?\s*(\d{2}[/-]\d{2}[/-]\d{4})\b", text, re.IGNORECASE)
    if not dob_match:
        dob_match = re.search(r"\b(\d{2}[/-]\d{2}[/-]\d{4})\b", text)
    if dob_match:
        fields["date_of_birth"] = dob_match.group(1).replace("-", "/")

    exp_match = re.search(r"(?:VALID|EXPIR|NT|TR)[^0-9]*(\d{2}[/-]\d{2}[/-]\d{4})", text, re.IGNORECASE)
    if exp_match:
        fields["date_of_expiry"] = exp_match.group(1).replace("-", "/")

    return fields


# ─── Universal Field Extractor ───────────────────────────────────────────────

PASSPORT_PATTERNS = {
    "passport_number": r"\b[A-Z]\d{7}\b",
    "date_of_birth":   r"\b(\d{2}[/-]\d{2}[/-]\d{4})\b",
    "date_of_expiry":  r"(?:expir|valid|exp)[^0-9]*(\d{2}[/-]\d{2}[/-]\d{4})",
    "gender":          r"\b(M|F|Male|Female)\b",
    "nationality":     r"\b(IND|PAK|BGD|CHN|USA|GBR|[A-Z]{3})\b",
}

def extract_fields_by_regex(text: str) -> dict:
    """Extract standard passport fields from raw OCR text using regex."""
    fields = {}
    for field, pattern in PASSPORT_PATTERNS.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            fields[field] = match.group(1) if match.lastindex else match.group(0)
    return fields


def extract_document_fields(
    text: str,
    doc_type: str = "PASSPORT",
    image_path: Optional[str] = None
) -> Dict[str, Any]:
    """
    Extract structured fields according to the selected document type.
    Supports: AADHAAR, PAN_CARD, PASSPORT, DRIVING_LICENSE, VISA, NATIONAL_ID.
    """
    doc_type_upper = doc_type.upper()

    if doc_type_upper in ["AADHAAR", "ADHAAR", "AADHAR", "UIDAI"]:
        return extract_aadhaar_fields(text, image_path)

    elif doc_type_upper in ["PAN", "PAN_CARD", "PANCARD"]:
        return extract_pan_fields(text)

    elif doc_type_upper in ["DRIVING_LICENSE", "DRIVING_LICENCE", "DL"]:
        return extract_driving_license_fields(text)

    elif doc_type_upper in ["PASSPORT", "VISA", "NATIONAL_ID"]:
        fields = extract_fields_by_regex(text)
        if fields.get("passport_number"):
            fields["doc_number"] = fields["passport_number"]
        return fields

    # Fallback
    fields = extract_fields_by_regex(text)
    return fields
