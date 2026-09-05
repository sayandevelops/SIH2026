# 🛡️ ShieldScan — AI Border Document Intelligence System

> **Defense-Grade AI & Sovereign Document Verification Suite**  
> Air-Gap Sovereign AI Architecture | Blockchain Tamper-Proof Audit  
> Theme: Cyber Defense, Computer Vision & Identity Intelligence

---

## 🚀 Quick Start

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python database/init_db.py        # Initialize mock watchlist DB
uvicorn main:app --reload --port 8000
```

API Docs available at: **http://localhost:8000/docs**

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

Dashboard at: **http://localhost:5173**

### Docker (Full Stack)
```bash
docker-compose up --build
```

---

## 📦 Modules

| Module | Description | Key Tech |
|:---|:---|:---|
| **1. OCR Extraction** | Extract text from passports, visas, national IDs | EasyOCR, PassportEye |
| **2. Document Validation** | ICAO checksum, date logic, watchlist lookup | Python, SQLite, rapidfuzz |
| **3. Tampering Detection** | ELA, CMFD, EXIF forensics, noise analysis | OpenCV, Pillow, piexif |
| **4. Face Verification** | 1:1 face matching + liveness anti-spoof | DeepFace (ArcFace), MediaPipe |
| **5. Risk Score Engine** | Weighted composite 0-100 risk score | Custom aggregator |
| **6. Blockchain Audit** | SHA-256 hash-chain tamper-evident log | hashlib, SQLite |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/screen` | **Master** — runs all modules |
| `POST` | `/api/ocr/extract` | OCR only |
| `POST` | `/api/validation/validate` | Validation only |
| `POST` | `/api/tampering/analyze` | Tampering only |
| `POST` | `/api/face/verify` | Face verification |
| `POST` | `/api/risk/score` | Risk score only |
| `POST` | `/api/audit/log` | Log audit event |
| `GET`  | `/api/audit/log` | Read audit log |
| `GET`  | `/api/audit/verify` | Verify chain integrity |

---

## 🧪 Test Cases (Demo)

| ID | Scenario | Expected Band |
|:---|:---|:---|
| TC-01 | Valid passport + face match ≥ 85% | 🟢 GREEN |
| TC-02 | Expired passport | 🟡 YELLOW |
| TC-03 | MRZ checksum mismatch (tampered DOB) | 🔴 RED |
| TC-04 | ELA photo splice detected | 🔴 RED |
| TC-05 | EXIF shows Photoshop edit | 🔴 RED |
| TC-06 | Face mismatch (wrong person) | 🔴 RED |
| TC-07 | Printed photo (liveness FAIL) | 🔴 RED |
| TC-08 | Blacklisted name in watchlist | 🔴 RED |

---

## 🛡️ Security

- ✅ No cloud API calls — fully air-gapped capable
- ✅ No biometric data stored permanently
- ✅ SHA-256 Merkle-chain audit trail
- ✅ Role-based access control (JWT)
- ✅ MIT Licensed — 100% Free & Open-Source

---

## 👥 Team

ShieldScan Core Security & AI Engineering Team.

---

## 📄 License

MIT — Free to use, modify, and distribute.
