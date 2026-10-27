export type Platform = "mac" | "windows" | "linux";

const MOBILE_USER_AGENT = /android|iphone|ipad|ipod|mobile/i;

// Used when the user agent is unavailable (e.g. during prerendering)
export const DEFAULT_PLATFORM: Platform = "windows";

export function isMobileUserAgent(userAgent: string): boolean {
  return MOBILE_USER_AGENT.test(userAgent);
}

/**
 * Maps a user agent to the desktop build to offer. Mobile devices get no
 * desktop platform: Android UAs also contain "linux" and iPhone/iPad UAs
 * contain "mac", so they must not fall through to the desktop checks.
 */
export function detectPlatform(userAgent: string): Platform | null {
  const ua = userAgent.toLowerCase();
  if (isMobileUserAgent(ua)) return null;
  if (!ua) return DEFAULT_PLATFORM;
  if (ua.includes("mac")) return "mac";
  if (ua.includes("win")) return "windows";
  return "linux";
}
