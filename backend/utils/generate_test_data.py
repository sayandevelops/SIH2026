"""
ShieldScan — Synthetic Test Dataset Generator
Creates realistic (but fake) test document images for SIH demo.

Usage:
    cd backend
    python utils/generate_test_data.py

Generates test_data/ folder with 10 test cases demonstrating:
  - Valid documents (GREEN)
  - Tampered MRZ (RED)
  - Photo-spliced passports (RED)
  - Expired documents (YELLOW)
  - Blacklisted names (RED)
"""

import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path
import random
import struct, zlib

OUTPUT_DIR = Path(__file__).parent.parent / "test_data"
OUTPUT_DIR.mkdir(exist_ok=True)

# ── Fonts (fallback to default if not available) ──────────────────────────────
def get_font(size=20, bold=False):
    try:
        from PIL import ImageFont
        font_path = "C:/Windows/Fonts/arial.ttf"
        if bold:
            font_path = "C:/Windows/Fonts/arialbd.ttf"
        return ImageFont.truetype(font_path, size)
    except:
        return ImageFont.load_default()


# ── ICAO Check Digit (for valid MRZ generation) ───────────────────────────────
WEIGHTS = [7, 3, 1]
def check_digit(field: str) -> str:
    total = 0
    for i, ch in enumerate(str(field).upper()):
        if ch == "<": val = 0
        elif ch.isdigit(): val = int(ch)
        elif ch.isalpha(): val = ord(ch) - 55
        else: val = 0
        total += val * WEIGHTS[i % 3]
    return str(total % 10)

def make_mrz(name, passport_no, nationality, dob, expiry, gender, tamper_dob=False):
    """Generate ICAO 9303 compliant MRZ lines."""
    # Line 1: P<NATIONALITY<SURNAME<<GIVENNAME
    parts = name.upper().replace(" ", "<<").replace("-", "<")
    line1 = f"P<{nationality.upper()}{parts}"
    line1 = line1[:44].ljust(44, "<")

    # Line 2: PASSPORTNO + CD + NATIONALITY + DOB + CD + GENDER + EXPIRY + CD + ...
    pno  = passport_no.upper().ljust(9, "<")[:9]
    cd1  = check_digit(pno)
    nat  = nationality.upper()[:3].ljust(3, "<")
    dob6 = dob.replace("/","").replace("-","")[-6:] if len(dob) >= 6 else "000000"  # YYMMDD
    if tamper_dob:
        dob6 = "990101"  # tampered — will break checksum
    cd2  = check_digit(dob6)
    gen  = gender.upper()[0] if gender else "M"
    exp6 = expiry.replace("/","").replace("-","")[-6:] if len(expiry) >= 6 else "991231"  # YYMMDD
    cd3  = check_digit(exp6)

    composite = pno + cd1 + dob6 + cd2 + gen + exp6 + cd3 + "<<<<<<<<<<<<<<" + "0"
    composite_field = composite[:14]
    cd_composite = check_digit(composite_field)

    line2 = f"{pno}{cd1}{nat}{dob6}{cd2}{gen}{exp6}{cd3}<<<<<<<<<<<<<<{cd_composite}"
    line2 = line2[:44].ljust(44, "<")

    return line1, line2


