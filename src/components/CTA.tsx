import { getTranslations } from "next-intl/server";
import Download from "./Download";

async function CTA() {
  const t = await getTranslations("Home.cta");
  return (
    <section aria-labelledby="cta-heading">
      <div>
        <div className="text-center tracking-normal">
          <h2
            id="cta-heading"
            className="text-[20px] font-medium dark:text-text text-black leading-8"
          >
            {t("title")}
          </h2>

          <p className="text-[20px] font-medium leading-none text-text2">
            {t("description")}
          </p>
        </div>

        <div>
          <Download />
        </div>
      </div>
    </section>
  );
}

export default CTA;
