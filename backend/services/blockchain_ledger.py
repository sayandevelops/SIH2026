"""
Module 6: Blockchain-Style Audit Ledger
SHA-256 hash chain for tamper-evident screening event logs.
"""

import hashlib
import json
import sqlite3
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional

DB_PATH = Path(__file__).parent.parent / "database" / "audit_ledger.db"

# ─── Database Init ────────────────────────────────────────────────────────────

def init_ledger_db():
    """Create the audit ledger table if it doesn't exist."""
    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("""
        CREATE TABLE IF NOT EXISTS audit_ledger (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id    TEXT NOT NULL,
            timestamp     TEXT NOT NULL,
            officer_id    TEXT,
            checkpoint    TEXT,
            doc_type      TEXT,
            extracted_name TEXT,
            doc_number    TEXT,
            risk_score    REAL,
            risk_band     TEXT,
            action_taken  TEXT,
            event_hash    TEXT NOT NULL,
            prev_hash     TEXT NOT NULL,
            payload_json  TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


# ─── Hash Chain Helpers ───────────────────────────────────────────────────────

def _get_last_hash() -> str:
    """Retrieve the hash of the most recent ledger entry (genesis hash if empty)."""
    try:
        conn   = sqlite3.connect(str(DB_PATH))
        cursor = conn.execute("SELECT event_hash FROM audit_ledger ORDER BY id DESC LIMIT 1")
        row    = cursor.fetchone()
        conn.close()
        return row[0] if row else "0" * 64  # Genesis block
    except:
        return "0" * 64


def _compute_hash(prev_hash: str, payload: dict) -> str:
    """SHA-256 hash of prev_hash + sorted JSON payload."""
    raw = prev_hash + json.dumps(payload, sort_keys=True, default=str)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


# ─── Write Event ──────────────────────────────────────────────────────────────

def log_screening_event(
    session_id:    str,
    officer_id:    str,
    checkpoint:    str,
    doc_type:      str,
    extracted_name: str,
    doc_number:    str,
    risk_score:    float,
    risk_band:     str,
    action_taken:  str,
    full_payload:  dict,
) -> dict:
    """
    Append a new screening event to the tamper-evident audit chain.
    Returns the session's block hash and previous hash.
    """
    init_ledger_db()

    prev_hash = _get_last_hash()
    timestamp = datetime.utcnow().isoformat() + "Z"

    # Build payload (what gets hashed)
    payload = {
        "session_id":    session_id,
        "timestamp":     timestamp,
        "officer_id":    officer_id,
        "checkpoint":    checkpoint,
        "doc_type":      doc_type,
        "doc_number":    doc_number,
        "risk_score":    risk_score,
        "risk_band":     risk_band,
    }

    event_hash = _compute_hash(prev_hash, payload)

    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("""
        INSERT INTO audit_ledger
        (session_id, timestamp, officer_id, checkpoint, doc_type,
         extracted_name, doc_number, risk_score, risk_band,
         action_taken, event_hash, prev_hash, payload_json)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (
        session_id, timestamp, officer_id, checkpoint, doc_type,
        extracted_name, doc_number, risk_score, risk_band,
        action_taken, event_hash, prev_hash, json.dumps(full_payload, default=str)
    ))
    conn.commit()
    conn.close()

    return {
        "session_id": session_id,
        "event_hash": event_hash,
        "prev_hash":  prev_hash,
        "timestamp":  timestamp,
    }


# ─── Read / Verify Chain ──────────────────────────────────────────────────────

def get_audit_log(limit: int = 50, offset: int = 0) -> list:
    """Retrieve recent audit log entries."""
    init_ledger_db()
    conn   = sqlite3.connect(str(DB_PATH))
    cursor = conn.execute("""
        SELECT id, session_id, timestamp, officer_id, checkpoint,
               doc_type, extracted_name, doc_number,
               risk_score, risk_band, action_taken, event_hash, prev_hash
        FROM audit_ledger ORDER BY id DESC LIMIT ? OFFSET ?
    """, (limit, offset))
    rows = cursor.fetchall()
    conn.close()

    cols = ["id","session_id","timestamp","officer_id","checkpoint",
            "doc_type","extracted_name","doc_number",
            "risk_score","risk_band","action_taken","event_hash","prev_hash"]
    return [dict(zip(cols, row)) for row in rows]


def verify_chain_integrity() -> dict:
    """
    Walk the entire hash chain from genesis and verify each block.
    Returns whether chain is intact and first broken link (if any).
    """
    init_ledger_db()
    conn   = sqlite3.connect(str(DB_PATH))
    cursor = conn.execute("""
        SELECT session_id, timestamp, officer_id, checkpoint, doc_type,
               doc_number, risk_score, risk_band,
               event_hash, prev_hash, payload_json
        FROM audit_ledger ORDER BY id ASC
    """)
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return {"intact": True, "total_blocks": 0, "broken_at": None}

    prev = "0" * 64
    for i, row in enumerate(rows):
        stored_hash = row[8]
        stored_prev = row[9]
        payload     = json.loads(row[10])

        # Recompute hash from stored_prev + payload fields
        recomputed_payload = {
            "session_id":  payload.get("session_id", row[0]),
            "timestamp":   payload.get("timestamp",  row[1]),
            "officer_id":  payload.get("officer_id", row[2]),
            "checkpoint":  payload.get("checkpoint", row[3]),
            "doc_type":    payload.get("doc_type",   row[4]),
            "doc_number":  payload.get("doc_number", row[5]),
            "risk_score":  payload.get("risk_score", row[6]),
            "risk_band":   payload.get("risk_band",  row[7]),
        }
        recomputed = _compute_hash(stored_prev, recomputed_payload)

        if recomputed != stored_hash or stored_prev != prev:
            return {
                "intact":       False,
                "total_blocks": len(rows),
                "broken_at":    i + 1,
                "detail":       f"Block {i+1} hash mismatch — CHAIN TAMPERED!",
            }
        prev = stored_hash

    return {
        "intact":       True,
        "total_blocks": len(rows),
        "broken_at":    None,
        "detail":       f"All {len(rows)} blocks verified — chain intact ✓",
    }
