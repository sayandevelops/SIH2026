"""
Module 3: Tampering Detection Service
Techniques: ELA, CMFD, EXIF Forensics, Noise/Edge Analysis
"""

import cv2
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
import io
import os
import uuid
from pathlib import Path
from typing import Optional

OUTPUT_DIR = Path(__file__).parent.parent / "uploads"

# ─── 3a. Error Level Analysis (ELA) ─────────────────────────────────────────

def run_ela(image_path: str, quality: int = 90) -> dict:
    """
    Detect digitally edited regions via JPEG re-compression error analysis.
    Authentic regions show uniform low-error; edited regions show high-error spikes.
    """
    try:
        original = Image.open(image_path).convert("RGB")

        # Re-save at known quality
        buf = io.BytesIO()
        original.save(buf, format="JPEG", quality=quality)
        buf.seek(0)
        resaved = Image.open(buf).convert("RGB")

        # Compute pixel difference
        ela_img = ImageChops.difference(original, resaved)
        ela_arr = np.array(ela_img)

        # Amplify for visualization
        scale = 20
        ela_vis = np.clip(ela_arr * scale, 0, 255).astype(np.uint8)
        ela_pil = Image.fromarray(ela_vis)

        # Analyze error statistics
        max_error  = int(ela_arr.max())
        mean_error = float(ela_arr.mean())

        # Heuristic: high max error relative to mean suggests tampering
        # Threshold tuned empirically
        tampered   = bool(max_error > 80 and mean_error > 5.0)
        confidence = float(min(1.0, (max_error / 255.0) * 1.5) if tampered else max(0.0, mean_error / 30))

        # Save heatmap
        heatmap_name = f"ela_{uuid.uuid4().hex[:8]}.png"
        heatmap_path = OUTPUT_DIR / heatmap_name
        ela_pil.save(str(heatmap_path))

        return {
            "technique":    "Error Level Analysis (ELA)",
            "tampered":     bool(tampered),
            "confidence":   round(float(confidence), 3),
            "detail":       f"Max error={max_error}, Mean error={mean_error:.2f}. {'Suspicious high-error regions found.' if tampered else 'Error distribution uniform — authentic.'}",
            "heatmap_path": str(heatmap_path),
            "heatmap_name": heatmap_name,
        }
    except Exception as e:
        return {"technique": "ELA", "tampered": False, "confidence": 0.0, "detail": f"ELA failed: {e}", "heatmap_path": None}


# ─── 3b. Copy-Move Forgery Detection (CMFD) ─────────────────────────────────

def run_cmfd(image_path: str) -> dict:
    """
    Detect copy-moved (cloned/duplicated) regions using SIFT keypoint matching.
    Suspicious if many keypoints cluster on closely-spaced, similar regions.
    """
    try:
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            raise ValueError("Cannot read image")

        sift = cv2.SIFT_create(nfeatures=800)
        kp, des = sift.detectAndCompute(img, None)

        if des is None or len(des) < 10:
            return {
                "technique": "Copy-Move Forgery Detection (CMFD)",
                "tampered": False, "confidence": 0.0,
                "detail": "Insufficient keypoints for CMFD analysis.",
                "heatmap_path": None,
            }

        # Match descriptors against themselves (excluding exact self-matches)
        bf     = cv2.BFMatcher(cv2.NORM_L2)
        matches = bf.knnMatch(des, des, k=5)

        suspicious_pairs = []
        for match_list in matches:
            for m in match_list[1:]:  # skip first (self-match)
                i, j = m.queryIdx, m.trainIdx
                if i == j:
                    continue
                pt1 = np.array(kp[i].pt)
                pt2 = np.array(kp[j].pt)
                dist = np.linalg.norm(pt1 - pt2)
                # Spatially separate but descriptor-similar → copied region
                if 20 < dist < 300 and m.distance < 60:
                    suspicious_pairs.append((i, j, dist))

        tampered   = bool(len(suspicious_pairs) > 15)
        confidence = float(min(1.0, len(suspicious_pairs) / 50))

        # Visualize suspicious keypoints
        heatmap_name = None
        if suspicious_pairs:
            vis = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
            for i, j, _ in suspicious_pairs[:30]:
                pt1 = tuple(int(x) for x in kp[i].pt)
                pt2 = tuple(int(x) for x in kp[j].pt)
                cv2.circle(vis, pt1, 8, (0, 0, 255), 2)
                cv2.circle(vis, pt2, 8, (255, 0, 0), 2)
                cv2.line(vis, pt1, pt2, (0, 255, 255), 1)
            heatmap_name = f"cmfd_{uuid.uuid4().hex[:8]}.png"
            cv2.imwrite(str(OUTPUT_DIR / heatmap_name), vis)

        return {
            "technique":    "Copy-Move Forgery Detection (CMFD)",
            "tampered":     bool(tampered),
            "confidence":   round(float(confidence), 3),
            "detail":       f"Found {len(suspicious_pairs)} suspicious keypoint pairs. {'Possible stamp/region duplication detected!' if tampered else 'No significant copy-move patterns.'}",
            "heatmap_path": str(OUTPUT_DIR / heatmap_name) if heatmap_name else None,
            "heatmap_name": heatmap_name,
        }
    except Exception as e:
        return {"technique": "CMFD", "tampered": False, "confidence": 0.0, "detail": f"CMFD failed: {e}", "heatmap_path": None}


