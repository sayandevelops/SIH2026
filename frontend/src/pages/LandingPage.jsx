import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield, Zap, Eye, Cpu, Lock, ArrowRight, CheckCircle2,
  Terminal, FileText, Fingerprint, Layers, Check, Sparkles,
  Search, AlertCircle, Compass, HardDrive, ShieldCheck
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

  // Terminal log simulation
  const [logIndex, setLogIndex] = useState(0);
  const terminalLogs = [
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
      setLogIndex((prev) => (prev < terminalLogs.length ? prev + 1 : 1));
    }, 1100);
    return () => clearInterval(timer);
  }, [terminalLogs.length]);

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 24px 80px" }}>
      
      {/* ── Tactical Badge & Hero ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: 60 }}
      >
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "7px 20px", borderRadius: "999px",
          background: "rgba(0, 242, 254, 0.08)", border: "1px solid rgba(0, 242, 254, 0.3)",
          fontSize: "0.8rem", fontWeight: 700, color: "#00f2fe",
          letterSpacing: "0.1em", textTransform: "uppercase",
          marginBottom: 24, boxShadow: "0 0 25px rgba(0, 242, 254, 0.15)"
        }}>
          <span className="radar-beacon" style={{ width: 8, height: 8, borderRadius: "50%", background: "#00f2fe", display: "inline-block" }} />
          SIH 2024 · PS-26188 · MHA / SSB BORDER CONTROL INITIATIVE
        </div>

        <h1 style={{
          fontSize: "clamp(2.5rem, 5.5vw, 4.2rem)",
          fontWeight: 800, lineHeight: 1.1,
          letterSpacing: "-0.035em",
          background: "linear-gradient(135deg, #ffffff 30%, #00f2fe 80%, #0088ff 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: 22,
        }}>
          Defense-Grade Border &<br />Document Intelligence
        </h1>

        <p style={{
          fontSize: "1.18rem", color: "#8da4c4",
          maxWidth: 680, margin: "0 auto 36px",
          lineHeight: 1.7,
        }}>
          ShieldScan instantly exposes forged passports, counterfeit national IDs, and identity impersonation in under 10 seconds — designed for border security forces with complete offline air-gap autonomy.
        </p>

        {/* CTA Actions */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            className="btn-primary"
            onClick={() => navigate("/scan")}
            style={{ fontSize: "1.05rem", padding: "16px 42px", gap: 12 }}
          >
            <Shield size={20} /> Launch Screening Console <ArrowRight size={18} />
          </button>
          
          <button
            className="btn-secondary"
            onClick={() => navigate("/audit")}
            style={{ fontSize: "1rem", padding: "16px 36px" }}
          >
            <Lock size={18} /> Blockchain Ledger
          </button>
        </div>
      </motion.div>

      {/* ── Live Cyber Terminal Simulation Box ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        style={{ marginBottom: 70 }}
      >
        <div className="terminal-window hud-frame">
          <div className="hud-corner hud-tl" />
          <div className="hud-corner hud-tr" />
          <div className="hud-corner hud-bl" />
          <div className="hud-corner hud-br" />

          {/* Terminal Title Bar */}
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: "#ff2a5f" }} />
            <div className="terminal-dot" style={{ background: "#ffb800" }} />
            <div className="terminal-dot" style={{ background: "#00f59b" }} />
            <span style={{ fontSize: "0.76rem", color: "#8da4c4", marginLeft: 10, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6 }}>
              <Terminal size={14} color="#00f2fe" />
              SHIELDSCAN_KERNEL_V4.2 :: AIR-GAP EMBEDDED PIPELINE (SSB-SECTOR-ALPHA)
            </span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00f59b" }} />
              <span style={{ fontSize: "0.72rem", color: "#00f59b", fontWeight: 700 }}>LIVE ENGINE</span>
            </div>
          </div>

          {/* Terminal Animated Feed */}
          <div className="terminal-body">
            {terminalLogs.slice(0, logIndex).map((log, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#4e6b8f", flexShrink: 0 }}>[{log.time}]</span>
                <span style={{ color: "#00f2fe", fontWeight: 600, flexShrink: 0, width: 110 }}>{log.mod}:</span>
                <span style={{ color: "#e8f4ff", flex: 1 }}>{log.text}</span>
                <span style={{
                  padding: "1px 8px", borderRadius: 4, fontSize: "0.7rem", fontWeight: 700,
                  background: log.status === "VALID" || log.status === "CLEARED" || log.status === "AUTHENTIC" || log.status === "MATCH" || log.status === "SEALED" || log.status === "OK"
                    ? "rgba(0, 245, 155, 0.15)" : "rgba(0, 242, 254, 0.15)",
                  color: log.status === "VALID" || log.status === "CLEARED" || log.status === "AUTHENTIC" || log.status === "MATCH" || log.status === "SEALED" || log.status === "OK"
                    ? "#00f59b" : "#00f2fe",
                  border: `1px solid ${log.status === "VALID" || log.status === "CLEARED" || log.status === "AUTHENTIC" || log.status === "MATCH" || log.status === "SEALED" || log.status === "OK" ? "rgba(0, 245, 155, 0.3)" : "rgba(0, 242, 254, 0.3)"}`,
                }}>
                  {log.status}
                </span>
              </div>
            ))}
            {logIndex < terminalLogs.length && (
              <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#00f2fe", marginTop: 12 }}>
                <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                <span>Running neural inference models...</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Key Tactical Stats ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginBottom: 70 }}
      >
        {stats.map((s, i) => (
          <div key={i} className="glass-card hud-frame" style={{ padding: "26px 20px", textAlign: "center" }}>
            <div className="hud-corner hud-tl" />
            <div className="hud-corner hud-br" />
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(0, 242, 254, 0.08)", border: "1px solid rgba(0, 242, 254, 0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px", color: "#00f2fe"
            }}>
              <s.icon size={18} />
            </div>
            <div style={{ fontSize: "2.1rem", fontWeight: 800, color: "#ffffff", marginBottom: 4, letterSpacing: "-0.02em" }}>
              {s.value}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#8da4c4", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Supported Identity Documents ──────────────────────────── */}
      <div style={{ marginBottom: 70 }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#00f2fe", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            UNIVERSAL COMPATIBILITY
          </span>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, marginTop: 4 }}>
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
                background: "rgba(13, 27, 54, 0.5)",
                border: "1px solid rgba(0, 242, 254, 0.18)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>{doc.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#f0f6fc", marginBottom: 4 }}>{doc.name}</div>
              <div style={{ fontSize: "0.72rem", color: "#00f2fe", fontFamily: "JetBrains Mono, monospace" }}>{doc.standard}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6-Module AI Architecture Grid ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{ marginBottom: 70 }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#00f2fe", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            HIGH-SECURITY FORENSICS
          </span>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: 4 }}>
            6-Tier Neural Screening Architecture
          </h2>
          <p style={{ color: "#8da4c4", maxWidth: 600, margin: "8px auto 0", fontSize: "0.95rem" }}>
            Zero third-party cloud dependencies. Every model runs locally in sub-second inference cycles on standard border checkpoint hardware.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="glass-card feature-card-glow hud-frame"
              style={{ padding: "30px 26px" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
            >
              <div className="hud-corner hud-tl" />
              <div className="hud-corner hud-br" />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: "linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(0, 136, 255, 0.15) 100%)",
                  border: "1px solid rgba(0, 242, 254, 0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <f.icon size={22} color="#00f2fe" />
                </div>
                <span style={{
                  fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.1em",
                  padding: "4px 10px", borderRadius: 4,
                  background: "rgba(0, 242, 254, 0.08)", color: "#00f2fe",
                  border: "1px solid rgba(0, 242, 254, 0.2)",
                  fontFamily: "JetBrains Mono, monospace"
                }}>
                  {f.tag}
                </span>
              </div>

              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 10, color: "#ffffff" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#8da4c4", lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Ready to Screen Banner ─────────────────────────────────── */}
      <div className="glass-card hud-frame" style={{
        padding: "48px 36px", textAlign: "center",
        background: "radial-gradient(circle at center, rgba(0, 242, 254, 0.12) 0%, rgba(8, 16, 33, 0.8) 100%)",
        border: "1px solid rgba(0, 242, 254, 0.35)",
      }}>
        <div className="hud-corner hud-tl" />
        <div className="hud-corner hud-tr" />
        <div className="hud-corner hud-bl" />
        <div className="hud-corner hud-br" />

        <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 14 }}>
          Begin Checkpoint Verification
        </h2>
        <p style={{ color: "#8da4c4", maxWidth: 540, margin: "0 auto 30px", fontSize: "1rem" }}>
          Load an official document image or PDF, take a live webcam verification snapshot, and receive an instant forensic verdict.
        </p>

        <button
          className="btn-primary"
          onClick={() => navigate("/scan")}
          style={{ fontSize: "1.05rem", padding: "16px 44px" }}
        >
          Open Scanner Terminal <ArrowRight size={18} />
        </button>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginTop: 60, color: "#4e6b8f", fontSize: "0.82rem", lineHeight: 1.6 }}>
        <div>ShieldScan · Smart India Hackathon (SIH) 2024 · Problem Statement PS-26188</div>
        <div>Ministry of Home Affairs (MHA) · Sashastra Seema Bal (SSB) · Air-Gap Sovereign AI Architecture</div>
      </div>

    </div>
  );
}
