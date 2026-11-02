import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Footer from "@/components/Footer";
import SupportUs from "@/components/SupportUs";
import { SUPPORT_PAGE_PATH } from "@/config/support";
import { generateLocaleMetadata } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return generateLocaleMetadata(locale, "Support", SUPPORT_PAGE_PATH);
}

export default async function Support({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <section className="mx-auto mt-16 w-full lg:mt-24">
        <SupportUs />
      </section>
      <Footer />
    </>
  );
}
