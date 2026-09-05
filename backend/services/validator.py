"""
Module 2: Document Validation Service
- UIDAI Aadhaar Verhoeff Checksum Engine
- Income Tax PAN Card Structure & Surname Verification
- ICAO 9303 Passport Check Digit Engine
- Date Logic & Watchlist Lookup
"""

from datetime import datetime, date
from typing import List, Optional, Dict, Any
import re
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "database" / "watchlist.db"


# ─── Verhoeff Checksum Engine (UIDAI Aadhaar) ─────────────────────────────────
# The Verhoeff algorithm uses dihedral group D5 multiplication and permutation tables.
# It is the official algorithm mandated by UIDAI for 12-digit Aadhaar numbers.

VERHOEFF_D = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
]

VERHOEFF_P = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
]

VERHOEFF_INV = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9]

def validate_verhoeff(number_str: str) -> bool:
    """Validate 12-digit Aadhaar number using official Verhoeff checksum algorithm."""
    clean_num = re.sub(r"\D", "", number_str)
    if not clean_num or len(clean_num) != 12:
        return False
    c = 0
    # Process digits right-to-left
    for i, digit in enumerate(reversed(clean_num)):
        c = VERHOEFF_D[c][VERHOEFF_P[i % 8][int(digit)]]
    return c == 0


def validate_aadhaar_number(aadhaar_str: str) -> List[dict]:
    """Validate Aadhaar 12-digit structure, starting digit rule, and Verhoeff check digit."""
    checks = []
    clean_num = re.sub(r"\D", "", aadhaar_str)

    # Check 1: 12-digit length
    is_12_digits = len(clean_num) == 12
    checks.append({
        "check_name": "aadhaar_12_digit_length",
        "passed": is_12_digits,
        "detail": f"Length: {len(clean_num)} digits (Expected exactly 12 digits)" if not is_12_digits else "12-digit structure valid ✓",
        "severity": "HIGH",
    })

    if not is_12_digits:
        return checks

    # Check 2: Starting digit (UIDAI rule: Aadhaar never starts with 0 or 1)
    valid_start = clean_num[0] not in ["0", "1"]
    checks.append({
        "check_name": "aadhaar_valid_starting_digit",
        "passed": valid_start,
        "detail": "Aadhaar starts with digits 2-9 ✓" if valid_start else f"Invalid starting digit '{clean_num[0]}' (UIDAI Aadhaar cannot begin with 0 or 1)",
        "severity": "HIGH",
    })

    # Check 3: Mathematical Verhoeff Checksum
    verhoeff_valid = validate_verhoeff(clean_num)
    checks.append({
        "check_name": "aadhaar_verhoeff_checksum",
        "passed": verhoeff_valid,
        "detail": "UIDAI Verhoeff Checksum verified ✓" if verhoeff_valid else "Mathematical Verhoeff Checksum FAILED — Number is forged or modified",
        "severity": "HIGH",
    })

    return checks


# ─── PAN Card Structure & Surname Verification ───────────────────────────────

PAN_STATUS_MAP = {
    "P": "Individual / Person",
    "C": "Company",
    "H": "Hindu Undivided Family (HUF)",
    "A": "Association of Persons (AOP)",
    "B": "Body of Individuals (BOI)",
    "G": "Government Agency",
    "J": "Artificial Juridical Person",
    "L": "Local Authority",
    "F": "Firm / Limited Liability Partnership",
    "T": "Trust",
}

