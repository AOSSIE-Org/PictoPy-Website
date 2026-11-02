import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import fc from "fast-check";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import Hero from "@/components/Hero";
import Faq from "@/components/Faq";
import SocialMediaCTA from "@/components/SocialMediaCTA";
import Metrics from "@/components/Metrics";
import Features from "@/components/Features";
import MacMockDesc from "@/components/MacMockDesc";
import MockUpWithDesc from "@/components/MockUpWithDesc";
import MacMockup from "@/components/MockUp";
import MacClock from "@/components/MacClock";
import FooterWatermark from "@/components/FooterWatermark";
import { Button } from "@/components/ui/button";
import { AOSSIE_EN_URL, SOCIAL_LINKS } from "@/config/links";
import { renderWithIntl, setTestLocale } from "./helpers/render";

vi.mock("next-intl/server", () => import("./helpers/next-intl-server"));

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

describe("Hero", () => {
  it("shows the translated headline, badge and AOSSIE credit link", () => {
    renderWithIntl(<Hero />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toBe(`${en.Home.Hero.heroTitle}${en.Home.Hero.heroSubtitle}`);
    expect(heading.id).toBe("downloads-section");
    expect(screen.getByText(en.Home.Hero.featureBadge)).toBeTruthy();

    const credit = screen.getByRole("link", { name: "Made by AOSSIE" });
    expect(credit.getAttribute("href")).toBe(AOSSIE_EN_URL);
    expect(credit.getAttribute("target")).toBe("_blank");
    expect(credit.getAttribute("rel")).toBe("noopener noreferrer");
    // The <org> tag of the ICU message becomes an emphasised span around the name only.
    expect(within(credit).getByText("AOSSIE").tagName).toBe("SPAN");
  });

  it("scrolls to the download buttons from the badge", () => {
    renderWithIntl(<Hero />);
    const heading = screen.getByRole("heading", { level: 1 });
    heading.scrollIntoView = vi.fn();
    fireEvent.click(screen.getByRole("button", { name: `${en.Home.Hero.downloadNow} →` }));
    expect(heading.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });

  it("is translated in Hindi", () => {
    renderWithIntl(<Hero />, { locale: "hi" });
    expect(screen.getByText(hi.Home.Hero.featureBadge)).toBeTruthy();
    expect(screen.getByText(hi.Home.Hero.heroDescription)).toBeTruthy();
    expect(screen.getByRole("link").textContent).toBe("AOSSIE द्वारा निर्मित");
  });
});

describe("Faq", () => {
  const questions = () => screen.getAllByRole("button");
  const expanded = () => questions().map((q) => q.getAttribute("aria-expanded") === "true");

  it("lists every question with the first one open", () => {
    renderWithIntl(<Faq />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(en.Home.Faq.title);
    expect(questions().map((q) => q.textContent)).toEqual(
      (["q1", "q2", "q3", "q4", "q5"] as const).map((k) => en.Home.Faq[k].question),
    );
    expect(expanded()).toEqual([true, false, false, false, false]);
    const answer = screen.getByText(en.Home.Faq.q1.answer).parentElement!;
    expect(answer.getAttribute("aria-hidden")).toBe("false");
    expect(screen.getByText(en.Home.Faq.q2.answer).parentElement!.getAttribute("aria-hidden")).toBe("true");
  });

  it("opens one answer at a time and closes the open one when clicked again", () => {
    renderWithIntl(<Faq />);
    fireEvent.click(questions()[2]);
    expect(expanded()).toEqual([false, false, true, false, false]);
    fireEvent.click(questions()[2]);
    expect(expanded()).toEqual([false, false, false, false, false]);
  });

  it("is translated in Hindi", () => {
    renderWithIntl(<Faq />, { locale: "hi" });
    expect(screen.getByText(hi.Home.Faq.title)).toBeTruthy();
    expect(screen.getByText(hi.Home.Faq.q5.question)).toBeTruthy();
  });

  it("property: after any clicks at most one answer is open, matching an accordion model", () => {
    fc.assert(
      fc.property(fc.array(fc.integer({ min: 0, max: 4 }), { maxLength: 15 }), (clicks) => {
        const { container, unmount } = renderWithIntl(<Faq />);
        // Plain selectors keep the many runs fast; the role-based tests above cover semantics.
        const buttons = Array.from(container.querySelectorAll("button"));
        try {
          let open = 0;
          for (const index of clicks) {
            act(() => buttons[index].click());
            open = open === index ? -1 : index;
          }
          expect(buttons.map((b) => b.getAttribute("aria-expanded") === "true")).toEqual([0, 1, 2, 3, 4].map((i) => i === open));
          expect(container.querySelectorAll('[aria-hidden="false"]')).toHaveLength(open === -1 ? 0 : 1);
        } finally {
          unmount();
        }
      }),
      { numRuns: 30 },
    );
  }, 20_000);
});

describe("SocialMediaCTA", () => {
  it("links each community card to its profile in a new tab", () => {
    renderWithIntl(<SocialMediaCTA />);
    expect(document.getElementById("community")).toBeTruthy();
    const cards = screen.getAllByRole("link");
    expect(cards.map((a) => a.getAttribute("href"))).toEqual([SOCIAL_LINKS.discord, SOCIAL_LINKS.github, SOCIAL_LINKS.youtube]);
    for (const card of cards) {
      expect(card.getAttribute("target")).toBe("_blank");
      expect(card.getAttribute("rel")).toBe("noopener noreferrer");
    }
    const discord = within(cards[0]);
    const copy = en.Home.SocialMediaCTA.discord;
    expect(discord.getByRole("heading", { level: 3 }).textContent).toBe(copy.name);
    expect(discord.getByText(copy.memberCount)).toBeTruthy();
    expect(discord.getByText(copy.button)).toBeTruthy();
    expect(within(cards[1]).getByText(en.Home.SocialMediaCTA.github.followerLabel)).toBeTruthy();
    expect(within(cards[2]).getByText(en.Home.SocialMediaCTA.youtube.subscriberLabel)).toBeTruthy();
  });

  it("is translated in Hindi", () => {
    renderWithIntl(<SocialMediaCTA />, { locale: "hi" });
    expect(screen.getByText(hi.Home.SocialMediaCTA.heading)).toBeTruthy();
    expect(screen.getByText(hi.Home.SocialMediaCTA.youtube.description)).toBeTruthy();
  });
});

describe("Metrics", () => {
  it.each(["en", "hi"] as const)("shows the four metrics in %s", async (locale) => {
    setTestLocale(locale);
    renderWithIntl(await Metrics(), { locale });
    const copy = { en, hi }[locale].Home.Metrics;
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(copy.metricsHeading);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      copy.metric1Value,
      copy.metric2Value,
      copy.metric3Value,
      copy.metric4Value,
    ]);
    expect(screen.getByText(copy.metric4Description)).toBeTruthy();
  });
});

describe("Features", () => {
  it("shows a screenshot card per feature with its tag, title and description", async () => {
    setTestLocale("en");
    renderWithIntl(await Features());
    const copy = en.Home.Features;
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      copy.tagging.title,
      copy.memories.title,
    ]);
    const images = screen.getAllByRole("img");
    expect(images.map((img) => [img.getAttribute("alt"), img.getAttribute("src")])).toEqual([
      [copy.tagging.title, "/brand/assets/3.jpg"],
      [copy.memories.title, "/brand/assets/2.jpg"],
    ]);
    expect(images[1].className).toContain("-mt-[2.3%]");
    expect(screen.getByText(copy.memories.tag)).toBeTruthy();
  });

  it("is translated in Hindi", async () => {
    setTestLocale("hi");
    renderWithIntl(await Features(), { locale: "hi" });
    expect(screen.getByAltText(hi.Home.Features.tagging.title)).toBeTruthy();
  });
});

