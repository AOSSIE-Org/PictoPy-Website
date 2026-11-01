import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";
import * as links from "@/config/links";
import { PRODUCTION_SITE_URL, SITE_URL } from "@/config/site";
import { LEGAL_PAGES } from "@/config/legal";
import { SUPPORT_LOGOS, SUPPORT_PAGE_PATH } from "@/config/support";

// Flatten every exported link, including the values of SOCIAL_LINKS.
const allLinks: [string, string][] = Object.entries(links).flatMap(
  ([name, value]): [string, string][] =>
    typeof value === "string"
      ? [[name, value]]
      : Object.entries(value).map(([key, url]): [string, string] => [`${name}.${key}`, url]),
);

describe("External links config", () => {
  it.each(allLinks)("%s is an absolute https:// URL", (_name, url) => {
    expect(url).toMatch(/^https:\/\//);
    expect(new URL(url).protocol).toBe("https:");
  });

  it("sends supporters to AOSSIE on GitHub Sponsors", () => {
    expect(links.GITHUB_SPONSORS_URL).toBe("https://github.com/sponsors/AOSSIE-Org");
  });

  it("points the PictoPy website link at the production domain", () => {
    expect(links.WEBSITE_URL).toBe(PRODUCTION_SITE_URL);
  });
});

describe("Site origin config", () => {
  it("has no trailing slash", () => {
    expect(SITE_URL).toMatch(/^https:\/\//);
    expect(SITE_URL.endsWith("/")).toBe(false);
    expect(PRODUCTION_SITE_URL.endsWith("/")).toBe(false);
  });
});

describe("Legal pages config", () => {
  it.each(Object.entries(LEGAL_PAGES))("%s has a single-segment path and a document in the project root", (_name, page) => {
    expect(page.path).toMatch(/^\/[a-z-]+$/);
    expect(fs.existsSync(path.join(process.cwd(), page.file))).toBe(true);
  });
});

describe("Support page config", () => {
  it("has a single-segment path that no legal page uses", () => {
    expect(SUPPORT_PAGE_PATH).toMatch(/^\/[a-z-]+$/);
    expect(Object.values(LEGAL_PAGES).map((page) => page.path)).not.toContain(SUPPORT_PAGE_PATH);
  });

  it.each(Object.entries(SUPPORT_LOGOS))("%s logo is a file in public/", (_name, src) => {
    expect(fs.existsSync(path.join(process.cwd(), "public", src))).toBe(true);
  });
});
