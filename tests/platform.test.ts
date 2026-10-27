import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  DEFAULT_PLATFORM,
  detectPlatform,
  isMobileUserAgent,
} from "@/lib/platform";

const UA = {
  macSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  windowsChrome:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
  linuxFirefox: "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
  android:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36",
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  ipad: "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)",
};

const MOBILE_TOKENS = ["android", "iphone", "ipad", "ipod", "mobile"];

const withoutMobileToken = fc
  .string()
  .filter((s) => !MOBILE_TOKENS.some((t) => s.toLowerCase().includes(t)));

describe("detectPlatform", () => {
  it("maps real desktop browsers to their installer platform", () => {
    expect(detectPlatform(UA.macSafari)).toBe("mac");
    expect(detectPlatform(UA.windowsChrome)).toBe("windows");
    expect(detectPlatform(UA.linuxFirefox)).toBe("linux");
  });

  it("offers no desktop build to phones and tablets even though their UAs mention linux or mac", () => {
    expect(detectPlatform(UA.android)).toBeNull();
    expect(detectPlatform(UA.iphone)).toBeNull();
    expect(detectPlatform(UA.ipad)).toBeNull();
  });

  it("falls back to the default platform when no user agent is available", () => {
    expect(detectPlatform("")).toBe(DEFAULT_PLATFORM);
  });

  it("treats unknown desktop user agents as linux", () => {
    expect(detectPlatform("SomeCustomBrowser/1.0 (FreeBSD)")).toBe("linux");
  });

  it("property: any user agent containing a mobile token never gets a desktop build", () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.constantFrom(...MOBILE_TOKENS),
        fc.string(),
        fc.boolean(),
        (prefix, token, suffix, upper) => {
          const ua = `${prefix}${upper ? token.toUpperCase() : token}${suffix}`;
          expect(isMobileUserAgent(ua)).toBe(true);
          expect(detectPlatform(ua)).toBeNull();
        },
      ),
    );
  });

  it("property: the result is case-insensitive and always a known value", () => {
    fc.assert(
      fc.property(fc.string(), (ua) => {
        expect(detectPlatform(ua.toUpperCase())).toBe(detectPlatform(ua.toLowerCase()));
        expect([null, "mac", "windows", "linux"]).toContain(detectPlatform(ua));
      }),
    );
  });

  it("property: non-mobile user agents mentioning mac are always offered the mac build", () => {
    fc.assert(
      fc.property(withoutMobileToken, withoutMobileToken, (a, b) => {
        expect(detectPlatform(`${a}Mac${b}`)).toBe("mac");
      }),
    );
  });
});