describe("MacMockDesc", () => {
  it.each(["en", "hi"] as const)("describes the app in %s", async (locale) => {
    setTestLocale(locale);
    renderWithIntl(await MacMockDesc(), { locale });
    expect(screen.getByText({ en, hi }[locale].Home.MacMockDesc.appDescription)).toBeTruthy();
  });
});

describe("MockUpWithDesc", () => {
  it("pairs the feature copy and testimonial with a mockup of the given screenshot", async () => {
    setTestLocale("en");
    renderWithIntl(await MockUpWithDesc({ image: "/brand/assets/1.jpg" }));
    const copy = en.Home.MockUpWithDesc;
    expect(screen.getByText(`“${copy.testimonialQuote}”`).tagName).toBe("BLOCKQUOTE");
    expect(screen.getByText(copy.testimonialAuthor)).toBeTruthy();
    expect(screen.getByText(copy.reviewButton)).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(`${copy.featureHeading} ${copy.featureSubheading}`);
    expect(screen.getByAltText("PictoPy Logo").getAttribute("src")).toContain("pictopy_logo.svg");
    expect(screen.getByAltText("PictoPy mockup preview").getAttribute("src")).toBe("/brand/assets/1.jpg");
  });

  it("is translated in Hindi", async () => {
    setTestLocale("hi");
    renderWithIntl(await MockUpWithDesc({ image: "/x.jpg" }), { locale: "hi" });
    expect(screen.getByText(hi.Home.MockUpWithDesc.featureSectionTitle)).toBeTruthy();
  });
});

