import Image from "next/image";
import MacMockup from "./MockUp";
import PictoPyImage from "@/assets/pictopy_logo.svg";
import { getTranslations } from "next-intl/server";

async function MockUpWithDesc({ image }: { image: string }) {
  const t = await getTranslations("Home.MockUpWithDesc");
  return (
    <>
      <section className="mt-32 flex flex-col gap-15 md:mt-44 md:gap-14 min-[850px]:flex-row lg:gap-20 xl:gap-25">
        <div className="flex max-w-full flex-col gap-8 md:gap-10 lg:max-w-[25%]">
          <div className="text-xl font-medium leading-8 tracking-[0.2px] md:text-2xl md:leading-9.5">
            <span className="text-[#000000] dark:text-text">
              {t("featureSectionTitle")}
            </span>
            <p className="mt-2 text-base leading-7 md:text-lg md:leading-8">
              <span className="text-[#000000] dark:text-text dark:[text-shadow:0px_0px_20px_#9AAAFFA6]">
                {t("featureSectionDescriptionHighlighting")}{" "}
              </span>
              <span className="text-[#434345]">
                {t("featureSectionDescription")}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-4 text-sm leading-[22.4px] tracking-[0.2px]">
            <div className="flex w-fit items-center gap-2 rounded-md bg-[#1B1C1E] px-2 py-0.5">
              <Image
                src={PictoPyImage.src}
                aria-label="PictoPy Logo"
                alt="PictoPy Logo"
                className="h-4 w-4"
                loading="lazy"
                width={16}
                height={16}
              />
              <span className="text-white">{t("reviewButton")}</span>
            </div>

            {/* Testimonial */}
            <blockquote className="text-[15px] leading-6.5 italic text-[#434345] dark:text-text3">
              &ldquo;{t("testimonialQuote")}&rdquo;
            </blockquote>

            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="h-10 w-10 shrink-0 rounded-full border-2 border-white bg-[#FFD43B] shadow-[0_1px_4px_rgba(0,0,0,0.15)]"
              />

              <div className="flex flex-col leading-tight">
                <span className="text-[14px] font-semibold text-black dark:text-white">
                  {t("testimonialAuthor")}
                </span>
                <span className="text-[12px] text-text3">
                  {t("testimonialLabel")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-210 self-center min-[850px]:mr-0 min-[850px]:ml-auto">
          <MacMockup image={image} />
        </div>
      </section>

      <h2 className="font-medium text-[20px] text-center place-self-center text-text2 max-w-100 mt-32">
        <span className="text-[#000000] dark:text-text">
          {t("featureHeading")}{" "}
        </span>
        <span>{t("featureSubheading")}</span>
      </h2>
    </>
  );
}

export default MockUpWithDesc;
