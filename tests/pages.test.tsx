/**
 * Pages, layouts and components that contain async Server Components, rendered
 * the way the static export renders them (React's server renderer).
 */
import fs from "fs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { prerender } from "react-dom/static";
import type { ComponentProps, ReactElement } from "react";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import RootRedirectLayout from "@/app/(root)/layout";
import RootPage, { generateMetadata as rootMetadata } from "@/app/(root)/page";
import LocaleLayout, { generateMetadata as layoutMetadata } from "@/app/[locale]/layout";
import Home, { generateStaticParams as homeParams } from "@/app/[locale]/page";
import Privacy, { generateMetadata as privacyMetadata, generateStaticParams as privacyParams } from "@/app/[locale]/privacy/page";
import Terms, { generateMetadata as termsMetadata, generateStaticParams as termsParams } from "@/app/[locale]/terms/page";
import Support, { generateMetadata as supportMetadata, generateStaticParams as supportParams } from "@/app/[locale]/support/page";
import HomePage from "@/components/HomePage";
import LegalPage from "@/components/LegalPage";
import MacClock from "@/components/MacClock";
import { LEGAL_PAGES } from "@/config/legal";
import { SITE_URL } from "@/config/site";
import { routing } from "@/i18n/routing";
import { renderServerTree, setTestLocale } from "./helpers/render";
import { NotFoundError } from "./helpers/next-navigation";
import { themeInitScript } from "@/context/theme-script";

vi.mock("next-intl/server", () => import("./helpers/next-intl-server"));
vi.mock("@aossie-org/social-share-button", () => ({ default: class {} }));
// In a Next.js build the layout gets next-intl's react-server provider, which reads the
// request locale itself; Vitest loads the client build, so supply that locale (taken from the
// mocked request path) here.
vi.mock("next-intl", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-intl")>();
  const { navigation } = await import("./helpers/next-navigation");
  return {
    ...actual,
    NextIntlClientProvider: (props: ComponentProps<typeof actual.NextIntlClientProvider>) => (
      <actual.NextIntlClientProvider {...props} locale={props.locale ?? navigation.pathname.split("/")[1]} />
    ),
  };
});

const params = (locale: string) => ({ params: Promise.resolve({ locale }) });

const allParams = routing.locales.map((locale) => ({ locale }));

async function renderDocument(ui: ReactElement) {
  const { prelude } = await prerender(ui);
  return new Response(prelude).text();
}

beforeEach(() => {
  vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Root route (/)", () => {
  it("forwards to the default locale with a script, a meta refresh and a no-JS link", () => {
    const html = renderToStaticMarkup(<RootPage />);
    expect(html).toContain('<script>location.replace("/en")</script>');
    expect(html).toContain('<meta http-equiv="refresh" content="0; url=/en"/>');
    expect(html).toContain('<noscript><a href="/en">Continue to PictoPy</a></noscript>');
  });

  it("ships the default locale's metadata for crawlers", async () => {
    const meta = await rootMetadata();
    expect(meta.title).toBe(en.Home.metaTitle);
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/en`);
  });

  it("uses a bare English document without stylesheets", () => {
    const html = renderToStaticMarkup(
      <RootRedirectLayout>
        <p>child</p>
      </RootRedirectLayout>,
    );
    // React adds an empty <head>; nothing (no stylesheet or script) may go in it.
    expect(html).toBe('<html lang="en"><head></head><body><p>child</p></body></html>');
  });
});

describe("Locale layout", () => {
  it("sets the document language and fonts and wraps pages with the navbar", async () => {
    setTestLocale("hi");
    const html = await renderDocument(await LocaleLayout({ children: <p>page body</p>, ...params("hi") }));
    expect(html).toMatch(/<html lang="hi" class="font-inter-variable font-devanagari-variable h-full antialiased"/);
    expect(html).toContain("<p>page body</p>");
    const body = document.createElement("div");
    body.innerHTML = html.replace(/^[\s\S]*<body[^>]*>|<\/body>[\s\S]*$/g, "");
    expect(within(body).getByRole("navigation")).toBeTruthy();
    expect(within(body).getAllByText(hi.Home.Navbar.documentation).length).toBeGreaterThan(0);
    // The background photo grid renders behind the content.
    expect(html).toContain("images.unsplash.com");
    // The theme is applied from <head>, before <body> exists, so the first paint is never the wrong theme
    const head = new DOMParser().parseFromString(html, "text/html").head;
    expect(head.querySelector("script")?.textContent).toBe(themeInitScript);
  });

  it("rejects unknown locales with a 404", async () => {
    await expect(LocaleLayout({ children: null, ...params("fr") })).rejects.toBeInstanceOf(NotFoundError);
    await expect(layoutMetadata(params("fr"))).rejects.toBeInstanceOf(NotFoundError);
  });

  it("builds localized home metadata", async () => {
    const meta = await layoutMetadata(params("hi"));
    expect(meta.title).toBe(hi.Home.metaTitle);
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/hi`);
  });
});

