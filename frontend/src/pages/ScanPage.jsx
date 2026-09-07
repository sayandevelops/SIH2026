import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import {
  Upload, Camera, FileText, Shield, Loader2,
  CheckCircle2, XCircle, ChevronRight, RotateCcw,
  Fingerprint, Eye, Cpu, AlertTriangle, Layers,
  Terminal, Check, Sparkles, Usb, Laptop
} from "lucide-react";
import { screenDocument } from "../api/shieldscan";
import DeviceCheckerHUD from "../components/Scanner/DeviceCheckerHUD";

const DOC_TYPES = [
  { id: "PASSPORT",        label: "Passport",        sub: "ICAO 9303 MRZ",          icon: "🛂", desc: "Passports with machine readable zone & checksums" },
  { id: "AADHAAR",         label: "Aadhaar Card",    sub: "UIDAI Verhoeff D5",      icon: "🆔", desc: "12-digit UIDAI format + QR verification" },
  { id: "PAN_CARD",        label: "PAN Card",        sub: "Income Tax Dept",        icon: "💳", desc: "10-char format + surname initial cross-match" },
  { id: "DRIVING_LICENSE", label: "Driving License", sub: "MoRTH Smart Card",       icon: "🚗", desc: "State code + issue year + DL number format" },
  { id: "VISA",            label: "Visa Permit",     sub: "Consular Entry Stamp",   icon: "📄", desc: "Entry dates, expiry, validity & jurisdiction" },
  { id: "NATIONAL_ID",     label: "National ID",     sub: "Universal Citizen Card", icon: "🪪", desc: "Standard identity document with OCR text" },
];

