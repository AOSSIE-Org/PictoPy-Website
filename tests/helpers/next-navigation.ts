/**
 * Stand-in for `next/navigation`, which needs the Next.js app router at runtime.
 * Tests set `navigation.pathname` (the full, locale-prefixed path) and inspect `router`.
 */
import { vi } from "vitest";

export const navigation = {
  pathname: "/en",
  router: {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  },
};

export class NotFoundError extends Error {
  constructor() {
    super("NEXT_NOT_FOUND");
  }
}

export const usePathname = () => navigation.pathname;
export const useRouter = () => navigation.router;
export const useParams = () => ({ locale: navigation.pathname.split("/")[1] });
export const useSearchParams = () => new URLSearchParams();
export const notFound = () => {
  throw new NotFoundError();
};
export const redirect = vi.fn();
export const permanentRedirect = vi.fn();
