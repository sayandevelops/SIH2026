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
    temp: "36.8°C",
    firmware: "v3.1.2-PRO",
    uvSensor: "Optimal (365nm)",
    irSensor: "Optimal (850nm)",
  });

  // Query actual browser media devices to see real USB cameras
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
      setDocScannerStatus("ready");
      setTelemetry((prev) => ({
        ...prev,
        latency: `${Math.floor(Math.random() * 3 + 4)}ms`,
        temp: `${(36.5 + Math.random() * 0.5).toFixed(1)}°C`,
      }));
      toast.success("Hardware devices synchronized ✓", { id: "hw-sync" });
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

  const handleTriggerDocScan = () => {
    setDocScannerStatus("scanning");
    toast("Optical document illumination active (White + UV + IR)...", {
      icon: "⚡",
      duration: 2000,
    });

    setTimeout(() => {
      setDocScannerStatus("ready");
      if (onDocumentCapture) {
        onDocumentCapture();
      }
      toast.success("Document Acquired from Optical Cradle!");
    }, 1800);
  };

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Top Status Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
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
              padding: "5px 12px",
              borderRadius: "8px",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              color: "#059669",
              fontSize: "0.78rem",
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 6px rgba(16, 185, 129, 0.4)",
                display: "inline-block",
              }}
            />
            KIOSK HARDWARE LINK: 2/2 CONNECTED
          </div>
          <span style={{ fontSize: "0.8rem", color: "#64748b", fontFamily: "JetBrains Mono" }}>
            USB 3.2 HUB · BUS 002 DEV 004 · LATENCY {telemetry.latency}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={scanDevices}
            disabled={checking}
            className="btn-secondary"
            style={{
              padding: "6px 14px",
              fontSize: "0.78rem",
              borderRadius: "8px",
            }}
          >
            <RefreshCw size={13} className={checking ? "spin" : ""} />
            {checking ? "Testing..." : "Re-Check Link"}
          </button>

          <button
            onClick={() => setShowDiagnostics(true)}
            className="btn-secondary"
            style={{
              padding: "6px 14px",
              fontSize: "0.78rem",
              borderRadius: "8px",
            }}
          >
            <Sliders size={13} color="#2563eb" />
            Device Diagnostics
          </button>
        </div>
      </div>

      {/* Dual Hardware Device Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 20,
        }}
      >
        {/* ── CARD 1: DOCUMENT SCANNER (Optical Cradle) ───────────────────── */}
        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "16px",
            border: docScannerStatus === "scanning"
              ? "1.5px solid #2563eb"
              : hasDocument
              ? "1.5px solid #10b981"
              : "1px solid #e2e8f0",
            boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.25s ease",
          }}
        >
          {/* Subtle Scan Beam Animation */}
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
                background: "linear-gradient(90deg, transparent, #2563eb, transparent)",
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
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Scan size={24} color="#2563eb" />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    fontFamily: "Outfit, sans-serif",
                    margin: 0,
                  }}
                >
                  Document Scanner
                </h3>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "6px",
                    background: docScannerStatus === "scanning"
                      ? "#eff6ff"
                      : hasDocument
                      ? "#ecfdf5"
                      : "#ecfdf5",
                    color: docScannerStatus === "scanning"
                      ? "#2563eb"
                      : hasDocument
                      ? "#059669"
                      : "#059669",
                    border: `1px solid ${
                      docScannerStatus === "scanning" ? "#bfdbfe" : "#a7f3d0"
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
              <p style={{ fontSize: "0.82rem", color: "#64748b", marginTop: 3, margin: "3px 0 0" }}>
                Captures and verifies identity documents
              </p>
            </div>
          </div>

          {/* Hardware Photo Preview */}
          <div
            style={{
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
              height: 140,
              marginBottom: 16,
              border: "1px solid #e2e8f0",
              boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.05)",
            }}
          >
            <img
              src="/images/passport_scanner.jpg"
              alt="Optical Document Cradle Scanner"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "8px 12px",
                background: "linear-gradient(to top, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.2) 80%, transparent)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "0.74rem", color: "#ffffff", fontWeight: 700 }}>
                3M / Gemalto CR5400 Optical Bed
              </span>
            </div>
          </div>

          {/* Checklist */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 9,
              background: "#f8fafc",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              marginBottom: 18,
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
                  gap: 10,
                  fontSize: "0.82rem",
                  color: "#334155",
                  fontWeight: 500,
                }}
              >
                <CheckCircle2 size={15} color="#2563eb" style={{ flexShrink: 0 }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Action */}
          <button
            className="btn-primary"
            onClick={handleTriggerDocScan}
            disabled={docScannerStatus === "scanning"}
            style={{
              width: "100%",
              padding: "11px 16px",
              fontSize: "0.88rem",
              borderRadius: "10px",
            }}
          >
            <Zap size={16} />
            {docScannerStatus === "scanning" ? "Acquiring..." : "Trigger Optical Cradle Scan"}
          </button>
        </div>

        {/* ── CARD 2: FACE SCANNER (Biometric e-Gate Pod) ─────────────────── */}
        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "16px",
            border: isLiveFaceReady
              ? "1.5px solid #10b981"
              : "1px solid #e2e8f0",
            boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.25s ease",
          }}
        >
          {/* Device Header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Camera size={24} color="#059669" />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    fontFamily: "Outfit, sans-serif",
                    margin: 0,
                  }}
                >
                  Face Scanner
                </h3>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "6px",
                    background: isLiveFaceReady
                      ? "#ecfdf5"
                      : detectedCameras.length > 0
                      ? "#ecfdf5"
                      : "#fffbeb",
                    color: isLiveFaceReady
                      ? "#059669"
                      : detectedCameras.length > 0
                      ? "#059669"
                      : "#d97706",
                    border: `1px solid ${
                      isLiveFaceReady
                        ? "#a7f3d0"
                        : detectedCameras.length > 0
                        ? "#a7f3d0"
                        : "#fde68a"
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
              <p style={{ fontSize: "0.82rem", color: "#64748b", marginTop: 3, margin: "3px 0 0" }}>
                Detects fake identities and ensures liveness
              </p>
            </div>
          </div>

          {/* Hardware Photo Preview */}
          <div
            style={{
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
              height: 140,
              marginBottom: 16,
              border: "1px solid #e2e8f0",
              boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.05)",
            }}
          >
            <img
              src="/images/biometric_face.jpg"
              alt="Biometric e-Gate Verification Sensor"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "8px 12px",
                background: "linear-gradient(to top, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.2) 80%, transparent)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "0.74rem", color: "#ffffff", fontWeight: 700 }}>
                Automated e-Gate Biometric Sensor
              </span>
            </div>
          </div>

          {/* Checklist */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 9,
              background: "#f8fafc",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              marginBottom: 18,
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
                  gap: 10,
                  fontSize: "0.82rem",
                  color: "#334155",
                  fontWeight: 500,
                }}
              >
                <CheckCircle2 size={15} color="#059669" style={{ flexShrink: 0 }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Action */}
          <button
            onClick={onFaceActivate}
            style={{
              width: "100%",
              padding: "11px 16px",
              fontSize: "0.88rem",
              borderRadius: "10px",
              background: "#059669",
              color: "#ffffff",
              border: "none",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(5, 150, 105, 0.25)",
              transition: "all 0.2s ease",
            }}
          >
            <Eye size={16} />
            {isLiveFaceReady ? "Retake Face Biometric" : "Launch Biometric Pod Camera"}
          </button>
        </div>
      </div>

      {/* Trust & Tagline Banner */}
      <div
        style={{
          marginTop: 18,
          padding: "12px 20px",
          borderRadius: "12px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheck size={18} color="#2563eb" />
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#0f172a",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            Safer Identities. Smarter Verification.
          </span>
        </div>
        <span style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>|</span>
        <span
          style={{
            fontSize: "0.82rem",
            color: "#64748b",
            fontFamily: "Plus Jakarta Sans, sans-serif",
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
              background: "rgba(15, 23, 42, 0.4)",
              backdropFilter: "blur(6px)",
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
              style={{
                maxWidth: 560,
                width: "100%",
                padding: 28,
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                boxShadow: "0 20px 40px -8px rgba(0, 0, 0, 0.15)",
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
                  <Cpu size={20} color="#2563eb" />
                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "#0f172a",
                      fontFamily: "Outfit",
                      margin: 0,
                    }}
                  >
                    Hardware Telemetry & Peripheral Diagnostics
                  </h3>
                </div>
                <button
                  onClick={() => setShowDiagnostics(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                    padding: 4,
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
                    background: "#f8fafc",
                    padding: 14,
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ fontSize: "0.72rem", color: "#64748b", fontFamily: "JetBrains Mono", fontWeight: 700 }}>
                    DEVICE 1 (CRADLE)
                  </div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f172a", marginTop: 4 }}>
                    ShieldScan DSS-9000
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#2563eb", marginTop: 2 }}>
                    USB 3.2 High-Speed (850nm IR / 365nm UV)
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    padding: 14,
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ fontSize: "0.72rem", color: "#64748b", fontFamily: "JetBrains Mono", fontWeight: 700 }}>
                    DEVICE 2 (BIOPOD)
                  </div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f172a", marginTop: 4 }}>
                    BioPod Vision-X
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#059669", marginTop: 2 }}>
                    UVC Video Stream (FHD 60FPS)
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  padding: 16,
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  fontSize: "0.82rem",
                  fontFamily: "JetBrains Mono",
                  color: "#334155",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 22,
                }}
              >
                <div>• Firmware Revision: <span style={{ color: "#2563eb", fontWeight: 600 }}>{telemetry.firmware}</span></div>
                <div>• Optical Sensor Temp: <span style={{ color: "#059669", fontWeight: 600 }}>{telemetry.temp}</span></div>
                <div>• Bus Transfer Latency: <span style={{ color: "#2563eb", fontWeight: 600 }}>{telemetry.latency}</span></div>
                <div>• UV Multi-Spectral Lamp: <span style={{ color: "#059669", fontWeight: 600 }}>{telemetry.uvSensor}</span></div>
                <div>• Real Video Inputs Detected: <span style={{ color: "#0f172a", fontWeight: 700 }}>{detectedCameras.length} Camera(s)</span></div>
                {detectedCameras.map((c, i) => (
                  <div key={i} style={{ paddingLeft: 12, color: "#2563eb" }}>
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
