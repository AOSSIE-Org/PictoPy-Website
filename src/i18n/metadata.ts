import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateLocaleMetadata(
  locale: string,
  namespace: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });

  const rawSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://pictopy.aossie.org";
  const siteUrl = rawSiteUrl.replace(/\/$/, "");
  const localeUrl = `${siteUrl}/${locale}`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: localeUrl,
      languages: {
        en: `${siteUrl}/en`,
        hi: `${siteUrl}/hi`,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/brand/icons/pictopy_logo.svg", type: "image/svg+xml" },
      ],
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: localeUrl,

      siteName: "AOSSIE",
      // Social platforms do not render SVG previews, so the share image is a 1200x630 PNG
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: t("metaTitle"),
        },
      ],
      locale: locale === "en" ? "en_US" : "hi_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
      images: [`${siteUrl}/og-image.png`],
    },
  };
}
