import Image from "next/image";
import { getTranslations } from "next-intl/server";

const featureCards = [
  // "crop" trims only the OS chrome baked into a full-desktop screenshot;
  // the app window itself is shown uncropped.
  { key: "tagging", src: "/brand/assets/3.jpg", crop: "" },
  { key: "memories", src: "/brand/assets/2.jpg", crop: "-mt-[2.3%] -mb-[0.4%] scale-x-[1.01]" },
] as const;

async function Features() {
  const t = await getTranslations("Home.Features");

  return (
    <section className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
      {featureCards.map((card) => (
        <div
          key={card.key}
          className="group flex flex-col overflow-hidden rounded-2xl border border-[#00000029] bg-[linear-gradient(112.57deg,rgba(17,18,20,0.05)_4.87%,rgba(12,13,15,0.07)_75.88%)] shadow-[inset_0px_1px_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-1 hover:border-black/25 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] dark:border-white/6 dark:bg-[linear-gradient(112.57deg,rgba(17,18,20,0.75)_4.87%,rgba(12,13,15,0.9)_75.88%)] dark:shadow-[inset_0px_1px_1px_1px_rgba(255,255,255,0.15)] dark:hover:border-white/15 dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
        >
          {/* Screenshot: inset with a border, grows to fill on hover */}
          <div className="border-b border-[#00000014] p-4 dark:border-white/6 sm:p-6">
            <div className="scale-[0.94] overflow-hidden rounded-lg border border-[#00000022] shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-out group-hover:scale-100 dark:border-white/10 dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
              <Image
                src={card.src}
                alt={t(`${card.key}.title`)}
                width={1900}
                height={984}
                loading="lazy"
                className={`h-auto w-full ${card.crop}`}
              />
            </div>
          </div>

          {/* Copy */}
          <div className="flex flex-col gap-2.5 px-6 py-6">
            <p className="font-mono text-[13px] uppercase tracking-[0.5px] text-[#266200] dark:text-[#3A9700]">
              {t(`${card.key}.tag`)}
            </p>

            <h3 className="text-[20px] font-medium text-black dark:text-white">
              {t(`${card.key}.title`)}
            </h3>

            <p className="text-[14px] leading-[22.4px] font-medium text-[#515151] dark:text-text3">
              {t(`${card.key}.description`)}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}

export default Features;
