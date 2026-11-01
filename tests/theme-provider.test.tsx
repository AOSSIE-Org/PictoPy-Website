import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import fc from "fast-check";
import { useContext } from "react";
import { ThemeContext, ThemeOptions, ThemeProvider } from "@/context/theme-provider";

function ThemeProbe() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button type="button" onClick={toggleTheme}>
      {theme === ThemeOptions.Dark ? "dark" : "light"}
    </button>
  );
}

function mockSystemDark(dark: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({ matches: dark && query === "(prefers-color-scheme: dark)" })),
  );
}

const renderProvider = () =>
  render(
    <ThemeProvider>
      <ThemeProbe />
    </ThemeProvider>,
  );

const isDarkDocument = () => document.documentElement.classList.contains("dark");

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ThemeProvider", () => {
  it("defaults to the light theme outside a provider", () => {
    render(<ThemeProbe />);
    expect(screen.getByRole("button").textContent).toBe("light");
    expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
  });

  it.each([
    { stored: "dark", systemDark: false, expected: "dark" },
    { stored: "light", systemDark: true, expected: "light" },
    { stored: null, systemDark: true, expected: "dark" },
    { stored: null, systemDark: false, expected: "light" },
  ])("resolves stored=$stored, system dark=$systemDark to $expected", ({ stored, systemDark, expected }) => {
    if (stored) localStorage.setItem("theme", stored);
    mockSystemDark(systemDark);
    renderProvider();
    expect(screen.getByRole("button").textContent).toBe(expected);
    expect(isDarkDocument()).toBe(expected === "dark");
    expect(localStorage.getItem("theme")).toBe(expected);
  });

  it("toggles the theme, the html class and the stored preference", () => {
    mockSystemDark(false);
    renderProvider();
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button").textContent).toBe("dark");
    expect(isDarkDocument()).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
    fireEvent.click(screen.getByRole("button"));
    expect(isDarkDocument()).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("property: after n toggles the theme is the start theme flipped n times, everywhere at once", () => {
    fc.assert(
      fc.property(fc.constantFrom("dark", "light"), fc.nat({ max: 9 }), (start, toggles) => {
        localStorage.setItem("theme", start);
        const { container, unmount } = renderProvider();
        const button = container.querySelector("button")!;
        try {
          for (let i = 0; i < toggles; i++) act(() => button.click());
          const expectDark = (start === "dark") !== (toggles % 2 === 1);
          expect(button.textContent).toBe(expectDark ? "dark" : "light");
          expect(isDarkDocument()).toBe(expectDark);
          expect(localStorage.getItem("theme")).toBe(expectDark ? "dark" : "light");
        } finally {
          unmount();
        }
      }),
      { numRuns: 30 },
    );
  }, 20_000);
});
