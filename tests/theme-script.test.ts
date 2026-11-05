import { describe, it, expect, afterEach, vi } from "vitest";
import { DEFAULT_THEME, THEME_STORAGE_KEY, themeInitScript } from "@/context/theme-script";

const root = document.documentElement;

function run({ stored, systemDark = false }: { stored?: string; systemDark?: boolean }) {
  if (stored !== undefined) localStorage.setItem(THEME_STORAGE_KEY, stored);
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: query === "(prefers-color-scheme: dark)" && systemDark }));
  new Function(themeInitScript)();
}

afterEach(() => {
  localStorage.clear();
  root.className = "";
  root.removeAttribute("style");
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("theme head script", () => {
  it("shares its storage key and default with ThemeProvider", () => {
    expect(THEME_STORAGE_KEY).toBe("theme");
    expect(DEFAULT_THEME).toBe("system");
  });

  it.each(["dark", "light"] as const)("applies a saved %s theme and its colour scheme", (theme) => {
    root.className = "font-var dark";
    run({ stored: theme, systemDark: theme === "light" });
    expect(root.classList.contains("dark")).toBe(theme === "dark");
    expect(root.classList.contains("font-var")).toBe(true);
    expect(root.style.colorScheme).toBe(theme);
  });

  it.each([
    [true, "dark"],
    [false, "light"],
  ] as const)("follows the system (prefers dark: %s) when nothing else is saved", (systemDark, expected) => {
    for (const stored of [undefined, "system", "sepia"]) {
      localStorage.clear();
      root.className = "";
      run({ stored, systemDark });
      expect(root.classList.contains("dark")).toBe(expected === "dark");
      expect(root.style.colorScheme).toBe(expected);
    }
  });

  it("falls back to the system theme when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => run({ systemDark: true })).not.toThrow();
    expect(root.classList.contains("dark")).toBe(true);
    expect(root.style.colorScheme).toBe("dark");
  });
});
