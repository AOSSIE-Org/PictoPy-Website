"use client";
import React, { useEffect, useState } from "react";

export enum ThemeOptions {
  Light = 0,
  Dark = 1,
}

interface ThemeContextStructure {
  theme: ThemeOptions;
  toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ThemeContextStructure>({
  theme: ThemeOptions.Light,
  toggleTheme: () => {},
});

/** Delay (ms) before transitions are switched back on after a theme change; one task is enough. */
const TRANSITION_RESTORE_DELAY_MS = 1;

/**
 * Sets or clears the `dark` class with CSS transitions switched off, so colours change instantly. Components that
 * read the page's computed colours right after a theme change (the Support Us widget in "auto" theme) then see the
 * new theme instead of a value from the middle of the 200ms colour fade.
 */
function applyThemeClass(dark: boolean) {
  const noTransitions = document.createElement("style");
  noTransitions.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.appendChild(noTransitions);
  document.documentElement.classList.toggle("dark", dark);
  // Apply the new colours while transitions are off, then restore them
  window.getComputedStyle(document.body).getPropertyValue("background-color");
  setTimeout(() => noTransitions.remove(), TRANSITION_RESTORE_DELAY_MS);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeOptions>(ThemeOptions.Light);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    let resolvedTheme: ThemeOptions;

    if (storedTheme === "dark") {
      resolvedTheme = ThemeOptions.Dark;
    } else if (storedTheme === "light") {
      resolvedTheme = ThemeOptions.Light;
    } else {
      resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? ThemeOptions.Dark
        : ThemeOptions.Light;
    }

    const setThemeForState = (theme: ThemeOptions) => {
      setTheme(theme);
    };

    setThemeForState(resolvedTheme);
  }, []);

  useEffect(() => {
    const dark = theme === ThemeOptions.Dark;
    applyThemeClass(dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === ThemeOptions.Dark ? ThemeOptions.Light : ThemeOptions.Dark,
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
