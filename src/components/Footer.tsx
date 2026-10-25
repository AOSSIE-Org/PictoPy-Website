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
import Download from "./Download";
import FooterWatermark from "./FooterWatermark";

type FooterColumn = {
  heading: "product" | "parentOrg" | "contribute" | "projects" | "umbrellaOrgs";
  links: { label: string; href: string }[];
};

const footerColumns: FooterColumn[] = [
  {
    heading: "product",
    links: [
      {
        label: "software",
        href: "https://github.com/AOSSIE-Org/PictoPy/releases/latest",
      },
      { label: "website", href: "https://pictopy.aossie.org" },
    ],
  },
  {
    heading: "parentOrg",
    links: [
      { label: "aossie", href: "https://aossie.org" },
      { label: "github", href: "https://github.com/AOSSIE-Org" },
    ],
  },
  {
    heading: "contribute",
    links: [
      {
        label: "contributingGuide",
        href: "https://github.com/AOSSIE-Org/PictoPy/blob/main/CONTRIBUTING.md",
      },
      {
        label: "goodFirstIssues",
        href: "https://github.com/AOSSIE-Org/PictoPy/issues",
      },
    ],
  },
  {
    heading: "projects",
    links: [
      { label: "resonate", href: "https://github.com/AOSSIE-Org/Resonate" },
      { label: "checkOutProjects", href: "https://aossie.org/en/projects" },
    ],
  },
  {
    heading: "umbrellaOrgs",
    links: [
      { label: "djedAlliance", href: "https://djed.one/" },
      { label: "stabilityNexus", href: "https://stability.nexus/" },
    ],
  },
];

const socials: { label: string; href: string; icon: IconType }[] = [
  {
    label: "Discord",
    href: "https://discord.com/channels/1022871757289422898/1311271974630330388",
    icon: FaDiscord,
  },
  {
    label: "GitHub",
    href: "https://github.com/AOSSIE-Org/PictoPy",
    icon: FaGithub,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@AOSSIE-Org",
    icon: FaYoutube,
  },
  { label: "X", href: "https://x.com/aossie_org", icon: FaXTwitter },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/aossie/",
    icon: FaLinkedinIn,
  },
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

      {/* Bottom bar */}
      <div className="flex flex-col items-center justify-between gap-3 py-8 text-[14px] font-medium text-[#515151] dark:text-text3 sm:flex-row">
        <span>{t("copyright", { year: new Date().getFullYear() })}</span>

        <span className="flex items-center gap-1.5">
          {t("madeWithPrefix")}
          <span aria-hidden="true" className="text-[#B8B8B8] dark:text-[#E5E5E5]">
            ♥
          </span>
          {t("madeWithSuffix")}
        </span>
      </div>
    </footer>
  );
}

export default Footer;
