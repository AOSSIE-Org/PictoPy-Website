"use client";
import { FaDiscord, FaGithub, FaYoutube } from "react-icons/fa";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

// Data to display in SocialMediaCTA section
const cards = [
  {
    icon: <FaDiscord className="text-[#5865F2]" />,
    title: "discord.name",
    count: "discord.memberCount",
    label: "discord.memberLabel",
    description: "discord.description",
    action: "discord.button",
    link: "https://discord.com/channels/1022871757289422898/1311271974630330388",
  },
  {
    icon: <FaGithub className="dark:text-white" />,
    title: "github.name",
    count: "github.followerCount",
    label: "github.followerLabel",
    description: "github.description",
    action: "github.button",
    link: "https://github.com/AOSSIE-Org/PictoPy",
  },
  {
    icon: <FaYoutube className="text-[#FF0000]" />,
    title: "youtube.name",
    count: "youtube.subscriberCount",
    label: "youtube.subscriberLabel",
    description: "youtube.description",
    action: "youtube.button",
    link: "https://www.youtube.com/@AOSSIE-Org",
  },
];

export default function SocialMediaCTA() {
  const t = useTranslations("Home.SocialMediaCTA");

  return (
    <section
      id="community"
      className="mt-40 lg:mt-52 flex flex-col gap-14 w-full scroll-mt-28"
    >
      <h2 className="place-self-center max-w-136 text-center tracking-[0.2px] font-medium text-[18px] md:text-[20px] text-[#606060] dark:text-text2">
        <span className="text-black dark:text-white">{t("heading")} </span>
        &nbsp;
        {t("description")}
      </h2>

      {/* Social Media CTA section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <a
            key={card.title}
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-40 md:min-h-42.5 cursor-pointer flex-col gap-4.5 rounded-xl border border-[#00000029] bg-[linear-gradient(112.57deg,rgba(17,18,20,0.075)_4.87%,rgba(12,13,15,0.09)_75.88%)] shadow-[inset_0px_1px_1px_1px_rgba(255,255,255,0.15)] dark:border-white/6 dark:bg-[linear-gradient(112.57deg,rgba(17,18,20,0.75)_4.87%,rgba(12,13,15,0.9)_75.88%)] dark:shadow-[inset_0px_1px_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-[10px] px-6 py-6.5 transition-all duration-300 leading-[22.4px] hover:-translate-y-1 hover:border-black/25 hover:shadow-[0_12px_36px_rgba(0,0,0,0.12)] dark:hover:border-white/15 dark:hover:shadow-[0_12px_36px_rgba(0,0,0,0.55)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-[28px] transition-transform duration-300 group-hover:scale-110">{card.icon}</div>

                <h3 className="text-[20px] font-medium leading-none dark:text-white text-black">
                  {t(card.title)}
                </h3>
              </div>

              <div className="text-right dark:[text-shadow:0px_0px_4px_rgba(0,0,0,0.25)]">
                <span className="font-mono text-sm font-medium text-[#515151] dark:text-text3 tracking-[0.3px]">
                  {t(card.count)}
                </span>{" "}
                <span className="font-mono text-sm font-medium text-[#515151] dark:text-text3 tracking-[0.3px]">
                  {t(card.label)}
                </span>
              </div>
            </div>

            <p className="max-w-83 text-[14px] leading-[22.4px] tracking-normal font-medium text-[#515151] dark:text-text3 dark:[text-shadow:0px_0px_4px_rgba(0,0,0,0.25)]">
              {t(card.description)}
            </p>

            <span className="inline-flex w-fit items-center gap-2 text-[14px] font-medium text-black dark:text-white transition-all duration-300 group-hover:gap-3">
              {t(card.action)}
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
