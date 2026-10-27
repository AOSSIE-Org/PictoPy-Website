import { afterEach, describe, expect, it, vi } from "vitest";
import { scrollBehavior, scrollToSection, scrollToTop } from "@/lib/scroll";

function mockReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({ matches: reduce && query.includes("reduce") })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

describe("scrollBehavior", () => {
  it("is smooth by default and when matchMedia is unavailable", () => {
    vi.stubGlobal("matchMedia", undefined);
    expect(scrollBehavior()).toBe("smooth");
    mockReducedMotion(false);
    expect(scrollBehavior()).toBe("smooth");
  });

  it("jumps instantly when the user prefers reduced motion", () => {
    mockReducedMotion(true);
    expect(scrollBehavior()).toBe("auto");
  });
});

describe("scrollToSection", () => {
  it("scrolls the target section to the top with the preferred behaviour", () => {
    mockReducedMotion(true);
    const section = document.createElement("section");
    section.id = "faq";
    section.scrollIntoView = vi.fn();
    document.body.append(section);

    scrollToSection("faq");
    expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: "auto", block: "start" });
  });

  it("does nothing when the section is missing", () => {
    mockReducedMotion(false);
    expect(() => scrollToSection("missing")).not.toThrow();
  });
});

describe("scrollToTop", () => {
  it("scrolls the window to the top", () => {
    mockReducedMotion(false);
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    scrollToTop();
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});

describe("with Lenis mounted", () => {
  it("routes section and top scrolls through Lenis instead of the native API", () => {
    const lenis = { scrollTo: vi.fn() };
    const section = document.createElement("section");
    section.id = "community";
    section.scrollIntoView = vi.fn();
    document.body.append(section);
    const nativeScrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    scrollToSection("community", lenis);
    scrollToTop(lenis);
    scrollToSection("missing", lenis);

    expect(lenis.scrollTo).toHaveBeenNthCalledWith(1, section);
    expect(lenis.scrollTo).toHaveBeenNthCalledWith(2, 0);
    expect(lenis.scrollTo).toHaveBeenCalledTimes(2);
    expect(section.scrollIntoView).not.toHaveBeenCalled();
    expect(nativeScrollTo).not.toHaveBeenCalled();
  });
});
