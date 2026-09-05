"""
Database init script — creates watchlist.db with mock blacklisted names/doc numbers.
Run once: python database/init_db.py
"""
import sqlite3
from pathlib import Path

DB_DIR  = Path(__file__).parent
WL_PATH = DB_DIR / "watchlist.db"


def init_watchlist():
    conn = sqlite3.connect(str(WL_PATH))
    conn.execute("""
        CREATE TABLE IF NOT EXISTS watchlist (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            name       TEXT NOT NULL,
            doc_number TEXT,
            reason     TEXT NOT NULL,
            added_date TEXT DEFAULT CURRENT_TIMESTAMP,
            source     TEXT DEFAULT 'MOCK_INTERPOL'
        )
    """)

    # ── Mock Blacklisted Entries (for SIH demo only) ──────────────────────────
    mock_data = [
        ("RAHUL VERMA",      "Z1234567", "Suspected human trafficking",     "INTERPOL_RED_NOTICE"),
        ("ARIF KHAN",        "B9876543", "Counterterrorism watchlist",       "MHA_ADVISORY"),
        ("SUNITA DEVI",      "P5551234", "Immigration fraud",                "IMMIGRATION_BUREAU"),
        ("JOHN DOE",         "A0000001", "Fake identity — multiple aliases", "INTELLIGENCE_BUREAU"),
        ("REZA AHMADI",      "IR123456", "Document forgery network",        "INTERPOL_RED_NOTICE"),
        ("NILUFER RASHIDOVA","UZ654321", "Counterfeit currency network",     "FINANCIAL_INTEL"),
        ("TARIQ HASSAN",     "PK112233", "Cross-border smuggling",           "BSF_ADVISORY"),
        ("PRIYA NAIR",       "K0099887", "Identity theft — Aadhaar fraud",  "UIDAI_ALERT"),
        ("CARLOS MENDEZ",    "MX445566", "Drug trafficking organization",    "INTERPOL_BLUE_NOTICE"),
        ("WANG FANG",        "CN778899", "Espionage suspect",                "INTELLIGENCE_BUREAU"),
    ]

    conn.executemany(
        "INSERT OR IGNORE INTO watchlist (name, doc_number, reason, source) VALUES (?,?,?,?)",
        mock_data
    )
    conn.commit()

    # FTS index for fast fuzzy name search
    conn.execute("CREATE VIRTUAL TABLE IF NOT EXISTS watchlist_fts USING fts5(name, doc_number, reason)")
    conn.execute("INSERT OR IGNORE INTO watchlist_fts SELECT name, doc_number, reason FROM watchlist")
    conn.commit()
    conn.close()
    print(f"[OK] Watchlist DB initialized at {WL_PATH} with {len(mock_data)} mock entries.")


if __name__ == "__main__":
    init_watchlist()
