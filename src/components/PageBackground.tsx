"use client";
import ShuffleGrid from "@/components/ShuffleGrid";
import { LEGAL_PAGES } from "@/config/legal";
import { SUPPORT_PAGE_PATH } from "@/config/support";
import { usePathname } from "@/i18n/navigation";

/** Text pages get a plain background; the shuffling photo grid stays on the rest of the site. */
const PLAIN_PAGES = new Set<string>([LEGAL_PAGES.privacy.path, LEGAL_PAGES.terms.path, SUPPORT_PAGE_PATH]);

export default function PageBackground() {
  return PLAIN_PAGES.has(usePathname()) ? null : <ShuffleGrid />;
}