describe("MacMockup", () => {
  it("frames the screenshot in a decorative macOS window with a menu bar", () => {
    renderWithIntl(<MacMockup image="/brand/assets/hero.jpg" imageClassName="crop-me" />);
    const image = screen.getByAltText("PictoPy mockup preview");
    expect(image.getAttribute("src")).toBe("/brand/assets/hero.jpg");
    expect(image.className).toContain("crop-me");
    expect(image.closest('[aria-hidden="true"]')).toBeTruthy();
    for (const item of ["File", "Edit", "View", "Go", "Window", "Help"]) {
      expect(screen.getByText(item)).toBeTruthy();
    }
  });
});

describe("MacClock", () => {
  it("shows the local date and time and keeps it current", () => {
    vi.useFakeTimers({ toFake: ["Date", "setInterval", "clearInterval"] });
    vi.setSystemTime(new Date(2026, 2, 5, 14, 7, 10));
    renderWithIntl(<MacClock />);
    expect(screen.getByText("Thu March 05")).toBeTruthy();
    expect(screen.getByText("2:07 PM")).toBeTruthy();

    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText("2:08 PM")).toBeTruthy();
  });

  it("formats the clock for the Hindi site", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 2, 5, 14, 7));
    renderWithIntl(<MacClock />, { locale: "hi" });
    const [date, time] = Array.from(document.querySelectorAll("span")).map((s) => s.textContent);
    expect(date).toBe(new Date().toLocaleDateString("hi", { weekday: "short", month: "long", day: "2-digit" }).replace(",", ""));
    expect(date).not.toContain("March");
    expect(time).toContain("2:07");
    expect(time).not.toContain("PM");
  });
});

describe("FooterWatermark", () => {
  it("spells PictoPy in decorative letters hidden from assistive tech", () => {
    const { container } = render(<FooterWatermark />);
    const root = container.firstElementChild!;
    expect(root.getAttribute("aria-hidden")).toBe("true");
    expect(root.querySelectorAll("span > span")).toHaveLength(7);
    expect(root.textContent).toBe("PictoPy");
  });
});

describe("Button", () => {
  it("renders a button with the default variant classes", () => {
    render(<Button>Go</Button>);
    const button = screen.getByRole("button", { name: "Go" });
    expect(button.className).toContain("bg-primary");
    expect(button.className).toContain("h-9 px-4");
  });

  it("applies variant and size classes and merges custom ones", () => {
    render(
      <Button variant="ghost" size="icon" className="extra">
        x
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-transparent");
    expect(button.className).toContain("h-9 w-9");
    expect(button.className).toContain("extra");
    expect(button.className).not.toContain("bg-primary");
  });

  it("styles its child element instead of rendering a button when asChild is set", () => {
    render(
      <Button asChild variant="link">
        <a href="https://example.org">Link</a>
      </Button>,
    );
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("link", { name: "Link" }).className).toContain("underline-offset-4");
  });
});
