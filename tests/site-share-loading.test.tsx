/**
 * SiteShareButton's loading paths: the share library is a classic script that
 * may only register a `window.SocialShareButton` global, and it loads
 * asynchronously, so clicks and unmounts can happen before it is ready.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, screen } from "@testing-library/react";
import en from "@/messages/en.json";
import SiteShareButton from "@/components/SiteShareButton";
import { renderWithIntl } from "./helpers/render";

// The bundler exposes no default export, as with the package's plain-script build.
vi.mock("@aossie-org/social-share-button", () => ({ default: undefined }));

const share = { constructed: 0, openModal: vi.fn(), updateOptions: vi.fn(), destroy: vi.fn() };

class GlobalShareButton {
  constructor() {
    share.constructed++;
  }
  openModal = share.openModal;
  updateOptions = share.updateOptions;
  destroy = share.destroy;
}

type ShareWindow = Window & { SocialShareButton?: unknown };

const flushImport = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)));

afterEach(() => {
  delete (window as ShareWindow).SocialShareButton;
  share.constructed = 0;
  vi.clearAllMocks();
});

describe("SiteShareButton loading", () => {
  it("falls back to the global the share script registers", async () => {
    (window as ShareWindow).SocialShareButton = GlobalShareButton;
    renderWithIntl(<SiteShareButton />);
    await flushImport();
    expect(share.constructed).toBe(1);
    fireEvent.click(screen.getByRole("button", { name: en.Share.trigger }));
    expect(share.openModal).toHaveBeenCalledTimes(1);
  });

  it("does nothing when clicked before the dialog has loaded", () => {
    (window as ShareWindow).SocialShareButton = GlobalShareButton;
    renderWithIntl(<SiteShareButton />);
    fireEvent.click(screen.getByRole("button", { name: en.Share.trigger }));
    expect(share.updateOptions).not.toHaveBeenCalled();
    expect(share.openModal).not.toHaveBeenCalled();
  });

  it("never builds the dialog when unmounted before the library loads", async () => {
    (window as ShareWindow).SocialShareButton = GlobalShareButton;
    const { unmount } = renderWithIntl(<SiteShareButton />);
    unmount();
    await flushImport();
    expect(share.constructed).toBe(0);
  });

  it("keeps the button inert when the library is unavailable", async () => {
    renderWithIntl(<SiteShareButton className="footer-link" />);
    await flushImport();
    const button = screen.getByRole("button", { name: en.Share.trigger });
    expect(button.className).toBe("footer-link");
    expect(button.getAttribute("title")).toBe(en.Share.trigger);
    expect(() => fireEvent.click(button)).not.toThrow();
    expect(share.constructed).toBe(0);
  });
});
