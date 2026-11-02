import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import Footer from "@/components/Footer";
import {
  AOSSIE_GITHUB_URL,
  AOSSIE_PROJECTS_URL,
  AOSSIE_URL,
  DJED_URL,
  REPO_CONTRIBUTING_URL,
  REPO_ISSUES_URL,
  REPO_LATEST_RELEASE_URL,
  RESONATE_REPO_URL,
  SOCIAL_LINKS,
  STABILITY_NEXUS_URL,
  WEBSITE_URL,
} from "@/config/links";
import { renderWithIntl, setTestLocale } from "./helpers/render";

vi.mock("next-intl/server", () => import("./helpers/next-intl-server"));
vi.mock("@aossie-org/social-share-button", () => ({
  default: class {
    destroy() {}
  },
}));

const UA_DESKTOP = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0";

beforeEach(() => {
  vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue(UA_DESKTOP);
  vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function renderFooter(locale: "en" | "hi" = "en") {
  setTestLocale(locale);
  return renderWithIntl(await Footer(), { locale });
}

const footer = () => within(screen.getByRole("contentinfo"));

describe("Footer", () => {
  it("shows the download call to action with the installers", async () => {
    await renderFooter();
    expect(footer().getByRole("heading", { level: 2 }).textContent).toBe(en.Home.Footer.ctaTitle);
    expect(footer().getByText(en.Home.Footer.ctaSubtitle)).toBeTruthy();
    expect(footer().getByRole("link", { name: en.Home.Download.downloadWindows })).toBeTruthy();
  });

  it("groups the external links into translated columns that open in a new tab", async () => {
    await renderFooter();
    const columns = footer().getAllByRole("heading", { level: 3 });
    expect(columns.map((h) => h.textContent)).toEqual(Object.values(en.Home.Footer.columns));

    const nav = within(footer().getByRole("navigation"));
    const links = nav.getAllByRole("link");
    expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      [en.Home.Footer.links.software, REPO_LATEST_RELEASE_URL],
      [en.Home.Footer.links.website, WEBSITE_URL],
      [en.Home.Footer.links.aossie, AOSSIE_URL],
      [en.Home.Footer.links.github, AOSSIE_GITHUB_URL],
      [en.Home.Footer.links.contributingGuide, REPO_CONTRIBUTING_URL],
      [en.Home.Footer.links.goodFirstIssues, REPO_ISSUES_URL],
      [en.Home.Footer.links.resonate, RESONATE_REPO_URL],
      [en.Home.Footer.links.checkOutProjects, AOSSIE_PROJECTS_URL],
      [en.Home.Footer.links.djedAlliance, DJED_URL],
      [en.Home.Footer.links.stabilityNexus, STABILITY_NEXUS_URL],
    ]);
    for (const link of links) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("links the social profiles with accessible names", async () => {
    await renderFooter();
    const expected = {
      Discord: SOCIAL_LINKS.discord,
      GitHub: SOCIAL_LINKS.github,
      YouTube: SOCIAL_LINKS.youtube,
      X: SOCIAL_LINKS.x,
      LinkedIn: SOCIAL_LINKS.linkedin,
    };
    for (const [name, href] of Object.entries(expected)) {
      // Matched by aria-label: the GitHub column link shares the visible name "GitHub".
      const [link] = footer()
        .getAllByRole("link", { name })
        .filter((a) => a.getAttribute("aria-label") === name);
      expect(link.getAttribute("href")).toBe(href);
      expect(link.getAttribute("target")).toBe("_blank");
    }
  });

  it("links the legal and support pages under the current locale and offers sharing", async () => {
    await renderFooter();
    expect(footer().getByRole("link", { name: en.Home.Footer.legal.privacy }).getAttribute("href")).toBe("/en/privacy");
    expect(footer().getByRole("link", { name: en.Home.Footer.legal.terms }).getAttribute("href")).toBe("/en/terms");
    const support = footer().getByRole("link", { name: en.Home.Footer.supportLink });
    expect(support.getAttribute("href")).toBe("/en/support");
    expect(footer().getByRole("button", { name: en.Share.trigger })).toBeTruthy();
  });

  it("shows the current year and the AOSSIE credit with its logo", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2031, 4, 1));
    await renderFooter();
    expect(footer().getByText("© 2031 PictoPy")).toBeTruthy();
    const [logo] = footer().getAllByRole("presentation", { hidden: true });
    expect(logo.getAttribute("src")).toBe("/brand/icons/aossie_logo.svg");
    expect(logo.parentElement!.textContent).toBe("AOSSIE");
    expect(logo.parentElement!.parentElement!.textContent).toBe("Made with♥by AOSSIE");
  });

  it("is translated in Hindi, including the locale of internal links", async () => {
    await renderFooter("hi");
    expect(footer().getByText(hi.Home.Footer.ctaTitle)).toBeTruthy();
    expect(footer().getByText(hi.Home.Footer.columns.umbrellaOrgs)).toBeTruthy();
    expect(footer().getByRole("link", { name: hi.Home.Footer.legal.privacy }).getAttribute("href")).toBe("/hi/privacy");
    expect(footer().getByRole("button", { name: hi.Share.trigger })).toBeTruthy();
    // In Hindi the logo tag sits in the prefix message, so the credit reads in Hindi word order.
    const [logo] = footer().getAllByRole("presentation", { hidden: true });
    expect(logo.parentElement!.parentElement!.textContent).toBe("AOSSIE द्वारा♥के साथ निर्मित");
  });
});
