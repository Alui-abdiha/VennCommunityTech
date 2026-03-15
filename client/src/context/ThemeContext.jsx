import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const themes = ["light", "dark-blue", "dark-purple"];

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);
  }, []);

  function applyTheme(newTheme) {
    const root = document.documentElement;

    root.classList.remove("dark-blue", "dark-purple");

    if (newTheme !== "light") {
      root.classList.add(newTheme);
    }

    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
  }

  function setTheme(newTheme) {
    if (!themes.includes(newTheme)) return;
    applyTheme(newTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}