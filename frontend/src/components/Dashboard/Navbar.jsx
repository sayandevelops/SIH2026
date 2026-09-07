import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Shield, Scan, BookOpen, Activity, Terminal, Radio, Code, CheckCircle2 } from "lucide-react";

const links = [
  { to: "/",           label: "Overview",   icon: Shield },
  { to: "/scan",       label: "AI Scanner", icon: Scan },
  { to: "/audit",      label: "Ledger",     icon: BookOpen },
  { to: "/developers", label: "API Portal", icon: Code },
];

export default function Navbar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-GB", { hour12: false }) + " IST");
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: "72px",
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid #e2e8f0",
      display: "flex", alignItems: "center",
      padding: "0 28px",
      gap: "24px",
      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
    }}>
      {/* Brand & Emblem */}
      <NavLink to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px", marginRight: "auto" }}>
        <div style={{
          width: 40, height: 40,
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
          position: "relative",
        }}>
          <Shield size={20} color="#ffffff" />
          <div style={{
            position: "absolute", top: -2, right: -2,
            width: 8, height: 8, borderRadius: "50%",
            background: "#10b981",
            border: "1.5px solid #ffffff",
          }} />
        </div>
        <div>
          <div style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "1.15rem",
            fontWeight: 800,
            letterSpacing: "-0.01em",
            color: "#0f172a",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            Shield<span style={{ color: "#2563eb" }}>Scan</span>
            <span style={{
              fontSize: "0.62rem",
              padding: "2px 6px",
              borderRadius: "4px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              color: "#2563eb",
              fontWeight: 700,
            }}>
              v2.0
            </span>
          </div>
          <div style={{
            fontSize: "0.68rem",
            color: "#64748b",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 600,
          }}>
            BORDER CONTROL & ID VERIFICATION
          </div>
        </div>
      </NavLink>

      {/* Nav Links (Clean Segmented Tab Pill) */}
      <div style={{
        display: "flex",
        gap: "4px",
        background: "#f1f5f9",
        padding: "4px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0"
      }}>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to} to={to}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              fontFamily: "Plus Jakarta Sans, sans-serif",
              letterSpacing: "0.01em",
              textDecoration: "none",
              color: isActive ? "#2563eb" : "#64748b",
              background: isActive ? "#ffffff" : "transparent",
              border: isActive ? "1px solid #e2e8f0" : "1px solid transparent",
              boxShadow: isActive ? "0 1px 3px rgba(0, 0, 0, 0.05)" : "none",
              transition: "all 0.2s ease",
            })}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </div>

      {/* Terminal Live Clock & Checkpoint Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "6px 12px",
          borderRadius: "8px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          fontSize: "0.75rem",
          color: "#475569",
          fontFamily: "JetBrains Mono, monospace",
        }}>
          <Radio size={13} color="#2563eb" />
          <span style={{ color: "#2563eb", fontWeight: 700 }}>ALPHA-01</span>
          <span style={{ color: "#cbd5e1" }}>|</span>
          <span>{time || "00:00:00"}</span>
        </div>

        {/* Kiosk Peripherals Status Pill */}
        <NavLink
          to="/scan"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "999px",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            fontSize: "0.74rem",
            fontWeight: 700,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            color: "#059669",
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 6px rgba(16, 185, 129, 0.4)",
            }}
          />
          KIOSK: 2 ONLINE
        </NavLink>

        {/* Live Defense Beacon */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "6px 14px",
          borderRadius: "999px",
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          fontSize: "0.74rem",
          fontWeight: 700,
          fontFamily: "Plus Jakarta Sans, sans-serif",
          color: "#2563eb",
        }}>
          <CheckCircle2 size={13} color="#2563eb" />
          ACTIVE DEFENSE
        </div>
      </div>
    </nav>
  );
}
