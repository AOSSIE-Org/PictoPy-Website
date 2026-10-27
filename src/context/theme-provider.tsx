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
    const root = document.documentElement;

    if (theme === ThemeOptions.Dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
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
