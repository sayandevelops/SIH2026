"""FastAPI Router — Module 2: Document Validation"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.validator import run_full_validation

router = APIRouter()


class ValidationRequest(BaseModel):
    name:            Optional[str] = None
    passport_number: Optional[str] = None
    nationality:     Optional[str] = None
    date_of_birth:   Optional[str] = None
    date_of_expiry:  Optional[str] = None
    gender:          Optional[str] = None
    # MRZ raw fields for checksum validation
    dob_mrz:         Optional[str] = None
    expiry_mrz:      Optional[str] = None
    mrz_cd_passport: Optional[str] = None
    mrz_cd_dob:      Optional[str] = None
    mrz_cd_expiry:   Optional[str] = None


@router.post("/validate")
async def validate_document(req: ValidationRequest):
    """Run all validation checks on extracted document fields."""
    result = run_full_validation(req.model_dump())
    return {"status": "success", **result}
