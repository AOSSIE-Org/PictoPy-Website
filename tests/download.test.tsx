import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import Download from "@/components/Download";
import { FALLBACK_RELEASE, GITHUB_RELEASE_API } from "@/const/const";
import { renderWithIntl } from "./helpers/render";

const UA_DESKTOP = "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0";
const UA_PHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) Mobile/15E148";

const LIVE_RELEASE = {
  tag_name: "v2.0.0",
  published_at: "2027-01-05T10:00:00Z",
  assets: [
    { name: "PictoPy_2.0.0_x64-setup.exe", browser_download_url: "https://x/PictoPy_2.0.0_x64-setup.exe" },
    { name: "PictoPy_2.0.0.dmg", browser_download_url: "https://x/PictoPy_2.0.0.dmg" },
  ],
};

const respond = (body: unknown, ok = true) => vi.fn(async () => ({ ok, json: async () => body }));

beforeEach(() => {
  vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue(UA_DESKTOP);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// The download links share useDownloadLink's page-lifetime cache, so the failing API runs first.
describe("Download section", () => {
  it("shows a pinned installer for every desktop platform and the pinned release when the API fails", async () => {
    const fetchMock = respond({}, false);
    vi.stubGlobal("fetch", fetchMock);
    renderWithIntl(<Download />);

    const links = screen.getAllByRole("link");
    expect(links.map((a) => a.textContent)).toEqual([
      en.Home.Download.downloadMac,
      en.Home.Download.downloadWindows,
      en.Home.Download.downloadLinux,
    ]);
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      FALLBACK_RELEASE.downloads.mac,
      FALLBACK_RELEASE.downloads.windows,
      FALLBACK_RELEASE.downloads.linux,
    ]);
    expect(links.every((a) => a.hasAttribute("download"))).toBe(true);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(GITHUB_RELEASE_API));
    expect(screen.getByText(FALLBACK_RELEASE.version)).toBeTruthy();
    expect(screen.getByText(`${en.Home.Download.latest}: Jul 16, 2026`)).toBeTruthy();
    expect(screen.getByText(en.Home.Download.multiOsSupport)).toBeTruthy();
    expect(screen.getByText(en.Home.Download.freeForever)).toBeTruthy();
  });

  it("keeps the pinned release when the request itself throws", async () => {
    const fetchMock = vi.fn(async () => {
      throw new TypeError("offline");
    });
    vi.stubGlobal("fetch", fetchMock);
    renderWithIntl(<Download />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.getByText(FALLBACK_RELEASE.version)).toBeTruthy();
  });

  it("shows the live version, date and installers once the GitHub API answers", async () => {
    vi.stubGlobal("fetch", respond(LIVE_RELEASE));
    renderWithIntl(<Download />);
    await waitFor(() => expect(screen.getByText("v2.0.0")).toBeTruthy());
    expect(screen.getByText(`${en.Home.Download.latest}: Jan 5, 2027`)).toBeTruthy();
    await waitFor(() =>
      expect(screen.getByRole("link", { name: en.Home.Download.downloadMac }).getAttribute("href")).toBe(
        "https://x/PictoPy_2.0.0.dmg",
      ),
    );
    // No Linux asset in the live release, so the pinned one stays.
    expect(screen.getByRole("link", { name: en.Home.Download.downloadLinux }).getAttribute("href")).toBe(
      FALLBACK_RELEASE.downloads.linux,
    );
  });

  it("formats the release date for the Hindi site and translates the labels", async () => {
    vi.stubGlobal("fetch", respond({}, false));
    renderWithIntl(<Download />, { locale: "hi" });
    const hindiDate = new Date(FALLBACK_RELEASE.publishedAt).toLocaleDateString("hi", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    expect(hindiDate).not.toBe("Jul 16, 2026");
    expect(screen.getByText(`${hi.Home.Download.latest}: ${hindiDate}`)).toBeTruthy();
    expect(screen.getByRole("link", { name: hi.Home.Download.downloadWindows })).toBeTruthy();
    expect(screen.getByText(hi.Home.Download.freeForever)).toBeTruthy();
  });

  it("ignores a release that arrives after the section is gone", async () => {
    let answer: (value: unknown) => void = () => {};
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise((resolve) => (answer = resolve))),
    );
    const error = vi.spyOn(console, "error");
    const { unmount } = renderWithIntl(<Download />);
    unmount();
    answer({ ok: true, json: async () => LIVE_RELEASE });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(error).not.toHaveBeenCalled();
  });

  it("tells phone visitors that PictoPy is a desktop app instead of offering installers", () => {
    vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue(UA_PHONE);
    vi.stubGlobal("fetch", respond({}, false));
    renderWithIntl(<Download />);
    expect(screen.getByText(en.Home.Download.mobileDownload, { exact: false })).toBeTruthy();
    expect(screen.getByText(en.Home.Download.mobileDownloadText, { exact: false })).toBeTruthy();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(screen.queryByText(FALLBACK_RELEASE.version)).toBeNull();
  });
});
