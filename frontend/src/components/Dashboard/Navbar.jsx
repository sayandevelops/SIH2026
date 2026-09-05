import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Shield, Scan, BookOpen, Activity, Terminal, Radio, Code } from "lucide-react";

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
      background: "rgba(3, 7, 18, 0.85)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderBottom: "1px solid rgba(0, 242, 254, 0.15)",
      display: "flex", alignItems: "center",
      padding: "0 28px",
      gap: "24px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
    }}>
      {/* Brand & Emblem */}
      <NavLink to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px", marginRight: "auto" }}>
        <div style={{
          width: 42, height: 42,
          background: "linear-gradient(135deg, rgba(0, 242, 254, 0.25), rgba(0, 114, 255, 0.4))",
          border: "1px solid rgba(0, 242, 254, 0.5)",
          borderRadius: "12px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 25px rgba(0, 242, 254, 0.35)",
          position: "relative",
        }}>
          <Shield size={22} color="#00f2fe" />
          <div style={{
            position: "absolute", top: -2, right: -2,
            width: 8, height: 8, borderRadius: "50%",
            background: "#00f59b",
            boxShadow: "0 0 10px #00f59b",
          }} />
        </div>
        <div>
          <div style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "1.15rem",
            fontWeight: 800,
            letterSpacing: "-0.01em",
            color: "#ffffff",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            Shield<span style={{
              background: "linear-gradient(135deg, #00f2fe, #0072ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Scan</span>
            <span style={{
              fontSize: "0.6rem",
              padding: "2px 6px",
              borderRadius: "4px",
              background: "rgba(0, 242, 254, 0.12)",
              border: "1px solid rgba(0, 242, 254, 0.3)",
              color: "#00f2fe",
              fontWeight: 700,
            }}>
              v2.0
            </span>
          </div>
          <div style={{
            fontSize: "0.68rem",
            color: "#4e6b8f",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontFamily: "JetBrains Mono, monospace",
          }}>
            MHA · SSB BORDER INTELLIGENCE
          </div>
        </div>
      </NavLink>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: "8px", background: "rgba(13, 27, 54, 0.4)", padding: "4px", borderRadius: "14px", border: "1px solid rgba(0, 242, 254, 0.1)" }}>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to} to={to}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 20px",
              borderRadius: "10px",
              fontSize: "0.85rem",
              fontWeight: 700,
              fontFamily: "Outfit, sans-serif",
              letterSpacing: "0.02em",
              textDecoration: "none",
              color: isActive ? "#00f2fe" : "#8da4c4",
              background: isActive ? "linear-gradient(135deg, rgba(0, 242, 254, 0.16), rgba(0, 114, 255, 0.1))" : "transparent",
              border: isActive ? "1px solid rgba(0, 242, 254, 0.4)" : "1px solid transparent",
              boxShadow: isActive ? "0 0 20px rgba(0, 242, 254, 0.2)" : "none",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            })}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </div>

      {/* Terminal Live Clock & Checkpoint Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "6px 14px",
          borderRadius: "8px",
          background: "rgba(13, 27, 54, 0.5)",
          border: "1px solid rgba(0, 242, 254, 0.12)",
          fontSize: "0.75rem",
          color: "#8da4c4",
          fontFamily: "JetBrains Mono, monospace",
        }}>
          <Radio size={13} color="#00f2fe" />
          <span style={{ color: "#00f2fe", fontWeight: 700 }}>ALPHA-01</span>
          <span style={{ color: "#2d4263" }}>|</span>
          <span>{time || "00:00:00"}</span>
        </div>

        {/* Live Defense Beacon */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "6px 14px",
          borderRadius: "999px",
          background: "rgba(0, 245, 155, 0.08)",
          border: "1px solid rgba(0, 245, 155, 0.3)",
          fontSize: "0.74rem",
          fontWeight: 800,
          fontFamily: "Outfit, sans-serif",
          color: "#00f59b",
          letterSpacing: "0.06em",
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#00f59b",
            boxShadow: "0 0 10px #00f59b",
          }} className="radar-beacon" />
          AIR-GAP ACTIVE
        </div>
      </div>
    </nav>
  );
}
