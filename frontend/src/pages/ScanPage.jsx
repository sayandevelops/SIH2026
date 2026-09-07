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
  const [hardwareMode, setHardwareMode] = useState(true); // Default ON to showcase physical immigration kiosk

  // ── Cradle Hardware Document Simulation ───────────────────────────
  const handleHardwareDocCapture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 560;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#0c1e3d";
      ctx.fillRect(0, 0, 800, 560);

      // Guilloche pattern lines
      ctx.strokeStyle = "rgba(0, 242, 254, 0.12)";
      for (let i = 0; i < 800; i += 35) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(800 - i, 560);
        ctx.stroke();
      }

      ctx.fillStyle = "#00f2fe";
      ctx.font = "bold 24px 'Courier New', monospace";
      ctx.fillText("REPUBLIC OF INDIA / PASSPORT", 40, 50);
      ctx.fillStyle = "#8da4c4";
      ctx.font = "14px 'Courier New', monospace";
      ctx.fillText("OPTICAL SCANNER DSS-9000 ACQUISITION", 40, 75);

      ctx.fillStyle = "#162b4d";
      ctx.fillRect(40, 95, 190, 245);
      ctx.strokeStyle = "#00f2fe";
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 95, 190, 245);

      ctx.fillStyle = "#8da4c4";
      ctx.beginPath();
      ctx.arc(135, 175, 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(135, 295, 78, 55, 0, Math.PI, 0);
      ctx.fill();

      ctx.strokeStyle = "rgba(0, 245, 155, 0.6)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(180, 285, 32, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#00f59b";
      ctx.font = "bold 10px monospace";
      ctx.fillText("SECURE ID", 158, 289);

      ctx.fillStyle = "#ffffff";
      ctx.font = "16px monospace";
      ctx.fillText("Type / Type: P", 260, 130);
      ctx.fillText("Country Code: IND", 440, 130);
      ctx.fillText("Passport No: Z9182341", 260, 170);
      ctx.fillText("Surname: SHARMA", 260, 210);
      ctx.fillText("Given Names: RAHUL", 260, 250);
      ctx.fillText("Nationality: INDIAN", 260, 290);
      ctx.fillText("Date of Birth: 14/08/1996", 260, 330);

      ctx.fillStyle = "#071224";
      ctx.fillRect(20, 380, 760, 150);
      ctx.strokeStyle = "rgba(0, 242, 254, 0.3)";
      ctx.strokeRect(20, 380, 760, 150);
      ctx.fillStyle = "#00f59b";
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
    { title: "Forensic Tampering Forensics",desc: "Computing ELA & CMFD pixel variance heatmaps" },
    { title: "EXIF & Metadata Inspection", desc: "Scanning editing software signatures" },
    { title: "ArcFace Biometric Matcher",   desc: "Cross-matching facial vectors & depth liveness" },
    { title: "Composite Risk Score & Log",  desc: "Generating SHA-256 Merkle chain block" },
  ];

  // ── Dropzone Setup ────────────────────────────────────────────────
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

  // ── Webcam capture ────────────────────────────────────────────────
  const captureFrame = () => {
    const snap = webcamRef.current?.getScreenshot();
    if (snap) {
      setLiveSnap(snap);
      setWebcamOn(false);
      toast.success("Biometric face sample captured ✓");
    }
  };

  // ── Run Screening Pipeline ────────────────────────────────────────
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
      
      {/* Tactical Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "4px 12px", borderRadius: "6px",
            background: "rgba(0, 242, 254, 0.08)", border: "1px solid rgba(0, 242, 254, 0.25)",
            fontSize: "0.72rem", fontWeight: 800, color: "#00f2fe",
            letterSpacing: "0.1em", textTransform: "uppercase",
            fontFamily: "JetBrains Mono, monospace", marginBottom: 8,
          }}>
            <Terminal size={12} /> BORDER CONTROL WORKSTATION · SECURE
          </div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
            AI Document & Identity Screening
          </h1>
          <p style={{ color: "#8da4c4", fontSize: "0.95rem", marginTop: 4 }}>
            Multi-spectral forgery detection, mathematical checksum auditing, and face biometrics.
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
              borderRadius: "10px",
              background: hardwareMode
                ? "linear-gradient(135deg, rgba(0, 245, 155, 0.15), rgba(0, 242, 254, 0.15))"
                : "rgba(13, 27, 54, 0.6)",
              border: `1.5px solid ${hardwareMode ? "#00f59b" : "rgba(0, 242, 254, 0.15)"}`,
              cursor: "pointer",
              boxShadow: hardwareMode ? "0 0 20px rgba(0, 245, 155, 0.25)" : "none",
              transition: "all 0.3s ease",
              userSelect: "none",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.65rem", color: hardwareMode ? "#00f59b" : "#4e6b8f", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "JetBrains Mono", fontWeight: 700 }}>
                KIOSK HARDWARE LINK
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: hardwareMode ? "#ffffff" : "#8da4c4", fontFamily: "Outfit" }}>
                {hardwareMode ? "HARDWARE ONLINE" : "MANUAL CLOUD MODE"}
              </div>
            </div>
            <div style={{
              width: 42,
              height: 22,
              borderRadius: 12,
              background: hardwareMode ? "#00f59b" : "#162b4d",
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: hardwareMode ? "flex-end" : "flex-start",
              transition: "all 0.25s ease",
            }}>
              <div style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#030712",
                boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
              }} />
            </div>
          </div>

          {/* Operator ID Badge */}
          <div style={{
            padding: "8px 16px", borderRadius: "10px",
            background: "rgba(13, 27, 54, 0.6)", border: "1px solid rgba(0, 242, 254, 0.15)",
            textAlign: "right",
          }}>
            <div style={{ fontSize: "0.68rem", color: "#4e6b8f", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "JetBrains Mono" }}>
              OPERATOR ID
            </div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#00f2fe", fontFamily: "JetBrains Mono" }}>
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
                background: done ? "rgba(0, 245, 155, 0.15)" : active ? "linear-gradient(135deg, #00f2fe, #0072ff)" : "rgba(13, 27, 54, 0.8)",
                border: `1.5px solid ${done ? "#00f59b" : active ? "#00f2fe" : "rgba(0, 242, 254, 0.15)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: active ? "#030712" : done ? "#00f59b" : "#4e6b8f",
                fontWeight: 800, fontSize: "0.95rem",
                boxShadow: active ? "0 0 20px rgba(0, 242, 254, 0.4)" : done ? "0 0 15px rgba(0, 245, 155, 0.2)" : "none",
                transition: "all 0.3s ease",
              }}>
                {done ? <Check size={18} strokeWidth={3} /> : <s.icon size={18} />}
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: active ? "#00f2fe" : done ? "#00f59b" : "#4e6b8f", fontWeight: 700, letterSpacing: "0.06em", fontFamily: "JetBrains Mono" }}>
                  PHASE 0{s.num}
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: active ? "#ffffff" : done ? "#f0f6fc" : "#8da4c4" }}>
                  {s.label}
                </div>
              </div>
              {i < 2 && (
                <div style={{
                  flex: 1, height: 2,
                  background: done ? "linear-gradient(90deg, #00f59b, rgba(0, 242, 254, 0.3))" : "rgba(0, 242, 254, 0.1)",
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
                <Layers size={16} color="#00f2fe" />
                <span style={{ fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8da4c4", fontFamily: "Outfit" }}>
                  Select Document Protocol
                </span>
              </div>
              <span style={{ fontSize: "0.72rem", color: "#00f2fe", fontFamily: "JetBrains Mono", background: "rgba(0, 242, 254, 0.08)", padding: "2px 8px", borderRadius: "4px" }}>
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
                      background: isSelected ? "linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(0, 114, 255, 0.15))" : "rgba(13, 27, 54, 0.4)",
                      border: `1.5px solid ${isSelected ? "#00f2fe" : "rgba(0, 242, 254, 0.12)"}`,
                      boxShadow: isSelected ? "0 0 25px rgba(0, 242, 254, 0.25), inset 0 0 10px rgba(0, 242, 254, 0.1)" : "none",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "1.4rem" }}>{dt.icon}</span>
                      {isSelected && (
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00f2fe", boxShadow: "0 0 8px #00f2fe" }} />
                      )}
                    </div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: isSelected ? "#ffffff" : "#f0f6fc", marginTop: 4 }}>
                      {dt.label}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: isSelected ? "#00f2fe" : "#4e6b8f", fontFamily: "JetBrains Mono" }}>
                      {dt.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* HUD Styled Dropzone */}
          <div className="hud-frame">
            <div className="hud-corner hud-tl" />
            <div className="hud-corner hud-tr" />
            <div className="hud-corner hud-bl" />
            <div className="hud-corner hud-br" />

            <div
              {...getRootProps()}
              className={`upload-zone ${isDragActive ? "drag-over" : ""}`}
            >
              <input {...getInputProps()} />

              {/* Sweeping Laser Beam Animation */}
              <div className="scan-laser" />

              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0, 242, 254, 0.2) 0%, rgba(0, 242, 254, 0.02) 70%)",
                border: "1px solid rgba(0, 242, 254, 0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "0 0 25px rgba(0, 242, 254, 0.2)",
              }}>
                <Upload size={28} color="#00f2fe" />
              </div>

              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ffffff", marginBottom: 6, fontFamily: "Outfit" }}>
                {isDragActive ? "Release Document to Scan" : "Import Document for Forensic Screening"}
              </div>
              <p style={{ fontSize: "0.85rem", color: "#8da4c4", marginBottom: 18, maxWidth: 420, margin: "0 auto 18px" }}>
                Drag & drop digital file or click to browse filesystem.
              </p>

              {/* Supported Format Badges */}
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                {["PDF Document", "JPEG / JPG", "PNG High-Res", "TIFF / BMP"].map((tag, idx) => (
                  <span key={idx} style={{
                    padding: "3px 10px", borderRadius: "6px",
                    background: "rgba(13, 27, 54, 0.7)", border: "1px solid rgba(0, 242, 254, 0.15)",
                    fontSize: "0.72rem", color: "#8da4c4", fontFamily: "JetBrains Mono",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {docFile && (
                <div style={{
                  marginTop: 20, display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "8px 16px", borderRadius: "8px",
                  background: "rgba(0, 245, 155, 0.1)", border: "1px solid rgba(0, 245, 155, 0.3)",
                }}>
                  <CheckCircle2 size={16} color="#00f59b" />
                  <span style={{ fontSize: "0.85rem", color: "#00f59b", fontWeight: 700, fontFamily: "JetBrains Mono" }}>
                    LOADED: {docFile.name} ({(docFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Airport e-Gate Biometric Webcam Section */}
          {docFile && (
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Fingerprint size={18} color="#00f2fe" />
                    <span style={{ fontSize: "1rem", fontWeight: 800, color: "#ffffff", fontFamily: "Outfit" }}>
                      Biometric Live Face Capture
                    </span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#8da4c4", marginTop: 2 }}>
                    Optional 1:1 ArcFace verification & passive 3D liveness anti-spoofing
                  </div>
                </div>

                {liveSnap ? (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "4px 12px", borderRadius: "6px",
                    background: "rgba(0, 245, 155, 0.12)", border: "1px solid rgba(0, 245, 155, 0.4)",
                    color: "#00f59b", fontSize: "0.75rem", fontWeight: 700,
                  }}>
                    <CheckCircle2 size={14} /> FACE READY
                  </div>
                ) : (
                  <span style={{ fontSize: "0.72rem", color: "#4e6b8f", fontFamily: "JetBrains Mono" }}>
                    STANDBY
                  </span>
                )}
              </div>

              {webcamOn ? (
                <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(0, 242, 254, 0.3)" }}>
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
                    style={{ width: 110, height: 110, objectFit: "cover", borderRadius: "12px", border: "2px solid #00f59b", boxShadow: "0 0 20px rgba(0, 245, 155, 0.3)" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff", marginBottom: 4 }}>
                      Facial Vector Generated
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#8da4c4", marginBottom: 12 }}>
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
                    background: "rgba(0, 242, 254, 0.04)",
                    border: "1.5px dashed rgba(0, 242, 254, 0.25)",
                    color: "#00f2fe", fontWeight: 700, fontSize: "0.9rem",
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
                style={{ width: "100%", padding: "18px", fontSize: "1.05rem", borderRadius: "14px" }}
              >
                {loading ? (
                  <>
                    <div className="spinner" /> Analyzing Document & Biometrics...
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
                  background: "transparent",
                  border: "1px solid rgba(255, 42, 95, 0.25)",
                  color: "#ff2a5f", fontSize: "0.85rem", fontWeight: 600,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <XCircle size={15} /> Clear Workspace & Start Fresh
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Live Document HUD Preview */}
        {docPreview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hud-frame"
          >
            <div className="hud-corner hud-tl" />
            <div className="hud-corner hud-tr" />
            <div className="hud-corner hud-bl" />
            <div className="hud-corner hud-br" />

            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Eye size={16} color="#00f2fe" />
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#8da4c4", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Live Inspection Monitor
                  </span>
                </div>
                <span style={{ fontSize: "0.72rem", color: "#00f59b", fontFamily: "JetBrains Mono" }}>
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
                      border: "1px solid rgba(0, 242, 254, 0.2)",
                      background: "#081021",
                    }}
                  />
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                    borderRadius: "8px", background: "rgba(0, 242, 254, 0.06)", border: "1px solid rgba(0, 242, 254, 0.15)",
                  }}>
                    <FileText size={20} color="#00f2fe" />
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff" }}>PDF Document Buffer</div>
                      <div style={{ fontSize: "0.72rem", color: "#8da4c4", fontFamily: "JetBrains Mono" }}>
                        Digital Vector Text + First-Page Rasterization Active
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(0, 242, 254, 0.2)" }}>
                  <img
                    src={docPreview} alt="Document Monitor"
                    style={{ width: "100%", display: "block", maxHeight: 420, objectFit: "contain", background: "#050b14" }}
                  />
                </div>
              )}

              {/* Document Meta Chips */}
              <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(13, 27, 54, 0.5)", border: "1px solid rgba(0, 242, 254, 0.08)" }}>
                  <div style={{ fontSize: "0.68rem", color: "#4e6b8f", textTransform: "uppercase", fontFamily: "JetBrains Mono" }}>TYPE PROTOCOL</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#00f2fe" }}>
                    {DOC_TYPES.find(d => d.id === docType)?.label}
                  </div>
                </div>
                <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(13, 27, 54, 0.5)", border: "1px solid rgba(0, 242, 254, 0.08)" }}>
                  <div style={{ fontSize: "0.68rem", color: "#4e6b8f", textTransform: "uppercase", fontFamily: "JetBrains Mono" }}>FILE PAYLOAD</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff", fontFamily: "JetBrains Mono" }}>
                    {docFile ? (docFile.size / 1024).toFixed(1) + " KB" : "-"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Cyber-Forensics Fullscreen Loading Animation */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 999,
              background: "rgba(3, 7, 18, 0.92)",
              backdropFilter: "blur(24px)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", padding: 24,
            }}
          >
            <div className="glass-card" style={{ maxWidth: 540, width: "100%", padding: "40px 32px", textAlign: "center" }}>
              
              {/* Central Pulsing Radar */}
              <div style={{ position: "relative", width: 90, height: 90, margin: "0 auto 24px" }}>
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  border: "2px solid rgba(0, 242, 254, 0.3)",
                }} className="radar-beacon" />
                <div style={{
                  position: "absolute", inset: 10, borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(0, 242, 254, 0.2), rgba(0, 114, 255, 0.3))",
                  border: "1.5px solid #00f2fe",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 30px rgba(0, 242, 254, 0.4)",
                }}>
                  <Cpu size={32} color="#00f2fe" />
                </div>
              </div>

              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffffff", marginBottom: 8, fontFamily: "Outfit" }}>
                AI Forensics Pipeline Running
              </h2>
              <div style={{ fontSize: "0.85rem", color: "#00f2fe", fontFamily: "JetBrains Mono", marginBottom: 28 }}>
                SESSION: {docFile?.name.toUpperCase()} · EXECUTION
              </div>

              {/* Progress Stage Tracker */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left", marginBottom: 24 }}>
                {STAGES.map((s, idx) => {
                  const isDone = idx < activeStage;
                  const isCurrent = idx === activeStage;
                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 14px", borderRadius: "10px",
                        background: isCurrent ? "rgba(0, 242, 254, 0.1)" : isDone ? "rgba(0, 245, 155, 0.05)" : "rgba(13, 27, 54, 0.3)",
                        border: `1px solid ${isCurrent ? "#00f2fe" : isDone ? "rgba(0, 245, 155, 0.3)" : "rgba(0, 242, 254, 0.06)"}`,
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%",
                        background: isDone ? "#00f59b" : isCurrent ? "#00f2fe" : "rgba(78, 107, 143, 0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.7rem", fontWeight: 800, color: "#030712",
                      }}>
                        {isDone ? <Check size={14} /> : isCurrent ? <Loader2 size={13} className="spinner" /> : idx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.84rem", fontWeight: 700, color: isCurrent ? "#00f2fe" : isDone ? "#ffffff" : "#4e6b8f" }}>
                          {s.title}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#8da4c4" }}>
                          {s.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ fontSize: "0.75rem", color: "#4e6b8f", fontFamily: "JetBrains Mono" }}>
                AIR-GAPPED COMPUTE NODE · VERIFYING INTEGRITY
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