describe("Home page", () => {
  it("prerenders one page per locale", () => {
    expect(homeParams()).toEqual(allParams);
  });

  it.each(["en", "hi"] as const)("embeds WebPage structured data in %s", async (locale) => {
    const page = await Home(params(locale));
    const script = (page.props.children as ReactElement<{ id?: string; dangerouslySetInnerHTML?: { __html: string } }>[])
      .find((child) => child?.props?.id === "schema-jsonld")!;
    const data = JSON.parse(script.props.dangerouslySetInnerHTML!.__html);
    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: { en, hi }[locale].Home.heading,
      description: { en, hi }[locale].Home.metaDescription,
      inLanguage: locale,
      publisher: { name: "PictoPy", url: SITE_URL, logo: `${SITE_URL}/brand/icons/pictopy_logo.svg` },
    });
  });

  it.each(["en", "hi"] as const)("renders every homepage section in %s", async (locale) => {
    const copy = { en, hi }[locale].Home;
    const { container } = await renderServerTree(<HomePage />, { locale });
    const page = within(container);
    expect(page.getByRole("heading", { level: 1 }).textContent).toBe(`${copy.Hero.heroTitle}${copy.Hero.heroSubtitle}`);
    expect(page.getByText(copy.MacMockDesc.appDescription)).toBeTruthy();
    expect(page.getByText(copy.Metrics.metricsHeading)).toBeTruthy();
    expect(page.getByText(copy.Features.memories.title, { selector: "h3" })).toBeTruthy();
    expect(container.querySelector("#community")).toBeTruthy();
    expect(container.querySelector("#faq")).toBeTruthy();
    expect(page.getByRole("contentinfo")).toBeTruthy();
    expect(page.getAllByRole("link", { name: copy.Download.downloadLinux })).toHaveLength(2); // hero + footer
  });
});

describe("Legal pages", () => {
  const firstHeading = (file: string) => /^# (.+)$/m.exec(fs.readFileSync(path.join(process.cwd(), file), "utf8"))![1];

  it.each([
    ["privacy", Privacy, privacyMetadata, privacyParams],
    ["terms", Terms, termsMetadata, termsParams],
  ] as const)("%s renders its repository document with localized metadata", async (page, Page, metadata, staticParams) => {
    expect(staticParams()).toEqual(allParams);
    const meta = await metadata(params("hi"));
    expect(meta.title).toBe(hi.Legal[page].metaTitle);
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/hi${LEGAL_PAGES[page].path}`);

    const { container } = await renderServerTree(await Page(params("en")));
    const article = within(container.querySelector("article")!);
    expect(article.getByRole("heading", { level: 1 }).textContent).toBe(firstHeading(LEGAL_PAGES[page].file));
    expect(article.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(1);
    expect(within(container).queryByText(en.Legal.englishOnly)).toBeNull();
    expect(container.querySelector("footer")).toBeTruthy();
  });

  it("points links between the legal documents at the localized site pages", async () => {
    const { container } = await renderServerTree(<LegalPage locale="hi" page="terms" />, { locale: "hi" });
    const links = within(container.querySelector("article")!).getAllByRole("link");
    const privacy = links.filter((a) => a.getAttribute("href")?.endsWith("/privacy"));
    expect(privacy.length).toBeGreaterThan(0);
    expect(privacy.every((a) => a.getAttribute("href") === "/hi/privacy")).toBe(true);
    expect(links.some((a) => a.getAttribute("href")?.endsWith(".md"))).toBe(false);
  });

  it("tells Hindi readers the document is English-only and marks it as English", async () => {
    const { container } = await renderServerTree(<LegalPage locale="hi" page="privacy" />, { locale: "hi" });
    const note = within(container).getByText(hi.Legal.englishOnly);
    expect(note.closest("article")).toBeTruthy();
    expect(container.querySelector("article h1")!.closest("[lang]")!.getAttribute("lang")).toBe("en");
  });
});

describe("Support page", () => {
  it("shows the support widget and footer with localized metadata", async () => {
    expect(supportParams()).toEqual(allParams);
    const meta = await supportMetadata(params("hi"));
    expect(meta.title).toBe(hi.Support.metaTitle);
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/hi/support`);

    const { container } = await renderServerTree(await Support(params("hi")), { locale: "hi" });
    expect(within(container).getByRole("heading", { level: 1 }).textContent).toBe(hi.Support.metaTitle);
    expect(within(container).getByText(hi.Support.aossieDescription)).toBeTruthy();
    expect(container.querySelector("footer")).toBeTruthy();
  });
});

describe("MacClock on the server", () => {
  it("renders empty so the export never bakes in a build-time date", async () => {
    const { container } = await renderServerTree(<MacClock />);
    expect(Array.from(container.querySelectorAll("span")).map((s) => s.textContent)).toEqual(["", ""]);
  });
});
