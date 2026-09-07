import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield, Zap, Eye, Cpu, Lock, ArrowRight, CheckCircle2,
  FileText, Fingerprint, Layers, Check, Sparkles,
  Search, AlertCircle, HardDrive, ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Cpu,
    title: "Multi-Engine OCR & MRZ",
    tag: "MODULE 01",
    desc: "Extracts biographic text from passports, Aadhaar cards, PAN cards & DLs using EasyOCR + ICAO 9303 MRZ parser.",
  },
  {
    icon: ShieldCheck,
    title: "Cryptographic Checksums",
    tag: "MODULE 02",
    desc: "Validates 73-character ICAO checksums and UIDAI Verhoeff D5 algorithm to detect fabricated document numbers.",
  },
  {
    icon: Eye,
    title: "Forensic Tampering (ELA & CMFD)",
    tag: "MODULE 03",
    desc: "Generates Error Level Analysis (ELA) compression heatmaps and Copy-Move keypoint matching to spot digital alterations.",
  },
  {
    icon: Fingerprint,
    title: "ArcFace Biometric & Liveness",
    tag: "MODULE 04",
    desc: "512D deep vector face matching between ID photo and live camera capture with passive depth and spoof detection.",
  },
  {
    icon: Search,
    title: "Real-Time Watchlist Lookup",
    tag: "MODULE 05",
    desc: "Sub-millisecond cross-referencing against Interpol, MHA, and local border lookout circulars (LOC).",
  },
  {
    icon: Lock,
    title: "Tamper-Evident SHA-256 Ledger",
    tag: "MODULE 06",
    desc: "Cryptographic hash-chain anchors every screening decision to an immutable, court-admissible audit trail.",
  },
];

const supportedDocs = [
  { code: "PASSPORT", name: "International Passport", standard: "ICAO 9303 Doc 9303", icon: "🛂" },
  { code: "AADHAAR",  name: "UIDAI Aadhaar Card",    standard: "Verhoeff D5 / QR",   icon: "🆔" },
  { code: "PAN_CARD", name: "Income Tax PAN Card",   standard: "NSDL / UTIITSL Format", icon: "💳" },
  { code: "DRIVING",  name: "MoRTH Driving License", standard: "State Sarathi Code",  icon: "🚗" },
  { code: "VISA",     name: "Consular Visa Permit",   standard: "Schengen / Indian eVisa", icon: "📄" },
  { code: "NAT_ID",   name: "National Citizen ID",   standard: "Universal Gov Card",  icon: "🪪" },
];

const stats = [
  { value: "< 8.4s", label: "Full Screening Latency", icon: Zap },
  { value: "6 AI Engines", label: "Multi-Stage Pipeline", icon: Layers },
  { value: "100% Offline", label: "Air-Gap Sovereign Mode", icon: HardDrive },
  { value: "SHA-256", label: "Cryptographic Audit Chain", icon: Lock },
];

