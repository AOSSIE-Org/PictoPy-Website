/**
 * Shared test setup: stand-ins for what jsdom or Vitest cannot provide
 * (the Next.js router, image optimiser, font loader, static asset imports
 * and a few browser APIs). Everything else runs for real.
 */
import { createElement, type ImgHTMLAttributes } from "react";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

vi.mock("next/navigation", () => import("./helpers/next-navigation"));

// next/image needs the Next.js image loader; a plain <img> keeps src/alt/size assertions meaningful.
// (The site passes no next/image-only props such as `fill` or `priority`.)
vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }: Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { src: string | { src: string } }) =>
    createElement("img", { src: typeof src === "string" ? src : src.src, alt, ...rest }),
}));

// next/font/google only works inside the Next.js compiler.
vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "font-inter-variable", className: "font-inter" }),
  Noto_Sans_Devanagari: () => ({ variable: "font-devanagari-variable", className: "font-devanagari" }),
}));

// Next.js turns static image imports into { src, width, height }; Vitest returns a bare URL.
vi.mock("@/assets/pictopy_logo.svg", () => ({
  default: { src: "/_next/static/media/pictopy_logo.svg", width: 32, height: 32 },
}));

class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

if (typeof window !== "undefined") {
  window.IntersectionObserver ??= MockObserver as unknown as typeof IntersectionObserver;
  window.ResizeObserver ??= MockObserver as unknown as typeof ResizeObserver;
  // jsdom has no matchMedia; default to "no preference" for every query.
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
  // jsdom logs "not implemented" for scrolling.
  window.scrollTo = (() => {}) as typeof window.scrollTo;
  Element.prototype.scrollIntoView ??= function scrollIntoView() {};
}

afterEach(() => {
  cleanup();
  document.documentElement.className = "";
  localStorage.clear();
});