export default function ScanPage() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const [step,         setStep]         = useState(1);
  const [docFile,      setDocFile]      = useState(null);
  const [docPreview,   setDocPreview]   = useState(null);
  const [docType,      setDocType]      = useState("PASSPORT");
  const [liveSnap,     setLiveSnap]     = useState(null);
  const [webcamOn,     setWebcamOn]     = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [activeStage,  setActiveStage]  = useState(0);
  const [hardwareMode, setHardwareMode] = useState(true);

  // ── Cradle Hardware Document Simulation ───────────────────────────
  const handleHardwareDocCapture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 560;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 800, 560);

      // Guilloche pattern
      ctx.strokeStyle = "rgba(37, 99, 235, 0.08)";
      for (let i = 0; i < 800; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(800 - i, 560);
        ctx.stroke();
      }

      ctx.fillStyle = "#1e3a8a";
      ctx.font = "bold 24px 'Courier New', monospace";
      ctx.fillText("REPUBLIC OF INDIA / PASSPORT", 40, 50);
      ctx.fillStyle = "#64748b";
      ctx.font = "14px 'Courier New', monospace";
      ctx.fillText("OPTICAL SCANNER DSS-9000 ACQUISITION", 40, 75);

      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(40, 95, 190, 245);
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, 95, 190, 245);

      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.arc(135, 175, 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(135, 295, 78, 55, 0, Math.PI, 0);
      ctx.fill();

      ctx.strokeStyle = "rgba(16, 185, 129, 0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(180, 285, 32, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#059669";
      ctx.font = "bold 10px monospace";
      ctx.fillText("SECURE ID", 158, 289);

      ctx.fillStyle = "#0f172a";
      ctx.font = "16px monospace";
      ctx.fillText("Type / Type: P", 260, 130);
      ctx.fillText("Country Code: IND", 440, 130);
      ctx.fillText("Passport No: Z9182341", 260, 170);
      ctx.fillText("Surname: SHARMA", 260, 210);
      ctx.fillText("Given Names: RAHUL", 260, 250);
      ctx.fillText("Nationality: INDIAN", 260, 290);
      ctx.fillText("Date of Birth: 14/08/1996", 260, 330);

      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(20, 380, 760, 150);
      ctx.strokeStyle = "#e2e8f0";
      ctx.strokeRect(20, 380, 760, 150);
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 20px 'Courier New', monospace";
      ctx.fillText("P<INDSHARMA<<RAHUL<<<<<<<<<<<<<<<<<<<<<<<<<<", 40, 435);
      ctx.fillText("Z9182341<4IND9608148M3108204<<<<<<<<<<<<<<02", 40, 490);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "cradle_scan_passport_Z9182341.png", { type: "image/png" });
        setDocFile(file);
        setDocPreview(URL.createObjectURL(file));
        setDocType("PASSPORT");
        setStep(2);
        toast.success("Document acquired from Optical Cradle Scanner! ✓");
      }
    }, "image/png");
  };

  const STAGES = [
    { title: "OCR Multi-Engine Extraction", desc: "Scanning document text, numbers & MRZ lines" },
    { title: "Cryptographic Rule Engine",   desc: "Validating Verhoeff & ICAO 9303 checksums" },
    { title: "Forensic Tampering Analysis", desc: "Computing ELA & CMFD pixel variance heatmaps" },
    { title: "Metadata Inspection",         desc: "Scanning editing software signatures" },
    { title: "ArcFace Biometric Matcher",   desc: "Cross-matching facial vectors & depth liveness" },
    { title: "Composite Risk Score & Log",  desc: "Generating SHA-256 Merkle chain block" },
  ];

  const onDrop = useCallback((accepted) => {
    const file = accepted[0];
    if (!file) return;
    setDocFile(file);
    setDocPreview(URL.createObjectURL(file));
    setStep(2);
    toast.success(`Document imported: ${file.name}`);
  }, []);

  const isPdf = docFile?.type === "application/pdf" || docFile?.name.toLowerCase().endsWith(".pdf");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const captureFrame = () => {
    const snap = webcamRef.current?.getScreenshot();
    if (snap) {
      setLiveSnap(snap);
      setWebcamOn(false);
      toast.success("Biometric face sample captured ✓");
    }
  };

  const runScreening = async () => {
    if (!docFile) { toast.error("Please upload a document first."); return; }

    setLoading(true);
    setStep(3);
    setActiveStage(0);

    const interval = setInterval(() => {
      setActiveStage(prev => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const result = await screenDocument({
        file:          docFile,
        documentType:  docType,
        liveImageB64:  liveSnap,
        officerId:     "OFFICER-01",
        checkpoint:    "CHECKPOINT-ALPHA",
      });

      clearInterval(interval);
      sessionStorage.setItem("screeningResult", JSON.stringify(result));
      navigate("/results");
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      toast.error("Screening failed: " + (err.response?.data?.detail || err.message));
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setDocFile(null);
    setDocPreview(null);
    setLiveSnap(null);
    setWebcamOn(false);
    toast("Console reset for next document.", { icon: "🔄" });
  };

  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "36px 24px 60px" }}>
      
      {/* Executive Clean Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 14px", borderRadius: "8px",
            background: "#eff6ff", border: "1px solid #bfdbfe",
            fontSize: "0.75rem", fontWeight: 700, color: "#2563eb",
            letterSpacing: "0.04em", textTransform: "uppercase",
            marginBottom: 10,
          }}>
            <Shield size={13} /> BORDER CONTROL WORKSTATION · CHECKPOINT-ALPHA
          </div>
          <h1 style={{ fontSize: "2.1rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Document & Identity Screening
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem", marginTop: 4 }}>
            Multi-spectral forgery detection, cryptographic checksum verification, and biometric face matching.
          </p>
        </div>

        {/* Status Indicators & Hardware Mode Toggle */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          {/* Hardware Kiosk Mode Toggle */}
          <div
            onClick={() => {
              const next = !hardwareMode;
              setHardwareMode(next);
              if (next) {
                toast.success("Hardware Kiosk Link Engaged: Querying Peripherals...", { icon: "🔌" });
              } else {
                toast("Manual Cloud Mode Active: Drag & drop enabled.", { icon: "💻" });
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 16px",
              borderRadius: "12px",
              background: hardwareMode ? "#ecfdf5" : "#ffffff",
              border: `1.5px solid ${hardwareMode ? "#a7f3d0" : "#e2e8f0"}`,
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
              transition: "all 0.2s ease",
              userSelect: "none",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.68rem", color: hardwareMode ? "#059669" : "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>
                HARDWARE LINK
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: hardwareMode ? "#065f46" : "#0f172a", fontFamily: "Outfit" }}>
                {hardwareMode ? "KIOSK ONLINE" : "MANUAL MODE"}
              </div>
            </div>
            <div style={{
              width: 42,
              height: 22,
              borderRadius: 12,
              background: hardwareMode ? "#10b981" : "#e2e8f0",
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: hardwareMode ? "flex-end" : "flex-start",
              transition: "all 0.2s ease",
            }}>
              <div style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }} />
            </div>
          </div>

          {/* Operator ID Badge */}
          <div style={{
            padding: "8px 16px", borderRadius: "12px",
            background: "#ffffff", border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            textAlign: "right",
          }}>
            <div style={{ fontSize: "0.68rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
              OPERATOR
            </div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>
              SSB-OFFICER-01
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator Tracker */}
      <div className="glass-card" style={{ padding: "18px 24px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        {[
          { num: 1, label: "Document Select & Upload", icon: Upload },
          { num: 2, label: "Biometric Face Capture",  icon: Camera },
          { num: 3, label: "Forensic Analysis",       icon: Sparkles },
        ].map((s, i) => {
          const active = step === s.num;
          const done = step > s.num;
          return (
            <div key={s.num} style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 220 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "10px",
                background: done ? "#ecfdf5" : active ? "#2563eb" : "#f1f5f9",
                border: `1.5px solid ${done ? "#10b981" : active ? "#2563eb" : "#e2e8f0"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: active ? "#ffffff" : done ? "#059669" : "#64748b",
                fontWeight: 700, fontSize: "0.95rem",
                boxShadow: active ? "0 2px 8px rgba(37, 99, 235, 0.25)" : "none",
                transition: "all 0.25s ease",
              }}>
                {done ? <Check size={18} strokeWidth={3} /> : <s.icon size={18} />}
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: active ? "#2563eb" : done ? "#059669" : "#64748b", fontWeight: 700, letterSpacing: "0.04em" }}>
                  PHASE 0{s.num}
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: active ? "#0f172a" : done ? "#0f172a" : "#64748b" }}>
                  {s.label}
                </div>
              </div>
              {i < 2 && (
                <div style={{
                  flex: 1, height: 2,
                  background: done ? "#10b981" : "#e2e8f0",
                  margin: "0 12px",
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Dynamic Hardware Device Checker HUD */}
      <AnimatePresence>
        {hardwareMode && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <DeviceCheckerHUD
              onDocumentCapture={handleHardwareDocCapture}
              onFaceActivate={() => {
                setWebcamOn(true);
                toast("Biometric Pod Camera feed engaged ✓", { icon: "📷" });
              }}
              isLiveFaceReady={!!liveSnap}
              hasDocument={!!docFile}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Screening Layout Grid */}
      <div style={{ display: "grid", gridTemplateColumns: docPreview ? "1.2fr 1fr" : "1fr", gap: 28, alignItems: "start" }}>

        {/* Left Column: Controls & Ingestion */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Document Type Selector Card */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Layers size={16} color="#2563eb" />
                <span style={{ fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "#475569", fontFamily: "Outfit" }}>
                  Select Document Protocol
                </span>
              </div>
              <span style={{ fontSize: "0.72rem", color: "#2563eb", background: "#eff6ff", border: "1px solid #bfdbfe", padding: "2px 8px", borderRadius: "6px", fontWeight: 600 }}>
                {DOC_TYPES.length} PROTOCOLS READY
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
              {DOC_TYPES.map(dt => {
                const isSelected = docType === dt.id;
                return (
                  <button
                    key={dt.id}
                    onClick={() => setDocType(dt.id)}
                    style={{
                      padding: "14px 12px",
                      borderRadius: "12px",
                      background: isSelected ? "#eff6ff" : "#ffffff",
                      border: `1.5px solid ${isSelected ? "#2563eb" : "#e2e8f0"}`,
                      boxShadow: isSelected ? "0 2px 8px rgba(37, 99, 235, 0.12)" : "0 1px 2px rgba(0, 0, 0, 0.03)",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "1.4rem" }}>{dt.icon}</span>
                      {isSelected && (
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb" }} />
                      )}
                    </div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: isSelected ? "#1d4ed8" : "#0f172a", marginTop: 4 }}>
                      {dt.label}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: isSelected ? "#2563eb" : "#64748b" }}>
                      {dt.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clean Modern Dropzone */}
          <div
            {...getRootProps()}
            className={`upload-zone ${isDragActive ? "drag-over" : ""}`}
          >
            <input {...getInputProps()} />

            <div style={{
              width: 56, height: 56, borderRadius: "14px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <Upload size={26} color="#2563eb" />
            </div>

            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", marginBottom: 6, fontFamily: "Outfit" }}>
              {isDragActive ? "Release Document to Scan" : "Import Document for Verification"}
            </div>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: 18, maxWidth: 400, margin: "0 auto 18px" }}>
              Drag & drop identity document or click to browse files.
            </p>

            {/* Supported Format Badges */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {["PDF Document", "JPEG / JPG", "PNG High-Res", "TIFF / BMP"].map((tag, idx) => (
                <span key={idx} style={{
                  padding: "3px 10px", borderRadius: "6px",
                  background: "#f1f5f9", border: "1px solid #e2e8f0",
                  fontSize: "0.72rem", color: "#475569", fontWeight: 600,
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {docFile && (
              <div style={{
                marginTop: 20, display: "inline-flex", alignItems: "center", gap: 10,
                padding: "8px 16px", borderRadius: "8px",
                background: "#ecfdf5", border: "1px solid #a7f3d0",
              }}>
                <CheckCircle2 size={16} color="#059669" />
                <span style={{ fontSize: "0.85rem", color: "#059669", fontWeight: 700, fontFamily: "JetBrains Mono" }}>
                  LOADED: {docFile.name} ({(docFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
          </div>

          {/* Airport e-Gate Biometric Webcam Section */}
          {docFile && (
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Fingerprint size={18} color="#2563eb" />
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", fontFamily: "Outfit" }}>
                      Biometric Live Face Capture
                    </span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: 2 }}>
                    Optional 1:1 ArcFace verification & passive 3D liveness check
                  </div>
                </div>

                {liveSnap ? (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "4px 12px", borderRadius: "6px",
                    background: "#ecfdf5", border: "1px solid #a7f3d0",
                    color: "#059669", fontSize: "0.75rem", fontWeight: 700,
                  }}>
                    <CheckCircle2 size={14} /> FACE READY
                  </div>
                ) : (
                  <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>
                    STANDBY
                  </span>
                )}
              </div>

              {webcamOn ? (
                <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    style={{ width: "100%", display: "block" }}
                  />

                  {/* Airport e-Gate Oval Reticle */}
                  <div className="biometric-reticle">
                    <div className="biometric-oval" />
                  </div>

                  <div style={{
                    position: "absolute", bottom: 12, left: 12, right: 12,
                    display: "flex", gap: 10,
                  }}>
                    <button className="btn-primary" onClick={captureFrame} style={{ flex: 1 }}>
                      <Camera size={18} /> Capture Biometric Frame
                    </button>
                    <button onClick={() => setWebcamOn(false)} className="btn-secondary" style={{ padding: "0 16px" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : liveSnap ? (
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <img
                    src={liveSnap} alt="Captured face"
                    style={{ width: 110, height: 110, objectFit: "cover", borderRadius: "12px", border: "2px solid #10b981", boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                      Facial Vector Generated
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#64748b", marginBottom: 12 }}>
                      Ready for 1:1 cross-examination with passport/ID photo.
                    </div>
                    <button onClick={() => { setLiveSnap(null); setWebcamOn(true); }} className="btn-secondary" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>
                      <RotateCcw size={14} /> Retake Photo
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setWebcamOn(true)}
                  style={{
                    width: "100%", padding: "16px",
                    borderRadius: "12px",
                    background: "#f8fafc",
                    border: "1.5px dashed #cbd5e1",
                    color: "#2563eb", fontWeight: 700, fontSize: "0.9rem",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    cursor: "pointer", transition: "all 0.2s ease",
                  }}
                >
                  <Camera size={18} /> Launch Biometric Camera Feed
                </button>
              )}
            </div>
          )}

          {/* Action Launchers */}
          {docFile && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                className="btn-primary"
                onClick={runScreening}
                disabled={loading}
                style={{ width: "100%", padding: "16px", fontSize: "1.02rem", borderRadius: "12px" }}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ borderTopColor: "#ffffff" }} /> Analyzing Document & Biometrics...
                  </>
                ) : (
                  <>
                    <Shield size={20} /> Execute AI Forensic Screening
                  </>
                )}
              </button>

              <button
                onClick={reset}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  background: "#ffffff",
                  border: "1px solid #fecaca",
                  color: "#dc2626", fontSize: "0.85rem", fontWeight: 600,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "all 0.2s ease",
                }}
              >
                <XCircle size={15} /> Clear Workspace & Start Fresh
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Live Document Preview */}
        {docPreview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Eye size={16} color="#2563eb" />
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Live Inspection Monitor
                  </span>
                </div>
                <span style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 600 }}>
                  RESOLVED · 200 DPI
                </span>
              </div>

              {isPdf ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <iframe
                    src={docPreview}
                    title="PDF Monitor"
                    style={{
                      width: "100%",
                      height: 380,
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc",
                    }}
                  />
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                    borderRadius: "8px", background: "#f8fafc", border: "1px solid #e2e8f0",
                  }}>
                    <FileText size={20} color="#2563eb" />
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>PDF Document Buffer</div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                        Digital Vector Text + First-Page Rasterization Active
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                  <img
                    src={docPreview} alt="Document Monitor"
                    style={{ width: "100%", display: "block", maxHeight: 420, objectFit: "contain", background: "#f8fafc" }}
                  />
                </div>
              )}

              {/* Document Meta Chips */}
              <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ padding: "10px 14px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "0.68rem", color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>DOCUMENT TYPE</div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#2563eb", marginTop: 2 }}>
                    {DOC_TYPES.find(d => d.id === docType)?.label}
                  </div>
                </div>
                <div style={{ padding: "10px 14px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "0.68rem", color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>FILE SIZE</div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a", marginTop: 2 }}>
                    {docFile ? (docFile.size / 1024).toFixed(1) + " KB" : "-"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Clean Loading Modal */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 999,
              background: "rgba(15, 23, 42, 0.4)",
              backdropFilter: "blur(8px)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", padding: 24,
            }}
          >
            <div style={{
              maxWidth: 540, width: "100%", padding: "36px 32px", textAlign: "center",
              background: "#ffffff", borderRadius: "20px", border: "1px solid #e2e8f0",
              boxShadow: "0 20px 40px -8px rgba(0, 0, 0, 0.15)",
            }}>
              
              <div style={{
                width: 64, height: 64, margin: "0 auto 20px", borderRadius: "16px",
                background: "#eff6ff", border: "1px solid #bfdbfe",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Cpu size={30} color="#2563eb" />
              </div>

              <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f172a", marginBottom: 6, fontFamily: "Outfit" }}>
                AI Forensics Pipeline Running
              </h2>
              <div style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: 24 }}>
                Processing {docFile?.name} through multi-spectral inspection engines
              </div>

              {/* Progress Stage Tracker */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "left", marginBottom: 24 }}>
                {STAGES.map((s, idx) => {
                  const isDone = idx < activeStage;
                  const isCurrent = idx === activeStage;
                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 14px", borderRadius: "10px",
                        background: isCurrent ? "#eff6ff" : isDone ? "#ecfdf5" : "#f8fafc",
                        border: `1px solid ${isCurrent ? "#bfdbfe" : isDone ? "#a7f3d0" : "#e2e8f0"}`,
                        transition: "all 0.25s ease",
                      }}
                    >
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%",
                        background: isDone ? "#10b981" : isCurrent ? "#2563eb" : "#e2e8f0",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.7rem", fontWeight: 800, color: isDone || isCurrent ? "#ffffff" : "#64748b",
                      }}>
                        {isDone ? <Check size={13} strokeWidth={3} /> : isCurrent ? <Loader2 size={13} className="spinner" /> : idx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.84rem", fontWeight: 700, color: isCurrent ? "#1d4ed8" : isDone ? "#065f46" : "#475569" }}>
                          {s.title}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                          {s.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                SOVEREIGN AIR-GAP PIPELINE · ZERO DATA LEAKAGE
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
