import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import Navbar from "@/components/ui/Navbar";
import { ThemeProvider } from "@/context/theme-provider";
import { FALLBACK_RELEASE } from "@/const/const";
import { REPO_CONTRIBUTING_URL, REPO_README_URL } from "@/config/links";
import { renderWithIntl } from "./helpers/render";

const UA = {
  mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15",
  linux: "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
  android: "Mozilla/5.0 (Linux; Android 14; Pixel 8) Mobile Safari/537.36",
};

const LIVE_DEB = "https://github.com/AOSSIE-Org/PictoPy/releases/download/v9.0.0/PictoPy_9.0.0_amd64.deb";

const setUserAgent = (ua: string) => vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue(ua);

const downloadLinks = () => screen.queryAllByRole("link", { name: en.Home.Navbar.download });

const mobileMenu = () => document.getElementById("mobile-menu")!;

beforeEach(() => {
  setUserAgent(UA.linux);
  vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

// useDownloadLink caches the release for the page's lifetime, so the API tests run first.
describe("Navbar download button", () => {
  it("keeps the pinned installer when the GitHub API fails", async () => {
    const fetchMock = vi.fn(async () => ({ ok: false, json: async () => ({}) }));
    vi.stubGlobal("fetch", fetchMock);
    renderWithIntl(<Navbar />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const links = downloadLinks();
    expect(links).toHaveLength(2); // desktop bar + mobile drawer
    for (const link of links) {
      expect(link.getAttribute("href")).toBe(FALLBACK_RELEASE.downloads.linux);
      expect(link.hasAttribute("download")).toBe(true);
    }
  });

  it("swaps in the live release asset for the visitor's platform", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          tag_name: "v9.0.0",
          assets: [
            { name: "PictoPy_9.0.0_x64-setup.exe", browser_download_url: "https://x/setup.exe" },
            { name: "PictoPy_9.0.0_amd64.deb", browser_download_url: LIVE_DEB },
          ],
        }),
      })),
    );
    renderWithIntl(<Navbar />);
    await waitFor(() => expect(downloadLinks().map((a) => a.getAttribute("href"))).toEqual([LIVE_DEB, LIVE_DEB]));
  });

  it("uses the pinned link of the detected platform when the release has no matching installer", () => {
    setUserAgent(UA.mac);
    renderWithIntl(<Navbar />);
    // The cached release has no macOS asset, so the pinned macOS installer stays.
    expect(downloadLinks().map((a) => a.getAttribute("href"))).toEqual([
      FALLBACK_RELEASE.downloads.mac,
      FALLBACK_RELEASE.downloads.mac,
    ]);
  });

  it("offers no desktop download to phones", () => {
    setUserAgent(UA.android);
    renderWithIntl(<Navbar />);
    expect(downloadLinks()).toHaveLength(0);
  });
});

