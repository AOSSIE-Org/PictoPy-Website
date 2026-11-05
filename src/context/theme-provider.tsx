"use client";
import React, { useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "./theme-script";

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
  // Until the saved theme is read on mount, `theme` is only the server-rendered default. Applying it would undo the
  // class the head script (theme-script.ts) already set, flashing the light theme for a frame, and save "light".
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

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
      setResolved(true);
    };

    setThemeForState(resolvedTheme);
  }, []);

  useEffect(() => {
    if (!resolved) return;
    const dark = theme === ThemeOptions.Dark;
    applyThemeClass(dark);
    localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
  }, [theme, resolved]);

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
