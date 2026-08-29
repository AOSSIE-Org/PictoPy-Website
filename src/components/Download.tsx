"use client";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDownloadLink } from "@/hooks/useDownloadLink";
import { usePlatform } from "@/hooks/usePlatform";
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
    <section className="w-full py-13 transition-colors duration-300  overflow-hidden">
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
  const { link, loading } = useDownloadLink(value.platform);

  return (
    <Button
      disabled={loading}
      onClick={() => {
        if (link) {
          window.open(link, "_blank", "noopener,noreferrer");
        }
      }}
      className="h-9 px-3 rounded-lg flex items-center gap-2 text-sm font-medium transition"
    >
      <value.icon aria-label="Download" />
      {value.label}
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
  const [release, setRelease] = useState<ReleaseData>({
    version: "Loading...",
    date: "Loading...",
  });

  const locale = useLocale();
  useEffect(() => {
    async function getRelease() {
      try {
        const res = await fetch(
          "https://api.github.com/repos/AOSSIE-Org/PictoPy/releases/latest",
        );

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();

        setRelease({
          version: data.tag_name,
          date: new Date(data.published_at).toLocaleDateString(locale, {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        });
      } catch {
        setRelease({
          version: "v1.0.0",
          date: "Sep 7, 2025",
        });
      }
    }

    getRelease();
  }, []);

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
