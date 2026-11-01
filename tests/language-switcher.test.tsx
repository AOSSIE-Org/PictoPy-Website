import { afterEach, describe, expect, it } from "vitest";
import { act, fireEvent, screen } from "@testing-library/react";
import fc from "fast-check";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { languages } from "@/config/languages";
import { renderWithIntl } from "./helpers/render";
import { navigation } from "./helpers/next-navigation";

const trigger = (label = en.LanguageSwitcher.selectLanguage) => screen.getByRole("button", { name: label });
const listbox = () => screen.getByRole("listbox");
const options = () => screen.getAllByRole("option");
const isOpen = () => trigger().getAttribute("aria-expanded") === "true";

afterEach(() => {
  navigation.router.replace.mockClear();
});

describe("LanguageSwitcher", () => {
  it("labels the trigger and shows the current language", () => {
    renderWithIntl(<LanguageSwitcher />);
    expect(trigger().getAttribute("aria-haspopup")).toBe("listbox");
    expect(trigger().textContent).toBe("English");
    expect(listbox().getAttribute("aria-label")).toBe(en.LanguageSwitcher.selectLanguage);
    expect(options().map((o) => o.textContent)).toEqual(languages.map((l) => `${l.localName}${l.name}`));
  });

  it("shows Hindi as current and translated on the Hindi site", () => {
    renderWithIntl(<LanguageSwitcher />, { locale: "hi" });
    expect(trigger(hi.LanguageSwitcher.selectLanguage).textContent).toBe("हिन्दी");
    expect(options().map((o) => o.getAttribute("aria-selected"))).toEqual(["false", "true"]);
  });

  it("opens, focuses the selected option and toggles closed", () => {
    renderWithIntl(<LanguageSwitcher />, { locale: "hi" });
    expect(listbox().className).toContain("invisible");
    fireEvent.click(trigger(hi.LanguageSwitcher.selectLanguage));
    expect(trigger(hi.LanguageSwitcher.selectLanguage).getAttribute("aria-expanded")).toBe("true");
    expect(listbox().className).not.toContain("invisible");
    expect(document.activeElement).toBe(options()[1]);
    fireEvent.click(trigger(hi.LanguageSwitcher.selectLanguage));
    expect(trigger(hi.LanguageSwitcher.selectLanguage).getAttribute("aria-expanded")).toBe("false");
  });

  it("closes on Escape and on a click outside, but not on a click inside", () => {
    renderWithIntl(<LanguageSwitcher />);
    fireEvent.click(trigger());
    fireEvent.keyDown(document, { key: "Enter" });
    expect(isOpen()).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(isOpen()).toBe(false);

    fireEvent.click(trigger());
    fireEvent.pointerDown(listbox());
    expect(isOpen()).toBe(true);
    fireEvent.pointerDown(document.body);
    expect(isOpen()).toBe(false);
  });

  it("closes without navigating when the current language is picked", () => {
    renderWithIntl(<LanguageSwitcher />);
    fireEvent.click(trigger());
    fireEvent.click(options()[0]);
    expect(isOpen()).toBe(false);
    expect(navigation.router.replace).not.toHaveBeenCalled();
  });

  it("switches to the same page in the chosen language", () => {
    renderWithIntl(<LanguageSwitcher />, { path: "/privacy" });
    fireEvent.click(trigger());
    fireEvent.click(options()[1]);
    expect(navigation.router.replace).toHaveBeenCalledTimes(1);
    expect(navigation.router.replace.mock.calls[0][0]).toBe("/hi/privacy");
  });

  it("ignores keys other than the arrows inside the list", () => {
    renderWithIntl(<LanguageSwitcher />);
    fireEvent.click(trigger());
    fireEvent.keyDown(listbox(), { key: "Tab" });
    expect(document.activeElement).toBe(options()[0]);
  });

  it("property: arrow keys move focus one option at a time and stop at both ends", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("en" as const, "hi" as const),
        fc.array(fc.constantFrom("ArrowDown", "ArrowUp"), { maxLength: 12 }),
        (locale, keys) => {
          const { container, unmount } = renderWithIntl(<LanguageSwitcher />, { locale });
          // Plain selectors keep the many runs fast; the role-based tests above cover semantics.
          const list = container.querySelector('[role="listbox"]')!;
          const items = Array.from(container.querySelectorAll('[role="option"]'));
          try {
            act(() => container.querySelector<HTMLButtonElement>("[aria-haspopup]")!.click());
            let expected = languages.findIndex((l) => l.code === locale);
            expect(document.activeElement).toBe(items[expected]);
            for (const key of keys) {
              fireEvent.keyDown(list, { key });
              expected = key === "ArrowDown" ? Math.min(expected + 1, languages.length - 1) : Math.max(expected - 1, 0);
              expect(document.activeElement).toBe(items[expected]);
            }
          } finally {
            unmount();
          }
        },
      ),
      { numRuns: 30 },
    );
  }, 20_000);
});
