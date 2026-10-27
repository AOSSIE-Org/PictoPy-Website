"use client";
import { useEffect, useState } from "react";
import { FALLBACK_RELEASE, GITHUB_RELEASE_API } from "@/const/const";
import type { Platform } from "@/lib/platform";
import { findAsset, type GitHubRelease } from "@/lib/release";

export type { Platform };

let releaseCache: GitHubRelease | null = null;
let releasePromise: Promise<GitHubRelease | null> | null = null;

async function getLatestRelease(): Promise<GitHubRelease | null> {
  if (releaseCache) return releaseCache;

  if (!releasePromise) {
    releasePromise = fetch(GITHUB_RELEASE_API)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch latest release");
        releaseCache = (await res.json()) as GitHubRelease;
        return releaseCache;
      })
      .catch(() => {
        releasePromise = null;
        return null;
      });
  }

  return releasePromise;
}

export function useDownloadLink(platform: Platform) {
  // Start with the pinned direct link so the button works immediately;
  // swap in the live latest-release asset if the GitHub API responds.
  const [link, setLink] = useState<string>(
    FALLBACK_RELEASE.downloads[platform],
  );

  // Reset to the pinned link whenever the platform changes so a previous
  // platform's link never lingers while (or if) the live asset resolves.
  const [prevPlatform, setPrevPlatform] = useState(platform);
  if (platform !== prevPlatform) {
    setPrevPlatform(platform);
    setLink(FALLBACK_RELEASE.downloads[platform]);
  }

  useEffect(() => {
    let mounted = true;

    getLatestRelease().then((release) => {
      if (!mounted || !release) return;
      const asset = findAsset(release, platform);
      if (asset) setLink(asset.browser_download_url);
    });

    return () => {
      mounted = false;
    };
  }, [platform]);

  return { link, loading: false };
}
