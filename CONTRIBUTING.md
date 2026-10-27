# Contributing to the PictoPy Website

We welcome contributions of all kinds: bug fixes, new sections, translations, accessibility and performance improvements, or documentation. This repository is the landing page for [PictoPy](https://github.com/AOSSIE-Org/PictoPy), AOSSIE's privacy-first desktop photo manager.

By participating you agree to our Code of Conduct and certify your work under the [Developer Certificate of Origin (DCO 1.1)](DCO.md) by signing off every commit (`git commit -s`). See [COPYRIGHT.md](COPYRIGHT.md) for copyright statements.

---

## 💬 Join our Discord Community

All project communication happens on Discord. We do not track GitHub notifications.

1. Join the **AOSSIE Discord server**: [https://discord.gg/hjUhu33uAn](https://discord.gg/hjUhu33uAn)
2. Then open the **[#pictopy](https://discord.com/channels/1022871757289422898/1311271974630330388)** channel (the channel link only works once you are a member).

Post a link to your issue or PR in the channel so maintainers see it.

---

## 🛠️ Getting Started

### 1. Prerequisites

- **Node.js** `v22.12.0` or higher
- **npm** `v10` or higher

### 2. Fork & Clone

```bash
git clone https://github.com/<your-username>/PictoPy-Website.git
cd PictoPy-Website
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site redirects to the default locale (`/en`).

---

## 📜 Pull Request Guidelines

1. **Branch from `main`:** `git checkout -b feat/short-description`
2. **Run all checks before pushing.** CI runs the same commands on every PR:

   ```bash
   npm run lint
   npm run test:coverage   # Vitest unit + property tests, 90% coverage threshold
   npm run build           # static export to out/
   ```

3. **Tests are required for new logic.** Anything in `src/lib/`, `src/hooks/`, `src/config/`, `src/i18n/` or `src/app/sitemap.ts` must come with tests in `tests/`. Use [fast-check](https://fast-check.dev) property tests where an input space is large (user agents, file names, URLs).
4. **Commit messages** follow [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `docs:`, `test:`, `chore:`), signed off with `-s`.
5. **Screenshots:** include before/after screenshots (light and dark, desktop and mobile) for any visual change.

---

## 📋 Code Style & Architecture

- **Next.js 16 App Router, static export.** Use Server Components by default and add `"use client"` only to interactive components.
- **Tailwind CSS v4 semantic tokens.** Use the theme variables defined in [`globals.css`](src/app/[locale]/globals.css) instead of ad-hoc `dark:` utilities.
- **i18n.** Every user-visible string goes into both [`src/messages/en.json`](src/messages/en.json) and [`src/messages/hi.json`](src/messages/hi.json). The catalog tests fail if keys or ICU placeholders differ.
- **Navigation.** Import `Link`, `useRouter` and `usePathname` from [`src/i18n/navigation.ts`](src/i18n/navigation.ts), never from `next/link` or `next/navigation`.
- **No magic constants.** Put URLs, release links and tunable values in [`src/const/const.ts`](src/const/const.ts) or [`src/config/`](src/config/).
- **Accessibility.** Keep keyboard navigation, visible focus states and WCAG 2.2 AA contrast in both themes.

---

## 🔐 Security

Please do not open public issues for vulnerabilities. Follow [SECURITY.md](SECURITY.md).

Thank you for contributing to AOSSIE and PictoPy!
