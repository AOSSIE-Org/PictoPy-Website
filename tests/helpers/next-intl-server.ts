/**
 * Stand-in for `next-intl/server`, whose request-scoped APIs need a Next.js
 * request. Translators are built from the real message catalogs, so server
 * components render the same copy they ship with.
 */
import { createTranslator } from "next-intl";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";

export const catalogs = { en, hi } as const;
export type TestLocale = keyof typeof catalogs;

const state = { locale: "en" as TestLocale };

/** Locale used by `getTranslations("Namespace")` calls that do not pass one (as `setRequestLocale` would). */
export function setRequestLocale(locale: string) {
  state.locale = locale as TestLocale;
}

export async function getTranslations(arg?: string | { locale?: string; namespace?: string }) {
  const { locale = state.locale, namespace } = typeof arg === "string" ? { namespace: arg } : (arg ?? {});
  const messages = catalogs[locale as TestLocale];
  // Namespaces are dynamic strings here, so the typed overloads don't apply.
  return createTranslator({ locale, messages, namespace } as never) as unknown as ReturnType<
    typeof createTranslator<typeof en>
  >;
}

export async function getMessages({ locale = state.locale }: { locale?: string } = {}) {
  return catalogs[locale as TestLocale];
}

export async function getLocale() {
  return state.locale;
}

/** `getRequestConfig` only wraps the factory, so tests can call the factory directly. */
export function getRequestConfig<T>(factory: T) {
  return factory;
}
