import type { ReactElement, ReactNode } from "react";
import { render } from "@testing-library/react";
import { prerender } from "react-dom/static";
import { NextIntlClientProvider } from "next-intl";
import { ThemeContext, ThemeOptions } from "@/context/theme-provider";
import { catalogs, setRequestLocale, type TestLocale } from "./next-intl-server";
import { navigation } from "./next-navigation";

type ProviderOptions = {
  locale?: TestLocale;
  theme?: ThemeOptions;
  toggleTheme?: () => void;
};

type Options = ProviderOptions & {
  /** Path below the locale prefix that the mocked router reports, e.g. "/privacy". */
  path?: string;
};

/** Sets the locale for server translators and the locale-prefixed path the mocked router reports. */
export function setTestLocale(locale: TestLocale, path = "") {
  setRequestLocale(locale);
  navigation.pathname = `/${locale}${path}`;
}

/** Real next-intl provider with the shipped catalog, plus a controllable theme context. */
export function Providers({
  children,
  locale = "en",
  theme = ThemeOptions.Light,
  toggleTheme = () => {},
}: ProviderOptions & { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale={locale} messages={catalogs[locale]} timeZone="UTC">
      <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
    </NextIntlClientProvider>
  );
}

/** Renders a client component (or a resolved server component tree) with the real catalogs. */
export function renderWithIntl(ui: ReactElement, { path, ...providerOptions }: Options = {}) {
  setTestLocale(providerOptions.locale ?? "en", path);
  const result = render(<Providers {...providerOptions}>{ui}</Providers>);
  return {
    ...result,
    rerenderWithIntl: (next: ReactElement, nextOptions: ProviderOptions = providerOptions) =>
      result.rerender(<Providers {...nextOptions}>{next}</Providers>),
  };
}

/**
 * Server-renders a tree that contains async Server Components (React's static
 * renderer awaits them) and mounts the HTML in a detached container for querying.
 */
export async function renderServerTree(ui: ReactElement, { path, ...providerOptions }: Options = {}) {
  setTestLocale(providerOptions.locale ?? "en", path);
  const { prelude } = await prerender(<Providers {...providerOptions}>{ui}</Providers>);
  const html = await new Response(prelude).text();
  const container = document.createElement("div");
  container.innerHTML = html;
  return { html, container };
}
