import Image from "next/image";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { IconType } from "react-icons";
import { FiArrowUpRight } from "react-icons/fi";
import {
  FaDiscord,
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import {
  AOSSIE_GITHUB_URL,
  AOSSIE_PROJECTS_URL,
  AOSSIE_URL,
  DJED_URL,
  REPO_CONTRIBUTING_URL,
  REPO_ISSUES_URL,
  REPO_LATEST_RELEASE_URL,
  RESONATE_REPO_URL,
  SOCIAL_LINKS,
  STABILITY_NEXUS_URL,
  WEBSITE_URL,
} from "@/config/links";
import { LEGAL_PAGES, type LegalPage } from "@/config/legal";
import { SUPPORT_PAGE_PATH } from "@/config/support";
import { Link } from "@/i18n/navigation";
import Download from "./Download";
import FooterWatermark from "./FooterWatermark";
import SiteShareButton from "./SiteShareButton";

/** Bottom-bar link style: the legal links' look plus a visible keyboard focus ring. */
const BOTTOM_BAR_LINK_CLASSES =
  "rounded-sm transition-colors duration-200 hover:text-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

/** The word "AOSSIE" in the made-with credit, with the AOSSIE logo right before it (decorative, as the word follows) and never wrapping apart. */
const aossieLogo = (name: ReactNode) => (
  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
    <Image
      src="/brand/icons/aossie_logo.svg"
      alt=""
      aria-hidden="true"
      width={22}
      height={24}
      className="h-5 w-auto"
    />
    {name}
  </span>
);

type FooterColumn = {
  heading: "product" | "parentOrg" | "contribute" | "projects" | "umbrellaOrgs";
  links: { label: string; href: string }[];
};

const footerColumns: FooterColumn[] = [
  {
    heading: "product",
    links: [
      { label: "software", href: REPO_LATEST_RELEASE_URL },
      { label: "website", href: WEBSITE_URL },
    ],
  },
  {
    heading: "parentOrg",
    links: [
      { label: "aossie", href: AOSSIE_URL },
      { label: "github", href: AOSSIE_GITHUB_URL },
    ],
  },
  {
    heading: "contribute",
    links: [
      { label: "contributingGuide", href: REPO_CONTRIBUTING_URL },
      { label: "goodFirstIssues", href: REPO_ISSUES_URL },
    ],
  },
  {
    heading: "projects",
    links: [
      { label: "resonate", href: RESONATE_REPO_URL },
      { label: "checkOutProjects", href: AOSSIE_PROJECTS_URL },
    ],
  },
  {
    heading: "umbrellaOrgs",
    links: [
      { label: "djedAlliance", href: DJED_URL },
      { label: "stabilityNexus", href: STABILITY_NEXUS_URL },
    ],
  },
];

const socials: { label: string; href: string; icon: IconType }[] = [
  { label: "Discord", href: SOCIAL_LINKS.discord, icon: FaDiscord },
  { label: "GitHub", href: SOCIAL_LINKS.github, icon: FaGithub },
  { label: "YouTube", href: SOCIAL_LINKS.youtube, icon: FaYoutube },
  { label: "X", href: SOCIAL_LINKS.x, icon: FaXTwitter },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, icon: FaLinkedinIn },
];

async function Footer() {
  const t = await getTranslations("Home.Footer");

  return (
    <footer className="mt-40 lg:mt-56">
      {/* Download CTA */}
      <div className="text-center text-[20px] font-medium leading-8 md:text-[24px] md:leading-9">
        <h2 className="font-semibold text-black dark:text-white">
          {t("ctaTitle")}
        </h2>
        <p className="text-[#606060] dark:text-text2">{t("ctaSubtitle")}</p>
      </div>

      <Download />

      {/* Interactive PictoPy watermark */}
      <FooterWatermark />

      {/* Link columns */}
      <nav className="mx-auto mt-14 grid w-full max-w-100 grid-cols-2 gap-x-8 gap-y-10 px-2 sm:w-fit sm:max-w-none sm:grid-cols-3 sm:px-0 lg:grid-cols-5 lg:gap-x-16">
        {footerColumns.map((column) => (
          <div key={column.heading} className="flex flex-col gap-4">
            <h3 className="text-[15px] font-semibold text-black dark:text-white">
              {t(`columns.${column.heading}`)}
            </h3>

            <ul className="flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[14px] font-medium text-[#515151] transition-colors duration-200 hover:text-black dark:text-text3 dark:hover:text-white"
                  >
                    {t(`links.${link.label}`)}
                    <FiArrowUpRight
                      size={12}
                      aria-hidden="true"
                      className="opacity-60"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Socials */}
      <div className="mt-16 flex items-center justify-center gap-7 border-b border-[#00000014] pb-10 dark:border-[#FFFFFF14]">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="text-[#515151] transition-all duration-200 hover:-translate-y-1 hover:text-black dark:text-text3 dark:hover:text-white"
          >
            <social.icon size={20} />
          </a>
        ))}
      </div>

      {/* Bottom bar: from xl it is a three-cell grid whose equal side cells keep the links centred on the viewport */}
      <div className="flex flex-col items-center gap-3 py-8 text-center text-[14px] font-medium text-[#515151] dark:text-text3 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:gap-x-8">
        <span className="xl:justify-self-start">{t("copyright", { year: new Date().getFullYear() })}</span>

        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {(Object.keys(LEGAL_PAGES) as LegalPage[]).map((page) => (
            <li key={page}>
              <Link
                href={LEGAL_PAGES[page].path}
                className="transition-colors duration-200 hover:text-text"
              >
                {t(`legal.${page}`)}
              </Link>
            </li>
          ))}
          <li>
            <Link href={SUPPORT_PAGE_PATH} className={BOTTOM_BAR_LINK_CLASSES}>
              <span aria-hidden="true">♥ </span>
              {t("supportLink")}
            </Link>
          </li>
          <li className="flex items-center">
            <SiteShareButton className={`inline-flex cursor-pointer items-center ${BOTTOM_BAR_LINK_CLASSES}`} />
          </li>
        </ul>

        <span className="flex flex-wrap items-center justify-center gap-1.5 xl:justify-self-end">
          {t.rich("madeWithPrefix", { logo: aossieLogo })}
          <span aria-hidden="true" className="text-[#B8B8B8] dark:text-[#E5E5E5]">
            ♥
          </span>
          {t.rich("madeWithSuffix", { logo: aossieLogo })}
        </span>
      </div>
    </footer>
  );
}

export default Footer;
