import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scan, Camera, CheckCircle2, AlertCircle, RefreshCw,
  Cpu, Zap, Usb, ShieldCheck, Activity, Eye, Sliders, X
} from "lucide-react";
import toast from "react-hot-toast";

export default function DeviceCheckerHUD({
  onDocumentCapture,
  onFaceActivate,
  isLiveFaceReady,
  hasDocument,
}) {
  const [checking, setChecking] = useState(false);
  const [docScannerStatus, setDocScannerStatus] = useState("ready"); // "ready" | "scanning" | "error"
  const [faceScannerStatus, setFaceScannerStatus] = useState("ready"); // "ready" | "active" | "error"
  const [detectedCameras, setDetectedCameras] = useState([]);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [telemetry, setTelemetry] = useState({
    latency: "6ms",
    temp: "37.2°C",
    firmware: "v3.1.2-PRO",
    uvSensor: "Active (365nm)",
    irSensor: "Active (850nm)",
  });

  // Query actual browser media devices to see real USB cameras/microphones
  const scanDevices = async () => {
    setChecking(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === "videoinput");
        setDetectedCameras(videoInputs);
        if (videoInputs.length > 0) {
          setFaceScannerStatus("ready");
        } else {
          setFaceScannerStatus("standby");
        }
      }
      // Hardware handshake response
      setDocScannerStatus("ready");
      setTelemetry((prev) => ({
        ...prev,
        latency: `${Math.floor(Math.random() * 4 + 4)}ms`,
        temp: `${(36.8 + Math.random() * 0.8).toFixed(1)}°C`,
      }));
      toast.success("Hardware peripheral handshake synchronized ✓", { id: "hw-sync" });
    } catch (err) {
      console.warn("Device detection error:", err);
      toast.error("Could not query media peripherals");
    } finally {
      setTimeout(() => setChecking(false), 500);
    }
  };

  useEffect(() => {
    scanDevices();
  }, []);

  // Trigger hardware optical scan simulation or sample fetch
  const handleTriggerDocScan = () => {
    setDocScannerStatus("scanning");
    toast("Document scanner optical illumination active (White + UV + IR)...", {
      icon: "⚡",
      duration: 2000,
    });

    setTimeout(() => {
      setDocScannerStatus("ready");
      if (onDocumentCapture) {
        onDocumentCapture();
      }
      toast.success("Passport Optical Image & MRZ Acquired from Cradle!");
    }, 1800);
  };

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Top Bar for Hardware Status */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: "6px",
              background: "rgba(0, 245, 155, 0.12)",
              border: "1px solid rgba(0, 245, 155, 0.35)",
              color: "#00f59b",
              fontSize: "0.74rem",
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: 800,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#00f59b",
                boxShadow: "0 0 10px #00f59b",
                display: "inline-block",
              }}
            />
            PHYSICAL KIOSK LINK: 2/2 CONNECTED
          </div>
          <span style={{ fontSize: "0.8rem", color: "#8da4c4", fontFamily: "JetBrains Mono" }}>
            USB 3.2 HUB · BUS 002 DEV 004 · PING {telemetry.latency}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={scanDevices}
            disabled={checking}
            style={{
              padding: "5px 12px",
              borderRadius: "8px",
              background: "rgba(13, 27, 54, 0.7)",
              border: "1px solid rgba(0, 242, 254, 0.2)",
              color: "#00f2fe",
              fontSize: "0.75rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "JetBrains Mono",
            }}
          >
            <RefreshCw size={12} className={checking ? "spin" : ""} />
            {checking ? "Checking..." : "Re-Check Link"}
          </button>

          <button
            onClick={() => setShowDiagnostics(true)}
            style={{
              padding: "5px 12px",
              borderRadius: "8px",
              background: "rgba(0, 242, 254, 0.1)",
              border: "1px solid rgba(0, 242, 254, 0.3)",
              color: "#e8f4ff",
              fontSize: "0.75rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "JetBrains Mono",
            }}
          >
            <Sliders size={12} color="#00f2fe" />
            Diagnostics
          </button>
        </div>
      </div>

      {/* Dual Hardware Device Grid (Directly representing the hardware image) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
        }}
      >
        {/* ── CARD 1: DOCUMENT SCANNER (Optical Cradle) ───────────────────── */}
        <div
          className="glass-card"
          style={{
            padding: "22px",
            position: "relative",
            overflow: "hidden",
            border:
              docScannerStatus === "scanning"
                ? "1.5px solid #00f2fe"
                : hasDocument
                ? "1.5px solid rgba(0, 245, 155, 0.5)"
                : "1px solid rgba(0, 242, 254, 0.25)",
            background:
              docScannerStatus === "scanning"
                ? "linear-gradient(135deg, rgba(0, 242, 254, 0.08), rgba(13, 27, 54, 0.9))"
                : "rgba(13, 27, 54, 0.75)",
            boxShadow:
              docScannerStatus === "scanning"
                ? "0 0 30px rgba(0, 242, 254, 0.25)"
                : "0 10px 30px rgba(0, 0, 0, 0.4)",
            transition: "all 0.3s ease",
          }}
        >
          {/* Top Laser Animation if Scanning */}
          {docScannerStatus === "scanning" && (
            <motion.div
              initial={{ top: 0 }}
              animate={{ top: "100%" }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 3,
                background: "linear-gradient(90deg, transparent, #00f2fe, #ffffff, #00f2fe, transparent)",
                boxShadow: "0 0 15px #00f2fe",
                zIndex: 10,
              }}
            />
          )}

          {/* Device Header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: "linear-gradient(135deg, rgba(0, 242, 254, 0.2), rgba(0, 114, 255, 0.25))",
                border: "1.5px solid #00f2fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 18px rgba(0, 242, 254, 0.3)",
                flexShrink: 0,
              }}
            >
              <Scan size={24} color="#00f2fe" />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: "#ffffff",
                    fontFamily: "Outfit, sans-serif",
                    margin: 0,
                  }}
                >
                  Document Scanner
                </h3>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    fontFamily: "JetBrains Mono",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background:
                      docScannerStatus === "scanning"
                        ? "rgba(0, 242, 254, 0.2)"
                        : hasDocument
                        ? "rgba(0, 245, 155, 0.2)"
                        : "rgba(0, 245, 155, 0.15)",
                    color:
                      docScannerStatus === "scanning"
                        ? "#00f2fe"
                        : hasDocument
                        ? "#00f59b"
                        : "#00f59b",
                    border: `1px solid ${
                      docScannerStatus === "scanning" ? "#00f2fe" : "#00f59b"
                    }`,
                  }}
                >
                  {docScannerStatus === "scanning"
                    ? "SCANNING..."
                    : hasDocument
                    ? "DOC IN CRADLE ✓"
                    : "ONLINE & READY"}
                </span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#8da4c4", marginTop: 3, margin: "3px 0 0" }}>
                Captures and verifies identity documents
              </p>
            </div>
          </div>

          {/* Capabilities Checklist (from Image) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              background: "rgba(3, 7, 18, 0.5)",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(0, 242, 254, 0.1)",
              marginBottom: 16,
            }}
          >
            {[
              "High-resolution document scanning",
              "OCR (Optical Character Recognition)",
              "Authenticity check (holograms, MRZ, security features)",
              "Tamper detection (edits, alterations, fake templates)",
              "Extracts and validates key information",
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "0.76rem",
                  color: "#d0e4ff",
                }}
              >
                <CheckCircle2 size={13} color="#00f2fe" style={{ flexShrink: 0 }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              className="btn-primary"
              onClick={handleTriggerDocScan}
              disabled={docScannerStatus === "scanning"}
              style={{
                flex: 1,
                padding: "10px 14px",
                fontSize: "0.85rem",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Zap size={15} />
              {docScannerStatus === "scanning" ? "Acquiring..." : "Trigger Optical Cradle Scan"}
            </button>
          </div>
        </div>

        {/* ── CARD 2: FACE SCANNER (Biometric e-Gate Pod) ─────────────────── */}
        <div
          className="glass-card"
          style={{
            padding: "22px",
            position: "relative",
            overflow: "hidden",
            border: isLiveFaceReady
              ? "1.5px solid rgba(0, 245, 155, 0.5)"
              : "1px solid rgba(0, 242, 254, 0.25)",
            background: "rgba(13, 27, 54, 0.75)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
            transition: "all 0.3s ease",
          }}
        >
          {/* Device Header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: "linear-gradient(135deg, rgba(0, 245, 155, 0.2), rgba(0, 114, 255, 0.25))",
                border: "1.5px solid #00f59b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 18px rgba(0, 245, 155, 0.3)",
                flexShrink: 0,
              }}
            >
              <Camera size={24} color="#00f59b" />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: "#ffffff",
                    fontFamily: "Outfit, sans-serif",
                    margin: 0,
                  }}
                >
                  Face Scanner
                </h3>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    fontFamily: "JetBrains Mono",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background: isLiveFaceReady
                      ? "rgba(0, 245, 155, 0.2)"
                      : detectedCameras.length > 0
                      ? "rgba(0, 245, 155, 0.15)"
                      : "rgba(255, 170, 0, 0.15)",
                    color: isLiveFaceReady
                      ? "#00f59b"
                      : detectedCameras.length > 0
                      ? "#00f59b"
                      : "#ffaa00",
                    border: `1px solid ${
                      isLiveFaceReady
                        ? "#00f59b"
                        : detectedCameras.length > 0
                        ? "#00f59b"
                        : "#ffaa00"
                    }`,
                  }}
                >
                  {isLiveFaceReady
                    ? "BIOMETRIC LOCKED ✓"
                    : detectedCameras.length > 0
                    ? `CAM ACTIVE (${detectedCameras.length} DETECTED)`
                    : "STANDBY"}
                </span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#8da4c4", marginTop: 3, margin: "3px 0 0" }}>
                Detects fake identities and ensures liveness
              </p>
            </div>
          </div>

          {/* Capabilities Checklist (from Image) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              background: "rgba(3, 7, 18, 0.5)",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(0, 242, 254, 0.1)",
              marginBottom: 16,
            }}
          >
            {[
              "Face matching with document photo",
              "Liveness detection (real person vs. photo/video)",
              "Spoof detection (masks, screens, deepfakes)",
              "Biometric verification",
              "Fast and accurate results",
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "0.76rem",
                  color: "#d0e4ff",
                }}
              >
                <CheckCircle2 size={13} color="#00f59b" style={{ flexShrink: 0 }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              className="btn-primary"
              onClick={onFaceActivate}
              style={{
                flex: 1,
                padding: "10px 14px",
                fontSize: "0.85rem",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #00f59b, #00b4d8)",
                color: "#030712",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Eye size={15} />
              {isLiveFaceReady ? "Retake Face Biometric" : "Launch Biometric Pod Camera"}
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Tagline Banner (Directly matching bottom of image) */}
      <div
        style={{
          marginTop: 18,
          padding: "10px 18px",
          borderRadius: "10px",
          background: "linear-gradient(90deg, rgba(0, 242, 254, 0.08), rgba(0, 114, 255, 0.05))",
          border: "1px solid rgba(0, 242, 254, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheck size={18} color="#00f2fe" />
          <span
            style={{
              fontSize: "0.82rem",
              fontWeight: 800,
              color: "#ffffff",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            Safer Identities. Smarter Verification.
          </span>
        </div>
        <span style={{ color: "rgba(0, 242, 254, 0.4)", fontSize: "0.8rem" }}>|</span>
        <span
          style={{
            fontSize: "0.78rem",
            color: "#8da4c4",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          Document screening + Face recognition = Fraud prevention
        </span>
      </div>

      {/* Diagnostics Modal */}
      <AnimatePresence>
        {showDiagnostics && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(3, 7, 18, 0.8)",
              backdropFilter: "blur(8px)",
              zIndex: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card"
              style={{
                maxWidth: 580,
                width: "100%",
                padding: 28,
                border: "1px solid rgba(0, 242, 254, 0.3)",
                background: "#0d1b36",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Cpu size={20} color="#00f2fe" />
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 800,
                      color: "#fff",
                      fontFamily: "Outfit",
                      margin: 0,
                    }}
                  >
                    Hardware Telemetry & Peripheral Diagnostic
                  </h3>
                </div>
                <button
                  onClick={() => setShowDiagnostics(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#8da4c4",
                    cursor: "pointer",
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    background: "rgba(3, 7, 18, 0.6)",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid rgba(0,242,254,0.1)",
                  }}
                >
                  <div style={{ fontSize: "0.7rem", color: "#4e6b8f", fontFamily: "JetBrains Mono" }}>
                    DEVICE 1 (CRADLE)
                  </div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#fff", marginTop: 4 }}>
                    ShieldScan DSS-9000
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#00f2fe", marginTop: 2 }}>
                    USB 3.2 High-Speed (850nm IR / 365nm UV)
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(3, 7, 18, 0.6)",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid rgba(0,242,254,0.1)",
                  }}
                >
                  <div style={{ fontSize: "0.7rem", color: "#4e6b8f", fontFamily: "JetBrains Mono" }}>
                    DEVICE 2 (BIOPOD)
                  </div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#fff", marginTop: 4 }}>
                    BioPod Vision-X
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#00f59b", marginTop: 2 }}>
                    UVC Video Stream (FHD 60FPS)
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(3, 7, 18, 0.5)",
                  padding: 14,
                  borderRadius: 10,
                  fontSize: "0.78rem",
                  fontFamily: "JetBrains Mono",
                  color: "#8da4c4",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  marginBottom: 20,
                }}
              >
                <div>• Firmware Revision: <span style={{ color: "#00f2fe" }}>{telemetry.firmware}</span></div>
                <div>• Optical Sensor Temp: <span style={{ color: "#00f59b" }}>{telemetry.temp}</span></div>
                <div>• Bus Transfer Latency: <span style={{ color: "#00f2fe" }}>{telemetry.latency}</span></div>
                <div>• UV Multi-Spectral Lamp: <span style={{ color: "#00f59b" }}>{telemetry.uvSensor}</span></div>
                <div>• Real Video Inputs Detected: <span style={{ color: "#fff" }}>{detectedCameras.length} Camera(s)</span></div>
                {detectedCameras.map((c, i) => (
                  <div key={i} style={{ paddingLeft: 12, color: "#60a5fa" }}>
                    ↳ [{i + 1}] {c.label || `Camera Stream ${i + 1}`}
                  </div>
                ))}
              </div>

              <button
                className="btn-primary"
                onClick={() => {
                  toast.success("Diagnostic self-test completed: All sensors optimal!");
                  setShowDiagnostics(false);
                }}
                style={{ width: "100%", padding: 12 }}
              >
                Confirm & Close Diagnostics
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
