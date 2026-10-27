// The Lenis instance from useLenis(). Lenis cancels native smooth scrolls, so
// when it is mounted every programmatic scroll has to go through it. It is not
// mounted with reduced motion (see LenisProvider), so the native path applies.
export type SmoothScroller = {
  scrollTo: (target: HTMLElement | number) => void;
};

// Smooth scrolling, or an instant jump when the user prefers reduced motion (WCAG 2.3.3)
export function scrollBehavior(): ScrollBehavior {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

export function scrollToSection(id: string, lenis?: SmoothScroller) {
  const target = document.getElementById(id);
  if (!target) return;
  if (lenis) lenis.scrollTo(target);
  else target.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
}

export function scrollToTop(lenis?: SmoothScroller) {
  if (lenis) lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: scrollBehavior() });
}
