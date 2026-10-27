import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { findAsset, PLATFORM_ASSET_SUFFIXES, type GitHubRelease } from "@/lib/release";
import type { Platform } from "@/lib/platform";

const asset = (name: string) => ({
  name,
  browser_download_url: `https://github.com/AOSSIE-Org/PictoPy/releases/download/v1/${name}`,
});

const release: GitHubRelease = {
  tag_name: "v1.2.0",
  assets: [
    asset("PictoPy_1.2.0_amd64.deb"),
    asset("PictoPy_1.2.0_x64-setup.exe"),
    asset("PictoPy_aarch64.app.tar.gz"),
    asset("latest.json"),
  ],
};

const PLATFORMS: Platform[] = ["mac", "windows", "linux"];

const matchesPlatform = (name: string, platform: Platform) =>
  PLATFORM_ASSET_SUFFIXES[platform].some((suffix) => name.endsWith(suffix));

describe("findAsset", () => {
  it("picks the installer for each platform from a real release layout", () => {
    expect(findAsset(release, "windows")?.name).toBe("PictoPy_1.2.0_x64-setup.exe");
    expect(findAsset(release, "mac")?.name).toBe("PictoPy_aarch64.app.tar.gz");
    expect(findAsset(release, "linux")?.name).toBe("PictoPy_1.2.0_amd64.deb");
  });

  it("returns undefined when a platform has no installer", () => {
    const windowsOnly: GitHubRelease = { tag_name: "v1", assets: [asset("setup.exe")] };
    expect(findAsset(windowsOnly, "mac")).toBeUndefined();
    expect(findAsset(windowsOnly, "linux")).toBeUndefined();
  });

  it("ignores metadata files such as latest.json and signatures", () => {
    const noise: GitHubRelease = {
      tag_name: "v1",
      assets: [asset("latest.json"), asset("PictoPy.exe.sig")],
    };
    expect(findAsset(noise, "windows")).toBeUndefined();
  });

  it("property: an asset is returned exactly when one matches the platform, and it always matches", () => {
    const allSuffixes = Object.values(PLATFORM_ASSET_SUFFIXES).flat();
    const fileName = fc
      .tuple(fc.string(), fc.constantFrom(...allSuffixes, ".zip", ".json", ".sig"))
      .map(([stem, ext]) => stem + ext);

    fc.assert(
      fc.property(fc.array(fileName, { maxLength: 8 }), fc.constantFrom(...PLATFORMS), (names, platform) => {
        const found = findAsset({ tag_name: "v", assets: names.map(asset) }, platform);
        expect(found !== undefined).toBe(names.some((n) => matchesPlatform(n, platform)));
        if (found) expect(matchesPlatform(found.name, platform)).toBe(true);
      }),
    );
  });

  it("property: the first matching asset in release order wins", () => {
    fc.assert(
      fc.property(fc.constantFrom(...PLATFORMS), fc.string(), fc.string(), (platform, a, b) => {
        const [suffix] = PLATFORM_ASSET_SUFFIXES[platform];
        const first = asset(`first-${a}${suffix}`);
        const second = asset(`second-${b}${suffix}`);
        expect(findAsset({ tag_name: "v", assets: [first, second] }, platform)).toBe(first);
      }),
    );
  });
});
