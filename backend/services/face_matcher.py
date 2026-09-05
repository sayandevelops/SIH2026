"""
Module 4: Face Verification & Liveness Detection Service
Tools: DeepFace (ArcFace), RetinaFace, MediaPipe
"""

import cv2
import numpy as np
import base64
import os
import uuid
from pathlib import Path
from typing import Optional, Tuple

OUTPUT_DIR = Path(__file__).parent.parent / "uploads"

# ─── Face Detection ───────────────────────────────────────────────────────────

def detect_and_crop_face(image_path: str) -> Optional[np.ndarray]:
    """
    Detect the primary face in an image (document or live) and return cropped face.
    Uses RetinaFace for high accuracy on low-quality document photos.
    """
    try:
        from retinaface import RetinaFace
        faces = RetinaFace.extract_faces(img_path=image_path, align=True)
        if faces:
            return faces[0]
    except (ImportError, Exception):
        pass

    # Fallback: OpenCV Haar cascade
    img  = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces   = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))

    if len(faces) == 0:
        return None

    # Largest face
    x, y, w, h = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)[0]
    return img[y:y+h, x:x+w]


def save_face_crop(face_array: np.ndarray, prefix: str = "face") -> str:
    """Save face crop to uploads and return filename."""
    fname = f"{prefix}_{uuid.uuid4().hex[:8]}.jpg"
    path  = OUTPUT_DIR / fname
    cv2.imwrite(str(path), face_array)
    return fname


# ─── Face Matching (1:1 Verification) ────────────────────────────────────────

MATCH_THRESHOLD = 65.0   # Below this → MISMATCH
VERIFY_THRESHOLD = 85.0  # Above this → VERIFIED

def match_faces(doc_image_path: str, live_image_path: str) -> dict:
    """
    Compare face in document image vs live webcam image.
    Returns similarity score and verification verdict.
    """
    try:
        from deepface import DeepFace

        result = DeepFace.verify(
            img1_path   = doc_image_path,
            img2_path   = live_image_path,
            model_name  = "ArcFace",
            detector_backend = "retinaface",
            enforce_detection = False,
            distance_metric   = "cosine",
        )
        distance      = result.get("distance", 1.0)
        match_score   = round(max(0.0, (1.0 - distance) * 100), 2)
        verified      = result.get("verified", False)

        if match_score >= VERIFY_THRESHOLD:
            decision = "VERIFIED"
        elif match_score >= MATCH_THRESHOLD:
            decision = "UNCERTAIN"
        else:
            decision = "MISMATCH"

        return {
            "match_score": match_score,
            "verified":    verified,
            "decision":    decision,
            "detail":      f"ArcFace cosine distance={distance:.4f}, similarity={match_score:.1f}%",
            "model":       "ArcFace",
        }
    except ImportError:
        return {
            "match_score": None,
            "verified":    None,
            "decision":    "UNAVAILABLE",
            "detail":      "⚠️ DeepFace not installed. Run: pip install deepface",
        }
    except Exception as e:
        return {
            "match_score": 0.0,
            "verified":    False,
            "decision":    "ERROR",
            "detail":      f"Face matching failed: {e}",
        }


# ─── Liveness Detection ───────────────────────────────────────────────────────

def check_liveness_mediapipe(image_path: str) -> dict:
    """
    Passive liveness check using MediaPipe Face Mesh.
    Analyses 3D facial landmark depth variance.
    """
    try:
        import mediapipe as mp
    except ImportError:
        return {
            "liveness_passed": None,
            "liveness_score":  None,
            "detail":          "⚠️ MediaPipe not installed. Run: pip install mediapipe",
        }

    try:
        mp_face_mesh = mp.solutions.face_mesh
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Cannot read image")

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        h, w    = img.shape[:2]

        with mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
        ) as face_mesh:
            results = face_mesh.process(img_rgb)

        if not results.multi_face_landmarks:
            return {
                "liveness_passed": False,
                "liveness_score":  0.0,
                "detail":          "No face detected for liveness check",
            }

        landmarks = results.multi_face_landmarks[0].landmark
        z_coords = [lm.z for lm in landmarks]
        z_variance = float(np.var(z_coords))

        LIVE_THRESHOLD = 0.0008
        liveness_passed = z_variance > LIVE_THRESHOLD
        liveness_score  = min(1.0, z_variance / 0.003) * 100

        return {
            "liveness_passed": liveness_passed,
            "liveness_score":  round(liveness_score, 2),
            "z_variance":      round(z_variance, 6),
            "detail":          f"Depth variance={z_variance:.6f}. {'Real face detected.' if liveness_passed else '⚠️ Possible spoof — flat face.'}",
        }
    except Exception as e:
        return {
            "liveness_passed": None,
            "liveness_score":  None,
            "detail":          f"Liveness check failed: {e}",
        }


# ─── Decode Base64 Image (from webcam) ───────────────────────────────────────

def decode_base64_image(b64_str: str) -> str:
    """Decode a base64 image string and save to uploads. Returns file path."""
    if b64_str.startswith("data:image"):
        b64_str = b64_str.split(",", 1)[1]
    img_bytes = base64.b64decode(b64_str)
    fname = f"live_{uuid.uuid4().hex[:8]}.jpg"
    fpath = OUTPUT_DIR / fname
    with open(str(fpath), "wb") as f:
        f.write(img_bytes)
    return str(fpath)


# ─── Full Face Verification Pipeline ─────────────────────────────────────────

def run_face_verification(doc_image_path: str, live_image_b64: Optional[str] = None) -> dict:
    """
    Run complete face verification pipeline:
    1. Detect face in document
    2. Detect face in live image (if provided)
    3. Match faces
    4. Check liveness
    """
    result = {
        "face_detected_doc":  False,
        "face_detected_live": False,
        "match_score":        None,
        "verified":           None,
        "liveness_passed":    None,
        "liveness_score":     None,
        "decision":           "UNKNOWN",
    }

    # Step 1: Detect face in document
    doc_face = detect_and_crop_face(doc_image_path)
    result["face_detected_doc"] = doc_face is not None

    if doc_face is None:
        result["decision"] = "NO_FACE_IN_DOC"
        return result

    doc_face_path = str(OUTPUT_DIR / save_face_crop(doc_face, "doc_face"))

    if not live_image_b64:
        result["decision"] = "NO_LIVE_IMAGE"
        return result

    # Step 2: Decode and detect live face
    live_image_path = decode_base64_image(live_image_b64)
    live_face       = detect_and_crop_face(live_image_path)
    result["face_detected_live"] = live_face is not None

    if live_face is None:
        result["decision"] = "NO_FACE_IN_LIVE"
        return result

    # Step 3: Match
    match_result = match_faces(doc_face_path, live_image_path)
    result.update(match_result)

    # Step 4: Liveness check on live image
    liveness_result = check_liveness_mediapipe(live_image_path)
    result["liveness_passed"] = liveness_result.get("liveness_passed")
    result["liveness_score"]  = liveness_result.get("liveness_score")
    result["liveness_detail"] = liveness_result.get("detail")

    # Override decision if liveness fails
    if result.get("liveness_passed") is False:
        result["decision"] = "SPOOF_DETECTED"

    return result