def validate_pan_structure(pan_str: str, holder_name: Optional[str] = None) -> List[dict]:
    """
    Validate Indian Income Tax PAN Card structure:
    1. Standard regex: 5 uppercase letters + 4 digits + 1 uppercase letter.
    2. 4th character entity type.
    3. 5th character matching first letter of holder's surname.
    """
    checks = []
    clean_pan = pan_str.strip().upper() if pan_str else ""

    # Check 1: 10-char regex pattern
    pattern = r"^[A-Z]{5}[0-9]{4}[A-Z]$"
    format_valid = bool(re.match(pattern, clean_pan))
    checks.append({
        "check_name": "pan_format_pattern",
        "passed": format_valid,
        "detail": f"PAN format valid: '{clean_pan}' ✓" if format_valid else f"Invalid PAN format '{clean_pan}' (Expected 5 letters, 4 digits, 1 letter)",
        "severity": "HIGH",
    })

    if not format_valid:
        return checks

    # Check 2: 4th character Entity Category
    entity_char = clean_pan[3]
    entity_type = PAN_STATUS_MAP.get(entity_char)
    checks.append({
        "check_name": "pan_entity_type_valid",
        "passed": entity_type is not None,
        "detail": f"Holder Category: {entity_type} ('{entity_char}') ✓" if entity_type else f"Unknown 4th character '{entity_char}' in PAN",
        "severity": "MEDIUM",
    })

    # Check 3: 5th character Surname Initial Matching
    if holder_name:
        name_parts = [p.strip().upper() for p in holder_name.split() if p.strip()]
        if name_parts:
            # Surname is typically the last word of the name
            surname = name_parts[-1]
            expected_initial = surname[0]
            actual_initial = clean_pan[4]
            surname_matches = (expected_initial == actual_initial)
            checks.append({
                "check_name": "pan_surname_cross_match",
                "passed": surname_matches,
                "detail": f"Surname '{surname}' initial '{expected_initial}' matches 5th PAN character '{actual_initial}' ✓"
                          if surname_matches
                          else f"Surname initial mismatch! Name: '{holder_name}' (expected initial '{expected_initial}'), but 5th PAN letter is '{actual_initial}'",
                "severity": "HIGH" if not surname_matches else "LOW",
            })

    return checks


# ─── ICAO 9303 Passport Check Digit Engine ───────────────────────────────────

ICAO_WEIGHTS    = [7, 3, 1]
ICAO_CHAR_TABLE = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

def icao_check_digit(field: str) -> int:
    """Compute ICAO 9303 check digit for a given MRZ field string."""
    total = 0
    for i, ch in enumerate(field.upper()):
        if ch == "<":
            val = 0
        elif ch.isdigit():
            val = int(ch)
        elif ch.isalpha():
            val = ord(ch) - ord("A") + 10
        else:
            val = 0
        total += val * ICAO_WEIGHTS[i % 3]
    return total % 10


def validate_mrz_checksums(
    passport_no: str,
    dob: str,
    expiry: str,
    cd_passport: str,
    cd_dob: str,
    cd_expiry: str,
) -> List[dict]:
    """Validate all three ICAO check digits. Returns list of check results."""
    checks = []
    pairs = [
        ("passport_number_checksum", passport_no, cd_passport),
        ("date_of_birth_checksum",   dob,          cd_dob),
        ("expiry_date_checksum",      expiry,       cd_expiry),
    ]
    for name, field, expected_cd in pairs:
        if not field or not expected_cd:
            continue
        computed = icao_check_digit(field)
        passed   = (str(computed) == str(expected_cd))
        checks.append({
            "check_name": name,
            "passed":     passed,
            "detail":     f"Expected CD={expected_cd}, Computed CD={computed}" if not passed
                          else f"Check digit {expected_cd} verified ✓",
            "severity":   "HIGH",
        })
    return checks


# ─── Date Validation ─────────────────────────────────────────────────────────

def parse_flexible_date(date_str: str) -> Optional[date]:
    """Try multiple date formats and return a date object."""
    if not date_str:
        return None
    formats = ["%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y", "%m/%d/%Y", "%d%m%Y", "%y%m%d", "%Y"]
    for fmt in formats:
        try:
            return datetime.strptime(date_str.strip(), fmt).date()
        except (ValueError, AttributeError):
            continue
    return None


