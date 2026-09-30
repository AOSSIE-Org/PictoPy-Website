"use client";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { ThemeContext, ThemeOptions } from "@/context/theme-provider";
import { FiArrowUpRight, FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import PictoPyLogo from "@/assets/pictopy_logo.svg";
import { platformConfig } from "@/const/const";
import { usePlatform } from "@/hooks/usePlatform";
import { useDownloadLink } from "@/hooks/useDownloadLink";
import Image from "next/image";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslations } from "next-intl";

type NavItem = {
  key: "documentation" | "contribute" | "aboutUs" | "contact";
  href?: string;
  targetId?: string;
};

// No extra pages on the site: external docs open in a new tab,
// the rest smooth-scroll to their homepage section.
const navConfig: NavItem[] = [
  {
    key: "documentation",
    href: "https://github.com/AOSSIE-Org/PictoPy/blob/main/README.md",
  },
  {
    key: "contribute",
    href: "https://github.com/AOSSIE-Org/PictoPy/blob/main/CONTRIBUTING.md",
  },
  { key: "aboutUs", targetId: "faq" },
  { key: "contact", targetId: "community" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function NavItemLink({
  item,
  label,
  className,
  onNavigate,
}: {
  item: NavItem;
  label: string;
  className: string;
  onNavigate?: () => void;
}) {
  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} inline-flex items-center justify-center gap-1`}
        onClick={onNavigate}
      >
        {label}
        <FiArrowUpRight size={13} aria-hidden="true" className="opacity-70" />
      </a>
    );
  }

  return (
    <button
      type="button"
      className={`${className} cursor-pointer`}
      onClick={() => {
        onNavigate?.();
        scrollToSection(item.targetId!);
      }}
    >
      {label}
    </button>
  );
}

const Navbar: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === ThemeOptions.Dark;
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const { platform } = usePlatform();
  const { link } = useDownloadLink(platform ?? "windows");
  const Icon = platform ? platformConfig[platform].icon : null;

  const t = useTranslations("ThemeToggle");
  const tN = useTranslations("Home.Navbar");
  useEffect(() => {
    const trueFunction = () => {
      setMounted(true);
    };
    trueFunction();
  }, []);

  return (
    <nav className="sticky top-4 z-999 w-full flex justify-center">
      <div className="h-19 w-full rounded-2xl border border-border flex items-center justify-between px-4  min-[1250px]:px-8 bg-[linear-gradient(#F8F9FA,#F8F9FA)] dark:bg-[linear-gradient(93.78deg,rgba(17,18,20,0.75)_4.87%,rgba(12,13,15,0.9)_75.88%)] shadow-[inset_0_1px_1px_1px_#00000026] dark:shadow-[inset_0_1px_1px_1px_#FFFFFF26]">
        {/* Logo + Language switcher */}
        <div className="flex items-center gap-2">
          <Image
            src={PictoPyLogo.src}
            alt="PictoPy logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain shrink-0 select-none"
            loading="eager"
            draggable={false}
          />
          <span className="text-primary text-[20px] font-semibold tracking-tight select-none">
            PictoPy
          </span>

          <div className="hidden min-[1000px]:flex items-center">
            <div className="mx-3 h-6 w-px border border-text3" />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden min-[1000px]:flex items-center gap-8 font-medium text-[14px] text-text3">
          {navConfig.map((item) => (
            <NavItemLink
              key={item.key}
              item={item}
              label={tN(item.key)}
              className="relative transition-colors duration-200 hover:text-text after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
            />
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden min-[1000px]:flex items-center gap-5">
          <Button
            className="transition rounded-lg"
            variant={"ghost"}
            onClick={toggleTheme}
            aria-label={t("toggleTheme")}
          >
            {isDark ? (
              <FiSun size={24} />
            ) : (
              <FiMoon size={24} fill="currentColor" />
            )}
          </Button>
          <div className="mx-3 h-6 w-px border border-text3" />
          {mounted && Icon && (
            <Button
              asChild
              className="h-9 px-3 rounded-lg flex items-center gap-2 text-sm font-medium transition"
            >
              <a href={link} download>
                <Icon size={17} />
                {tN("download")}
              </a>
            </Button>
          )}
        </div>

        {/* Mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="min-[1000px]:hidden rounded-lg"
          onMouseEnter={() => setSidebarOpen(true)}
          onClick={() => setSidebarOpen(true)}
        >
          <FiMenu size={24} />
        </Button>

        {/* Mobile sidebar */}
        <MobileSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>
    </nav>
  );
};

type MobileSidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

function MobileSidebar({ sidebarOpen, setSidebarOpen }: MobileSidebarProps) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === ThemeOptions.Dark;
  const { platform } = usePlatform();
  const { link } = useDownloadLink(platform ?? "windows");
  const Icon = platform ? platformConfig[platform].icon : null;
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("ThemeToggle");
  const tN = useTranslations("Home.Navbar");

  useEffect(() => {
    const trueFunction = () => {
      setMounted(true);
    };
    trueFunction();
  }, []);

  return (
    <>
      {/* Overlay */}
      <button
        className={`fixed bg-bg z-40 transition-opacity duration-300 min-[1000px]:hidden ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 bg-bg z-50 h-screen w-full max-w-full text-center sm:max-w-72 border border-border transition-transform duration-300 min-[1000px]:hidden ${
          sidebarOpen ? "translate-x-0 " : "translate-x-full "
        }`}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        {/* Menu section */}
        <div className="flex items-center justify-between p-5">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src={PictoPyLogo.src}
              alt="PictoPy logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain shrink-0 select-none"
              loading="eager"
              draggable={false}
            />
            <span className="text-primary text-[20px] font-semibold tracking-tight select-none">
              PictoPy
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={22} />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col p-4 font-medium">
          {navConfig.map((item) => (
            <NavItemLink
              key={item.key}
              item={item}
              label={tN(item.key)}
              className="rounded-lg px-3 py-3 text-text3 transition hover:text-text3/70 hover:bg-muted text-center"
              onNavigate={() => setSidebarOpen(false)}
            />
          ))}

          <div className="relative place-self-center">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Theme toggle and Download section */}
        <div className="flex flex-col gap-4 px-4 pb-4">
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="h-10 w-full justify-center gap-3 rounded-xl hover:bg-muted"
            aria-label={t("toggleTheme")}
          >
            {isDark ? (
              <>
                <FiSun size={22} />
                <b className="text-text">{t("toggleLight")}</b>{" "}
              </>
            ) : (
              <>
                <FiMoon size={22} fill="none" />
                <b className="text-text">{t("toggleDark")}</b>{" "}
              </>
            )}
          </Button>
          {mounted && Icon && (
            <Button
              asChild
              className="h-11 w-full rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              <a href={link} download>
                <Icon size={17} />
                {tN("download")}
              </a>
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}

export default Navbar;