describe("Navbar links", () => {
  it("opens the documentation and contributing guide in a new tab", () => {
    renderWithIntl(<Navbar />);
    for (const [name, href] of [
      [en.Home.Navbar.documentation, REPO_README_URL],
      [en.Home.Navbar.contribute, REPO_CONTRIBUTING_URL],
    ]) {
      const links = screen.getAllByRole("link", { name });
      expect(links).toHaveLength(2);
      for (const link of links) {
        expect(link.getAttribute("href")).toBe(href);
        expect(link.getAttribute("target")).toBe("_blank");
        expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      }
    }
  });

  it("scrolls to the FAQ and community sections on the homepage", () => {
    const faq = Object.assign(document.createElement("section"), { id: "faq" });
    const community = Object.assign(document.createElement("section"), { id: "community" });
    faq.scrollIntoView = vi.fn();
    community.scrollIntoView = vi.fn();
    document.body.append(faq, community);

    renderWithIntl(<Navbar />);
    const [aboutUs] = screen.getAllByRole("button", { name: en.Home.Navbar.aboutUs });
    const [contact] = screen.getAllByRole("button", { name: en.Home.Navbar.contact });
    fireEvent.click(aboutUs);
    fireEvent.click(contact);
    expect(faq.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    expect(community.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });

  it("links to the homepage sections from other pages", () => {
    renderWithIntl(<Navbar />, { path: "/privacy" });
    expect(screen.queryByRole("button", { name: en.Home.Navbar.aboutUs })).toBeNull();
    expect(screen.getAllByRole("link", { name: en.Home.Navbar.aboutUs })[0].getAttribute("href")).toBe("/en#faq");
    expect(screen.getAllByRole("link", { name: en.Home.Navbar.contact })[0].getAttribute("href")).toBe("/en#community");
  });

  it("scrolls back to the top when the logo is clicked on the homepage", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    renderWithIntl(<Navbar />);
    const [logo] = screen.getAllByRole("link", { name: en.Home.Navbar.backToTop });
    expect(logo.getAttribute("href")).toBe("/en");
    expect(within(logo).getByText("PictoPy")).toBeTruthy();
    expect(within(logo).getByRole("presentation").getAttribute("src")).toContain("pictopy_logo.svg");
    expect(fireEvent.click(logo)).toBe(false); // default prevented: no page load
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("lets the logo load the homepage from other pages, labelled as a home link", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    renderWithIntl(<Navbar />, { path: "/terms" });
    expect(screen.queryByRole("link", { name: en.Home.Navbar.backToTop })).toBeNull();
    const [logo] = screen.getAllByRole("link", { name: en.Home.Navbar.goHome });
    expect(logo.getAttribute("href")).toBe("/en");
    expect(fireEvent.click(logo)).toBe(true);
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("is translated in Hindi", () => {
    renderWithIntl(<Navbar />, { locale: "hi" });
    for (const key of ["documentation", "contribute", "aboutUs", "contact"] as const) {
      expect(screen.getAllByText(hi.Home.Navbar[key]).length).toBeGreaterThan(0);
    }
    expect(screen.getByRole("button", { name: hi.Home.Navbar.openMenu })).toBeTruthy();
    expect(screen.getAllByRole("link", { name: hi.Home.Navbar.backToTop })[0].getAttribute("href")).toBe("/hi");
    expect(screen.queryByText(en.Home.Navbar.documentation)).toBeNull();
  });
});

describe("Navbar theme toggle", () => {
  it("switches between light and dark and updates the icons and labels", () => {
    renderWithIntl(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>,
    );
    const drawer = within(mobileMenu());
    expect(drawer.getByText(en.ThemeToggle.toggleDark)).toBeTruthy();
    const [desktopToggle] = screen.getAllByRole("button", { name: en.ThemeToggle.toggleTheme });

    fireEvent.click(desktopToggle);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(drawer.getByText(en.ThemeToggle.toggleLight)).toBeTruthy();
    expect(drawer.queryByText(en.ThemeToggle.toggleDark)).toBeNull();

    fireEvent.click(drawer.getByRole("button", { name: en.ThemeToggle.toggleTheme }));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(drawer.getByText(en.ThemeToggle.toggleDark)).toBeTruthy();
  });
});

describe("Navbar mobile menu", () => {
  const menuButton = () => screen.getByRole("button", { name: en.Home.Navbar.openMenu });
  const isOpen = () => {
    expect(menuButton().getAttribute("aria-expanded")).toBe(String(!mobileMenu().hasAttribute("inert")));
    return menuButton().getAttribute("aria-expanded") === "true";
  };

  it("starts closed and inert, and is controlled by the menu button", () => {
    renderWithIntl(<Navbar />);
    expect(menuButton().getAttribute("aria-controls")).toBe("mobile-menu");
    expect(isOpen()).toBe(false);
    expect(mobileMenu().className).toContain("translate-x-full");

    fireEvent.click(menuButton());
    expect(isOpen()).toBe(true);
    expect(mobileMenu().className).toContain("translate-x-0");
  });

  it("closes with the close button, the overlay and when the pointer leaves", () => {
    renderWithIntl(<Navbar />);
    const [overlay, closeButton] = screen.getAllByRole("button", { name: en.Home.Navbar.closeMenu });
    expect(overlay.getAttribute("tabindex")).toBe("-1");

    fireEvent.click(menuButton());
    fireEvent.click(closeButton);
    expect(isOpen()).toBe(false);

    fireEvent.mouseEnter(menuButton());
    expect(isOpen()).toBe(true);
    fireEvent.click(overlay);
    expect(isOpen()).toBe(false);

    fireEvent.click(menuButton());
    fireEvent.mouseLeave(mobileMenu());
    expect(isOpen()).toBe(false);
  });

  it("closes after following a link in the drawer", () => {
    renderWithIntl(<Navbar />);
    const drawer = within(mobileMenu());
    for (const name of [en.Home.Navbar.documentation, en.Home.Navbar.backToTop]) {
      fireEvent.click(menuButton());
      fireEvent.click(drawer.getByRole("link", { name }));
      expect(isOpen()).toBe(false);
    }
    fireEvent.click(menuButton());
    fireEvent.click(drawer.getByRole("button", { name: en.Home.Navbar.contact }));
    expect(isOpen()).toBe(false);
  });

  it("closes after following a section link from another page", () => {
    renderWithIntl(<Navbar />, { path: "/support" });
    fireEvent.click(menuButton());
    fireEvent.click(within(mobileMenu()).getByRole("link", { name: en.Home.Navbar.aboutUs }));
    expect(isOpen()).toBe(false);
  });
});
