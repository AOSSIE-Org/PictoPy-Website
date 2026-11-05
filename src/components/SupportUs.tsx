"use client";

import SupportUsButton from "@aossie-org/support-us-button";
import { useTranslations } from "next-intl";
import { AOSSIE_URL, GITHUB_SPONSORS_URL } from "@/config/links";
import { SUPPORT_LOGOS, SUPPORTERS } from "@/config/support";
import "@aossie-org/support-us-button/style.css";

/** Name of the project shown on the support page. */
const PROJECT_NAME = "PictoPy";

/** The AOSSIE support widget; it inherits the page's font and colours. */
export default function SupportUs() {
  const t = useTranslations("Support");
  const tHome = useTranslations("Home");

  return (
    <SupportUsButton
      Theme="auto"
      heading={t("metaTitle")}
      labels={{ madeBy: t("madeBy"), supportedBy: t("supportedBy") }}
      organizationInformation={{
        name: "AOSSIE",
        desc: t("aossieDescription"),
        image: SUPPORT_LOGOS.organization,
        link: AOSSIE_URL,
      }}
      projectInformation={{
        name: PROJECT_NAME,
        description: tHome("metaDescription"),
        image: SUPPORT_LOGOS.project,
      }}
      sponsors={SUPPORTERS}
      ctaSection={{ sponsorLink: [{ name: "GitHub Sponsors", url: GITHUB_SPONSORS_URL }] }}
    />
  );
}