# ─── 3c. EXIF Metadata Forensics ─────────────────────────────────────────────

SUSPICIOUS_SOFTWARE = [
    "photoshop", "gimp", "lightroom", "paint.net", "affinity",
    "pixelmator", "corel", "inkscape", "canva", "adobe",
]

def run_exif_forensics(image_path: str) -> dict:
    """
    Analyse EXIF metadata for signs of editing software, timestamp
    inconsistencies, or missing camera-specific tags.
    """
    try:
        import exifread
        with open(image_path, "rb") as f:
            tags = exifread.process_file(f, details=False)

        anomalies = []
        exif_data = {}

        for tag, val in tags.items():
            key   = str(tag)
            value = str(val)
            exif_data[key] = value

            # Check for editing software
            if "Software" in key:
                for sw in SUSPICIOUS_SOFTWARE:
                    if sw in value.lower():
                        anomalies.append(f"Editing software detected: '{value}'")

        # Missing camera model is suspicious for a document scan
        if "Image Make" not in exif_data and "Image Model" not in exif_data:
            anomalies.append("No camera make/model in EXIF — possibly screenshot or edited image")

        # GPS data in an ID document is suspicious
        if any("GPS" in k for k in exif_data.keys()):
            anomalies.append("GPS coordinates found in document image EXIF — unusual for scanned docs")

        tampered   = len(anomalies) > 0
        confidence = min(1.0, len(anomalies) * 0.35)

        return {
            "technique":    "EXIF Metadata Forensics",
            "tampered":     tampered,
            "confidence":   round(confidence, 3),
            "detail":       " | ".join(anomalies) if anomalies else "No suspicious EXIF anomalies found.",
            "exif_tags":    exif_data,
            "heatmap_path": None,
        }
    except Exception as e:
        return {"technique": "EXIF Forensics", "tampered": False, "confidence": 0.0, "detail": f"EXIF analysis failed: {e}", "heatmap_path": None}


# ─── 3d. Noise & Edge Inconsistency Analysis ─────────────────────────────────

def run_noise_analysis(image_path: str) -> dict:
    """
    Detect splice zones via Laplacian edge map variance analysis.
    Spliced regions show abnormally sharp or blurry edges compared to surroundings.
    """
    try:
        img  = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            raise ValueError("Cannot read image")

        # Divide into blocks and compute Laplacian variance per block
        h, w   = img.shape
        block  = 64  # 64×64 pixel blocks
        variances = []

        for y in range(0, h - block, block):
            for x in range(0, w - block, block):
                roi = img[y:y+block, x:x+block]
                lap = cv2.Laplacian(roi, cv2.CV_64F)
                variances.append(lap.var())

        if not variances:
            return {"technique": "Noise Analysis", "tampered": False, "confidence": 0.0, "detail": "Image too small for block analysis.", "heatmap_path": None}

        mean_var = np.mean(variances)
        std_var  = np.std(variances)
        cv_coeff = std_var / (mean_var + 1e-6)  # Coefficient of Variation

        # High CV → inconsistent sharpness → probable splice
        tampered   = bool(cv_coeff > 1.5)
        confidence = float(min(1.0, cv_coeff / 3.0))

        return {
            "technique":  "Noise & Edge Inconsistency Analysis",
            "tampered":   bool(tampered),
            "confidence": round(float(confidence), 3),
            "detail":     f"Edge variance CV={float(cv_coeff):.2f}. {'Inconsistent sharpness — possible splice zone.' if tampered else 'Uniform noise pattern — authentic.'}",
            "heatmap_path": None,
        }
    except Exception as e:
        return {"technique": "Noise Analysis", "tampered": False, "confidence": 0.0, "detail": f"Noise analysis failed: {e}", "heatmap_path": None}


# ─── Composite Tampering Engine ───────────────────────────────────────────────

TECHNIQUE_WEIGHTS = {
    "Error Level Analysis (ELA)":              0.40,
    "Copy-Move Forgery Detection (CMFD)":      0.30,
    "EXIF Metadata Forensics":                 0.20,
    "Noise & Edge Inconsistency Analysis":     0.10,
}

def run_full_tampering_analysis(image_path: str) -> dict:
    """Run all 4 tampering detection techniques and compute composite risk score."""
    results = [
        run_ela(image_path),
        run_cmfd(image_path),
        run_exif_forensics(image_path),
        run_noise_analysis(image_path),
    ]

    weighted_score = 0.0
    for r in results:
        w = TECHNIQUE_WEIGHTS.get(r["technique"], 0.0)
        weighted_score += float(r["confidence"]) * w * 100

    overall_tampered = bool(any(bool(r["tampered"]) for r in results))
    composite_score  = float(round(min(100.0, weighted_score), 2))

    # Primary heatmap is ELA result
    ela_result    = results[0]
    heatmap_url   = f"/uploads/{ela_result.get('heatmap_name')}" if ela_result.get("heatmap_name") else None

    return {
        "overall_tampered": bool(overall_tampered),
        "techniques":       results,
        "composite_score":  float(composite_score),
        "heatmap_url":      heatmap_url,
    }
