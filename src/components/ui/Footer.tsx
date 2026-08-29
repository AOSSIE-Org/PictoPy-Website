import { Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { FaDiscord, FaGithub, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import { FiLink } from "react-icons/fi";
import { SiX } from "react-icons/si";

async function Footer() {
  const t = await getTranslations("Home");
  const footerLinks = [
    {
      title: t("footer.product"),
      links: [
        { name: t("footer.software"), link: "#" },
        { name: t("footer.website"), link: "#" },
      ],
    },
    {
      title: t("footer.parentOrg"),
      links: [
        { name: "AOSSIE", link: "#" },
        { name: "GitHub", link: "#" },
      ],
    },
    {
      title: t("footer.contribute"),
      links: [
        { name: t("footer.designTools"), link: "#" },
        { name: t("footer.developerTools"), link: "#" },
      ],
    },
    {
      title: t("footer.projects"),
      links: [
        { name: "Resonate", link: "#" },
        { name: "EduAid", link: "#" },
      ],
    },
    {
      title: t("footer.community"),
      links: [
        { name: t("footer.communityStories"), link: "#" },
        { name: t("footer.ambassadors"), link: "#" },
      ],
    },
  ];
  return (
    <footer className="bg-bg text-text">
      <div className="px-5 pb-0 pt-12 sm:px-8 md:pt-18">
        {/* Links */}
        <div className="grid grid-cols-2 gap-y-8 md:grid-cols-5 md:gap-y-0">
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-10">
              <h2 className="text-[14px] leading-5.5 tracking-[0.2px] font-medium">
                {section.title}
              </h2>

              <ul className="space-y-5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      aria-label={link.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={link.link}
                      className="text-[14px] font-medium text-text3 transition-colors hover:text-text3/70"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social icons */}
        <div className="mt-10 py-4 flex items-center justify-center gap-3 md:mt-35">
          <a
            href="https://discord.com/invite/xnmAPS7zqB"
            aria-label="Discord"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text3 dark:text-[#838383] hover:text-black dark:hover:text-white"
          >
            <FaDiscord size={24} aria-hidden="true" />
          </a>

          <a
            href="https://github.com/AOSSIE-Org"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text3 dark:text-[#838383] hover:text-black dark:hover:text-white"
          >
            <FaGithub size={24} aria-hidden="true" />
          </a>

          <a
            href="https://www.youtube.com/@AOSSIE-Org"
            aria-label="YouTube"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text3 dark:text-[#838383] hover:text-black dark:hover:text-white"
          >
            <FaYoutube size={24} aria-hidden="true" />
          </a>

          <a
            href="https://x.com/aossie_org"
            aria-label="X (formerly Twitter)"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text3 dark:text-[#838383] hover:text-black dark:hover:text-white"
          >
            <SiX size={20} aria-hidden="true" />
          </a>

          <a
            href="https://www.linkedin.com/company/aossie"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-text3 dark:bg-[#838383] text-white dark:text-black hover:bg-black dark:hover:bg-white"
          >
            <FaLinkedinIn size={16} aria-hidden="true" />
          </a>

          <a
            href="mailto:aossie.osst@gmail.com"
            aria-label="Email"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text3 dark:text-[#838383] hover:text-black dark:hover:text-white"
          >
            <Mail size={20} aria-hidden="true"  />
          </a>

          <a
            href="https://aossie.org/en"
            aria-label="AOSSIE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text3 dark:text-[#838383] hover:text-black dark:hover:text-white"
          >
            <FiLink size={20} aria-hidden="true" />
          </a>
        </div>

        {/* Bottom */}
        <div className="mt-2 border-t-2 border-[#E4E4E4] dark:border-[#1B1C1E]">
          <div className="flex flex-col items-center justify-between gap-3 py-4 text-[14px] font-medium leading-5 tracking-[-0.15px] text-text3 md:flex-row">
            <span>© 2026 PictoPy</span>

            <span className="text-[16px] leading-[82%] tracking-normal text-text3">
              {t("footer.madeWith")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
