"use client";

import { useTranslations } from "next-intl";
import { FiArrowUpRight } from "react-icons/fi";

export default function Hero() {
  const t = useTranslations("Home.Hero");

  return (
    <section className="flex items-center justify-center gap-5 mt-8 sm:mt-17.5">
      {/* Content */}
      <div className="text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-3 whitespace-nowrap font-medium rounded-[43px] border dark:border-[#9F8B4B] bg-black dark:bg-[#1C1D15] px-2.5 sm:px-3 py-[5.95px] text-xs xs:text-sm dark:shadow-[0px_0px_20px_0px_#F5306B1A]">
          <span className="text-[#ffffff]">
            {t("featureBadge")}
          </span>
          <div className="inline-flex visible">
            <div className="mx-1.5 sm:mx-3 h-4.25 w-px border border-[#434345]" />
            <button
              className="cursor-pointer text-[#E5E5E5] dark:text-text3 hover:text-text3/80 whitespace-nowrap"
              onClick={() => {
                document.getElementById("downloads-section")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              {t("downloadNow")} →
            </button>
          </div>
        </div>

        {/* Powered by AOSSIE */}
        <div className="mt-3 pt-2">
          <a
            href="https://aossie.org/en"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 text-[13px] xs:text-sm font-medium tracking-[0.2px] text-[#606060] dark:text-text3 transition-colors duration-200 hover:text-black dark:hover:text-white"
          >
            <span>
              {t.rich("poweredBy", {
                org: (chunks) => (
                  <span className="font-semibold text-[#3d3d3d] underline decoration-1 underline-offset-4 dark:text-text">
                    {chunks}
                  </span>
                ),
              })}
            </span>
            <FiArrowUpRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>

        {/* Heading */}
        <h1
          className="mt-6 min-[411px]:mt-2 text-4xl xs:text-5xl font-semibold text-[#202020] drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)] dark:text-white dark:[text-shadow:0px_4px_4px_rgba(0,0,0,0.15)] leading-tight tracking-tight md:text-[64px]"
          id="downloads-section"
        >
          {t("heroTitle")}
          <br />
          {t("heroSubtitle")}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-2.5 max-w-2xl text-[16px] font-medium">
          <span className="text-text">{t("heroDescriptionHighlight")}</span>{" "}
          <span className="text-[#606060] dark:text-text2">
            {t("heroDescription")}
          </span>
        </p>
      </div>
    </section>
  );
}
