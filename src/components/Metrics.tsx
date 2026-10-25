import { metricsData } from "@/const/const";
import { getTranslations } from "next-intl/server";

async function Metrics() {
  const t = await getTranslations("Home.Metrics");
  return (
    <section className="flex flex-col gap-14 mt-40 lg:mt-52">
      {/* Heading */}
      <h2 className="text-center font-semibold text-4xl min-[640px]:text-[64px] leading-18 bg-[linear-gradient(91.3deg,#202020_71.33%,#8F8F8F_152.13%)] bg-clip-text text-transparent [text-shadow:0px_4px_4px_#00000026] dark:shadow-[0px_4px_4px_0px_#00000026] dark:text-[#FFFFFF]">
        {t("metricsHeading")}
      </h2>

      {/* Features */}
      <div className="grid overflow-hidden bg-[#E8E8E8] dark:bg-[#16230C] px-px pt-px grid-cols-1 min-[640px]:grid-cols-2 lg:grid-cols-4 rounded-sm">
        {metricsData.map((item, index) => (
          <div
            key={item.label}
            className={`group relative h-78.25 border-b-0 border border-[#E8E8E8] dark:border-[#16230C] rounded-t-[13px] bg-bg dark:bg-[#0C0C0C] max-[640px]:dark:bg-[#121212] p-5 font-medium leading-5 tracking-normal transition-colors duration-300 hover:bg-[#FAFAFA] dark:hover:bg-[#111411] max-[640px]:dark:hover:bg-[#161816]`}
          >
            {/* Right separator (desktop only) */}
            {index < 3 && (
              <div
                className="absolute -right-px top-0 hidden h-full w-[1.1px] dark:bg-[radial-gradient(14000.09%_50%_at_50%_50%,#A8BF69_0%,rgba(109,146,23,0)_100%)] lg:block"
                aria-hidden="true"
              />
            )}

            {/* Bottom separator (mobile only) */}
            {index < 3 && (
              <div
                className="absolute bottom-0 left-0 h-[1.1px] w-full dark:bg-[linear-gradient(90deg,rgba(109,146,23,0)_0%,#8DAE3C_20%,#A8BF69_50%,#8DAE3C_80%,rgba(109,146,23,0)_100%)] sm:hidden"
                aria-hidden="true"
              />
            )}

            {/* Bottom separator (2-column layout only) */}
            {index < 2 && (
              <div
                className="absolute bottom-0 left-0 hidden h-[1.1px] w-full dark:bg-[linear-gradient(90deg,rgba(109,146,23,0)_0%,#8DAE3C_20%,#A8BF69_50%,#8DAE3C_80%,rgba(109,146,23,0)_100%)] sm:block lg:hidden"
                aria-hidden="true"
              />
            )}

            <p className="font-mono text-[14px] uppercase text-[#266200] dark:text-[#3A9700]">
              {t(item.label)}
            </p>

            <h3 className="mt-2 text-4xl font-bold text-black transition-transform duration-300 origin-left group-hover:scale-105 dark:text-white">
              {t(item.value)}
            </h3>

            <p className="mt-26 min-[640px]:mt-31 text-[14px] leading-5 text-text2 font-normal">
              {t(item.description)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Metrics;
