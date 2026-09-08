import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Cpu, Eye, Shield, Lock, Layers, Zap,
  CheckCircle2, Terminal, ArrowRight, Copy, Check,
  Sparkles, FileText, Fingerprint, GraduationCap,
  HardDrive, Search, Server, ShieldCheck, AlertTriangle,
  Play, ExternalLink, HelpCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const guideSections = [
  { id: "architecture", label: "🗺️ Architecture & Pipeline", icon: Layers },
  { id: "algorithms", label: "🔬 AI Forensic Math & Logic", icon: Cpu },
  { id: "hardware-sop", label: "🎓 Exam & Entrance Kiosk SOP", icon: GraduationCap },
  { id: "api-reference", label: "⚡ Developer REST API", icon: Terminal },
  { id: "blockchain", label: "⛓️ Cryptographic Audit Ledger", icon: Lock },
  { id: "walkthrough", label: "🧪 Live Hands-On Testing", icon: Play },
];

export default function GuidePage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("architecture");
  const [copiedCode, setCopiedCode] = useState("");

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedCode(""), 2000);
  };

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 24px 80px" }}>
      
      {/* ── 1. Guide Header ──────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "6px 18px", borderRadius: "999px",
          background: "#eff6ff", border: "1px solid #bfdbfe",
          fontSize: "0.78rem", fontWeight: 700, color: "#2563eb",
          letterSpacing: "0.04em", textTransform: "uppercase",
          marginBottom: 16,
        }}>
          <BookOpen size={15} color="#2563eb" />
          SHIELDSCAN MASTER TECHNICAL & OPERATIONAL STUDY GUIDE
        </div>

        <h1 style={{
          fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
          fontWeight: 800, lineHeight: 1.18,
          letterSpacing: "-0.03em",
          color: "#0f172a",
          marginBottom: 16,
        }}>
          How ShieldScan Works: In-Depth Technical Guide
        </h1>

        <p style={{
          fontSize: "1.1rem", color: "#475569",
          maxWidth: 720, margin: "0 auto 24px",
          lineHeight: 1.6,
        }}>
          Comprehensive blueprint explaining forensic tamper detection mathematics, biometric 1:1 facial matching, physical entrance kiosk deployment SOPs, and REST API integration.
        </p>

        {/* Quick Spec Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, fontSize: "0.8rem", color: "#334155", fontWeight: 600 }}>
          <span style={{ padding: "5px 12px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            ⏱️ &lt; 8.4s Total Latency
          </span>
          <span style={{ padding: "5px 12px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            🔒 100% Offline Air-Gap Mode
          </span>
          <span style={{ padding: "5px 12px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            📐 ICAO Doc 9303 & Verhoeff D5 Compliant
          </span>
          <span style={{ padding: "5px 12px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            🛡️ SHA-256 Court-Admissible Proofs
          </span>
        </div>
      </div>

      {/* ── 2. Interactive Navigation Pills ───────────────────────── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "center",
        marginBottom: 36,
        position: "sticky",
        top: 72,
        zIndex: 50,
        background: "rgba(248, 250, 252, 0.9)",
        backdropFilter: "blur(12px)",
        padding: "10px 0",
      }}>
        {guideSections.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 18px",
                borderRadius: "10px",
                fontSize: "0.84rem",
                fontWeight: isActive ? 700 : 600,
                cursor: "pointer",
                border: isActive ? "1.5px solid #2563eb" : "1px solid #e2e8f0",
                background: isActive ? "#ffffff" : "#f1f5f9",
                color: isActive ? "#2563eb" : "#475569",
                boxShadow: isActive ? "0 2px 8px rgba(37, 99, 235, 0.12)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              <sec.icon size={15} color={isActive ? "#2563eb" : "#64748b"} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 3. Main Content Container ─────────────────────────────── */}
      <div style={{ background: "#ffffff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "36px 30px", boxShadow: "0 4px 20px -4px rgba(0,0,0,0.04)" }}>
        
        {/* ── TAB 1: ARCHITECTURE & PIPELINE ──────────────────────── */}
        {activeSection === "architecture" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ marginBottom: 28 }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                SECTION 01
              </span>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
                End-to-End System Architecture & Pipeline
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6 }}>
                ShieldScan operates on an air-gapped sovereign edge pipeline designed to run on desktop document cradles, exam kiosks, or local edge server racks without sending data outside the local facility.
              </p>
            </div>

            {/* 4-Stage Flowchart Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18, marginBottom: 36 }}>
              {[
                {
                  step: "STAGE 01",
                  title: "Multi-Source Document Ingestion",
                  desc: "Captures identity credential from optical cradle (3M CR-5400), exam kiosk camera, webcam, or digital PDF/image upload. Normalizes resolution and color balance.",
                  color: "#2563eb",
                },
                {
                  step: "STAGE 02",
                  title: "Forensic & Optical Tamper Engine",
                  desc: "EasyOCR extracts biographic fields. Algorithmic validators check ICAO 9303 / Verhoeff D5 equations. OpenCV computes ELA 90% JPEG difference and ORB keypoint clones.",
                  color: "#059669",
                },
                {
                  step: "STAGE 03",
                  title: "Biometric ArcFace 1:1 Matching",
                  desc: "Crops portrait photo from document. Live webcam captures candidate. ArcFace extracts 512D deep embedding vectors in RAM and computes cosine similarity + liveness check.",
                  color: "#7c3aed",
                },
                {
                  step: "STAGE 04",
                  title: "Cryptographic Consensus & Verdict",
                  desc: "Sub-millisecond LOC cross-check. Generates risk score (0-100), seals screening event into immutable SHA-256 block ledger, and returns court-admissible audit proof.",
                  color: "#0284c7",
                },
              ].map((st, i) => (
                <div key={i} style={{ padding: "22px", borderRadius: "14px", background: "#f8fafc", border: "1px solid #e2e8f0", position: "relative" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, color: st.color, letterSpacing: "0.06em", marginBottom: 6 }}>
                    {st.step}
                  </div>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
                    {st.title}
                  </h4>
                  <p style={{ fontSize: "0.84rem", color: "#475569", lineHeight: 1.55, margin: 0 }}>
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Sovereign Air-Gap Deep Dive */}
            <div style={{ padding: "24px", borderRadius: "14px", background: "#eff6ff", border: "1px solid #bfdbfe" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <HardDrive size={20} color="#2563eb" />
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e40af", margin: 0 }}>
                  Why Air-Gap Sovereignty Matters
                </h4>
              </div>
              <p style={{ fontSize: "0.88rem", color: "#334155", lineHeight: 1.6, margin: 0 }}>
                Unlike cloud-based identity verification APIs (AWS Rekognition, Google Cloud Vision) that require outbound internet connectivity and transmit sensitive citizen facial biometrics to external US data centers, ShieldScan bundles quantized neural models directly on the local machine. Even if network cables are cut or remote border towers lose power, the entire 8-stage verification pipeline operates at 100% capacity with 0 bytes transmitted externally.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── TAB 2: ALGORITHMIC DEEP DIVE ────────────────────────── */}
        {activeSection === "algorithms" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ marginBottom: 28 }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                SECTION 02
              </span>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
                Forensic Detection Algorithms: Mathematical Deep Dive
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6 }}>
                Step-by-step mathematical logic explaining how ShieldScan detects digital forgery, spliced photographs, and algorithmic checksum falsification.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Algorithm 1: ELA */}
              <div style={{ padding: "24px", borderRadius: "14px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Eye size={20} color="#2563eb" />
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    1. Error Level Analysis (ELA) Compression Heatmap
                  </h3>
                </div>
                <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: 1.6, marginBottom: 12 }}>
                  When a JPEG image is saved, the discrete cosine transform (DCT) quantizes high-frequency pixel variations into lossy 8x8 pixel blocks. When a fraudulent document is modified in Photoshop or Canva (e.g., changing an expiry date from 2024 to 2028 or pasting a new portrait), that specific modified region is re-compressed at a different quantization ratio compared to the untouched document background.
                </p>
                <div style={{ padding: "14px 18px", borderRadius: "10px", background: "#0f172a", color: "#38bdf8", fontFamily: "JetBrains Mono, monospace", fontSize: "0.82rem", marginBottom: 12 }}>
                  ELA_Pixel(x, y) = | Original_Image(x, y) - Recompressed_JPEG_90(x, y) | * Scale_Factor
                </div>
                <p style={{ fontSize: "0.85rem", color: "#334155", lineHeight: 1.5, margin: 0 }}>
                  ShieldScan calculates the absolute variance across the image matrix. Untouched authentic areas stabilize to a uniform low-variance dark blue noise floor, whereas spliced text or altered photos appear as glowing neon red/amber clusters on the interactive ELA viewer.
                </p>
              </div>

              {/* Algorithm 2: CMFD */}
              <div style={{ padding: "24px", borderRadius: "14px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Sparkles size={20} color="#059669" />
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    2. Copy-Move Forgery Detection (CMFD) via ORB Keypoints
                  </h3>
                </div>
                <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: 1.6, marginBottom: 12 }}>
                  Fraudsters frequently duplicate official rubber stamps, government crests, or signatures from valid documents onto counterfeit cards. ShieldScan deploys Oriented FAST and Rotated BRIEF (ORB) keypoint feature extraction to generate 256-bit binary descriptors.
                </p>
                <p style={{ fontSize: "0.85rem", color: "#334155", lineHeight: 1.5, margin: 0 }}>
                  A k-Nearest Neighbors (k-NN) matcher compares all keypoint pairs. When multiple identical keypoint clusters exist at separate coordinate regions with near-zero Hamming distance, the system flags a high-confidence <strong>Copy-Move Cloned Region</strong>.
                </p>
              </div>

              {/* Algorithm 3: Checksums */}
              <div style={{ padding: "24px", borderRadius: "14px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <ShieldCheck size={20} color="#7c3aed" />
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    3. ICAO 9303 (7-3-1) & Verhoeff D5 Checksum Verification
                  </h3>
                </div>
                <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: 1.6, marginBottom: 12 }}>
                  Passports and Aadhaar cards contain mathematical checksums that cannot be guessed by simple observation:
                </p>
                <ul style={{ paddingLeft: 20, fontSize: "0.86rem", color: "#475569", lineHeight: 1.7, margin: 0 }}>
                  <li><strong>ICAO 9303 Passport Checksum:</strong> Evaluates the Machine Readable Zone (MRZ). Each alphanumeric character is converted to an integer value and multiplied by cyclical weights (7, 3, 1). The sum modulo 10 must match the check digit exactly.</li>
                  <li><strong>Verhoeff D5 Algorithm (Aadhaar):</strong> Based on the dihedral group D5 of permutations of order 10. Catches 100% of single-digit substitution errors and 100% of adjacent transposition errors (e.g., swapping 48 for 84).</li>
                </ul>
              </div>

              {/* Algorithm 4: ArcFace */}
              <div style={{ padding: "24px", borderRadius: "14px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Fingerprint size={20} color="#0284c7" />
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    4. ArcFace 512D Deep Biometric Embeddings & Cosine Similarity
                  </h3>
                </div>
                <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: 1.6, marginBottom: 12 }}>
                  Both the ID photo crop and the live webcam stream pass through an ArcFace deep residual neural network trained on over 5 million facial identities. The network maps facial geometry onto a 512-dimensional hypersphere with an additive angular margin.
                </p>
                <div style={{ padding: "14px 18px", borderRadius: "10px", background: "#0f172a", color: "#38bdf8", fontFamily: "JetBrains Mono, monospace", fontSize: "0.82rem", marginBottom: 12 }}>
                  Cosine_Similarity(V_id, V_live) = (V_id • V_live) / ( ||V_id|| * ||V_live|| )
                </div>
                <p style={{ fontSize: "0.85rem", color: "#334155", lineHeight: 1.5, margin: 0 }}>
                  If the calculated cosine similarity is &gt;= 0.68 (68.0%), the identity is confirmed. Concurrently, a passive liveness detector verifies natural ocular micro-movements to block 2D paper printouts and smartphone display spoofing.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAB 3: EXAM CENTER & HARDWARE SOP ────────────────────── */}
        {activeSection === "hardware-sop" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ marginBottom: 28 }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                SECTION 03
              </span>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
                Examination Center & Entrance Kiosk SOP
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6 }}>
                Standard Operating Procedure for deploying the <strong>ShieldScan ExamGuard Kiosk v3</strong> at competitive examination centers (UPSC, JEE/NEET, SSC, Banking) to completely stop solver gangs and impersonation.
              </p>
            </div>

            {/* Visual Kiosk SOP Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 32 }}>
              <div style={{ padding: 0, borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <img src="/images/exam_kiosk.jpg" alt="Exam Kiosk" style={{ width: "100%", height: 220, objectFit: "cover" }} />
                <div style={{ padding: "20px" }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
                    Kiosk Gate Setup Checklist
                  </h4>
                  <ul style={{ paddingLeft: 18, fontSize: "0.84rem", color: "#475569", lineHeight: 1.7, margin: 0 }}>
                    <li>Place kiosk at entry gate 45 minutes prior to candidate reporting time.</li>
                    <li>Verify internal lithium battery capacity (&gt;80%) or connect AC 220V.</li>
                    <li>Load candidate pre-registration manifest via encrypted USB token.</li>
                    <li>Test optical barcode reader and LED facial ring illumination.</li>
                  </ul>
                </div>
              </div>

              <div style={{ padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
                  3-Second Candidate Verification Flow
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { step: "1", title: "Admit Card Scan", text: "Candidate presents paper Admit Card with QR code under optical laser bed." },
                    { step: "2", title: "Live Face Alignment", text: "Candidate looks at ring camera. Live frame captures face in 1.2 seconds." },
                    { step: "3", title: "Instant Decision & Seat Assignment", text: "System validates Admit Card QR digital signature against official board database and computes ArcFace match." },
                  ].map((f, idx) => (
                    <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{
                        width: 26, height: 26, borderRadius: "50%", background: "#2563eb", color: "#ffffff",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 800, flexShrink: 0
                      }}>
                        {f.step}
                      </span>
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>{f.title}</div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 2 }}>{f.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Red Alert Protocol */}
            <div style={{ padding: "20px 24px", borderRadius: "14px", background: "#fef2f2", border: "1px solid #fecaca" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <AlertTriangle size={18} color="#ef4444" />
                <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "#991b1b", margin: 0 }}>
                  Suspect Impersonation Protocol (Red Alert Trigger)
                </h4>
              </div>
              <p style={{ fontSize: "0.84rem", color: "#7f1d1d", lineHeight: 1.55, margin: 0 }}>
                If ArcFace cosine similarity is &lt; 0.68 or the admit card QR signature fails cryptographic hash verification, the kiosk flashes an amber alert silently to the Center Superintendent's console and locks the entry turnstile. The candidate is escorted to the verification room for manual biometric iris re-scan without disrupting general entry queues.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── TAB 4: DEVELOPER REST API ───────────────────────────── */}
        {activeSection === "api-reference" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ marginBottom: 28 }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                SECTION 04
              </span>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
                Developer REST API & Code Integration
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6 }}>
                Integrate ShieldScan verification into existing examination portals, mobile apps, or enterprise ERPs using standard HTTP multipart requests.
              </p>
            </div>

            {/* Python Example */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "#0f172a" }}>
                  Python (requests): Submit Document & Live Face
                </span>
                <button
                  onClick={() => handleCopy(`import requests

API_URL = "http://localhost:8000/api/scan"

with open("passport_scan.jpg", "rb") as doc_file, \\
     open("live_face.jpg", "rb") as face_file:
    files = {
        "file": ("passport_scan.jpg", doc_file, "image/jpeg"),
        "live_face": ("live_face.jpg", face_file, "image/jpeg")
    }
    data = {
        "doc_type": "PASSPORT",
        "officer_id": "OFFICER_042"
    }
    response = requests.post(API_URL, files=files, data=data)
    result = response.json()
    print("Decision:", result.get("decision"))
    print("Tamper Score:", result.get("tamper_score"))`, "py")}
                  className="btn-secondary"
                  style={{ padding: "5px 12px", fontSize: "0.76rem" }}
                >
                  {copiedCode === "py" ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                  {copiedCode === "py" ? "Copied" : "Copy Code"}
                </button>
              </div>

              <pre style={{
                background: "#0f172a", color: "#e2e8f0", padding: "18px 20px",
                borderRadius: "12px", fontSize: "0.82rem", lineHeight: 1.55,
                fontFamily: "JetBrains Mono, monospace", overflowX: "auto", margin: 0
              }}>
{`import requests

API_URL = "http://localhost:8000/api/scan"

with open("passport_scan.jpg", "rb") as doc_file, \\
     open("live_face.jpg", "rb") as face_file:
    files = {
        "file": ("passport_scan.jpg", doc_file, "image/jpeg"),
        "live_face": ("live_face.jpg", face_file, "image/jpeg")
    }
    data = {
        "doc_type": "PASSPORT",
        "officer_id": "OFFICER_042"
    }
    response = requests.post(API_URL, files=files, data=data)
    result = response.json()
    print("Decision:", result.get("decision"))
    print("Tamper Score:", result.get("tamper_score"))`}
              </pre>
            </div>

            {/* JSON Response Schema */}
            <div>
              <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                Sample JSON Response Breakdown
              </div>
              <pre style={{
                background: "#0f172a", color: "#38bdf8", padding: "18px 20px",
                borderRadius: "12px", fontSize: "0.82rem", lineHeight: 1.55,
                fontFamily: "JetBrains Mono, monospace", overflowX: "auto", margin: 0
              }}>
{`{
  "scan_id": "SCAN_9832_PASSPORT",
  "decision": "CLEARED",
  "tamper_score": 14.2,
  "confidence": 0.96,
  "ocr_data": {
    "doc_number": "J8291048",
    "name": "ADAMS, SARAH JANE",
    "nationality": "IND",
    "dob": "1994-08-14"
  },
  "forensic_breakdown": {
    "ela_tamper_detected": false,
    "copy_move_clones": 0,
    "mrz_checksum_valid": true,
    "face_match_confidence": 0.942
  },
  "blockchain_block": {
    "block_id": 842,
    "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "timestamp": "2026-09-08T10:45:12Z"
  }
}`}
              </pre>
            </div>
          </motion.div>
        )}

        {/* ── TAB 5: BLOCKCHAIN AUDIT LEDGER ──────────────────────── */}
        {activeSection === "blockchain" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ marginBottom: 28 }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                SECTION 05
              </span>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
                Cryptographic SHA-256 Proof-of-Inspection Ledger
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6 }}>
                Every single document inspection, whether cleared, flagged, or rejected, is permanently sealed into a local cryptographic blockchain hash-chain.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, marginBottom: 28 }}>
              <div style={{ padding: "22px", borderRadius: "14px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
                  Court-Admissible Chain of Custody
                </h4>
                <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.55, margin: 0 }}>
                  In judicial prosecution of impersonation or document forgery, defense lawyers often claim logs were modified post-facto. ShieldScan's cryptographic hash chain provides indisputable mathematical proof that the audit record existed in that exact state at that exact millisecond.
                </p>
              </div>

              <div style={{ padding: "22px", borderRadius: "14px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
                  Zero-Knowledge Proof Privacy
                </h4>
                <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.55, margin: 0 }}>
                  Blocks only store irreversible SHA-256 cryptographic hashes of the passenger biometrics and biographic strings. If an adversary steals the ledger file, no facial images or raw Aadhaar numbers can be reverse-engineered from the hashes.
                </p>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => navigate("/audit")}
                className="btn-secondary"
                style={{ padding: "12px 28px", fontSize: "0.9rem", gap: 8 }}
              >
                <Lock size={16} />
                <span>Explore Live Blockchain Audit Ledger</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── TAB 6: HANDS-ON DEMO WALKTHROUGH ────────────────────── */}
        {activeSection === "walkthrough" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ marginBottom: 28 }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                SECTION 06
              </span>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
                Hands-On Testing Walkthrough: Step-by-Step
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6 }}>
                Follow this 4-step checklist to test the entire ShieldScan system live right now.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              {[
                {
                  step: "Step 1: Open AI Detection Console",
                  action: "Click 'AI Detection' in the navbar or go to /scan.",
                  tip: "Notice the hardware status bar verifying cradle connection.",
                },
                {
                  step: "Step 2: Choose or Generate Test Document",
                  action: "Select 'Passport' or 'Aadhaar Card'. Click 'Load Sample Passport' in the cradle device checker for instant 1-click test file loading.",
                  tip: "Or upload your own ID image/PDF.",
                },
                {
                  step: "Step 3: Activate Biometric Webcam (Optional)",
                  action: "Click 'Activate Face Sensor' in the Device Checker card to capture a live webcam frame for 1:1 facial matching.",
                  tip: "ArcFace compares your live face against the portrait photo in the document.",
                },
                {
                  step: "Step 4: Click 'Run Forensic Inspection'",
                  action: "Watch the neural verification pipeline compute OCR, MRZ, ELA, and LOC cross-checks in under 8 seconds.",
                  tip: "Inspect the side-by-side ELA compression heatmap and the mined SHA-256 block on the Results page.",
                },
              ].map((item, idx) => (
                <div key={idx} style={{ padding: "18px 22px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <CheckCircle2 size={18} color="#2563eb" />
                    <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                      {item.step}
                    </h4>
                  </div>
                  <div style={{ fontSize: "0.86rem", color: "#334155", marginLeft: 28, marginBottom: 4 }}>
                    {item.action}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#64748b", marginLeft: 28, fontStyle: "italic" }}>
                    💡 Tip: {item.tip}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => navigate("/scan")}
                className="btn-primary"
                style={{ padding: "14px 36px", fontSize: "1rem", gap: 10 }}
              >
                <Play size={18} />
                <span>Launch Live AI Detection Test Now</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

      </div>

    </div>
  );
}
