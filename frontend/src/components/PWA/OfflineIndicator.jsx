import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, AlertTriangle } from "lucide-react";
import { usePWA } from "../../pwa/PwaContext";

export default function OfflineIndicator() {
  const { isOffline } = usePWA();

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            zIndex: 90,
            background: "linear-gradient(90deg, #991b1b, #dc2626, #b91c1c)",
            color: "#ffffff",
            boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "8px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              fontSize: "0.82rem",
              fontWeight: 600,
              fontFamily: "Plus Jakarta Sans, sans-serif",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  background: "rgba(0, 0, 0, 0.2)",
                }}
              >
                <WifiOff size={14} />
              </div>
              <span>
                <strong style={{ letterSpacing: "0.02em" }}>OFFLINE MODE ACTIVE:</strong> Network connection lost. Running on cached local app shell.
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255, 255, 255, 0.18)",
                padding: "3px 10px",
                borderRadius: "999px",
                fontSize: "0.75rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              <AlertTriangle size={12} />
              <span>Kiosk Cache Ready</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
