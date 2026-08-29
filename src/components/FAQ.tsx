import { getTranslations } from "next-intl/server";

interface FAQItem {
  question: string;
  answer: string;
}

export default async function FAQ() {
  const t = await getTranslations("Home.faq");
  const faqs: FAQItem[] = t.raw("items") as FAQItem[];
  return (
    <section className="bg-bg text-text tracking-normal leading-6.5">
      <div className="px-6 py-12 md:px-8 md:py-20">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-semibold tracking-normal md:text-[64px] md:leading-18 bg-[linear-gradient(91.3deg,#202020_71.33%,#8F8F8F_152.13%)] bg-clip-text text-transparent [text-shadow:0px_4px_4px_0px_#00000026] dark:text-[#FFFFFF]">
            {t("title")}
          </h2>

          <p className="mt-5 max-w-125 place-self-center text-[16px] leading-6.5 md:text-base tracking-normal font-medium dark:text-text2 text-text3">
            {t("description")}
          </p>
        </div>

        {/* FAQ list */}
        <div className="w-full">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              open={index === 0}
              className="group border-b-2 dark:border-[#1B1C1E] border-[#E5E5E5] "
            >
              <summary className="flex cursor-pointer list-none items-center justify-between py-7 outline-none">
                <span className="text-[16px] font-medium dark:text-text text-black ">
                  {faq.question}
                </span>

                {/* Plus / Minus */}
                <span
                  aria-hidden="true"
                  className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/35"
                >
                  <span className="absolute h-[1.5px] w-3 bg-black rounded-2xl" />

                  <span
                    className="
                      absolute rounded-2xl h-3 w-[1.5px] bg-black
                      transition-opacity duration-200
                      group-open:opacity-0
                    "
                  />
                </span>
              </summary>

              <div className="pb-12.5 pr-25 text-[16px] font-medium leading-6.5 text-text2">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