def validate_dates(dob_str: str, expiry_str: Optional[str] = None, require_expiry: bool = True) -> List[dict]:
    """Check DOB is in the past and document is not expired."""
    checks = []
    today = date.today()

    dob = parse_flexible_date(dob_str) if dob_str else None
    expiry = parse_flexible_date(expiry_str) if expiry_str else None

    # DOB must be in the past and reasonable (> 1 year old)
    if dob:
        passed = dob < today and (today - dob).days > 365
        checks.append({
            "check_name": "date_of_birth_valid",
            "passed":     passed,
            "detail":     f"DOB {dob} is valid ✓" if passed else f"DOB {dob} is invalid or in future",
            "severity":   "MEDIUM",
        })
    elif dob_str:
        checks.append({
            "check_name": "date_of_birth_parseable",
            "passed":     False,
            "detail":     f"Could not parse DOB: '{dob_str}'",
            "severity":   "MEDIUM",
        })

    # Document expiry (Aadhaar and PAN do not have expiry dates, Passports and DLs do)
    if require_expiry:
        if expiry:
            passed = expiry >= today
            checks.append({
                "check_name": "document_not_expired",
                "passed":     passed,
                "detail":     f"Expiry {expiry} — {'Valid' if passed else 'EXPIRED'}",
                "severity":   "HIGH",
            })
        elif expiry_str:
            checks.append({
                "check_name": "expiry_date_parseable",
                "passed":     False,
                "detail":     f"Could not parse expiry: '{expiry_str}'",
                "severity":   "HIGH",
            })

    return checks


# ─── Format Validation ────────────────────────────────────────────────────────

def validate_passport_number_format(passport_no: str) -> dict:
    """Indian passport: 1 uppercase letter + 7 digits."""
    pattern = r"^[A-Z]\d{7}$"
    passed = bool(re.match(pattern, passport_no.strip().upper())) if passport_no else False
    return {
        "check_name": "passport_number_format",
        "passed":     passed,
        "detail":     f"'{passport_no}' {'matches' if passed else 'does NOT match'} expected format [A-Z]\\d{{7}}",
        "severity":   "HIGH",
    }


def validate_nationality_code(code: str) -> dict:
    """Check 3-letter ISO 3166-1 alpha-3 country code."""
    VALID_CODES = {
        "IND", "PAK", "BGD", "CHN", "USA", "GBR", "DEU", "FRA",
        "AUS", "CAN", "RUS", "NPL", "LKA", "AFG", "IRN", "IRQ",
        "MMR", "THA", "VNM", "SGP", "MYS", "IDN", "PHL", "KOR",
        "JPN", "SAU", "ARE", "QAT", "KWT", "OMN", "BHR", "JOR",
        "EGY", "ZAF", "NGA", "KEN", "ETH", "GHA", "TZA", "UGA",
    }
    passed = (code.strip().upper() in VALID_CODES) if code else False
    return {
        "check_name": "nationality_code_valid",
        "passed":     passed,
        "detail":     f"Nationality code '{code}' is {'recognized' if passed else 'unrecognized / suspicious'}",
        "severity":   "MEDIUM",
    }


# ─── Watchlist / Blacklist Lookup ─────────────────────────────────────────────

def check_watchlist(name: str = "", doc_number: str = "") -> dict:
    """
    Query the local mock watchlist database.
    Matches against doc numbers (Passport, Aadhaar, PAN) and fuzzy matches names.
    """
    try:
        conn = sqlite3.connect(str(DB_PATH))
        cursor = conn.cursor()

        hit = False
        hit_detail = "No watchlist match found ✓"

        # Search by document number (exact or normalized)
        if doc_number:
            clean_doc = re.sub(r"[\s-]", "", doc_number).upper()
            cursor.execute("SELECT name, doc_number, reason FROM watchlist")
            rows = cursor.fetchall()
            for db_name, db_doc, db_reason in rows:
                if db_doc:
                    clean_db_doc = re.sub(r"[\s-]", "", db_doc).upper()
                    if clean_doc == clean_db_doc or doc_number.strip().upper() == db_doc.strip().upper():
                        hit = True
                        hit_detail = f"⚠️ WATCHLIST HIT — {db_name} [{db_doc}]: {db_reason}"
                        break

        # Fuzzy name search if no doc hit
        if not hit and name:
            cursor.execute("SELECT name, reason FROM watchlist")
            rows = cursor.fetchall()
            from rapidfuzz import fuzz
            for db_name, reason in rows:
                score = fuzz.token_sort_ratio(name.upper(), db_name.upper())
                if score >= 85:
                    hit = True
                    hit_detail = f"⚠️ NAME MATCH ({score}%) — {db_name}: {reason}"
                    break

        conn.close()
        return {
            "check_name": "watchlist_lookup",
            "passed":     not hit,
            "detail":     hit_detail,
            "severity":   "HIGH",
        }
    except Exception as e:
        return {
            "check_name": "watchlist_lookup",
            "passed":     True,  # fail-open
            "detail":     f"Watchlist DB unavailable: {e}",
            "severity":   "LOW",
        }