# ── Draw Passport Template ────────────────────────────────────────────────────
def draw_passport(
    name="RAHUL SHARMA",
    passport_no="J1234567",
    nationality="IND",
    dob="15/08/1990",
    expiry="14/08/2030",
    gender="M",
    photo_img=None,
    stamp_img=None,
    tamper_dob=False,
    photo_spliced=False,
    label="",
) -> Image.Image:

    W, H = 856, 540
    img  = Image.new("RGB", (W, H), color=(250, 248, 240))  # off-white paper
    draw = ImageDraw.Draw(img)

    # ── Background texture ──────────────────────────────────────────────────
    noise = np.random.randint(0, 8, (H, W, 3), dtype=np.uint8)
    noise_img = Image.fromarray(noise)
    img = Image.blend(img, noise_img, 0.04)
    draw = ImageDraw.Draw(img)

    # ── Dark blue header ───────────────────────────────────────────────────
    draw.rectangle([0, 0, W, 60], fill=(10, 30, 80))
    draw.text((W//2, 14), "REPUBLIC OF INDIA", fill="#FFD700", font=get_font(18, bold=True), anchor="mm")
    draw.text((W//2, 38), "PASSPORT", fill="#FFD700", font=get_font(14), anchor="mm")

    # ── Coat of arms placeholder ───────────────────────────────────────────
    draw.ellipse([18, 10, 52, 52], outline="#FFD700", width=2)
    draw.text((35, 31), "🇮🇳", font=get_font(16), anchor="mm")

    # ── Photo box ─────────────────────────────────────────────────────────
    photo_x, photo_y = 30, 80
    photo_w, photo_h = 130, 165
    draw.rectangle([photo_x, photo_y, photo_x+photo_w, photo_y+photo_h],
                   outline=(100,100,100), width=2, fill=(220,220,220))

    if photo_img:
        ph = photo_img.resize((photo_w, photo_h), Image.LANCZOS)
        if photo_spliced:
            # Add obvious splice artifact (different color border)
            ph_arr = np.array(ph)
            ph_arr[0:8, :] = [255, 0, 0]  # red top strip = ELA anomaly zone
            ph_arr[-8:, :] = [255, 0, 0]
            ph = Image.fromarray(ph_arr)
        img.paste(ph, (photo_x, photo_y))
    else:
        draw.text((photo_x + photo_w//2, photo_y + photo_h//2),
                  "PHOTO", fill="#888888", font=get_font(14), anchor="mm")

    # ── Fields ────────────────────────────────────────────────────────────
    field_x = 200
    fields = [
        ("Surname / Nom",          name.split()[0].upper() if name else ""),
        ("Given Names / Prénoms",  " ".join(name.split()[1:]).upper() if len(name.split()) > 1 else ""),
        ("Nationality",            "INDIAN"),
        ("Date of Birth",          dob),
        ("Sex",                    "M" if gender.upper().startswith("M") else "F"),
        ("Place of Birth",         "NEW DELHI"),
        ("Date of Issue",          "15/08/2020"),
        ("Date of Expiry",         expiry),
        ("Passport No.",           passport_no.upper()),
    ]

    for i, (label_t, value) in enumerate(fields):
        y = 78 + i * 47
        draw.text((field_x, y),      label_t, fill="#555555", font=get_font(10))
        draw.text((field_x, y + 14), value,   fill="#111111", font=get_font(15, bold=True))
        draw.line([field_x, y + 34, W - 20, y + 34], fill="#cccccc", width=1)

    # ── MRZ Zone ──────────────────────────────────────────────────────────
    mrz_y = H - 80
    draw.rectangle([0, mrz_y - 12, W, H], fill=(240, 240, 230))
    draw.text((20, mrz_y - 8), "Machine Readable Zone", fill="#888888", font=get_font(9))
    line1, line2 = make_mrz(name, passport_no, nationality, dob, expiry, gender, tamper_dob)
    draw.text((20, mrz_y + 4),  line1, fill="#111111", font=get_font(14), spacing=0)
    draw.text((20, mrz_y + 30), line2, fill="#111111", font=get_font(14), spacing=0)

    # ── Stamp (optional) ──────────────────────────────────────────────────
    if stamp_img:
        stamp = stamp_img.resize((100, 100), Image.LANCZOS).convert("RGBA")
        img.paste(stamp, (W - 130, 150), mask=stamp.split()[3])

    # ── Label (for demo identification) ───────────────────────────────────
    if label:
        draw.rectangle([0, H-22, W, H], fill=(30, 30, 30))
        draw.text((10, H - 16), f"TEST CASE: {label}", fill="#00FF88", font=get_font(10))

    return img


# ── Generate a simple synthetic face ─────────────────────────────────────────
def make_face(skin=(220,180,140), label="", w=130, h=165):
    """Draw a simple cartoon face for test purposes (no real biometric data)."""
    img  = Image.new("RGB", (w, h), color=(200, 220, 240))
    draw = ImageDraw.Draw(img)
    # head
    draw.ellipse([15, 10, w-15, h-30], fill=skin, outline="#888888", width=1)
    # eyes
    draw.ellipse([28, 40, 42, 54], fill="white", outline="#333")
    draw.ellipse([w-42, 40, w-28, 54], fill="white", outline="#333")
    draw.ellipse([32, 43, 38, 50], fill="#333")
    draw.ellipse([w-38, 43, w-32, 50], fill="#333")
    # nose
    draw.polygon([(w//2-4, 65), (w//2+4, 65), (w//2, 78)], fill="#c8a882")
    # mouth
    draw.arc([w//2-18, 82, w//2+18, 100], start=0, end=180, fill="#883333", width=2)
    if label:
        draw.rectangle([0, h-20, w, h], fill="#000")
        draw.text((5, h-16), label, fill="white", font=get_font(8))
    return img


# ── Generate all Test Cases ───────────────────────────────────────────────────

def generate_all():
    print("🔧 Generating ShieldScan Test Dataset...")

    face_valid   = make_face(skin=(220,180,140), label="RAHUL")
    face_other   = make_face(skin=(180,130,100), label="IMPOSTOR")
    face_dark    = make_face(skin=(120,80,50),   label="TARIQ")

    cases = [
        {
            "id": "TC-01",
            "name": "TC-01_VALID_PASSPORT_GREEN",
            "kwargs": dict(
                name="RAHUL SHARMA", passport_no="J1234567", nationality="IND",
                dob="150890", expiry="140830", gender="M",
                photo_img=face_valid, label="TC-01: Valid Passport — Expected GREEN",
            )
        },
        {
            "id": "TC-02",
            "name": "TC-02_EXPIRED_PASSPORT_YELLOW",
            "kwargs": dict(
                name="PRIYA NAIR", passport_no="K0099887", nationality="IND",
                dob="220895", expiry="210910", gender="F",   # expired in 2010!
                photo_img=make_face(skin=(200,160,140), label="PRIYA"),
                label="TC-02: EXPIRED — Expected YELLOW/RED",
            )
        },
        {
            "id": "TC-03",
            "name": "TC-03_TAMPERED_DOB_MRZ_RED",
            "kwargs": dict(
                name="ARIF KHAN", passport_no="B9876543", nationality="IND",
                dob="010185", expiry="311230", gender="M",
                photo_img=make_face(skin=(160,120,80), label="ARIF"),
                tamper_dob=True,  # MRZ checksum will FAIL
                label="TC-03: Tampered DOB → MRZ Checksum FAIL — Expected RED",
            )
        },
        {
            "id": "TC-04",
            "name": "TC-04_PHOTO_SPLICED_RED",
            "kwargs": dict(
                name="SUNITA DEVI", passport_no="P5551234", nationality="IND",
                dob="300992", expiry="291232", gender="F",
                photo_img=face_other,
                photo_spliced=True,  # obvious splice artifact added
                label="TC-04: Photo Spliced → ELA Anomaly — Expected RED",
            )
        },
        {
            "id": "TC-05",
            "name": "TC-05_BLACKLISTED_NAME_RED",
            "kwargs": dict(
                name="RAHUL VERMA", passport_no="Z1234567", nationality="IND",
                dob="050188", expiry="041235", gender="M",
                photo_img=make_face(skin=(200,175,145), label="R.VERMA"),
                label="TC-05: Blacklisted — Expected RED (watchlist hit)",
            )
        },
        {
            "id": "TC-06",
            "name": "TC-06_FACE_MISMATCH_RED",
            "kwargs": dict(
                name="CARLOS MENDEZ", passport_no="MX445566", nationality="MEX",
                dob="121279", expiry="111235", gender="M",
                photo_img=make_face(skin=(180,140,100), label="CARLOS"),
                label="TC-06: Face Mismatch — Expected RED",
            )
        },
    ]

    for case in cases:
        img = draw_passport(**case["kwargs"])
        path = OUTPUT_DIR / f"{case['name']}.png"
        img.save(str(path))
        print(f"  ✅ {case['id']} → {path.name}")

    # Also save individual face images for face-mismatch demo
    face_valid.save(str(OUTPUT_DIR / "face_valid_rahul.png"))
    face_other.save(str(OUTPUT_DIR / "face_impostor.png"))
    print(f"\n✅ Test dataset saved to: {OUTPUT_DIR}")
    print(f"   Total files: {len(list(OUTPUT_DIR.iterdir()))}")
    print("\n📋 How to use in demo:")
    print("   1. Upload TC-01 → expect GREEN")
    print("   2. Upload TC-03 → expect RED (MRZ checksum fail)")
    print("   3. Upload TC-04 → expect RED (ELA tampering detected)")
    print("   4. Upload TC-05 → expect RED (watchlist hit)")
    print("   5. Upload TC-06 + face_impostor.png in webcam → expect RED (face mismatch)")

if __name__ == "__main__":
    generate_all()
