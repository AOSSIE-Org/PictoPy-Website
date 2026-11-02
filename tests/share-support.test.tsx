import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { createElement } from "react";
import { ThemeContext, ThemeOptions } from "@/context/theme-provider";
import { GITHUB_SPONSORS_URL } from "@/config/links";
import { SUPPORT_LOGOS, SUPPORTERS } from "@/config/support";

const share = vi.hoisted(() => ({
  constructed: [] as Record<string, unknown>[],
  updateOptions: vi.fn(),
  openModal: vi.fn(),
  destroy: vi.fn(),
}));

vi.mock("@aossie-org/social-share-button", () => ({
  default: class {
    constructor(options: Record<string, unknown>) {
      share.constructed.push(options);
    }
    updateOptions = share.updateOptions;
    openModal = share.openModal;
    destroy = share.destroy;
  },
}));

// Return the key so assertions don't depend on copy
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

import SiteShareButton from "@/components/SiteShareButton";
import SupportUs from "@/components/SupportUs";

const withTheme = (theme: ThemeOptions) =>
  createElement(ThemeContext.Provider, { value: { theme, toggleTheme: () => {} } }, createElement(SiteShareButton));

beforeEach(() => {
  share.constructed.length = 0;
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("SiteShareButton", () => {
  it("builds a hidden-button share dialog with translated labels and the site theme", async () => {
    render(withTheme(ThemeOptions.Dark));
    await waitFor(() => expect(share.constructed).toHaveLength(1));
    expect(share.constructed[0]).toMatchObject({
      showButton: false,
      theme: "dark",
      platforms: ["whatsapp", "twitter", "linkedin", "telegram", "email"],
      labels: { share: "share", close: "close", copy: "copy", copied: "copied", copyFailed: "copyFailed", urlLabel: "urlLabel" },
    });
    expect(share.constructed[0].container).toBeInstanceOf(HTMLSpanElement);
  });

  it("shares the current page when the trigger is clicked", async () => {
    document.title = "PictoPy";
    render(withTheme(ThemeOptions.Light));
    await waitFor(() => expect(share.constructed).toHaveLength(1));
    fireEvent.click(screen.getByRole("button", { name: "trigger" }));
    expect(share.updateOptions).toHaveBeenCalledWith({ url: window.location.href, title: "PictoPy" });
    expect(share.openModal).toHaveBeenCalledTimes(1);
  });

  it("rebuilds the dialog when the theme changes and cleans up on unmount", async () => {
    const { rerender, unmount } = render(withTheme(ThemeOptions.Light));
    await waitFor(() => expect(share.constructed).toHaveLength(1));
    rerender(withTheme(ThemeOptions.Dark));
    await waitFor(() => expect(share.constructed).toHaveLength(2));
    expect(share.constructed[1]).toMatchObject({ theme: "dark" });
    expect(share.destroy).toHaveBeenCalledTimes(1);
    unmount();
    expect(share.destroy).toHaveBeenCalledTimes(2);
  });
});

describe("SupportUs", () => {
  it("passes props the widget accepts without validation warnings", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(createElement(SupportUs));
    expect(warn.mock.calls.filter(([message]) => String(message).includes("[SupportUsButton]"))).toEqual([]);
  });

  it("shows the translated heading, both logos and the GitHub Sponsors call to action", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    render(createElement(SupportUs));
    expect(screen.getByRole("heading", { level: 1, name: "metaTitle" })).toBeTruthy();
    const logos = Array.from(document.querySelectorAll("img")).map((img) => img.getAttribute("src"));
    expect(logos).toEqual(expect.arrayContaining(Object.values(SUPPORT_LOGOS)));
    fireEvent.click(screen.getByRole("button", { name: "GitHub Sponsors" }));
    expect(open).toHaveBeenCalledWith(GITHUB_SPONSORS_URL, "_blank", "noopener,noreferrer");
  });

  it("lists Google Summer of Code and Stability Nexus as supporters, linking to their sites", () => {
    render(createElement(SupportUs));
    for (const { name, link } of SUPPORTERS) {
      const anchor = screen.getByText(name).closest("a");
      expect(anchor?.getAttribute("href")).toBe(link);
    }
    expect(SUPPORTERS.map((s) => s.name)).toEqual(["Google Summer of Code", "Stability Nexus"]);
  });
});
