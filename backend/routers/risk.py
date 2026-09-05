"""FastAPI Router — Module 5: Risk Score Engine"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.risk_engine import compute_risk_score

router = APIRouter()


class RiskRequest(BaseModel):
    validation_result: Optional[dict] = None
    tampering_result:  Optional[dict] = None
    face_result:       Optional[dict] = None
    watchlist_hit:     bool = False


@router.post("/score")
async def get_risk_score(req: RiskRequest):
    """Compute composite risk score from all module results."""
    result = compute_risk_score(
        validation_result = req.validation_result,
        tampering_result  = req.tampering_result,
        face_result       = req.face_result,
        watchlist_hit     = req.watchlist_hit,
    )
    return {"status": "success", **result}