# ─── Aggregate Validator ──────────────────────────────────────────────────────

def run_full_validation(fields: dict, doc_type: str = "PASSPORT") -> dict:
    """
    Run appropriate validation checks based on document type.
    Supports: AADHAAR, PAN_CARD, PASSPORT, DRIVING_LICENSE, VISA, NATIONAL_ID.
    """
    all_checks = []
    doc_type_upper = doc_type.upper()

    # 1. AADHAAR CARD VALIDATION
    if doc_type_upper in ["AADHAAR", "ADHAAR", "AADHAR", "UIDAI", "AADHAAR_CARD", "ADHAAR_CARD"]:
        aadhaar_no = fields.get("aadhaar_number") or fields.get("doc_number", "")
        if aadhaar_no:
            all_checks += validate_aadhaar_number(aadhaar_no)
        else:
            all_checks.append({
                "check_name": "aadhaar_number_present",
                "passed": False,
                "detail": "No 12-digit Aadhaar number detected on document",
                "severity": "HIGH",
            })

        all_checks += validate_dates(
            fields.get("date_of_birth", ""),
            require_expiry=False
        )

        all_checks.append(check_watchlist(
            name=fields.get("name", ""),
            doc_number=aadhaar_no,
        ))

    # 2. PAN CARD VALIDATION
    elif doc_type_upper in ["PAN", "PAN_CARD", "PANCARD"]:
        pan_no = fields.get("pan_number") or fields.get("doc_number", "")
        if pan_no:
            all_checks += validate_pan_structure(pan_no, holder_name=fields.get("name"))
        else:
            all_checks.append({
                "check_name": "pan_number_present",
                "passed": False,
                "detail": "No 10-character PAN number detected on document",
                "severity": "HIGH",
            })

        all_checks += validate_dates(
            fields.get("date_of_birth", ""),
            require_expiry=False
        )

        all_checks.append(check_watchlist(
            name=fields.get("name", ""),
            doc_number=pan_no,
        ))

    # 3. PASSPORT VALIDATION
    elif doc_type_upper == "PASSPORT":
        # MRZ Checksum (if MRZ data available)
        if fields.get("passport_number") and fields.get("mrz_cd_passport"):
            all_checks += validate_mrz_checksums(
                fields.get("passport_number", ""),
                fields.get("dob_mrz", ""),
                fields.get("expiry_mrz", ""),
                fields.get("mrz_cd_passport", ""),
                fields.get("mrz_cd_dob", ""),
                fields.get("mrz_cd_expiry", ""),
            )

        # Date checks (require expiry)
        all_checks += validate_dates(
            fields.get("date_of_birth", ""),
            fields.get("date_of_expiry", ""),
            require_expiry=True
        )

        # Format checks
        if fields.get("passport_number"):
            all_checks.append(validate_passport_number_format(fields["passport_number"]))
        if fields.get("nationality"):
            all_checks.append(validate_nationality_code(fields["nationality"]))

        # Watchlist
        all_checks.append(check_watchlist(
            name=fields.get("name", ""),
            doc_number=fields.get("passport_number", fields.get("doc_number", "")),
        ))

    # 4. DRIVING LICENSE / VISA / NATIONAL ID / DEFAULT
    else:
        all_checks += validate_dates(
            fields.get("date_of_birth", ""),
            fields.get("date_of_expiry", ""),
            require_expiry=bool(fields.get("date_of_expiry"))
        )

        all_checks.append(check_watchlist(
            name=fields.get("name", ""),
            doc_number=fields.get("doc_number", fields.get("passport_number", "")),
        ))

    failures = [c for c in all_checks if not c["passed"]]
    high_failures = [c for c in failures if c.get("severity") == "HIGH"]

    # Risk contribution: 0–30 pts
    risk_contribution = min(30, len(high_failures) * 10 + len(failures) * 3)

    return {
        "overall_valid":     len(failures) == 0,
        "document_type":     doc_type_upper,
        "checks":            all_checks,
        "failure_count":     len(failures),
        "risk_contribution": risk_contribution,
    }
