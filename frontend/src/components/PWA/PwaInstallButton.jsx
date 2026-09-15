import { Download, CheckCircle2 } from "lucide-react";
import { usePWA } from "../../pwa/PwaContext";

export default function PwaInstallButton({ mobile = false }) {
  const { isInstallable, isInstalled, promptInstall } = usePWA();

  if (isInstalled) {
    return (
      <div
        title="Running as an installed PWA"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: mobile ? "10px 14px" : "6px 12px",
          borderRadius: "8px",
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          color: "#166534",
          fontSize: mobile ? "0.85rem" : "0.78rem",
          fontWeight: 600,
          fontFamily: "Plus Jakarta Sans, sans-serif",
        }}
      >
        <CheckCircle2 size={mobile ? 16 : 13} color="#16a34a" />
        <span>PWA Installed</span>
      </div>
    );
  }

  // If install prompt is ready or we want to allow users to trigger/learn how to install
  return (
    <button
      onClick={promptInstall}
      title="Install ShieldScan as a desktop or mobile application"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: mobile ? "center" : "flex-start",
        gap: "6px",
        padding: mobile ? "11px 16px" : "7px 14px",
        borderRadius: "9px",
        background: mobile ? "rgba(37, 99, 235, 0.08)" : "#f8fafc",
        border: "1px solid #cbd5e1",
        color: "#1e40af",
        fontSize: mobile ? "0.9rem" : "0.8rem",
        fontWeight: 600,
        fontFamily: "Plus Jakarta Sans, sans-serif",
        cursor: "pointer",
        transition: "all 0.18s ease",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#eff6ff";
        e.currentTarget.style.borderColor = "#93c5fd";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = mobile ? "rgba(37, 99, 235, 0.08)" : "#f8fafc";
        e.currentTarget.style.borderColor = "#cbd5e1";
      }}
    >
      <Download size={mobile ? 16 : 13} strokeWidth={2.2} />
      <span>Install App</span>
    </button>
  );
}
