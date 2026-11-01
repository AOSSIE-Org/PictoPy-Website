import fs from "fs";
import path from "path";
import { getTranslations } from "next-intl/server";
import Footer from "@/components/Footer";
import { LegalDocument } from "@/lib/legal-markdown";
import { getPathname } from "@/i18n/navigation";
import {
  LEGAL_DOCUMENT_LOCALE,
  LEGAL_PAGES,
  type LegalPage as LegalPageName,
} from "@/config/legal";

// The renderer outputs plain HTML elements, so the document is styled from its wrapper.
const DOCUMENT_CLASSES = [
  "text-[15px] leading-7 font-medium text-text3",
  "[&_h1]:mb-8 [&_h1]:text-4xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-text md:[&_h1]:text-5xl",
  "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-text",
  "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-text",
  "[&_p]:my-4",
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-2",
  "[&_strong]:font-semibold [&_strong]:text-text",
  "[&_a]:rounded-sm [&_a]:text-text [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-text3",
  "[&_a:focus-visible]:outline-none [&_a:focus-visible]:ring-1 [&_a:focus-visible]:ring-ring",
  "[&_code]:rounded [&_code]:border [&_code]:border-border [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-text",
].join(" ");

/** A legal page: the repository's Markdown document, with a note on locales it isn't translated into. */
export default async function LegalPage({
  locale,
  page,
}: {
  locale: string;
  page: LegalPageName;
}) {
  const t = await getTranslations({ locale, namespace: "Legal" });
  const source = fs.readFileSync(
    path.join(process.cwd(), LEGAL_PAGES[page].file),
    "utf8",
  );
  const links = {
    privacy: getPathname({ href: LEGAL_PAGES.privacy.path, locale }),
    terms: getPathname({ href: LEGAL_PAGES.terms.path, locale }),
  };

  return (
    <>
      <article className="mx-auto mt-16 w-full max-w-3xl lg:mt-24">
        {locale !== LEGAL_DOCUMENT_LOCALE && (
          <p className="mb-8 rounded-xl border border-border bg-surface-2 px-4 py-3 text-[14px] font-medium text-text3">
            {t("englishOnly")}
          </p>
        )}
        <LegalDocument source={source} links={links} className={DOCUMENT_CLASSES} />
      </article>
      <Footer />
    </>
  );
}
