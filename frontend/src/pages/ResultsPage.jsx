import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Shield, FileText, AlertTriangle, CheckCircle2, XCircle,
  Eye, User, Lock, BarChart2, ArrowLeft, Download, Printer,
  Copy, Check, ExternalLink, RefreshCw, Cpu, Layers, Fingerprint
} from "lucide-react";
import toast from "react-hot-toast";

export default function ResultsPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [forensicView, setForensicView] = useState("side_by_side"); // "side_by_side", "ela", "raw"
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("screeningResult");
    if (raw) {
      try {
        setResult(JSON.parse(raw));
      } catch (e) {
        console.error("Failed to parse screeningResult", e);
        navigate("/scan");
      }
    } else {
      navigate("/scan");
    }
  }, [navigate]);

  if (!result) return null;

  const { ocr, validation, tampering, face, risk, audit } = result;
  const band = risk?.band || "GREEN";
  const bandClass = band === "GREEN" ? "band-green" : band === "YELLOW" ? "band-yellow" : "band-red";
  const stampClass = band === "GREEN" ? "stamp-green" : band === "YELLOW" ? "stamp-yellow" : "stamp-red";
  const stampText = band === "GREEN" ? "CLEARED · AUTHENTIC" : band === "YELLOW" ? "CAUTION · MANUAL REVIEW" : "FORGERY · INTERCEPT";

  const totalScore = Number(risk?.total_score || 0);

  // SVG Gauge calculations (radius = 70, circumference = 2 * PI * 70 = 439.82)
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  const copyEventHash = () => {
    if (audit?.event_hash) {
      navigator.clipboard.writeText(audit.event_hash);
      setCopiedHash(true);
      toast.success("Cryptographic SHA-256 Hash copied to clipboard!");
      setTimeout(() => setCopiedHash(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 24px 80px" }}>

      {/* ── Top Tactical Navigation & Actions ──────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <button
          onClick={() => navigate("/scan")}
          className="btn-secondary"
          style={{ padding: "9px 18px", fontSize: "0.85rem" }}
        >
          <ArrowLeft size={16} /> New Screening
        </button>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={handlePrint}
            className="btn-secondary no-print"
            style={{ padding: "9px 18px", fontSize: "0.85rem", gap: 8 }}
          >
            <Printer size={16} /> Print / Export Dossier
          </button>

          <button
            onClick={() => navigate("/audit")}
            className="btn-secondary no-print"
            style={{ padding: "9px 18px", fontSize: "0.85rem", gap: 8 }}
          >
            <Lock size={16} /> View Blockchain Ledger
          </button>
        </div>
      </div>

      {/* ── Intelligence Dossier Classification Banner ─────────────── */}
      <div className="glass-card hud-frame" style={{
        padding: "20px 24px", marginBottom: 28,
        borderLeft: `4px solid ${band === "GREEN" ? "var(--emerald-core)" : band === "YELLOW" ? "var(--amber-core)" : "var(--crimson-core)"}`,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20
      }}>
        <div className="hud-corner hud-tl" />
        <div className="hud-corner hud-tr" />
        <div className="hud-corner hud-bl" />
        <div className="hud-corner hud-br" />

        <div>
          <div style={{
            fontSize: "0.72rem", fontFamily: "JetBrains Mono, monospace",
            color: "#8da4c4", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4
          }}>
            RESTRICTED // LAW ENFORCEMENT & IMMIGRATION INSPECTION DOSSIER
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0 }}>
            Biometric Document Screening Report
          </h1>
          <div style={{
            fontSize: "0.82rem", color: "#8da4c4", fontFamily: "JetBrains Mono, monospace",
            display: "flex", alignItems: "center", gap: 12, marginTop: 8, flexWrap: "wrap"
          }}>
            <span>SESSION: <strong style={{ color: "#00f2fe" }}>{result.session_id?.slice(0, 16)}...</strong></span>
            <span>·</span>
            <span>DOC TYPE: <strong style={{ color: "#ffffff" }}>{result.ocr?.document_type?.replace(/_/g, " ") || "PASSPORT"}</strong></span>
            <span>·</span>
            <span>TIMESTAMP: <strong style={{ color: "#ffffff" }}>{new Date().toLocaleTimeString()} IST</strong></span>
          </div>
        </div>

        {/* Classified Stamp */}
        <div className={`classified-stamp ${stampClass}`}>
          {stampText}
        </div>
      </div>

      {/* ── Hero Composite Risk Score Gauge ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card hud-frame"
        style={{ padding: "36px 30px", marginBottom: 28 }}
      >
        <div className="hud-corner hud-tl" />
        <div className="hud-corner hud-tr" />
        <div className="hud-corner hud-bl" />
        <div className="hud-corner hud-br" />

        <div style={{
          display: "grid", gridTemplateColumns: "auto 1fr", gap: 40, alignItems: "center",
          flexWrap: "wrap"
        }}>
          {/* Circular SVG Speedometer Gauge */}
          <div style={{ position: "relative", width: 170, height: 170, margin: "0 auto" }}>
            <svg width="170" height="170" className="ring-gauge">
              {/* Background Track */}
              <circle
                cx="85" cy="85" r={radius}
                stroke="rgba(0, 242, 254, 0.12)"
                strokeWidth="14"
                fill="transparent"
              />
              {/* Animated Glowing Ring */}
              <circle
                cx="85" cy="85" r={radius}
                stroke={band === "GREEN" ? "#00f59b" : band === "YELLOW" ? "#ffb800" : "#ff2a5f"}
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="ring-gauge-circle"
                style={{
                  filter: `drop-shadow(0 0 10px ${band === "GREEN" ? "rgba(0,245,155,0.6)" : band === "YELLOW" ? "rgba(255,184,0,0.6)" : "rgba(255,42,95,0.6)"})`
                }}
              />
            </svg>

            {/* Central Score Digits */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              textAlign: "center"
            }}>
              <span style={{
                fontSize: "2.8rem", fontWeight: 900, fontFamily: "Outfit, sans-serif",
                color: band === "GREEN" ? "#00f59b" : band === "YELLOW" ? "#ffb800" : "#ff2a5f",
                lineHeight: 1
              }}>
                {totalScore.toFixed(0)}
              </span>
              <span style={{ fontSize: "0.74rem", color: "#8da4c4", letterSpacing: "0.08em", marginTop: 4, textTransform: "uppercase" }}>
                Risk / 100
              </span>
            </div>
          </div>

          {/* Verdict and Strategic Directives */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span className={`band-badge ${bandClass}`}>
                PROTOCOL STATUS: {band}
              </span>
              <span style={{ fontSize: "0.82rem", color: "#8da4c4" }}>
                Threshold: &lt;20 Clear · 21-60 Caution · &gt;60 Threat
              </span>
            </div>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 8, color: "#ffffff" }}>
              {risk?.recommended_action || "Verification Verdict Generated"}
            </h2>

            <p style={{ fontSize: "0.92rem", color: "#8da4c4", lineHeight: 1.6, maxWidth: 650 }}>
              {band === "GREEN"
                ? "All multi-spectral biometric, algorithmic, and tamper forensic checks passed standard verification tolerances. Document is clear for border crossing passage."
                : band === "YELLOW"
                ? "Minor discrepancies or low image quality detected during neural evaluation. Second-officer manual passport inspection is strongly recommended."
                : "Critical anomaly detected! Image editing compression artifacts or checksum failure indicates deliberate document counterfeiting. Hold traveler for secondary questioning."
              }
            </p>

            {/* 4 Score Breakdown Meters */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 16, marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(0, 242, 254, 0.12)"
            }}>
              {[
                { label: "Tampering", val: risk?.tampering_contrib, max: 35 },
                { label: "Validation", val: risk?.validation_contrib, max: 30 },
                { label: "Face Match", val: risk?.face_contrib, max: 25 },
                { label: "Watchlist", val: risk?.watchlist_contrib, max: 10 },
              ].map(({ label, val, max }) => {
                const num = val != null ? Number(val) : 0;
                const pct = Math.min(100, Math.max(0, (num / max) * 100));
                const clr = pct > 65 ? "#ff2a5f" : pct > 35 ? "#ffb800" : "#00f59b";

                return (
                  <div key={label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#8da4c4", marginBottom: 5 }}>
                      <span>{label}</span>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", color: clr, fontWeight: 700 }}>
                        {num.toFixed(1)} / {max}
                      </span>
                    </div>
                    <div style={{ height: 6, background: "rgba(0, 242, 254, 0.1)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: clr, transition: "width 0.8s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Two Column Primary Results Grid ─────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: 24, marginBottom: 28 }}>

        {/* ── CARD 1: Tampering Forensics & Heatmaps ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card hud-frame"
          style={{ padding: "24px" }}
        >
          <div className="hud-corner hud-tl" />
          <div className="hud-corner hud-tr" />

          {/* Section Header with View Tabs */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Eye size={20} color="#00f2fe" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Forensic Tampering Analysis</h3>
            </div>

            <span className={`band-badge ${tampering?.overall_tampered ? "band-red" : "band-green"}`} style={{ fontSize: "0.75rem" }}>
              {tampering?.overall_tampered ? "ALERT: TAMPERED" : "VERIFIED: AUTHENTIC"}
            </span>
          </div>

          {/* Tab Selector for Forensics View */}
          {tampering?.heatmap_url && (
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", color: "#8da4c4" }}>Forensic Heatmap Inspection:</span>
              <div className="tab-pill-group">
                <button
                  className={`tab-pill-btn ${forensicView === "side_by_side" ? "active" : ""}`}
                  onClick={() => setForensicView("side_by_side")}
                >
                  Dual View
                </button>
                <button
                  className={`tab-pill-btn ${forensicView === "ela" ? "active" : ""}`}
                  onClick={() => setForensicView("ela")}
                >
                  ELA Heatmap
                </button>
              </div>
            </div>
          )}

          {/* Visual Heatmap Box */}
          {tampering?.heatmap_url ? (
            <div style={{ marginBottom: 20 }}>
              {forensicView === "side_by_side" ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{
                    background: "rgba(4, 9, 20, 0.6)", borderRadius: 10,
                    border: "1px solid rgba(0, 242, 254, 0.15)", padding: 8, textAlign: "center"
                  }}>
                    <div style={{ fontSize: "0.7rem", color: "#8da4c4", marginBottom: 6, textTransform: "uppercase" }}>ELA Analysis Layer</div>
                    <img
                      src={`http://localhost:8000${tampering.heatmap_url}`}
                      alt="ELA Heatmap"
                      style={{ width: "100%", height: 180, objectFit: "contain", borderRadius: 6 }}
                    />
                  </div>
                  <div style={{
                    background: "rgba(4, 9, 20, 0.6)", borderRadius: 10,
                    border: "1px solid rgba(0, 242, 254, 0.15)", padding: 8, display: "flex",
                    flexDirection: "column", justifyContent: "center", alignItems: "center"
                  }}>
                    <div style={{ fontSize: "0.7rem", color: "#8da4c4", marginBottom: 6, textTransform: "uppercase" }}>Noise Distribution Key</div>
                    <div style={{ fontSize: "0.8rem", color: "#8da4c4", textAlign: "left", lineHeight: 1.6, padding: "0 8px" }}>
                      <p><strong style={{ color: "#00f2fe" }}>Dark/Uniform:</strong> Consistent compression throughout document.</p>
                      <p style={{ marginTop: 6 }}><strong style={{ color: "#ff2a5f" }}>Bright Patches:</strong> Re-saved layers or localized splicing tampering.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: "rgba(4, 9, 20, 0.6)", borderRadius: 10,
                  border: "1px solid rgba(0, 242, 254, 0.2)", padding: 12, textAlign: "center"
                }}>
                  <img
                    src={`http://localhost:8000${tampering.heatmap_url}`}
                    alt="ELA Full Heatmap"
                    style={{ width: "100%", maxHeight: 260, objectFit: "contain", borderRadius: 8 }}
                  />
                  <div style={{ fontSize: "0.75rem", color: "#8da4c4", marginTop: 8 }}>
                    Error Level Analysis (ELA) rendered with high-frequency residual enhancement
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              padding: "20px", background: "rgba(0, 242, 254, 0.04)", borderRadius: 10,
              border: "1px solid rgba(0, 242, 254, 0.1)", textAlign: "center", marginBottom: 16
            }}>
              <p style={{ fontSize: "0.85rem", color: "#8da4c4" }}>No pixel-level tampering indicators triggered.</p>
            </div>
          )}

          {/* Forensic Techniques Breakdown List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tampering?.techniques?.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", borderRadius: 8,
                  background: t.tampered ? "rgba(255, 42, 95, 0.08)" : "rgba(0, 242, 254, 0.04)",
                  border: `1px solid ${t.tampered ? "rgba(255, 42, 95, 0.3)" : "rgba(0, 242, 254, 0.12)"}`,
                }}
              >
                {t.tampered ? (
                  <AlertTriangle size={18} color="#ff2a5f" style={{ flexShrink: 0 }} />
                ) : (
                  <CheckCircle2 size={18} color="#00f59b" style={{ flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "#ffffff" }}>
                    {t.technique}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#8da4c4", marginTop: 2 }}>
                    {t.detail}
                  </div>
                </div>
                <div style={{
                  fontFamily: "JetBrains Mono, monospace", fontSize: "0.82rem",
                  fontWeight: 700, color: t.tampered ? "#ff2a5f" : "#00f59b"
                }}>
                  {(t.confidence * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CARD 2: Biometric Face & Liveness Intelligence ─────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card hud-frame"
          style={{ padding: "24px" }}
        >
          <div className="hud-corner hud-tl" />
          <div className="hud-corner hud-tr" />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Fingerprint size={20} color="#00f2fe" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Biometric 1:1 Face Match</h3>
            </div>

            {face?.decision && (
              <span className={`band-badge ${face.decision === "VERIFIED" ? "band-green" : face.decision === "UNCERTAIN" ? "band-yellow" : "band-red"}`} style={{ fontSize: "0.75rem" }}>
                {face.decision}
              </span>
            )}
          </div>

          {face ? (
            <div>
              {/* Biometric Status Tiles */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                <div style={{
                  padding: "14px", background: "rgba(0, 242, 254, 0.04)",
                  border: "1px solid rgba(0, 242, 254, 0.12)", borderRadius: 10, textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.74rem", color: "#8da4c4", marginBottom: 6 }}>ID Document Face Crop</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    {face.face_detected_doc ? (
                      <>
                        <CheckCircle2 size={18} color="#00f59b" />
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#00f59b" }}>LOCATED</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={18} color="#ff2a5f" />
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ff2a5f" }}>NOT FOUND</span>
                      </>
                    )}
                  </div>
                </div>

                <div style={{
                  padding: "14px", background: "rgba(0, 242, 254, 0.04)",
                  border: "1px solid rgba(0, 242, 254, 0.12)", borderRadius: 10, textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.74rem", color: "#8da4c4", marginBottom: 6 }}>Live Camera Capture</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    {face.face_detected_live ? (
                      <>
                        <CheckCircle2 size={18} color="#00f59b" />
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#00f59b" }}>ACQUIRED</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={18} color="#ff2a5f" />
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ff2a5f" }}>MISSING</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* ArcFace Similarity Bar */}
              {face.match_score != null && (
                <div style={{
                  padding: "16px", background: "rgba(13, 27, 54, 0.5)",
                  border: "1px solid rgba(0, 242, 254, 0.15)", borderRadius: 10, marginBottom: 18
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#f0f6fc" }}>ArcFace 512D Vector Similarity</span>
                    <span style={{
                      fontFamily: "JetBrains Mono, monospace", fontSize: "1.1rem", fontWeight: 800,
                      color: face.match_score >= 80 ? "#00f59b" : face.match_score >= 60 ? "#ffb800" : "#ff2a5f"
                    }}>
                      {face.match_score?.toFixed(1)}%
                    </span>
                  </div>

                  <div style={{ height: 10, background: "rgba(0, 242, 254, 0.1)", borderRadius: 5, overflow: "hidden" }}>
                    <div style={{
                      width: `${face.match_score}%`, height: "100%",
                      background: face.match_score >= 80 ? "linear-gradient(90deg, #00f59b, #00f2fe)" : face.match_score >= 60 ? "#ffb800" : "#ff2a5f",
                      boxShadow: `0 0 12px ${face.match_score >= 80 ? "#00f59b" : "#ff2a5f"}`
                    }} />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#8da4c4", marginTop: 6 }}>
                    <span>0% (Mismatch)</span>
                    <span style={{ color: "#00f2fe" }}>Passing Threshold: 68.0%</span>
                    <span>100% (Identical)</span>
                  </div>
                </div>
              )}

              {/* Anti-Spoof Liveness Indicator */}
              {face.liveness_passed != null && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10,
                  background: face.liveness_passed ? "rgba(0, 245, 155, 0.08)" : "rgba(255, 42, 95, 0.08)",
                  border: `1px solid ${face.liveness_passed ? "rgba(0, 245, 155, 0.3)" : "rgba(255, 42, 95, 0.3)"}`,
                }}>
                  {face.liveness_passed ? (
                    <CheckCircle2 size={20} color="#00f59b" />
                  ) : (
                    <AlertTriangle size={20} color="#ff2a5f" />
                  )}
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff" }}>
                      Anti-Spoof Liveness: {face.liveness_passed ? "AUTHENTIC 3D HUMAN" : "SCREEN / PHOTO SPOOF DETECTED"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#8da4c4", marginTop: 2 }}>
                      {face.liveness_passed ? "Passed passive micro-texture and ocular depth reflectance checks." : "High risk: Printed photo on paper or digital tablet screen replay."}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "36px 16px", color: "#8da4c4" }}>
              <User size={36} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#f0f6fc" }}>No Live Biometric Photo Supplied</div>
              <p style={{ fontSize: "0.8rem", marginTop: 6 }}>
                Passenger face matching was bypassed. Perform a new screening with webcam active to verify traveler identity.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Two Column Secondary Grid: OCR Data & Checksum Validation ─ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: 24, marginBottom: 28 }}>

        {/* ── CARD 3: OCR Extracted Fields Table ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card hud-frame"
          style={{ padding: "24px" }}
        >
          <div className="hud-corner hud-tl" />
          <div className="hud-corner hud-tr" />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FileText size={20} color="#00f2fe" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Extracted Biographic Data</h3>
            </div>

            <span style={{
              fontSize: "0.78rem", color: "#00f2fe", fontFamily: "JetBrains Mono, monospace",
              padding: "4px 10px", background: "rgba(0, 242, 254, 0.08)", borderRadius: 6,
              border: "1px solid rgba(0, 242, 254, 0.2)"
            }}>
              {(ocr?.confidence * 100)?.toFixed(0)}% OCR CONFIDENCE
            </span>
          </div>

          <table className="data-table">
            <tbody>
              {ocr?.extracted && Object.entries(ocr.extracted)
                .filter(([k]) => !k.includes("mrz_cd") && !k.startsWith("_"))
                .map(([k, v]) => v && (
                  <tr key={k}>
                    <td style={{ color: "#8da4c4", textTransform: "capitalize", width: "42%", fontWeight: 600 }}>
                      {k.replace(/_/g, " ")}
                    </td>
                    <td style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.85rem", color: "#ffffff" }}>
                      {String(v)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {ocr?.raw_text && (
            <details style={{ marginTop: 16 }}>
              <summary style={{ fontSize: "0.78rem", color: "#00f2fe", cursor: "pointer", outline: "none" }}>
                Inspect Raw OCR Text Feed
              </summary>
              <pre style={{
                marginTop: 10, padding: 12, background: "rgba(4, 9, 20, 0.8)",
                borderRadius: 8, fontSize: "0.75rem", color: "#8da4c4",
                maxHeight: 120, overflowY: "auto", whiteSpace: "pre-wrap",
                fontFamily: "JetBrains Mono, monospace"
              }}>
                {ocr.raw_text}
              </pre>
            </details>
          )}
        </motion.div>

        {/* ── CARD 4: Checksum & Format Validation Rules ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card hud-frame"
          style={{ padding: "24px" }}
        >
          <div className="hud-corner hud-tl" />
          <div className="hud-corner hud-tr" />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Shield size={20} color={validation?.overall_valid ? "#00f59b" : "#ff2a5f"} />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Security Rule Engine</h3>
            </div>

            <span className={`band-badge ${validation?.overall_valid ? "band-green" : "band-red"}`} style={{ fontSize: "0.75rem" }}>
              {validation?.overall_valid ? "ALL CHECKS PASSED" : `${validation?.failure_count} CHECKS FAILED`}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {validation?.checks?.map((check, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px",
                  background: check.passed ? "rgba(0, 245, 155, 0.04)" : "rgba(255, 42, 95, 0.06)",
                  border: `1px solid ${check.passed ? "rgba(0, 245, 155, 0.15)" : "rgba(255, 42, 95, 0.25)"}`,
                  borderRadius: 8,
                }}
              >
                {check.passed ? (
                  <CheckCircle2 size={17} color="#00f59b" style={{ flexShrink: 0, marginTop: 2 }} />
                ) : (
                  <XCircle size={17} color="#ff2a5f" style={{ flexShrink: 0, marginTop: 2 }} />
                )}
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff", textTransform: "capitalize" }}>
                    {check.check_name.replace(/_/g, " ")}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "#8da4c4", marginTop: 2, lineHeight: 1.4 }}>
                    {check.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── CARD 5: Tamper-Evident SHA-256 Blockchain Block Seal ────── */}
      {audit && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card hud-frame"
          style={{ padding: "24px", border: "1px solid rgba(157, 78, 221, 0.35)" }}
        >
          <div className="hud-corner hud-tl" />
          <div className="hud-corner hud-tr" />
          <div className="hud-corner hud-bl" />
          <div className="hud-corner hud-br" />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Lock size={20} color="#9d4edd" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#ffffff" }}>
                Immutable Blockchain Audit Block
              </h3>
            </div>

            <button
              onClick={copyEventHash}
              className="crypto-chip"
              title="Copy SHA-256 Hash"
            >
              {copiedHash ? <Check size={14} color="#00f59b" /> : <Copy size={14} />}
              {copiedHash ? "HASH COPIED" : "COPY EVENT HASH"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {[
              { label: "Block SHA-256 Hash", val: audit.event_hash },
              { label: "Parent Block Hash", val: audit.prev_hash },
              { label: "Screening Session ID", val: audit.session_id },
              { label: "Ledger Timestamp", val: new Date(audit.timestamp).toLocaleString() },
            ].map(({ label, val }) => (
              <div
                key={label}
                style={{
                  padding: "12px 14px", background: "rgba(157, 78, 221, 0.06)",
                  borderRadius: 8, border: "1px solid rgba(157, 78, 221, 0.18)"
                }}
              >
                <div style={{ fontSize: "0.72rem", color: "#8da4c4", marginBottom: 4 }}>{label}</div>
                <div style={{
                  fontSize: "0.8rem", fontFamily: "JetBrains Mono, monospace",
                  color: "#c4b5fd", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                }}>
                  {val || "—"}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: "0.76rem", color: "#8da4c4" }}>
            <Shield size={14} color="#9d4edd" />
            <span>Cryptographically sealed under Section 65B Indian Evidence Act compliant ledger.</span>
          </div>
        </motion.div>
      )}

    </div>
  );
}