export default function LandingPage() {
  const navigate = useNavigate();

  // Activity feed simulation
  const [logIndex, setLogIndex] = useState(0);
  const activityLogs = [
    { time: "00:01.02", mod: "OCR_ENGINE", text: "EasyOCR: Document type detected -> PASSPORT (ICAO 9303 TD3)", status: "OK" },
    { time: "00:01.48", mod: "ICAO_VERIFY", text: "MRZ Line 1 & Line 2 parsed. Verifying 73-char composite checksum...", status: "VALID" },
    { time: "00:02.15", mod: "TAMPER_ELA", text: "Error Level Analysis computed at 90% JPEG quality. Variance: 14.2 (Low)", status: "CLEARED" },
    { time: "00:02.89", mod: "CMFD_MATCH", text: "ORB keypoint descriptors extracted: 0 cloned blocks detected", status: "AUTHENTIC" },
    { time: "00:03.42", mod: "ARCFACE_V2", text: "Live webcam frame vs ID crop cosine similarity: 93.8% (Threshold: 68.0%)", status: "MATCH" },
    { time: "00:04.10", mod: "WATCHLIST", text: "LOC database cross-reference: 0 active warrants found", status: "NEGATIVE" },
    { time: "00:04.55", mod: "BLOCKCHAIN", text: "SHA-256 block #0841 mined -> e3b0c44298fc1c149afbf4c8996fb924", status: "SEALED" },
    { time: "00:04.80", mod: "DISPATCH", text: "Screening complete -> DECISION: GREEN (PASSENGER CLEARED)", status: "CLEARED" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLogIndex((prev) => (prev < activityLogs.length ? prev + 1 : 1));
    }, 1100);
    return () => clearInterval(timer);
  }, [activityLogs.length]);

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 24px 80px" }}>
      
      {/* ── Executive Hero ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center", marginBottom: 54 }}
      >
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "6px 18px", borderRadius: "999px",
          background: "#eff6ff", border: "1px solid #bfdbfe",
          fontSize: "0.78rem", fontWeight: 700, color: "#2563eb",
          letterSpacing: "0.04em", textTransform: "uppercase",
          marginBottom: 20,
        }}>
          <ShieldCheck size={14} color="#2563eb" />
          SOVEREIGN DEFENSE AI · BORDER & IDENTITY INTELLIGENCE
        </div>

        <h1 style={{
          fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
          fontWeight: 800, lineHeight: 1.15,
          letterSpacing: "-0.03em",
          color: "#0f172a",
          marginBottom: 20,
        }}>
          Enterprise-Grade Border &<br />Document Intelligence
        </h1>

        <p style={{
          fontSize: "1.15rem", color: "#475569",
          maxWidth: 660, margin: "0 auto 34px",
          lineHeight: 1.65,
        }}>
          ShieldScan instantly exposes forged passports, counterfeit national IDs, and identity impersonation in under 10 seconds — designed for border security forces with complete offline air-gap autonomy.
        </p>

        {/* CTA Actions */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            className="btn-primary"
            onClick={() => navigate("/scan")}
            style={{ fontSize: "1rem", padding: "14px 36px", gap: 10 }}
          >
            <Shield size={18} /> Launch Screening Console <ArrowRight size={16} />
          </button>
          
          <button
            className="btn-secondary"
            onClick={() => navigate("/audit")}
            style={{ fontSize: "1rem", padding: "14px 30px" }}
          >
            <Lock size={16} /> Blockchain Ledger
          </button>
        </div>

        {/* ── Executive Hero Showcase Banner ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            marginTop: 44,
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.03)",
            background: "#ffffff",
            position: "relative",
          }}
        >
          {/* Top Banner Toolbar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            background: "linear-gradient(to right, #ffffff, #f8fafc)",
            borderBottom: "1px solid #e2e8f0",
            flexWrap: "wrap",
            gap: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", background: "#10b981",
                boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.2)",
              }} />
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1e293b", letterSpacing: "0.04em" }}>
                AUTOMATED BORDER CHECKPOINT KIOSK & e-GATE SUITE
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{
                fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "999px",
                background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe",
              }}>
                OPTICAL 500 DPI UV/IR
              </span>
              <span style={{
                fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "999px",
                background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0",
              }}>
                ARCFACE 1:1 LIVE
              </span>
            </div>
          </div>

          {/* Banner Image Container */}
          <div style={{ position: "relative", width: "100%", maxHeight: "500px", overflow: "hidden" }}>
            <img
              src="/images/hero_banner.jpg"
              alt="ShieldScan Border Control Security Platform"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            {/* Ambient Overlay at bottom */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "30px 24px 20px",
              background: "linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.4) 60%, transparent 100%)",
              color: "#ffffff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 16,
            }}>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#93c5fd", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                  MISSION-READY DEPLOYMENT
                </div>
                <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff" }}>
                  Autonomous e-Gate Screening & Multi-Spectral Passport Readers
                </div>
              </div>
              <button
                onClick={() => navigate("/scan")}
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  padding: "10px 22px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
                }}
              >
                Launch Scanner Console <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Live Security Pipeline Monitor ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ marginBottom: 60 }}
      >
        <div className="terminal-window">
          {/* Header */}
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: "#ef4444" }} />
            <div className="terminal-dot" style={{ background: "#f59e0b" }} />
            <div className="terminal-dot" style={{ background: "#10b981" }} />
            <span style={{ fontSize: "0.8rem", color: "#475569", marginLeft: 8, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <Cpu size={14} color="#2563eb" />
              SHIELDSCAN KERNEL V4.2 :: AIR-GAP VERIFICATION PIPELINE (SSB-SECTOR-ALPHA)
            </span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
              <span style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 700 }}>ACTIVE ENGINE</span>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="terminal-body">
            {activityLogs.slice(0, logIndex).map((log, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#94a3b8", flexShrink: 0 }}>[{log.time}]</span>
                <span style={{ color: "#2563eb", fontWeight: 700, flexShrink: 0, width: 110 }}>{log.mod}:</span>
                <span style={{ color: "#1e293b", flex: 1 }}>{log.text}</span>
                <span style={{
                  padding: "2px 8px", borderRadius: 6, fontSize: "0.72rem", fontWeight: 700,
                  background: log.status === "VALID" || log.status === "CLEARED" || log.status === "AUTHENTIC" || log.status === "MATCH" || log.status === "SEALED" || log.status === "OK"
                    ? "#ecfdf5" : "#eff6ff",
                  color: log.status === "VALID" || log.status === "CLEARED" || log.status === "AUTHENTIC" || log.status === "MATCH" || log.status === "SEALED" || log.status === "OK"
                    ? "#059669" : "#2563eb",
                  border: `1px solid ${log.status === "VALID" || log.status === "CLEARED" || log.status === "AUTHENTIC" || log.status === "MATCH" || log.status === "SEALED" || log.status === "OK" ? "#a7f3d0" : "#bfdbfe"}`,
                }}>
                  {log.status}
                </span>
              </div>
            ))}
            {logIndex < activityLogs.length && (
              <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#2563eb", marginTop: 12, fontSize: "0.8rem" }}>
                <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                <span>Running neural verification models...</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Key Tactical Stats ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginBottom: 60 }}
      >
        {stats.map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: "24px 20px", textAlign: "center" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "#eff6ff", border: "1px solid #bfdbfe",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px", color: "#2563eb"
            }}>
              <s.icon size={20} />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginBottom: 4, letterSpacing: "-0.02em" }}>
              {s.value}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Real-World Checkpoint Hardware Suite ─────────────────── */}
      <div style={{ marginBottom: 68 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            HARDWARE INTEGRATION
          </span>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            Engineered for Border Kiosks & Automated e-Gates
          </h2>
          <p style={{ color: "#64748b", maxWidth: 640, margin: "8px auto 0", fontSize: "0.95rem" }}>
            Direct plug-and-play compatibility with standard immigration checkpoint hardware, desktop passport readers, and biometric traveler cameras.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 24 }}>
          {/* Card 1: Document Scanner Hardware */}
          <div className="glass-card" style={{ padding: 0, overflow: "hidden", borderRadius: "18px", border: "1px solid #e2e8f0" }}>
            <div style={{ height: 250, overflow: "hidden", position: "relative", background: "#f1f5f9" }}>
              <img
                src="/images/passport_scanner.jpg"
                alt="Optical Document & e-Passport Reader Cradle"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", top: 14, left: 14,
                background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(6px)",
                color: "#ffffff", padding: "5px 12px", borderRadius: "6px",
                fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                CRADLE STATUS: OPTICAL READY
              </div>
            </div>
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Optical & RFID Document Reader
                </h3>
                <span style={{
                  fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "6px",
                  background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe"
                }}>
                  3M / GEMALTO CLASS
                </span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>
                Multi-spectral illumination bed capturing high-resolution 500 DPI images under White light, UV 365nm for forensic watermarks, and IR 850nm for B900 ink validation.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["ICAO 9303 TD1/TD2/TD3", "ISO 14443 Type A/B RFID", "UV Phosphor Check", "Anti-Glare Bed"].map((tag, tIdx) => (
                  <span key={tIdx} style={{
                    fontSize: "0.72rem", fontWeight: 600, padding: "4px 10px", borderRadius: "6px",
                    background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0"
                  }}>
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Biometric e-Gate Sensor */}
          <div className="glass-card" style={{ padding: 0, overflow: "hidden", borderRadius: "18px", border: "1px solid #e2e8f0" }}>
            <div style={{ height: 250, overflow: "hidden", position: "relative", background: "#f1f5f9" }}>
              <img
                src="/images/biometric_face.jpg"
                alt="Automated e-Gate Biometric Facial Verification"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", top: 14, left: 14,
                background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(6px)",
                color: "#ffffff", padding: "5px 12px", borderRadius: "6px",
                fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                SENSOR STATUS: LIVE 60 FPS
              </div>
            </div>
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Biometric e-Gate Facial Terminal
                </h3>
                <span style={{
                  fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "6px",
                  background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0"
                }}>
                  ARCFACE 512D
                </span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>
                Real-time 1:1 facial matching against ID document photos with sub-second vector cosine comparison and neural passive liveness detection.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["1:1 Vector Match", "Anti-Spoof Liveness", "Wide-Angle HDR", "Zero Biometric Storage"].map((tag, tIdx) => (
                  <span key={tIdx} style={{
                    fontSize: "0.72rem", fontWeight: 600, padding: "4px 10px", borderRadius: "6px",
                    background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0"
                  }}>
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Supported Identity Documents ──────────────────────────── */}
      <div style={{ marginBottom: 60 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            UNIVERSAL COMPATIBILITY
          </span>
          <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            Multi-Protocol Document Engine
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          {supportedDocs.map((doc, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: "20px 16px", textAlign: "center",
                background: "#ffffff",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>{doc.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#0f172a", marginBottom: 4 }}>{doc.name}</div>
              <div style={{ fontSize: "0.72rem", color: "#2563eb", fontFamily: "JetBrains Mono, monospace" }}>{doc.standard}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6-Module AI Architecture Grid ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ marginBottom: 60 }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            HIGH-SECURITY FORENSICS
          </span>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            6-Tier Neural Screening Architecture
          </h2>
          <p style={{ color: "#64748b", maxWidth: 600, margin: "8px auto 0", fontSize: "0.95rem" }}>
            Zero third-party cloud dependencies. Every model runs locally in sub-second inference cycles on standard border checkpoint hardware.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="glass-card"
              style={{ padding: "28px 24px" }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <f.icon size={20} color="#2563eb" />
                </div>
                <span style={{
                  fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em",
                  padding: "4px 10px", borderRadius: 6,
                  background: "#f1f5f9", color: "#475569",
                  border: "1px solid #e2e8f0",
                  fontFamily: "JetBrains Mono, monospace"
                }}>
                  {f.tag}
                </span>
              </div>

              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 8, color: "#0f172a" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Ready to Screen Banner ─────────────────────────────────── */}
      <div style={{
        padding: "48px 36px", textAlign: "center",
        background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(37, 99, 235, 0.2)",
        color: "#ffffff",
      }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 12, color: "#ffffff" }}>
          Begin Checkpoint Verification
        </h2>
        <p style={{ color: "#dbeafe", maxWidth: 540, margin: "0 auto 28px", fontSize: "0.98rem" }}>
          Load an official document image or PDF, take a live biometric verification snapshot, and receive an instant forensic verdict.
        </p>

        <button
          onClick={() => navigate("/scan")}
          style={{
            fontSize: "1rem", padding: "14px 36px",
            background: "#ffffff", color: "#1e40af",
            border: "none", borderRadius: "12px",
            fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            display: "inline-flex", alignItems: "center", gap: 10,
          }}
        >
          Open Screening Console <ArrowRight size={18} />
        </button>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginTop: 50, color: "#94a3b8", fontSize: "0.82rem", lineHeight: 1.6 }}>
        <div>ShieldScan · Defense-Grade AI Document Verification Platform</div>
        <div>Air-Gap Sovereign AI Architecture · Real-Time Border Intelligence</div>
      </div>

    </div>
  );
}
