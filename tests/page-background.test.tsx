import { describe, expect, it } from "vitest";
import PageBackground from "@/components/PageBackground";
import { renderWithIntl } from "./helpers/render";

describe("PageBackground", () => {
  it.each(["", "/unknown"])("shows the shuffling photo grid on %s", (path) => {
    const { container } = renderWithIntl(<PageBackground />, { path });
    expect(container.children).toHaveLength(2);
  });

  it.each(["/privacy", "/terms", "/support"])("keeps %s on a plain background", (path) => {
    const { container } = renderWithIntl(<PageBackground />, { locale: "hi", path });
    expect(container.childElementCount).toBe(0);
  });
});
