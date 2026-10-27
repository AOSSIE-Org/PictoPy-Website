import { describe, it, expect, vi, afterEach } from "vitest";
import sitemap from "@/app/sitemap";
import { routing } from "@/i18n/routing";
import { defaultLanguage, languages } from "@/config/languages";
import { generateLocaleMetadata } from "@/i18n/metadata";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async ({ locale }: { locale: string }) => (key: string) => `${locale}:${key}`),
}));

const SITE = "https://pictopy.aossie.org";

afterEach(() => vi.unstubAllEnvs());

describe("Locale configuration", () => {
  it("routes every configured language with English as default", () => {
    expect(routing.locales).toEqual(languages.map((l) => l.code));
    expect(routing.defaultLocale).toBe(defaultLanguage);
    expect(defaultLanguage).toBe("en");
  });
});

describe("sitemap", () => {
  it("lists one production URL per locale", () => {
    expect(sitemap().map((entry) => entry.url)).toEqual(routing.locales.map((l) => `${SITE}/${l}`));
  });

  it("honours NEXT_PUBLIC_SITE_URL and strips a trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example.org/");
    expect(sitemap()[0].url).toBe("https://preview.example.org/en");
  });
});

describe("generateLocaleMetadata", () => {
  it("builds canonical, hreflang alternates and localized titles", async () => {
    const meta = await generateLocaleMetadata("hi", "Home");
    expect(meta.title).toBe("hi:metaTitle");
    expect(meta.description).toBe("hi:metaDescription");
    expect(meta.alternates?.canonical).toBe(`${SITE}/hi`);
    expect(meta.alternates?.languages).toEqual({ en: `${SITE}/en`, hi: `${SITE}/hi` });
  });

  it("uses a 1200x630 raster share image, because social platforms ignore SVG previews", async () => {
    const meta = await generateLocaleMetadata("en", "Home");
    const [image] = meta.openGraph?.images as { url: string; width: number; height: number }[];
    expect(image.url).toBe(`${SITE}/og-image.png`);
    expect([image.width, image.height]).toEqual([1200, 630]);
    expect(meta.twitter).toMatchObject({ card: "summary_large_image", images: [`${SITE}/og-image.png`] });
  });

  it("sets the Open Graph locale per language", async () => {
    expect((await generateLocaleMetadata("en", "Home")).openGraph).toMatchObject({ locale: "en_US" });
    expect((await generateLocaleMetadata("hi", "Home")).openGraph).toMatchObject({ locale: "hi_IN" });
  });

  it("respects NEXT_PUBLIC_SITE_URL for canonical URLs", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example.org/");
    const meta = await generateLocaleMetadata("en", "Home");
    expect(meta.alternates?.canonical).toBe("https://preview.example.org/en");
  });
});
