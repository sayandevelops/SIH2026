"""
Module 5: Composite Risk Score Engine
Aggregates outputs from all modules into a weighted 0-100 risk score.
"""

from typing import Optional


# ─── Risk Band Thresholds ─────────────────────────────────────────────────────
GREEN_MAX  = 20
YELLOW_MAX = 60
# Above 60 → RED


def compute_risk_score(
    validation_result: Optional[dict] = None,
    tampering_result:  Optional[dict] = None,
    face_result:       Optional[dict] = None,
    watchlist_hit:     bool = False,
) -> dict:
    """
    Compute composite risk score (0–100) with breakdown.

    Weights:
      - Tampering:   35 pts max
      - Validation:  30 pts max
      - Face match:  25 pts max
      - Watchlist:   10 pts max
    """

    breakdown = {}

    # ── Tampering Score (0–35) ─────────────────────────────────────────────
    tampering_score = 0.0
    if tampering_result:
        raw = tampering_result.get("composite_score", 0.0)   # 0–100
        tampering_score = round(raw * 0.35, 2)               # scale to 0–35
    breakdown["tampering"] = tampering_score

    # ── Validation Score (0–30) ────────────────────────────────────────────
    validation_score = 0.0
    if validation_result:
        raw = validation_result.get("risk_contribution", 0.0)  # already 0–30
        validation_score = round(min(30.0, raw), 2)
    breakdown["validation"] = validation_score

    # ── Face Score (0–25) ──────────────────────────────────────────────────
    face_score = 0.0
    if face_result:
        decision = face_result.get("decision", "UNKNOWN")
        match_score = face_result.get("match_score") or 0.0
        liveness_passed = face_result.get("liveness_passed")

        if decision == "SPOOF_DETECTED":
            face_score = 25.0
        elif decision == "MISMATCH":
            face_score = 22.0
        elif decision == "UNCERTAIN":
            face_score = 12.0
        elif decision == "VERIFIED":
            face_score = 0.0
        else:
            face_score = 10.0  # Unknown / error

        # Penalise liveness failure
        if liveness_passed is False and face_score < 25.0:
            face_score = min(25.0, face_score + 8.0)

    breakdown["face"] = round(face_score, 2)

    # ── Watchlist Score (0–10) ─────────────────────────────────────────────
    watchlist_score = 10.0 if watchlist_hit else 0.0
    # Also check validation result for watchlist
    if validation_result:
        for check in validation_result.get("checks", []):
            if check.get("check_name") == "watchlist_lookup" and not check.get("passed"):
                watchlist_score = 10.0
    breakdown["watchlist"] = watchlist_score

    # ── Total ──────────────────────────────────────────────────────────────
    total = round(
        breakdown["tampering"] +
        breakdown["validation"] +
        breakdown["face"] +
        breakdown["watchlist"],
        2
    )
    total = min(100.0, total)

    # ── Band & Action ──────────────────────────────────────────────────────
    if total <= GREEN_MAX:
        band   = "GREEN"
        action = "✅ Allow passage — all checks passed."
    elif total <= YELLOW_MAX:
        band   = "YELLOW"
        action = "⚠️ Route to secondary inspection — suspicious indicators detected."
    else:
        band   = "RED"
        action = "🚨 INTERCEPT IMMEDIATELY — high probability of fraud or identity threat."

    return {
        "total_score":        total,
        "band":               band,
        "validation_contrib": breakdown["validation"],
        "tampering_contrib":  breakdown["tampering"],
        "face_contrib":       breakdown["face"],
        "watchlist_contrib":  breakdown["watchlist"],
        "recommended_action": action,
        "breakdown":          breakdown,
    }
