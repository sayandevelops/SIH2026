import { NavLink, useLocation } from "react-router-dom";
import { Shield, Scan, BookOpen, Code, ArrowRight, ShoppingBag, Lock } from "lucide-react";

const navLinks = [
  { to: "/", label: "Overview", icon: Shield },
  { to: "/scan", label: "AI Detection", icon: Scan },
  { to: "/store", label: "Hardware Store", icon: ShoppingBag },
  { to: "/guide", label: "Guide & Docs", icon: BookOpen },
  { to: "/audit", label: "Ledger", icon: Lock },
  { to: "/developers", label: "API Docs", icon: Code },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: "64px",
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(18px) saturate(180%)",
        WebkitBackdropFilter: "blur(18px) saturate(180%)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          height: "100%",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Logo */}
        <NavLink
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.22)",
            }}
          >
            <Shield size={20} color="#ffffff" strokeWidth={2.4} />
          </div>
          <span
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "1.22rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#0f172a",
            }}
          >
            Shield<span style={{ color: "#2563eb" }}>Scan</span>
          </span>
        </NavLink>

        {/* Center Nav Links - Modern Clean Floating Navigation */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            padding: "4px",
            borderRadius: "12px",
            border: "1px solid transparent",
          }}
        >
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "7px 16px",
                  borderRadius: "8px",
                  fontSize: "0.84rem",
                  fontWeight: isActive ? 600 : 500,
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  textDecoration: "none",
                  color: isActive ? "#2563eb" : "#64748b",
                  background: isActive ? "#ffffff" : "transparent",
                  border: isActive ? "1px solid #e2e8f0" : "1px solid transparent",
                  boxShadow: isActive ? "0 1px 3px rgba(0, 0, 0, 0.06)" : "none",
                  transition: "all 0.18s ease",
                }}
              >
                <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Actions - Clean, Modern & Purposeful */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Subtle Live Status Indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "5px 11px",
              borderRadius: "999px",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              fontSize: "0.74rem",
              fontWeight: 600,
              color: "#059669",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 6px rgba(16, 185, 129, 0.6)",
              }}
            />
            Live Engine
          </div>

          {/* Primary Action Button */}
          <NavLink
            to="/scan"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 18px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#ffffff",
              fontSize: "0.84rem",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
              transition: "all 0.2s ease",
            }}
          >
            <span>Launch Detection</span>
            <ArrowRight size={14} />
          </NavLink>
        </div>
      </div>
    </header>
  );
}
