import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import fc from "fast-check";
import ShuffleGrid from "@/components/ShuffleGrid";
import { squareData } from "@/const/const";

/** Image URL of every tile, per grid (desktop grid first, then the small-screen one). */
function tileSources(container: HTMLElement): string[][] {
  return Array.from(container.children).map((grid) =>
    Array.from(grid.children).map((tile) => (tile as HTMLElement).style.backgroundImage.replace(/^url\("?|"?\)$/g, "")),
  );
}

const sources = squareData.map((sq) => sq.src);
const sorted = (list: string[]) => [...list].sort();

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("ShuffleGrid", () => {
  it("renders every Unsplash photo once in each of its two grids", () => {
    const { container } = render(<ShuffleGrid />);
    const grids = tileSources(container);
    expect(grids).toHaveLength(2);
    for (const grid of grids) {
      expect(grid).toHaveLength(squareData.length);
      expect(sorted(grid)).toEqual(sorted(sources));
      expect(grid.every((src) => src.startsWith("https://") && src.includes("unsplash.com"))).toBe(true);
    }
    expect(grids[0]).toEqual(grids[1]);
  });

  it("shuffles on mount and again every three seconds", () => {
    // Always swapping with the first element rotates the list by one.
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { container } = render(<ShuffleGrid />);
    const first = tileSources(container)[0];
    expect(first).not.toEqual(sources);

    act(() => vi.advanceTimersByTime(2999));
    expect(tileSources(container)[0]).toEqual(first);

    vi.spyOn(Math, "random").mockReturnValue(0.999);
    act(() => vi.advanceTimersByTime(1));
    // Always swapping in place keeps the source order.
    expect(tileSources(container)[0]).toEqual(sources);
  });

  it("stops reshuffling once unmounted", () => {
    const { unmount } = render(<ShuffleGrid />);
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    unmount();
    act(() => vi.runOnlyPendingTimers());
    expect(vi.getTimerCount()).toBe(0);
  });

  it("property: for any random sequence every grid is a permutation of the photos", () => {
    fc.assert(
      fc.property(fc.array(fc.double({ min: 0, max: 1, maxExcluded: true, noNaN: true }), { minLength: 1, maxLength: 48 }), (randoms) => {
        let call = 0;
        vi.spyOn(Math, "random").mockImplementation(() => randoms[call++ % randoms.length]);
        const { container, unmount } = render(<ShuffleGrid />);
        try {
          act(() => vi.advanceTimersByTime(3000));
          for (const grid of tileSources(container)) {
            expect(sorted(grid)).toEqual(sorted(sources));
          }
        } finally {
          unmount();
        }
      }),
      { numRuns: 25 },
    );
  }, 20_000);
});
