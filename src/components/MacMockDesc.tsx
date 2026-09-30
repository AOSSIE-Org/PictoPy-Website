import { getTranslations } from "next-intl/server";

async function MacMockDesc() {
  const t = await getTranslations("Home.MacMockDesc");
  return (
    <div className="flex max-w-153.75 text-center place-self-center mt-20 text-[#606060] dark:text-text2">
      <p className="font-medium text-[16px] leading-6 tracking-normal">
        {t("appDescription")}
      </p>
    </div>
  );
}

export default MacMockDesc;
