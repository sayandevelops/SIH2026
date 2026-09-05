"""
PDF Handler Utility
Provides functions to detect, render, and extract text from uploaded PDF documents.
Uses PyMuPDF (fitz) for fast, standalone rendering without external dependencies (no poppler required).
"""

from pathlib import Path
from typing import Tuple, Optional
import shutil
import uuid
from fastapi import UploadFile, HTTPException


def is_pdf(filename: str, content_type: Optional[str] = None) -> bool:
    """Check if the given file is a PDF based on extension or MIME type."""
    if content_type and "pdf" in content_type.lower():
        return True
    return Path(filename).suffix.lower() == ".pdf"


def process_uploaded_document(
    upload_file: UploadFile,
    dest_dir: Path,
    prefix: str = "doc"
) -> Tuple[Path, str, Optional[str]]:
    """
    Saves an uploaded document (Image or PDF).
    If it's a PDF, renders page 1 to a high-resolution PNG for OCR and forensics,
    and extracts any embedded digital text.

    Returns:
        (image_path, image_url, embedded_pdf_text)
    """
    dest_dir.mkdir(parents=True, exist_ok=True)
    filename = upload_file.filename or "upload.jpg"
    ext = Path(filename).suffix.lower() or ".jpg"
    content_type = upload_file.content_type or ""
    uid = uuid.uuid4().hex[:8]

    # Validate file type
    if not (content_type.startswith("image/") or is_pdf(filename, content_type)):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Please upload a valid image (JPG, PNG, TIFF) or PDF document."
        )

    if is_pdf(filename, content_type):
        try:
            import pymupdf
        except ImportError:
            raise HTTPException(
                status_code=500,
                detail="PDF processing engine (PyMuPDF) is not installed on the server."
            )

        # Save the original PDF
        pdf_name = f"{prefix}_{uid}.pdf"
        pdf_path = dest_dir / pdf_name
        with open(str(pdf_path), "wb") as f:
            shutil.copyfileobj(upload_file.file, f)

        try:
            # Open PDF and render first page to high-res PNG (200 DPI)
            doc = pymupdf.open(str(pdf_path))
            if len(doc) == 0:
                raise ValueError("PDF file is empty (0 pages).")

            page = doc[0]
            pix = page.get_pixmap(dpi=200)
            img_name = f"{prefix}_{uid}.png"
            img_path = dest_dir / img_name
            pix.save(str(img_path))

            # Extract any embedded digital text from PDF
            embedded_text = page.get_text() or ""
            doc.close()

            img_url = f"/uploads/{img_name}"
            return img_path, img_url, embedded_text

        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to process PDF document: {str(e)}"
            )

    else:
        # Regular image file
        img_name = f"{prefix}_{uid}{ext}"
        img_path = dest_dir / img_name
        with open(str(img_path), "wb") as f:
            shutil.copyfileobj(upload_file.file, f)

        img_url = f"/uploads/{img_name}"
        return img_path, img_url, None
