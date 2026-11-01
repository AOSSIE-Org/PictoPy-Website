"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Share2 } from "lucide-react";
import type SocialShareButton from "@aossie-org/social-share-button";
import { ThemeContext, ThemeOptions } from "@/context/theme-provider";
import "@aossie-org/social-share-button/src/social-share-button.css";

/** Networks offered in the share dialog, in display order. */
const SHARE_PLATFORMS = ["whatsapp", "twitter", "linkedin", "telegram", "email"];

/** Size of the share icon, matching the 14px bottom-bar text. */
const ICON_SIZE = 16;

/** Loads the share library in the browser only; it reads `window` when evaluated. */
async function loadShareButton(): Promise<typeof SocialShareButton | undefined> {
  const mod = await import("@aossie-org/social-share-button");
  // The package is a classic script: bundlers expose it as the default export, and it also sets a global.
  return mod.default ?? (window as Window & { SocialShareButton?: typeof SocialShareButton }).SocialShareButton;
}

/** Footer icon button that opens the AOSSIE share dialog for the current page. */
export default function SiteShareButton({ className }: { className?: string }) {
  const t = useTranslations("Share");
  const { theme: siteTheme } = useContext(ThemeContext);
  const containerRef = useRef<HTMLSpanElement>(null);
  const instanceRef = useRef<SocialShareButton | null>(null);
  // The button stays disabled until the dialog exists, so an early click is never silently dropped
  const [ready, setReady] = useState(false);

  const theme = siteTheme === ThemeOptions.Dark ? "dark" : "light";
  const share = t("share");
  const close = t("close");
  const copy = t("copy");
  const copied = t("copied");
  const copyFailed = t("copyFailed");
  const urlLabel = t("urlLabel");

  // The dialog's theme is fixed when it is built, so a theme or language change rebuilds it.
  useEffect(() => {
    let cancelled = false;
    let instance: SocialShareButton | null = null;

    loadShareButton().then((ShareButton) => {
      if (cancelled || !ShareButton || !containerRef.current) return;
      instance = new ShareButton({
        container: containerRef.current,
        showButton: false,
        platforms: SHARE_PLATFORMS,
        theme,
        labels: { share, close, copy, copied, copyFailed, urlLabel },
      });
      instanceRef.current = instance;
      setReady(true);
    });

    return () => {
      cancelled = true;
      instance?.destroy();
      instanceRef.current = null;
      setReady(false);
    };
  }, [theme, share, close, copy, copied, copyFailed, urlLabel]);

  const openDialog = () => {
    const instance = instanceRef.current;
    if (!instance) return;
    instance.updateOptions({ url: window.location.href, title: document.title });
    instance.openModal();
  };

  return (
    <>
      <span ref={containerRef} />
      <button
        type="button"
        onClick={openDialog}
        disabled={!ready}
        aria-label={t("trigger")}
        title={t("trigger")}
        className={`${className ?? ""} disabled:cursor-wait disabled:opacity-50`}
      >
        <Share2 size={ICON_SIZE} aria-hidden="true" />
      </button>
    </>
  );
}
