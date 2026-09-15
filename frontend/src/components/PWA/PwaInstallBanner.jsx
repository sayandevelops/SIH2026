import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Shield, Sparkles, Smartphone, Laptop } from "lucide-react";
import { usePWA } from "../../pwa/PwaContext";

export default function PwaInstallBanner() {
  const { isInstallable, isInstalled, bannerDismissed, promptInstall, dismissBanner } = usePWA();

  // Do not display banner if already installed or if dismissed by the user
  if (!isInstallable || isInstalled || bannerDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 95,
          maxWidth: "420px",
          width: "calc(100% - 48px)",
          background: "rgba(15, 23, 42, 0.94)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "16px",
          border: "1px solid rgba(59, 130, 246, 0.35)",
          boxShadow: "0 20px 45px -10px rgba(15, 23, 42, 0.5), 0 0 25px rgba(37, 99, 235, 0.2)",
          padding: "18px 20px",
          color: "#ffffff",
          fontFamily: "Plus Jakarta Sans, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          {/* Logo Badge */}
          <div
            style={{
              width: "44px",
              height: "44px",
              flexShrink: 0,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
            }}
          >
            <Shield size={24} color="#ffffff" />
          </div>

          {/* Text Content */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#ffffff" }}>
                  Install ShieldScan App
                </h4>
                <Sparkles size={13} color="#60a5fa" />
              </div>

              {/* Close Button */}
              <button
                onClick={dismissBanner}
                aria-label="Dismiss banner"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  transition: "all 0.15s ease",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ margin: "0 0 14px 0", fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.45 }}>
              Install on your device for instant launch, standalone window mode, and offline inspection capabilities.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Install Now CTA */}
              <button
                onClick={promptInstall}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                  padding: "9px 14px",
                  borderRadius: "9px",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#ffffff",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 2px 10px rgba(37, 99, 235, 0.35)",
                  transition: "all 0.2s ease",
                }}
              >
                <Download size={14} />
                <span>Install Application</span>
              </button>

              {/* Dismiss Button */}
              <button
                onClick={dismissBanner}
                style={{
                  padding: "9px 12px",
                  borderRadius: "9px",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#cbd5e1",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                Later
              </button>
            </div>

            {/* Device Compatibility Footnote */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "12px",
                paddingTop: "10px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                fontSize: "0.7rem",
                color: "#64748b",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Laptop size={11} /> Windows / macOS
              </span>
              <span>•</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Smartphone size={11} /> Android / iOS
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
