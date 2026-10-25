"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FiMinus, FiPlus } from "react-icons/fi";

const faqKeys = ["q1", "q2", "q3", "q4", "q5"] as const;

export default function Faq() {
  const t = useTranslations("Home.Faq");
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section id="faq" className="mt-40 lg:mt-56 flex w-full flex-col scroll-mt-28">
      {/* Heading */}
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-[#202020] drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)] dark:text-white dark:[text-shadow:0px_4px_4px_rgba(0,0,0,0.15)] md:text-5xl">
          {t("title")}
        </h2>
        <p className="max-w-118 text-[15px] leading-6.5 font-medium text-[#606060] dark:text-text3">
          {t("subtitle")}
        </p>
      </div>

      {/* Accordion */}
      <div className="mt-14 flex w-full flex-col">
        {faqKeys.map((key, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={key}
              className="border-b border-[#00000014] transition-colors duration-300 dark:border-[#FFFFFF14]"
            >
              <button
                type="button"
                className="group flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span className="text-[15px] font-medium text-black transition-colors duration-200 group-hover:text-black/60 dark:text-white dark:group-hover:text-white/70 md:text-base">
                  {t(`${key}.question`)}
                </span>

                <span
                  className={`grid h-6.5 w-6.5 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                    isOpen
                      ? "rotate-180 bg-black text-white dark:bg-white dark:text-black"
                      : "bg-[#0000000f] text-black group-hover:bg-black group-hover:text-white dark:bg-[#ffffff1a] dark:text-white dark:group-hover:bg-white dark:group-hover:text-black"
                  }`}
                  aria-hidden="true"
                >
                  {isOpen ? <FiMinus size={14} /> : <FiPlus size={14} />}
                </span>
              </button>

              {/* Animated answer */}
              <div
                aria-hidden={!isOpen}
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "grid-rows-[1fr] pb-7 opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <p className="max-w-5xl overflow-hidden text-[15px] leading-7 font-medium text-[#515151] dark:text-text3">
                  {t(`${key}.answer`)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
