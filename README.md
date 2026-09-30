<!-- Don't delete it -->
<div name="readme-top"></div>

<!-- Organization Logo -->
<div align="center" style="display: flex; align-items: center; justify-content: center; gap: 24px;">
  <img src="public/brand/icons/aossie_logo.svg" width="175" alt="AOSSIE logo" >
  <img src="public/brand/icons/pictopy_logo.svg" width="175" alt="PictoPy logo" />

</div>

&nbsp;

<!-- Organization Name -->
<div align="center">

[![Static Badge](https://img.shields.io/badge/AOSSIE-Webpage--Starter-228B22?style=for-the-badge&labelColor=FFC517)](https://aossie.org/)

</div>

<!-- Organization/Project Social Handles -->
<p align="center">
<!-- Telegram -->
<a href="https://t.me/+bMWGzaMTMa8xN2Ex">
<img src="https://img.shields.io/badge/Telegram-black?style=flat&logo=telegram&logoColor=white&logoSize=auto&color=24A1DE" alt="Telegram Badge"/></a>
&nbsp;&nbsp;
<!-- X (formerly Twitter) -->
<a href="https://x.com/aossie_org">
<img src="https://img.shields.io/twitter/follow/aossie_org" alt="X Badge"/></a>
&nbsp;&nbsp;
<!-- Discord AOSSIE-->
<a href="https://discord.gg/hjUhu33uAn">
<img src="https://img.shields.io/discord/995968619034984528?style=flat&logo=discord&logoColor=white&logoSize=auto&label=Discord&labelColor=5865F2&color=57F287" alt="Discord AOSSIE"/></a>
<!-- Discord Stability Nexus-->
<a href="https://discord.gg/YzDKeEfWtS">
<img src="https://img.shields.io/discord/995968619034984528?style=flat&logo=discord&logoColor=white&logoSize=auto&label=Discord&labelColor=5865F2&color=57F287" alt="Discord Stability Nexus"/></a>
&nbsp;&nbsp;
<!-- LinkedIn -->
<a href="https://www.linkedin.com/company/aossie/">
  <img src="https://img.shields.io/badge/LinkedIn-black?style=flat&logo=LinkedIn&logoColor=white&logoSize=auto&color=0A66C2" alt="LinkedIn Badge"></a>
&nbsp;&nbsp;
<!-- Youtube AOSSIE-->
<a href="https://www.youtube.com/@AOSSIE-Org">
  <img src="https://img.shields.io/youtube/channel/subscribers/UCKVVLbawY7Gej_3o2WKsoiA?style=flat&logo=youtube&logoColor=white%20&logoSize=auto&labelColor=FF0000&color=FF0000" alt="Youtube AOSSIE Badge"></a>
<a href="https://www.youtube.com/@StabilityNexus">
  <img src="https://img.shields.io/youtube/channel/subscribers/UCKVVLbawY7Gej_3o2WKsoiA?style=flat&logo=youtube&logoColor=white%20&logoSize=auto&labelColor=FF0000&color=FF0000" alt="Youtube YouTube Badge"></a>
</p>

---

<div align="center">
<h1>PictoPy Website</h1>
</div>

[PictoPy Website](https://pictopy.aossie.org/) is the official landing page for **[PictoPy](https://github.com/AOSSIE-Org/PictoPy)**: a privacy-first, AI-powered desktop image gallery.

A high-performance, developer-friendly webpage built on **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and pre-configured for **Internationalization (i18n)** and **Localization (l10n)** using **next-intl**.

[![Deploy](https://github.com/AOSSIE-Org/PictoPy-Website/actions/workflows/build-and-deploy.yaml/badge.svg)](https://github.com/AOSSIE-Org/PictoPy-Website/actions/workflows/build-and-deploy.yaml)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

</div>

---

## About PictoPy

PictoPy is an advanced desktop gallery application that combines **Tauri**, **React**, and **Rust** for the frontend with a **Python** backend for sophisticated AI-powered image analysis and management.

It runs entirely offline, keeping your photos and their analysis private — no cloud uploads, no external servers.

---

## 🚀 PictoPy's Features

- **Smart Auto-Tagging** — automatically tags photos based on detected objects and recognized faces using YOLOv11 and FaceNet
- **Face Clustering** — groups photos by person using DBSCAN clustering on face embeddings
- **Smart Search** — find photos by objects, faces, or metadata instantly
- **Album Management** — full traditional gallery features alongside AI capabilities
- **Privacy-First** — fully offline, all processing happens locally on your machine
- **Cross-Platform** — runs on Windows, macOS, and Linux via Tauri

---

## 💻 Tech Stack

| Layer             | Technology                        |
| ----------------- | --------------------------------- |
| Desktop Framework | Tauri                             |
| Frontend          | React, TypeScript, Tailwind CSS   |
| Rust Backend      | Rust (file system & Tauri bridge) |
| Python Backend    | FastAPI, Python                   |
| Object Detection  | YOLOv11                           |
| Face Recognition  | FaceNet, ONNX Runtime             |
| Face Clustering   | DBSCAN                            |
| Database          | SQLite                            |
| Image Processing  | OpenCV                            |
| State Management  | Redux Toolkit                     |

---

## 🚀 Key Features of PictoPy Website

- **Next.js 16 & React 19:** Utilizing the latest Server Components, Client Actions, and async routing paradigms.
- **Tailwind CSS v4:** Modern utility-first styling with native CSS variables and streamlined postcss integrations.
- **Dual Theme System:** Flash-free light and dark themes using a custom React theme provider ([`src/context/theme-provider.tsx`](src/context/theme-provider.tsx)) and Tailwind CSS v4 class-based custom variants.
- **Complete Landing Page:** Hero with live download links (GitHub Releases API), Mac-style app mockups with a live locale-aware menu-bar clock, feature cards, metrics, community CTAs, FAQ accordion, and a footer with an interactive letter-animated watermark.
- **Robust i18n & l10n:** Deeply integrated multi-language support:
  - Automatic locale detection based on browser preferences.
  - Subpath routing (e.g., `/hi` for Hindi, and unprefixed `/` for English as default) with clean `as-needed` URL prefixing.
  - Sleek, interactive language switcher client component.
  - Zero-bundle-size footprint for static translations using Server Components & Client `useTranslations`.
- **Developer Experience:** Strict TypeScript compilation and ES Lint setup.
- **Application Control Compatibility:** Configured with manual Webpack & Turbopack alias resolution to bypass restrictive execution environments blocking native binary compiles.
- **Open-Source Governance & CI/CD:** Integrated GitHub Actions workflows (`ci.yml`, `nextjs.yml`, `label-merge-conflicts.yml`), `.coderabbit.yml`, and `DCO.md` legal documentation.
- **AI Agent Pairing Ready:** Includes `AGENTS.md` and `CLAUDE.md` to guide AI development agents.

---

## 📂 Project Structure

Here is a breakdown of the key i18n directories and files:

```text
├── .github/                        # GitHub configuration and CI workflows
│   └── workflows/
├── .coderabbit.yml                 # Automated AI Code Review configuration
├── AGENTS.md                       # AI agent directives and rules
├── CLAUDE.md                       # Notes for Claude or AI assistance
├── COPYRIGHT.md
├── Contributors.md
├── DCO.md
├── README.md
├── Tasks.md
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── public/                         # Public static assets
│   ├── llms.txt
│   ├── robots.txt
│   └── brand/
│       ├── Brand.md
│       ├── assets/                 # App screenshots used in the mockups
│       │   ├── hero.jpg
│       │   ├── 1.jpg
│       │   ├── 2.jpg
│       │   └── 3.jpg
│       └── icons/
│           ├── aossie_logo.svg
│           ├── pictopy_logo.svg
│           ├── stability_nexus_logo.svg
│           └── favicon.ico
├── src/                            # Source files
│   ├── app/
│   │   ├── page.tsx                # Root redirect
│   │   ├── sitemap.ts
│   │   └── [locale]/
│   │       ├── globals.css
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── error.tsx
│   │       └── not-found.tsx
│   ├── assets/                     # Imported logos (SVG/PNG)
│   ├── components/
│   │   ├── Download.tsx            # Platform download buttons + release version bar
│   │   ├── Faq.tsx                 # FAQ accordion
│   │   ├── Features.tsx            # Feature cards (AI Tagging, Memories)
│   │   ├── Footer.tsx              # Download CTA, link columns, socials, copyright
│   │   ├── FooterWatermark.tsx     # Interactive "PictoPy" letter animation
│   │   ├── Hero.tsx                # Headline, badge, Powered by AOSSIE
│   │   ├── HomePage.tsx            # Section composition for the homepage
│   │   ├── LanguageSwitcher.tsx    # Designed locale dropdown
│   │   ├── MacClock.tsx            # Live locale-aware menu-bar clock
│   │   ├── MacMockDesc.tsx
│   │   ├── Metrics.tsx
│   │   ├── MockUp.tsx              # Mac-style window frame for screenshots
│   │   ├── MockUpWithDesc.tsx      # Mockup + testimonial section
│   │   ├── ShuffleGrid.tsx         # Animated background image grid
│   │   ├── SocialMediaCTA.tsx
│   │   ├── providers/
│   │   │   └── lenis-provider.tsx
│   │   └── ui/
│   │       ├── Navbar.tsx
│   │       └── button.tsx
│   ├── config/
│   ├── const/
│   ├── context/
│   │   └── theme-provider.tsx      # Light/dark theme context
│   ├── hooks/
│   ├── i18n/
│   │   ├── metadata.ts
│   │   ├── navigation.ts
│   │   ├── request.ts
│   │   └── routing.ts
│   ├── index.css
│   └── messages/
│       ├── en.json
│       └── hi.json
├── tsconfig.json
└── .gitignore

```

Notes:

- The repo uses a localized App Router layout under `src/app/[locale]` and reusable UI components under `src/components`.
- All user-facing strings live in `src/messages/{en,hi}.json`; components never hard-code copy.
- The site is fully static (`output: "export"`), so anything dynamic (release version, download links, the mockup clock) is fetched or computed client-side.

---

## 🛠️ Usage Guide

### 1. Adding a New Language

To add support for a new language (e.g., French - `fr`):

1. **Register the language:** Open [`src/config/languages.ts`](src/config/languages.ts) and add your new language to the `languages` array:

   ```typescript
   export const languages: Language[] = [
     { code: 'en', name: 'English', localName: 'English' },
     { code: 'hi', name: 'Hindi', localName: 'हिन्दी' },
     { code: 'fr', name: 'French', localName: 'Français' } // Add this line
   ];
   ```

2. **Create the translation catalog:** Under `src/messages/`, create a new file named `fr.json`:

   ```json
   {
     "Home": {
       "heading": "Bienvenue sur AOSSIE Webpage Starter"
     }
   }
   ```

3. That's it! Next.js and `next-intl` will automatically register the locale, add it to the routing tables, and handle redirection for visitors matching `fr` browser preferences.

---

### 2. Translating Text in Pages and Components

#### Server Components (Recommended for Static Content)

By default, server components can load translations statically without shipping translation JSONs to the client bundle:

```tsx
import { useTranslations } from "next-intl";

export default function Section() {
  const t = useTranslations("Home");
  return <h1>{t("heading")}</h1>;
}
```

#### Client Components

If your component uses React hooks (e.g., `useState`), define it with `"use client"` and import from `next-intl`:

```tsx
"use client";

import { useTranslations } from 'next-intl';

export default function InteractiveButton() {
  const t = useTranslations('Home');
  return <button onClick={() => alert('Clicked!')}>{t('heading')}</button>;
}
```

---

### 3. Navigation Helpers

When navigating between routes, always use the locale-aware navigation helpers imported from [`src/i18n/navigation.ts`](src/i18n/navigation.ts) instead of standard `next/link` or `next/navigation`:

```tsx
import { Link } from "../../i18n/navigation";

// Will automatically resolve to /en/about or /hi/about based on active locale
<Link href="/about">About Us</Link>;
```

For programmatic router navigation:

```typescript
import { useRouter, usePathname } from "../../i18n/navigation";

const router = useRouter();
const pathname = usePathname();

// Switch active locale on current page
router.replace(pathname, { locale: 'hi' });
```

---

### 4. Theme Configuration & Dual Theme Support

The starter kit uses `next-themes` combined with Tailwind CSS v4's class-based custom variants to provide a responsive and flash-free theme experience.

#### Customizing Colors

**Preffered Method**
Tailwind v4 is configured via CSS custom properties in [`src/app/[locale]/globals.css`](src/app/[locale]/globals.css). To adjust the default light and dark theme background or text colors, edit the root variables:

```css
:root {
  --background: #ffffff; /* Light theme background */
  --foreground: #121212; /* Light theme text */
}

.dark {
  --background: #0a0a0a; /* Dark theme background */
  --foreground: #f4f4f5; /* Dark theme text */
}
```

#### Using Theme Classes

To create element styles that adapt automatically to the user's selected theme, use semantic utility tokens instead of inline `dark:` utilities:

```tsx
<div className="bg-background-secondary text-foreground-primary border border-border-default">
  This card automatically transitions colors across light and dark themes.
</div>
```

---

### 5. Smooth Scrolling (Lenis)

The starter repository integrates the `lenis` library to provide smooth, high-performance inertial scrolling across all browsers.

#### Customizing Lenis Options

To configure scroll parameters (e.g., dampening velocity, custom scroll durations, or scroll directions), update the parameters passed to the `ReactLenis` component in [`lenis-provider.tsx`](src/components/providers/lenis-provider.tsx):

```tsx
<ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
  {children}
</ReactLenis>
```

To access the active Lenis instance or bind custom scroll animations programmatically in your page components, use the `useLenis` hook:

```typescript
import { useLenis } from "lenis/react";

const lenis = useLenis(({ scroll, limit, velocity, direction }) => {
  // Bind your scroll logic or animation timelines here
});
```

---

## ⚡ Development and Deployment

### Getting Started

Install the project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it. The application will automatically detect your browser's language preferences and route you to `/hi` for Hindi or `/` for English (the default locale, which omits the prefix).

### Building for Production

Compile and optimize the project:

```bash
npm run build
```

This compiles optimized static pages under the `/[locale]` path and checks all TypeScript configurations.

### Running in Production

Start the optimized server(This is optional if you are deploying to a static hosting service like GitHub Pages):

```bash
npm run start
```

---

## 🤝 Contributing

We welcome contributions of all kinds! To contribute:

1. Fork the repository and create your feature branch (`git checkout -b feature/AmazingFeature`).
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
3. Ensure code quality:
   - `npm run lint`
   - `npm run build`
4. Push your branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request for review.

© 2026 AOSSIE. Released under the Apache 2.0 / Open Source License.
