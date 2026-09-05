"""
ShieldScan — AI Border Document Intelligence System
FastAPI Main Application Entrypoint
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from routers import ocr, validation, tampering, face, audit, risk, screen, developer_api

# ─── App Setup ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="ShieldScan API",
    description="Defense-Grade AI Border & Document Intelligence System",
    version="1.0.0",
    contact={
        "name": "ShieldScan Security Team",
        "email": "contact@shieldscan.io",
    },
    license_info={"name": "MIT"},
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Dev mode: allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

from fastapi import Request
from fastapi.responses import JSONResponse
import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "type": type(exc).__name__},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

# ─── Static Files (uploaded docs & generated heatmaps) ────────────────────────
os.makedirs("uploads", exist_ok=True)
os.makedirs("reports", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/reports", StaticFiles(directory="reports"), name="reports")

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(ocr.router,           prefix="/api/ocr",        tags=["OCR Extraction"])
app.include_router(validation.router,    prefix="/api/validation", tags=["Document Validation"])
app.include_router(tampering.router,     prefix="/api/tampering",  tags=["Tampering Detection"])
app.include_router(face.router,          prefix="/api/face",       tags=["Face Verification"])
app.include_router(risk.router,          prefix="/api/risk",       tags=["Risk Score Engine"])
app.include_router(audit.router,         prefix="/api/audit",      tags=["Blockchain Audit"])
app.include_router(screen.router,        prefix="/api",            tags=["Unified Screening"])
app.include_router(developer_api.router, prefix="/api/v1",         tags=["Developer Platform & SDK"])

# ─── Health Check ─────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    return {
        "system": "ShieldScan",
        "status": "operational",
        "version": "1.0.0",
        "modules": ["ocr", "validation", "tampering", "face", "risk", "audit"],
    }

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok"}
