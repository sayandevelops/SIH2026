import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Scan, BookOpen, Code, ArrowRight, ShoppingBag, Lock, Menu, X } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-close menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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
          padding: "0 20px",
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

        {/* Center Nav Links - Desktop Only */}
        <nav
          className="desktop-nav"
          style={{
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            padding: "4px",
            borderRadius: "12px",
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

        {/* Right Actions & Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Primary Action Button - Desktop */}
          <NavLink
            to="/scan"
            className="desktop-action-btn"
            style={{
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

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              background: mobileMenuOpen ? "#eff6ff" : "#ffffff",
              color: mobileMenuOpen ? "#2563eb" : "#0f172a",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer & Backdrop ──────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: "fixed",
                top: "64px",
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(15, 23, 42, 0.4)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                zIndex: 98,
              }}
            />

            {/* Slide-down Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{
                position: "fixed",
                top: "64px",
                left: 0,
                right: 0,
                background: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid #e2e8f0",
                boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.15)",
                zIndex: 99,
                padding: "20px 20px 26px",
                maxHeight: "calc(100vh - 64px)",
                overflowY: "auto",
              }}
            >
              {/* Navigation Links list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "18px" }}>
                {navLinks.map(({ to, label, icon: Icon }) => {
                  const isActive = location.pathname === to;
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "11px 14px",
                        borderRadius: "10px",
                        fontSize: "0.92rem",
                        fontWeight: isActive ? 700 : 500,
                        textDecoration: "none",
                        color: isActive ? "#2563eb" : "#334155",
                        background: isActive ? "#eff6ff" : "transparent",
                        border: isActive ? "1px solid #bfdbfe" : "1px solid transparent",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          background: isActive ? "#2563eb" : "#f1f5f9",
                          color: isActive ? "#ffffff" : "#64748b",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon size={16} />
                      </div>
                      <span>{label}</span>
                    </NavLink>
                  );
                })}
              </div>

              {/* Mobile Drawer Action Button */}
              <NavLink
                to="/scan"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "13px 20px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#ffffff",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
                }}
              >
                <span>Launch AI Detection</span>
                <ArrowRight size={16} />
              </NavLink>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
