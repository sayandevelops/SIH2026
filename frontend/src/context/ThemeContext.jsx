import React, { createContext, useContext, useState, useEffect } from "react";

export const THEMES = {
  default: {
    id: "default",
    name: "Border Defense HQ",
    shortName: "Border HQ",
    tagline: "Sovereign e-Gate & Immigration",
    badge: "DEFENSE COMMAND",
    accentColor: "#2563eb",
    softBg: "#eff6ff",
    borderColor: "#bfdbfe",
    icon: "Shield",
    description: "Executive high-trust GovTech interface optimized for immigration counters, e-Gates, and sovereign audit centers.",
  },
  traffic: {
    id: "traffic",
    name: "Traffic Police & Highway Patrol",
    shortName: "Traffic Police",
    tagline: "Sunlight Glare & Rapid DL / RC",
    badge: "HIGHWAY INTERCEPT",
    accentColor: "#d97706",
    softBg: "#fffbeb",
    borderColor: "#fde68a",
    icon: "Siren",
    description: "High-contrast solar amber mode engineered for extreme roadside sunlight glare, fast vehicle intercepts, and glove-friendly touch targets.",
  },
  maritime: {
    id: "maritime",
    name: "Maritime & Vessel Boarding",
    shortName: "Ship Checking",
    tagline: "Nautical Bridge & Seafarer CDC",
    badge: "MARITIME CUSTOMS",
    accentColor: "#06b6d4",
    softBg: "#0c1e34",
    borderColor: "#164e63",
    icon: "Anchor",
    description: "Deep-sea nautical midnight palette with bioluminescent cyan telemetry to preserve night vision on dark ship bridges and open-water boarding.",
  },
};

const ThemeContext = createContext({
  theme: "default",
  setTheme: () => {},
  themeMeta: THEMES.default,
  availableThemes: THEMES,
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem("shieldscan_theme");
      return saved && THEMES[saved] ? saved : "default";
    } catch {
      return "default";
    }
  });

  const setTheme = (newTheme) => {
    if (THEMES[newTheme]) {
      setThemeState(newTheme);
      try {
        localStorage.setItem("shieldscan_theme", newTheme);
      } catch (e) {
        console.warn("Failed to persist theme in localStorage", e);
      }
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    themeMeta: THEMES[theme] || THEMES.default,
    availableThemes: THEMES,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
