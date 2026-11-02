import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useLenis } from "lenis/react";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import ErrorBoundary from "@/app/[locale]/error";
import NotFound from "@/app/[locale]/not-found";
import { LenisProvider } from "@/components/providers/lenis-provider";
import getRequestConfig from "@/i18n/request";
import { renderWithIntl } from "./helpers/render";

vi.mock("next-intl/server", () => import("./helpers/next-intl-server"));

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Error boundary page", () => {
  it("logs the error, explains it and retries on request", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("render failed");
    const reset = vi.fn();
    renderWithIntl(<ErrorBoundary error={error} reset={reset} />);

    expect(log).toHaveBeenCalledWith(error);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(en.Error.title);
    expect(screen.getByText(en.Error.description)).toBeTruthy();
    expect(reset).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: en.Error.retry }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("is translated in Hindi", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    renderWithIntl(<ErrorBoundary error={new Error("x")} reset={() => {}} />, { locale: "hi" });
    expect(screen.getByRole("button", { name: hi.Error.retry })).toBeTruthy();
  });
});

describe("Not-found page", () => {
  it.each(["en", "hi"] as const)("links back to the %s homepage", (locale) => {
    const copy = { en, hi }[locale].NotFound;
    renderWithIntl(<NotFound />, { locale });
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(copy.title);
    expect(screen.getByText(copy.description)).toBeTruthy();
    expect(screen.getByRole("link", { name: copy.home }).getAttribute("href")).toBe(`/${locale}`);
  });
});

describe("LenisProvider", () => {
  type Listener = () => void;

  function mockReducedMotion(initial: boolean) {
    const listeners = new Set<Listener>();
    const state = { reduce: initial };
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        get matches() {
          return query === "(prefers-reduced-motion: reduce)" && state.reduce;
        },
        addEventListener: (_: string, listener: Listener) => listeners.add(listener),
        removeEventListener: (_: string, listener: Listener) => listeners.delete(listener),
      })),
    );
    return {
      listeners,
      set(reduce: boolean) {
        state.reduce = reduce;
        listeners.forEach((listener) => listener());
      },
    };
  }

  function LenisProbe() {
    return <p>{useLenis() ? "smooth" : "native"}</p>;
  }

  it("mounts Lenis smooth scrolling by default", async () => {
    mockReducedMotion(false);
    render(
      <LenisProvider>
        <LenisProbe />
      </LenisProvider>,
    );
    expect(await screen.findByText("smooth")).toBeTruthy();
    expect(document.documentElement.classList.contains("lenis")).toBe(true);
  });

  it("keeps native scrolling for users who prefer reduced motion", () => {
    mockReducedMotion(true);
    render(
      <LenisProvider>
        <LenisProbe />
      </LenisProvider>,
    );
    expect(screen.getByText("native")).toBeTruthy();
    expect(document.documentElement.classList.contains("lenis")).toBe(false);
  });

  it("follows a change of the reduced-motion preference and unsubscribes on unmount", async () => {
    const media = mockReducedMotion(false);
    const { unmount } = render(
      <LenisProvider>
        <LenisProbe />
      </LenisProvider>,
    );
    expect(await screen.findByText("smooth")).toBeTruthy();
    expect(document.documentElement.classList.contains("lenis")).toBe(true);
    act(() => media.set(true));
    // Lenis is destroyed, which removes its classes from <html>.
    expect(document.documentElement.classList.contains("lenis")).toBe(false);
    expect(media.listeners.size).toBe(1);
    unmount();
    expect(media.listeners.size).toBe(0);
  });
});

describe("i18n request config", () => {
  // getRequestConfig is mocked to return the factory, so the factory runs directly.
  const resolve = getRequestConfig as unknown as (args: {
    requestLocale: Promise<string | undefined>;
  }) => Promise<{ locale: string; messages: unknown }>;

  it.each(["en", "hi"] as const)("loads the %s catalog for a supported locale", async (locale) => {
    const config = await resolve({ requestLocale: Promise.resolve(locale) });
    expect(config.locale).toBe(locale);
    expect(config.messages).toEqual({ en, hi }[locale]);
  });

  it.each([undefined, "fr", ""])("falls back to English for %j", async (requested) => {
    const config = await resolve({ requestLocale: Promise.resolve(requested) });
    expect(config.locale).toBe("en");
    expect(config.messages).toEqual(en);
  });
});
