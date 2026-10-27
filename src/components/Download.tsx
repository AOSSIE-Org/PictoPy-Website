"use client";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDownloadLink } from "@/hooks/useDownloadLink";
import { usePlatform } from "@/hooks/usePlatform";
import { FALLBACK_RELEASE, GITHUB_RELEASE_API } from "@/const/const";
import { useLocale, useTranslations } from "next-intl";
import type { IconType } from "react-icons";
import { DiWindows } from "react-icons/di";
import { SiLinux, SiApple } from "react-icons/si";

type PlatformConfigItem = {
  icon: IconType;
  label: string;
  platform: "mac" | "windows" | "linux";
};

type DownloadButtonProps = {
  value: PlatformConfigItem;
};

const Download: FC = () => {
  const { isMobile } = usePlatform();
  const t = useTranslations("Home.Download");
  const platformConfig = {
    mac: {
      icon: SiApple,
      label: t("downloadMac"),
      platform: "mac",
    },
    windows: {
      icon: DiWindows,
      label: t("downloadWindows"),
      platform: "windows",
    },
    linux: {
      icon: SiLinux,
      label: t("downloadLinux"),
      platform: "linux",
    },
  } as const;
  const platformArray = Object.values(platformConfig);

  return (
    <section className="w-full py-8 sm:py-13 transition-colors duration-300 overflow-hidden">
      {isMobile ? (
        <p className="font-mono text-center font-normal text-muted-foreground text-xs text-[#1e1e1e] dark:text-[#C1C1C1]">
          {t("mobileDownload")}
          <br />
          {t("mobileDownloadText")}
        </p>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {platformArray.map((value) => (
              <DownloadButton key={value.platform} value={value} />
            ))}
          </div>
          <VersionBar
            latest={t("latest")}
            multiOsSupport={t("multiOsSupport")}
            freeForever={t("freeForever")}
          />
        </>
      )}
    </section>
  );
};

export default Download;

// CTA (Download button)
function DownloadButton({ value }: DownloadButtonProps) {
  const { link } = useDownloadLink(value.platform);

  return (
    <Button
      asChild
      className="h-9 px-3 rounded-lg flex items-center gap-2 text-sm font-medium cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
    >
      <a href={link} download>
        <value.icon />
        {value.label}
      </a>
    </Button>
  );
}

interface ReleaseData {
  version: string;
  date: string;
}

type VersionBarProps = {
  latest: string;
  multiOsSupport: string;
  freeForever: string;
};

// Version below CTA
function VersionBar({ latest, multiOsSupport, freeForever }: VersionBarProps) {
  const locale = useLocale();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // Pinned release info shown immediately; replaced by live data when the
  // GitHub API responds (it is rate-limited for unauthenticated clients).
  const [release, setRelease] = useState<ReleaseData>({
    version: FALLBACK_RELEASE.version,
    date: formatDate(FALLBACK_RELEASE.publishedAt),
  });

  useEffect(() => {
    let cancelled = false;

    async function getRelease() {
      try {
        const res = await fetch(GITHUB_RELEASE_API);

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();

        if (cancelled) return;

        setRelease({
          version: data.tag_name,
          date: formatDate(data.published_at),
        });
      } catch {
        // Keep the pinned fallback release info.
      }
    }

    getRelease();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return (
    <section className="font-mono w-full flex justify-center py-4">
      <div className="flex flex-wrap text-text3 items-center justify-center text-xs">
        <span>{release.version}</span>

        <span className="mx-5 h-2.5 w-px bg-text3" />

        <span>
          {latest}: {release.date}
        </span>

        <span className="mx-5 h-2.5 w-px bg-text3" />

        <span>{multiOsSupport}</span>

        <span className="mx-5 h-2.5 w-px bg-text3" />

        <span>{freeForever}</span>
      </div>
    </section>
  );
}
