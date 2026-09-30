"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { languages } from "@/config/languages";
import { useLocale, useTranslations } from "next-intl";
import { FiCheck, FiChevronDown, FiGlobe } from "react-icons/fi";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const currentLanguage =
    languages.find((lang) => lang.code === locale) ?? languages[0];

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Move focus into the listbox on the selected option when it opens
  useEffect(() => {
    if (!open) return;
    const selectedIndex = languages.findIndex((lang) => lang.code === locale);
    optionRefs.current[selectedIndex === -1 ? 0 : selectedIndex]?.focus();
  }, [open, locale]);

  const handleListboxKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();

    const focusedIndex = optionRefs.current.findIndex(
      (option) => option === document.activeElement,
    );
    const nextIndex =
      event.key === "ArrowDown"
        ? Math.min(focusedIndex + 1, languages.length - 1)
        : Math.max(focusedIndex - 1, 0);

    optionRefs.current[nextIndex]?.focus();
  };

  const handleLanguageChange = (newLocale: string) => {
    setOpen(false);
    if (newLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        disabled={isPending}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("selectLanguage")}
        onClick={() => setOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-text3 transition-colors duration-200 hover:bg-bg-hover hover:text-text disabled:cursor-wait disabled:opacity-60"
      >
        <FiGlobe size={15} aria-hidden="true" />
        <span>{currentLanguage.localName}</span>
        <FiChevronDown
          size={14}
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      <div
        role="listbox"
        aria-label={t("selectLanguage")}
        onKeyDown={handleListboxKeyDown}
        className={`absolute left-0 top-[calc(100%+10px)] z-50 min-w-44 origin-top-left rounded-xl border border-border bg-bg/95 p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.14)] backdrop-blur-md transition-all duration-200 ease-out dark:shadow-[0_12px_32px_rgba(0,0,0,0.6)] ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "pointer-events-none invisible -translate-y-1 scale-95 opacity-0"
        }`}
      >
        <p className="px-2.5 pb-2 pt-1.5 text-left text-[11px] font-medium uppercase tracking-[0.6px] text-text2">
          {t("selectLanguage")}
        </p>

        {languages.map((lang, index) => {
          const isActive = lang.code === locale;

          return (
            <button
              key={lang.code}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex w-full cursor-pointer items-center justify-between gap-6 rounded-lg px-2.5 py-2 transition-colors duration-150 ${
                isActive
                  ? "bg-bg-hover text-text"
                  : "text-text3 hover:bg-bg-hover hover:text-text"
              }`}
            >
              <span className="flex flex-col items-start leading-tight">
                <span className="text-sm font-medium">{lang.localName}</span>
                <span className="text-[11px] text-text2">{lang.name}</span>
              </span>

              {isActive && <FiCheck size={15} aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
