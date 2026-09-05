"""FastAPI Router — Module 6: Blockchain Audit Ledger"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.blockchain_ledger import log_screening_event, get_audit_log, verify_chain_integrity

router = APIRouter()


class AuditEventRequest(BaseModel):
    session_id:      str
    officer_id:      str = "OFFICER-01"
    checkpoint:      str = "CHECKPOINT-ALPHA"
    doc_type:        str = "PASSPORT"
    extracted_name:  str = ""
    doc_number:      str = ""
    risk_score:      float = 0.0
    risk_band:       str = "GREEN"
    action_taken:    str = ""
    full_payload:    dict = {}


@router.post("/log")
async def log_event(req: AuditEventRequest):
    """Append a screening event to the blockchain audit chain."""
    result = log_screening_event(**req.model_dump())
    return {"status": "success", **result}


@router.get("/log")
async def get_log(limit: int = 50, offset: int = 0):
    """Retrieve recent audit log entries."""
    events = get_audit_log(limit=limit, offset=offset)
    return {"status": "success", "count": len(events), "events": events}


@router.get("/verify")
async def verify_integrity():
    """Verify the full hash chain integrity of the audit ledger."""
    result = verify_chain_integrity()
    return {"status": "success", **result}
