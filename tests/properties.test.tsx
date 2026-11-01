/** Property tests for the URL builders and the legal-document renderer. */
import { afterEach, describe, expect, it, vi } from "vitest";
import fc from "fast-check";
import { renderToStaticMarkup } from "react-dom/server";
import sitemap from "@/app/sitemap";
import { getPathname } from "@/i18n/navigation";
import { generateLocaleMetadata } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";
import { LEGAL_PAGES } from "@/config/legal";
import { SUPPORT_PAGE_PATH } from "@/config/support";
import { getSiteUrl } from "@/config/site";
import { LegalDocument, parseLegalMarkdown, resolveLegalHref } from "@/lib/legal-markdown";

vi.mock("next-intl/server", () => import("./helpers/next-intl-server"));

afterEach(() => vi.unstubAllEnvs());

const locale = fc.constantFrom(...routing.locales);
const pagePath = fc.constantFrom("", ...Object.values(LEGAL_PAGES).map((p) => p.path), SUPPORT_PAGE_PATH);
const origin = fc
  .tuple(fc.domain(), fc.boolean())
  .map(([domain, trailingSlash]) => `https://${domain}${trailingSlash ? "/" : ""}`);
const segment = fc.stringMatching(/^[a-z0-9-]{1,12}$/);

const links = { privacy: "/hi/privacy", terms: "/hi/terms" };

describe("URL builders", () => {
  it("property: the sitemap lists every locale x page exactly once under the configured origin", () => {
    fc.assert(
      fc.property(origin, (siteUrl) => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", siteUrl);
        const base = siteUrl.replace(/\/$/, "");
        const urls = sitemap().map((entry) => entry.url);
        const pages = ["", ...Object.values(LEGAL_PAGES).map((p) => p.path), SUPPORT_PAGE_PATH];
        expect(new Set(urls).size).toBe(urls.length);
        expect(urls.sort()).toEqual(routing.locales.flatMap((l) => pages.map((p) => `${base}/${l}${p}`)).sort());
        for (const url of urls) {
          expect(new URL(url).protocol).toBe("https:");
          expect(url.slice("https://".length)).not.toContain("//");
        }
      }),
    );
  });

  it("property: the site origin never ends with a slash", () => {
    fc.assert(
      fc.property(origin, (siteUrl) => {
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", siteUrl);
        expect(getSiteUrl().endsWith("/")).toBe(false);
        expect(siteUrl.startsWith(getSiteUrl())).toBe(true);
      }),
    );
  });

  it("property: localized paths always carry the locale prefix", () => {
    fc.assert(
      fc.property(locale, fc.array(segment, { maxLength: 4 }), (lang, segments) => {
        const href = `/${segments.join("/")}`;
        const expected = segments.length ? `/${lang}${href}` : `/${lang}`;
        expect(getPathname({ href, locale: lang })).toBe(expected);
      }),
    );
  });

  it("property: every page's canonical URL is one of its hreflang alternates and in the sitemap", async () => {
    await fc.assert(
      fc.asyncProperty(locale, pagePath, async (lang, path) => {
        const namespace = path === "" ? "Home" : path === SUPPORT_PAGE_PATH ? "Support" : `Legal${path.replace("/", ".")}`;
        const meta = await generateLocaleMetadata(lang, namespace, path);
        const canonical = meta.alternates?.canonical as string;
        expect(canonical).toBe(`${getSiteUrl()}/${lang}${path}`);
        expect(Object.values(meta.alternates?.languages ?? {})).toContain(canonical);
        expect(sitemap().map((entry) => entry.url)).toContain(canonical);
        expect(meta.title).toBeTruthy();
      }),
    );
  });
});

describe("Legal Markdown", () => {
  const unsafeScheme = /^\s*(javascript|data|vbscript|file):/i;

  it("property: resolved links are always a site page, http(s), mailto, absolute path or anchor", () => {
    const href = fc.oneof(
      fc.string(),
      fc.constantFrom("javascript:", "JavaScript:", "data:", "vbscript:", "https://", "mailto:", "/", "#", "./").chain((prefix) =>
        fc.string().map((rest) => prefix + rest),
      ),
    );
    fc.assert(
      fc.property(href, (value) => {
        const resolved = resolveLegalHref(value, links);
        if (resolved === null) return;
        expect(resolved).toMatch(/^(https?:|mailto:|\/|#)/i);
        expect(resolved).not.toMatch(unsafeScheme);
      }),
    );
  });

  it("property: rendering any document never emits an unsafe link", () => {
    const linkTarget = fc.oneof(fc.webUrl(), fc.constantFrom("javascript:alert(1)", "data:text/html,x", "PRIVACY.md", "TERMS.md", "x.md"));
    const line = fc.oneof(
      fc.string({ maxLength: 20 }),
      fc.tuple(fc.string({ minLength: 1, maxLength: 10 }), linkTarget).map(([label, target]) => `[${label.replace(/[[\]]/g, "")}x](${target})`),
      fc.string({ maxLength: 10 }).map((s) => `## ${s}`),
      fc.string({ maxLength: 10 }).map((s) => `* **${s}**`),
    );
    fc.assert(
      fc.property(fc.array(line, { maxLength: 10 }), (lines) => {
        const html = renderToStaticMarkup(<LegalDocument source={lines.join("\n")} links={links} />);
        const hrefs = Array.from(html.matchAll(/href="([^"]*)"/g), (m) => m[1]);
        for (const value of hrefs) {
          expect(value).not.toMatch(unsafeScheme);
          expect(value).not.toMatch(/\.md$/);
        }
      }),
    );
  });

  it("property: parsing keeps every word of the document and never yields empty blocks", () => {
    const word = fc.stringMatching(/^[A-Za-z0-9]{1,8}$/);
    const line = fc.oneof(
      fc.array(word, { minLength: 1, maxLength: 4 }).map((w) => w.join(" ")),
      fc.tuple(fc.constantFrom("#", "##", "###"), word).map(([h, w]) => `${h} ${w}`),
      fc.tuple(fc.constantFrom("*", "-"), word).map(([m, w]) => `${m} ${w}`),
      fc.constant(""),
    );
    fc.assert(
      fc.property(fc.array(line, { maxLength: 15 }), fc.boolean(), (lines, windows) => {
        const source = lines.join(windows ? "\r\n" : "\n");
        const blocks = parseLegalMarkdown(source);
        const texts = blocks.flatMap((b) => (b.type === "list" ? b.items : [b.text]));
        expect(texts.every((t) => t.trim().length > 0)).toBe(true);
        const words = (s: string) => s.split(/\s+/).filter((w) => w && !/^(#{1,3}|[*-])$/.test(w));
        expect(texts.flatMap(words)).toEqual(lines.flatMap(words));
      }),
    );
  });
});
