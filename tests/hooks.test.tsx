import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { FALLBACK_RELEASE } from "@/const/const";
import { usePlatform } from "@/hooks/usePlatform";
import type { Platform } from "@/lib/platform";

const UA_MAC = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)";
const UA_ANDROID = "Mozilla/5.0 (Linux; Android 14; Pixel 8) Mobile";

const setUserAgent = (ua: string) =>
  vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue(ua);

const releaseResponse = (assets: { name: string; browser_download_url: string }[]) =>
  vi.fn(async () => ({ ok: true, json: async () => ({ tag_name: "v9", assets }) }));

// useDownloadLink caches the release at module level, so each test loads a fresh copy
async function loadUseDownloadLink() {
  vi.resetModules();
  return (await import("@/hooks/useDownloadLink")).useDownloadLink;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("usePlatform", () => {
  it("detects a desktop platform after mount", async () => {
    setUserAgent(UA_MAC);
    const { result } = renderHook(() => usePlatform());
    await waitFor(() => expect(result.current.mounted).toBe(true));
    expect(result.current).toEqual({ platform: "mac", isMobile: false, mounted: true });
  });

  it("renders the default platform during prerendering, before the user agent is known", () => {
    let snapshot: ReturnType<typeof usePlatform> | undefined;
    function Probe() {
      snapshot = usePlatform();
      return null;
    }
    renderToString(createElement(Probe));
    expect(snapshot).toEqual({ platform: "windows", isMobile: false, mounted: false });
  });

  it("flags phones as mobile with no desktop platform", async () => {
    setUserAgent(UA_ANDROID);
    const { result } = renderHook(() => usePlatform());
    await waitFor(() => expect(result.current.mounted).toBe(true));
    expect(result.current.isMobile).toBe(true);
    expect(result.current.platform).toBeNull();
  });
});

describe("useDownloadLink", () => {
  it("starts with the pinned fallback link so the button works before the API answers", async () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    const useDownloadLink = await loadUseDownloadLink();
    const { result } = renderHook(() => useDownloadLink("linux"));
    expect(result.current.link).toBe(FALLBACK_RELEASE.downloads.linux);
  });

  it("switches to the latest release asset when the GitHub API responds", async () => {
    const live = "https://github.com/AOSSIE-Org/PictoPy/releases/download/v9/PictoPy_9_x64-setup.exe";
    vi.stubGlobal("fetch", releaseResponse([{ name: "PictoPy_9_x64-setup.exe", browser_download_url: live }]));
    const useDownloadLink = await loadUseDownloadLink();
    const { result } = renderHook(() => useDownloadLink("windows"));
    await waitFor(() => expect(result.current.link).toBe(live));
  });

  it("keeps the fallback when the release has no installer for the platform", async () => {
    const fetchMock = releaseResponse([{ name: "setup.exe", browser_download_url: "https://x/setup.exe" }]);
    vi.stubGlobal("fetch", fetchMock);
    const useDownloadLink = await loadUseDownloadLink();
    const { result } = renderHook(() => useDownloadLink("linux"));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(result.current.link).toBe(FALLBACK_RELEASE.downloads.linux);
  });

  it("keeps the fallback when the API fails, and retries on the next request", async () => {
    const fetchMock = vi.fn(async () => ({ ok: false, json: async () => ({}) }));
    vi.stubGlobal("fetch", fetchMock);
    const useDownloadLink = await loadUseDownloadLink();

    const first = renderHook(() => useDownloadLink("mac"));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(first.result.current.link).toBe(FALLBACK_RELEASE.downloads.mac);

    renderHook(() => useDownloadLink("mac"));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it("serves later requests from the cached release without refetching", async () => {
    const fetchMock = releaseResponse([{ name: "a.deb", browser_download_url: "https://x/a.deb" }]);
    vi.stubGlobal("fetch", fetchMock);
    const useDownloadLink = await loadUseDownloadLink();

    const first = renderHook(() => useDownloadLink("linux"));
    await waitFor(() => expect(first.result.current.link).toBe("https://x/a.deb"));
    const second = renderHook(() => useDownloadLink("linux"));
    await waitFor(() => expect(second.result.current.link).toBe("https://x/a.deb"));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("resets to the new platform's fallback when the platform changes", async () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    const useDownloadLink = await loadUseDownloadLink();
    const { result, rerender } = renderHook(({ platform }: { platform: Platform }) => useDownloadLink(platform), {
      initialProps: { platform: "mac" },
    });
    rerender({ platform: "windows" });
    expect(result.current.link).toBe(FALLBACK_RELEASE.downloads.windows);
  });
});
