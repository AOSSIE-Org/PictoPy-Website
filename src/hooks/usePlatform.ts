"use client";
import { useEffect, useState } from "react";

type Platform = "mac" | "windows" | "linux";

export function usePlatform() {
  const [platform, setPlatform] = useState<Platform | null>("windows");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const ua =
      typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : "";

    const mobile = /android|iphone|ipad|ipod|mobile/i.test(ua);
    setIsMobile(mobile);

    // Mobile devices get no desktop platform: Android UAs also contain
    // "linux" and iPhone/iPad UAs contain "mac", so they must not fall
    // through to the desktop checks below.
    let detectedPlatform: Platform | null = null;
    if (mobile) detectedPlatform = null;
    else if (!ua) detectedPlatform = "windows";
    else if (ua.includes("mac")) detectedPlatform = "mac";
    else if (ua.includes("win")) detectedPlatform = "windows";
    else if (ua.includes("linux")) detectedPlatform = "linux";
    else detectedPlatform = "linux";

    setPlatform(detectedPlatform);
    setMounted(true);
  }, []);

  return { platform, isMobile, mounted };
}

