import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Siren, Anchor, ChevronDown, Check, Sun, Compass } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const themeIcons = {
  default: Shield,
  traffic: Siren,
  maritime: Anchor,
};

export default function ThemeSelector({ mobile = false }) {
  const { theme, setTheme, themeMeta, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const CurrentIcon = themeIcons[theme] || Shield;

  if (mobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Operational Environment
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
          {Object.values(availableThemes).map((t) => {
            const Icon = themeIcons[t.id] || Shield;
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  padding: "8px 4px",
                  borderRadius: "8px",
                  border: isSelected ? `2px solid ${t.accentColor}` : "1px solid var(--border-subtle)",
                  background: isSelected ? t.softBg : "var(--bg-surface)",
                  color: isSelected ? t.accentColor : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={16} color={t.accentColor} />
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
                  {t.shortName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Pill Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 12px",
          borderRadius: "10px",
          border: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
          color: "var(--text-primary)",
          fontSize: "0.82rem",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = themeMeta.accentColor;
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = "var(--border-subtle)";
        }}
        aria-label="Change Operational Environment Theme"
      >
        <div
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "6px",
            background: themeMeta.softBg,
            border: `1px solid ${themeMeta.borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: themeMeta.accentColor,
          }}
        >
          <CurrentIcon size={13} strokeWidth={2.4} />
        </div>

        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>
          {themeMeta.shortName}
        </span>

        <span
          style={{
            fontSize: "0.64rem",
            fontWeight: 800,
            padding: "2px 6px",
            borderRadius: "4px",
            background: themeMeta.softBg,
            color: themeMeta.accentColor,
            border: `1px solid ${themeMeta.borderColor}`,
            letterSpacing: "0.03em",
          }}
        >
          {theme === "traffic" ? "SOLAR" : theme === "maritime" ? "NIGHT" : "HQ"}
        </span>

        <ChevronDown
          size={13}
          style={{
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 0.2s ease",
            color: "var(--text-muted)",
          }}
        />
      </button>

      {/* Popover Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              width: "290px",
              background: "var(--bg-surface)",
              borderRadius: "14px",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 14px 35px -8px rgba(0, 0, 0, 0.2)",
              padding: "10px",
              zIndex: 1000,
              backdropFilter: "blur(20px)",
            }}
          >
            <div style={{ padding: "4px 8px 8px", borderBottom: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                TACTICAL DEPLOYMENT THEMES
              </div>
              <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                Select operational field environment
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
              {Object.values(availableThemes).map((t) => {
                const Icon = themeIcons[t.id] || Shield;
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setTheme(t.id);
                      setIsOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "9px 10px",
                      borderRadius: "10px",
                      border: isSelected ? `1.5px solid ${t.accentColor}` : "1px solid transparent",
                      background: isSelected ? t.softBg : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = "var(--bg-glass-hover)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: isSelected ? t.accentColor : t.softBg,
                        border: `1px solid ${t.borderColor}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isSelected ? "#ffffff" : t.accentColor,
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    >
                      <Icon size={17} strokeWidth={2.4} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-pure)" }}>
                          {t.name}
                        </span>
                        {isSelected && <Check size={14} color={t.accentColor} strokeWidth={3} />}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "2px", lineHeight: 1.35 }}>
                        {t.tagline}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
