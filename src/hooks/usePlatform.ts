"use client";
import { useSyncExternalStore } from "react";
import {
  DEFAULT_PLATFORM,
  detectPlatform,
  isMobileUserAgent,
} from "@/lib/platform";

// The user agent never changes during a session, so there is nothing to subscribe to
const subscribe = () => () => {};
const getUserAgent = () => navigator.userAgent;
// Prerendered HTML has no user agent; React swaps in the client value after hydration
const getServerUserAgent = () => null;

export function usePlatform() {
  const userAgent = useSyncExternalStore(subscribe, getUserAgent, getServerUserAgent);

  if (userAgent === null) {
    return { platform: DEFAULT_PLATFORM, isMobile: false, mounted: false };
  }
  return {
    platform: detectPlatform(userAgent),
    isMobile: isMobileUserAgent(userAgent),
    mounted: true,
  };
}
