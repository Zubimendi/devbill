"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
  themeColor: string;
  setThemeColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeColor, setThemeColor] = useState("#4648d4");

  useEffect(() => {
    // Fetch initial settings to get the saved theme color
    const fetchTheme = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.themeColor) {
            setThemeColor(data.themeColor);
          }
        }
      } catch (error) {
        console.error("Failed to fetch theme settings:", error);
      }
    };

    fetchTheme();
  }, []);

  useEffect(() => {
    // Apply the theme color to the document root
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--primary-accent", themeColor);
    }
  }, [themeColor]);

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
