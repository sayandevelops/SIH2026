import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, AlertTriangle, CheckCircle2, XCircle, ArrowLeft,
  RotateCcw, Download, Lock, FileText, Eye, Fingerprint,
  Layers, ChevronRight, User, Sparkles, Copy, Check, Printer
} from "lucide-react";
import toast from "react-hot-toast";

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [result, setResult] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [forensicView, setForensicView] = useState("side_by_side"); // "side_by_side" | "ela"

  useEffect(() => {
    // Read from session storage or navigation state
    const saved = sessionStorage.getItem("screeningResult");
    if (saved) {
      try {
        setResult(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cached result", e);
      }
    } else if (location.state?.result) {
      setResult(location.state.result);
    }
  }, [location.state]);

  if (!result) {
    return (
      <div style={{ maxWidth: 640, margin: "100px auto", textAlign: "center", padding: "0 24px" }}>
        <div className="glass-card" style={{ padding: "48px 32px" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "14px",
            background: "#eff6ff", border: "1px solid #bfdbfe",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 18px", color: "#2563eb"
          }}>
            <FileText size={26} />
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
            No Screening Report Loaded
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: 28 }}>
            Please select an official identity document in the screening console to generate a forensic audit dossier.
          </p>
          <button className="btn-primary" onClick={() => navigate("/scan")}>
            <ArrowLeft size={16} /> Open Screening Console
          </button>
        </div>
      </div>
    );
  }

  const { risk, ocr, validation, tampering, face, audit } = result;

  // Composite risk metrics
  const totalScore = risk?.total_score != null ? Number(risk.total_score) : 0;
  const band = risk?.risk_band || "GREEN";
  const bandClass = band === "GREEN" ? "band-green" : band === "YELLOW" ? "band-yellow" : "band-red";
  const stampClass = band === "GREEN" ? "stamp-green" : band === "YELLOW" ? "stamp-yellow" : "stamp-red";
  const stampText = band === "GREEN" ? "VERIFIED AUTHENTIC" : band === "YELLOW" ? "SECONDARY REVIEW" : "FORGERY REJECTED";

  // Speedometer Gauge Arc Calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, totalScore)) / 100) * circumference;

  const copyEventHash = () => {
    if (audit?.event_hash) {
      navigator.clipboard.writeText(audit.event_hash);
      setCopiedHash(true);
      toast.success("SHA-256 Ledger Event Hash copied to clipboard ✓");
      setTimeout(() => setCopiedHash(false), 2500);
    }
  };

  const printDossier = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 24px 80px" }}>
      
      {/* ── Top Navigation & Utility Controls ────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
        <button
          onClick={() => navigate("/scan")}
          className="btn-secondary"
          style={{ padding: "8px 16px", fontSize: "0.84rem" }}
        >
          <ArrowLeft size={16} /> New Screening
        </button>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={printDossier}
            className="btn-secondary"
            style={{ padding: "8px 16px", fontSize: "0.84rem" }}
          >
            <Printer size={15} /> Print Audit Report
          </button>

          <button
            onClick={() => navigate("/audit")}
            className="btn-secondary"
            style={{ padding: "8px 16px", fontSize: "0.84rem" }}
          >
            <Lock size={15} color="#2563eb" /> View Blockchain Ledger
          </button>
        </div>
      </div>

      {/* ── Official Classified Dossier Header ───────────────────────── */}
      <div className="glass-card" style={{
        padding: "26px 30px", marginBottom: 24,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20
      }}>
        <div>
          <div style={{
            fontSize: "0.72rem",
            color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4,
            fontWeight: 700,
          }}>
            OFFICIAL INSPECTION DOSSIER · BORDER SECURITY COMMAND
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
            Identity & Document Verification Report
          </h1>
          <div style={{
            fontSize: "0.82rem", color: "#64748b",
            display: "flex", alignItems: "center", gap: 12, marginTop: 8, flexWrap: "wrap"
          }}>
            <span>SESSION: <strong style={{ color: "#2563eb", fontFamily: "JetBrains Mono" }}>{result.session_id?.slice(0, 16)}...</strong></span>
            <span>·</span>
            <span>TYPE: <strong style={{ color: "#0f172a" }}>{result.ocr?.document_type?.replace(/_/g, " ") || "PASSPORT"}</strong></span>
            <span>·</span>
            <span>TIMESTAMP: <strong style={{ color: "#0f172a" }}>{new Date().toLocaleTimeString()} IST</strong></span>
          </div>
        </div>

        {/* Classified Stamp */}
        <div className={`classified-stamp ${stampClass}`}>
          {stampText}
        </div>
      </div>

      {/* ── Hero Composite Risk Score Gauge ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ padding: "34px 30px", marginBottom: 28 }}
      >
        <div style={{
          display: "grid", gridTemplateColumns: "auto 1fr", gap: 36, alignItems: "center",
          flexWrap: "wrap"
        }}>
          {/* Circular SVG Speedometer Gauge */}
          <div style={{ position: "relative", width: 170, height: 170, margin: "0 auto" }}>
            <svg width="170" height="170" className="ring-gauge">
              {/* Background Track */}
              <circle
                cx="85" cy="85" r={radius}
                stroke="#f1f5f9"
                strokeWidth="14"
                fill="transparent"
              />
              {/* Animated Glowing Ring */}
              <circle
                cx="85" cy="85" r={radius}
                stroke={band === "GREEN" ? "#059669" : band === "YELLOW" ? "#d97706" : "#dc2626"}
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="ring-gauge-circle"
              />
            </svg>

            {/* Central Score Digits */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              textAlign: "center"
            }}>
              <span style={{
                fontSize: "2.8rem", fontWeight: 800, fontFamily: "Outfit, sans-serif",
                color: band === "GREEN" ? "#059669" : band === "YELLOW" ? "#d97706" : "#dc2626",
                lineHeight: 1
              }}>
                {totalScore.toFixed(0)}
              </span>
              <span style={{ fontSize: "0.74rem", color: "#64748b", fontWeight: 600, letterSpacing: "0.04em", marginTop: 4, textTransform: "uppercase" }}>
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
              <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                Threshold: &lt;20 Clear · 21-60 Caution · &gt;60 Threat
              </span>
            </div>

            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, marginBottom: 8, color: "#0f172a" }}>
              {risk?.recommended_action || "Verification Verdict Generated"}
            </h2>

            <p style={{ fontSize: "0.92rem", color: "#475569", lineHeight: 1.6, maxWidth: 650 }}>
              {band === "GREEN"
                ? "All multi-spectral biometric, algorithmic, and tamper forensic checks passed standard verification tolerances. Document is clear for passage."
                : band === "YELLOW"
                ? "Minor discrepancies or low image resolution detected during neural evaluation. Second-officer manual passport inspection is recommended."
                : "Critical anomaly detected! Image editing compression artifacts or checksum failure indicates deliberate document counterfeiting. Hold traveler for secondary questioning."
              }
            </p>

            {/* 4 Score Breakdown Meters */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 16, marginTop: 24, paddingTop: 20, borderTop: "1px solid #e2e8f0"
            }}>
              {[
                { label: "Tampering", val: risk?.tampering_contrib, max: 35 },
                { label: "Validation", val: risk?.validation_contrib, max: 30 },
                { label: "Face Match", val: risk?.face_contrib, max: 25 },
                { label: "Watchlist", val: risk?.watchlist_contrib, max: 10 },
              ].map(({ label, val, max }) => {
                const num = val != null ? Number(val) : 0;
                const pct = Math.min(100, Math.max(0, (num / max) * 100));
                const clr = pct > 65 ? "#dc2626" : pct > 35 ? "#d97706" : "#059669";

                return (
                  <div key={label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b", marginBottom: 5 }}>
                      <span style={{ fontWeight: 600 }}>{label}</span>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", color: clr, fontWeight: 700 }}>
                        {num.toFixed(1)} / {max}
                      </span>
                    </div>
                    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: 24, marginBottom: 28 }}>

        {/* ── CARD 1: Tampering Forensics & Heatmaps ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
          style={{ padding: "24px" }}
        >
          {/* Section Header with View Tabs */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Eye size={20} color="#2563eb" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Forensic Tampering Analysis</h3>
            </div>

            <span className={`band-badge ${tampering?.overall_tampered ? "band-red" : "band-green"}`} style={{ fontSize: "0.72rem" }}>
              {tampering?.overall_tampered ? "ALERT: TAMPERED" : "VERIFIED: AUTHENTIC"}
            </span>
          </div>

          {/* Tab Selector for Forensics View */}
          {tampering?.heatmap_url && (
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Forensic Heatmap Inspection:</span>
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
                    background: "#f8fafc", borderRadius: 10,
                    border: "1px solid #e2e8f0", padding: 10, textAlign: "center"
                  }}>
                    <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: 6, textTransform: "uppercase", fontWeight: 700 }}>ELA Analysis Layer</div>
                    <img
                      src={`${import.meta.env.VITE_API_URL || "http://localhost:8000"}${tampering.heatmap_url}`}
                      alt="ELA Heatmap"
                      style={{ width: "100%", height: 180, objectFit: "contain", borderRadius: 6, background: "#ffffff" }}
                    />
                  </div>
                  <div style={{
                    background: "#f8fafc", borderRadius: 10,
                    border: "1px solid #e2e8f0", padding: 12, display: "flex",
                    flexDirection: "column", justifyContent: "center"
                  }}>
                    <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: 6, textTransform: "uppercase", fontWeight: 700 }}>Noise Distribution Key</div>
                    <div style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.6 }}>
                      <p><strong style={{ color: "#2563eb" }}>Dark / Uniform:</strong> Consistent compression throughout document.</p>
                      <p style={{ marginTop: 6 }}><strong style={{ color: "#dc2626" }}>Bright Patches:</strong> Re-saved layers or localized pixel splicing.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: "#f8fafc", borderRadius: 10,
                  border: "1px solid #e2e8f0", padding: 12, textAlign: "center"
                }}>
                  <img
                    src={`${import.meta.env.VITE_API_URL || "http://localhost:8000"}${tampering.heatmap_url}`}
                    alt="ELA Full Heatmap"
                    style={{ width: "100%", maxHeight: 260, objectFit: "contain", borderRadius: 8, background: "#ffffff" }}
                  />
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 8 }}>
                    Error Level Analysis (ELA) rendered with high-frequency residual enhancement
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              padding: "20px", background: "#f8fafc", borderRadius: 10,
              border: "1px solid #e2e8f0", textAlign: "center", marginBottom: 16
            }}>
              <p style={{ fontSize: "0.85rem", color: "#64748b" }}>No pixel-level tampering indicators triggered.</p>
            </div>
          )}

          {/* Forensic Techniques Breakdown List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tampering?.techniques?.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", borderRadius: 10,
                  background: t.tampered ? "#fef2f2" : "#f8fafc",
                  border: `1px solid ${t.tampered ? "#fecaca" : "#e2e8f0"}`,
                }}
              >
                {t.tampered ? (
                  <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
                ) : (
                  <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "#0f172a" }}>
                    {t.technique}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>
                    {t.detail}
                  </div>
                </div>
                <div style={{
                  fontFamily: "JetBrains Mono, monospace", fontSize: "0.82rem",
                  fontWeight: 700, color: t.tampered ? "#dc2626" : "#059669"
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
          className="glass-card"
          style={{ padding: "24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Fingerprint size={20} color="#2563eb" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Biometric 1:1 Face Match</h3>
            </div>

            {face?.decision && (
              <span className={`band-badge ${face.decision === "VERIFIED" ? "band-green" : face.decision === "UNCERTAIN" ? "band-yellow" : "band-red"}`} style={{ fontSize: "0.72rem" }}>
                {face.decision}
              </span>
            )}
          </div>

          {face ? (
            <div>
              {/* Biometric Status Tiles */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                <div style={{
                  padding: "14px", background: "#f8fafc",
                  border: "1px solid #e2e8f0", borderRadius: 10, textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.74rem", color: "#64748b", marginBottom: 6 }}>ID Document Face Crop</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    {face.face_detected_doc ? (
                      <>
                        <CheckCircle2 size={18} color="#059669" />
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#059669" }}>LOCATED</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={18} color="#dc2626" />
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#dc2626" }}>NOT FOUND</span>
                      </>
                    )}
                  </div>
                </div>

                <div style={{
                  padding: "14px", background: "#f8fafc",
                  border: "1px solid #e2e8f0", borderRadius: 10, textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.74rem", color: "#64748b", marginBottom: 6 }}>Live Camera Capture</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    {face.face_detected_live ? (
                      <>
                        <CheckCircle2 size={18} color="#059669" />
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#059669" }}>ACQUIRED</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={18} color="#dc2626" />
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#dc2626" }}>MISSING</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* ArcFace Similarity Bar */}
              {face.match_score != null && (
                <div style={{
                  padding: "16px", background: "#f8fafc",
                  border: "1px solid #e2e8f0", borderRadius: 10, marginBottom: 18
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: "0.84rem", fontWeight: 600, color: "#0f172a" }}>ArcFace 512D Vector Similarity</span>
                    <span style={{
                      fontFamily: "JetBrains Mono, monospace", fontSize: "1.1rem", fontWeight: 800,
                      color: face.match_score >= 80 ? "#059669" : face.match_score >= 60 ? "#d97706" : "#dc2626"
                    }}>
                      {face.match_score?.toFixed(1)}%
                    </span>
                  </div>

                  <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      width: `${face.match_score}%`, height: "100%",
                      background: face.match_score >= 80 ? "#059669" : face.match_score >= 60 ? "#d97706" : "#dc2626",
                    }} />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#64748b", marginTop: 6 }}>
                    <span>0% (Mismatch)</span>
                    <span style={{ color: "#2563eb", fontWeight: 600 }}>Passing Threshold: 68.0%</span>
                    <span>100% (Identical)</span>
                  </div>
                </div>
              )}

              {/* Anti-Spoof Liveness Indicator */}
              {face.liveness_passed != null && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10,
                  background: face.liveness_passed ? "#ecfdf5" : "#fef2f2",
                  border: `1px solid ${face.liveness_passed ? "#a7f3d0" : "#fecaca"}`,
                }}>
                  {face.liveness_passed ? (
                    <CheckCircle2 size={20} color="#059669" />
                  ) : (
                    <AlertTriangle size={20} color="#dc2626" />
                  )}
                  <div>
                    <div style={{ fontSize: "0.86rem", fontWeight: 700, color: face.liveness_passed ? "#065f46" : "#991b1b" }}>
                      Anti-Spoof Liveness: {face.liveness_passed ? "AUTHENTIC 3D HUMAN" : "SCREEN / PHOTO SPOOF DETECTED"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>
                      {face.liveness_passed ? "Passed passive micro-texture and ocular depth reflectance checks." : "High risk: Printed photo on paper or digital screen replay detected."}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "36px 16px", color: "#64748b" }}>
              <User size={36} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f172a" }}>No Live Biometric Photo Supplied</div>
              <p style={{ fontSize: "0.8rem", marginTop: 6 }}>
                Passenger face matching was bypassed. Perform a new screening with camera active to verify traveler identity.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Two Column Secondary Grid: OCR Data & Checksum Validation ─ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: 24, marginBottom: 28 }}>

        {/* ── CARD 3: OCR Extracted Fields Table ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
          style={{ padding: "24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FileText size={20} color="#2563eb" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Extracted Biographic Data</h3>
            </div>

            <span style={{
              fontSize: "0.75rem", color: "#2563eb", fontWeight: 700,
              padding: "4px 10px", background: "#eff6ff", borderRadius: 6,
              border: "1px solid #bfdbfe"
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
                    <td style={{ color: "#64748b", textTransform: "capitalize", width: "42%", fontWeight: 600 }}>
                      {k.replace(/_/g, " ")}
                    </td>
                    <td style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.85rem", color: "#0f172a", fontWeight: 600 }}>
                      {String(v)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {ocr?.raw_text && (
            <details style={{ marginTop: 16 }}>
              <summary style={{ fontSize: "0.8rem", color: "#2563eb", cursor: "pointer", outline: "none", fontWeight: 600 }}>
                Inspect Raw OCR Text Feed
              </summary>
              <pre style={{
                marginTop: 10, padding: 12, background: "#f8fafc",
                borderRadius: 8, fontSize: "0.75rem", color: "#475569",
                border: "1px solid #e2e8f0",
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
          className="glass-card"
          style={{ padding: "24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Shield size={20} color={validation?.overall_valid ? "#059669" : "#dc2626"} />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Security Rule Engine</h3>
            </div>

            <span className={`band-badge ${validation?.overall_valid ? "band-green" : "band-red"}`} style={{ fontSize: "0.72rem" }}>
              {validation?.overall_valid ? "ALL CHECKS PASSED" : `${validation?.failure_count} CHECKS FAILED`}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {validation?.checks?.map((check, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px",
                  background: check.passed ? "#ecfdf5" : "#fef2f2",
                  border: `1px solid ${check.passed ? "#a7f3d0" : "#fecaca"}`,
                  borderRadius: 10,
                }}
              >
                {check.passed ? (
                  <CheckCircle2 size={17} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                ) : (
                  <XCircle size={17} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                )}
                <div>
                  <div style={{ fontSize: "0.86rem", fontWeight: 700, color: check.passed ? "#065f46" : "#991b1b", textTransform: "capitalize" }}>
                    {check.check_name.replace(/_/g, " ")}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "#64748b", marginTop: 2, lineHeight: 1.4 }}>
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
          className="glass-card"
          style={{ padding: "24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Lock size={20} color="#7c3aed" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
                Immutable Blockchain Audit Block
              </h3>
            </div>

            <button
              onClick={copyEventHash}
              className="btn-secondary"
              style={{ padding: "6px 14px", fontSize: "0.78rem" }}
              title="Copy SHA-256 Hash"
            >
              {copiedHash ? <Check size={14} color="#059669" /> : <Copy size={14} />}
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
                  padding: "12px 14px", background: "#f8fafc",
                  borderRadius: 10, border: "1px solid #e2e8f0"
                }}
              >
                <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: 4, fontWeight: 600 }}>{label}</div>
                <div style={{
                  fontSize: "0.82rem", fontFamily: "JetBrains Mono, monospace",
                  color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600
                }}>
                  {val || "—"}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: "0.76rem", color: "#64748b" }}>
            <Shield size={14} color="#7c3aed" />
            <span>Cryptographically sealed under Section 65B Indian Evidence Act compliant ledger.</span>
          </div>
        </motion.div>
      )}

    </div>
  );
}
