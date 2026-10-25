<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# PictoPy Website

PictoPy is an open-source, privacy-first AI photo management application built for the desktop - featuring on-device face recognition, object detection, and smart search, with zero data leaving your machine.

PictoPy brings the intelligence of modern AI photo management to your local machine, without the privacy trade-offs of cloud-based alternatives. Built as a fully offline desktop application with Rust, React, and Python, PictoPy automatically groups faces across your library, tags photos with detected objects, and lets you search your pictures with simple words - all powered by state-of-the-art on-device models, without an internet connection or a subscription.

Find out more at https://pictopy.aossie.org/.

## 🛠️ Stack & Commands

- **Stack:** Next.js 16.2.11 App Router (Turbopack), React 19, Tailwind CSS v4, `next-intl` (i18n), custom theme context ([`src/context/theme-provider.tsx`](src/context/theme-provider.tsx)) for light/dark state.
- **Build:** `npm run build`
- **Develop:** `npm run dev`

---

## 🎨 Styles & Theme System

- **Class-Based Dark Mode:** Tailwind CSS v4 is configured for class-based overrides using `@custom-variant dark (&:where(.dark, .dark *))` in [`globals.css`](src/app/[locale]/globals.css).
- **Semantic Tokens:** Do **not** write inline layout dark utilities (e.g., `dark:bg-black` or `dark:text-zinc-50`). Always write semantic classes linked to the central theme variables (e.g., `bg-background-primary`, `text-foreground-primary`).
- **Typography:** The default font family is **Inter**. It is mapped to `--font-sans` in globals.css.
- **Breakpoint gotcha:** Never mix px-based arbitrary variants (e.g., `min-[900px]:`) with rem-based named breakpoints (`sm:`, `lg:`) on the same property — Tailwind v4 cannot order them, so the wrong rule can win. Stick to the named breakpoints.
- **Copy lives in messages:** All user-facing strings must go through `next-intl` catalogs in [`src/messages/`](src/messages/) (`en.json` + `hi.json`) — never hard-code visible text in components.

---

## 🌐 i18n & l10n Routing

- **Dynamic segment:** All localized pages and layouts must be nested inside [`src/app/[locale]/`](src/app/[locale]/).
- **Awaiting params:** Layout and Page `params` props are Promises in Next.js 15/16. Always `await params` before accessing `locale`.
- **Navigation:** Never import `Link`, `useRouter`, or `usePathname` from standard `next/link` or `next/navigation`. Always import them from local configuration helpers in [`src/i18n/navigation.ts`](src/i18n/navigation.ts).

---

## 📦 Project Boundaries

- **Config alias map:** Webpack & Turbopack alias resolvers are manually defined in [`next.config.ts`](next.config.ts) mapping `"next-intl/config"` to our local request setup. Do not import the native `@swc/core` compiler plugin wrapper `createNextIntlPlugin` directly to avoid security policy native module blocks.
- **Branding Assets:** The official branding logo, favicon, and style specifications reside inside [`brand/`](brand/).

