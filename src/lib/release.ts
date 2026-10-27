import type { Platform } from "./platform";

export interface GitHubAsset {
  name: string;
  browser_download_url: string;
}

export interface GitHubRelease {
  tag_name: string;
  assets: GitHubAsset[];
}

// Installer file suffixes per platform, in order of preference
export const PLATFORM_ASSET_SUFFIXES: Record<Platform, readonly string[]> = {
  mac: [".dmg", ".app.tar.gz"],
  windows: [".exe", ".msi"],
  linux: [".deb", ".AppImage", ".rpm"],
};

export function findAsset(
  release: GitHubRelease,
  platform: Platform,
): GitHubAsset | undefined {
  const suffixes = PLATFORM_ASSET_SUFFIXES[platform];
  return release.assets.find((asset) =>
    suffixes.some((suffix) => asset.name.endsWith(suffix)),
  );
}
