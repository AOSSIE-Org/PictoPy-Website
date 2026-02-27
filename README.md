<div align="center">

# PictoPy Website

The official landing page for **[PictoPy](https://github.com/AOSSIE-Org/PictoPy)** — a privacy-first, AI-powered desktop image gallery.

[![Deploy](https://github.com/AOSSIE-Org/PictoPy-Website/actions/workflows/build-and-deploy.yaml/badge.svg)](https://github.com/AOSSIE-Org/PictoPy-Website/actions/workflows/build-and-deploy.yaml)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

**[pictopy.aossie.org](https://pictopy.aossie.org)** · [PictoPy App Repo](https://github.com/AOSSIE-Org/PictoPy) · [Discord](https://discord.gg/hjUhu33uAn)

</div>

---

## About PictoPy

PictoPy is an advanced desktop gallery application that combines **Tauri**, **React**, and **Rust** for the frontend with a **Python** backend for sophisticated AI-powered image analysis and management.

It runs entirely offline, keeping your photos and their analysis private — no cloud uploads, no external servers.

### Key Features

- **Smart Auto-Tagging** — automatically tags photos based on detected objects and recognized faces using YOLOv11 and FaceNet
- **Face Clustering** — groups photos by person using DBSCAN clustering on face embeddings
- **Smart Search** — find photos by objects, faces, or metadata instantly
- **Album Management** — full traditional gallery features alongside AI capabilities
- **Privacy-First** — fully offline, all processing happens locally on your machine
- **Cross-Platform** — runs on Windows, macOS, and Linux via Tauri

### Tech Stack

| Layer | Technology |
|---|---|
| Desktop Framework | Tauri |
| Frontend | React, TypeScript, Tailwind CSS |
| Rust Backend | Rust (file system & Tauri bridge) |
| Python Backend | FastAPI, Python |
| Object Detection | YOLOv11 |
| Face Recognition | FaceNet, ONNX Runtime |
| Face Clustering | DBSCAN |
| Database | SQLite |
| Image Processing | OpenCV |
| State Management | Redux Toolkit |

---

## About This Repo

This repository contains the **marketing website** for PictoPy, built with React, Vite, and Tailwind CSS. It is automatically deployed to [pictopy.aossie.org](https://pictopy.aossie.org) via GitHub Pages on every push to `main`.

### Local Development

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Production build
npm run build
```

The dev server runs at `http://localhost:5173`.

### Project Structure

```
src/
├── Pages/
│   ├── Landing page/     # Hero section & Navbar
│   ├── Demo/             # Interactive demo marquee
│   ├── HowItWorks/       # How It Works section
│   ├── FaqPage/          # FAQ section
│   ├── Footer/           # Footer
│   └── pictopy-landing.tsx
├── components/
│   └── ui/               # Reusable UI components
├── context/
│   └── theme-provider.tsx
└── lib/
    └── utils.ts
```

### Deployment

Pushes to `main` trigger the [GitHub Actions workflow](.github/workflows/build-and-deploy.yaml), which builds the site and deploys it to GitHub Pages at [pictopy.aossie.org](https://pictopy.aossie.org).

---

## Contributing

We welcome contributions to the website! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) guide before submitting a PR.

For contributions to the PictoPy application itself, visit the [main repository](https://github.com/AOSSIE-Org/PictoPy) and join the [Discord server](https://discord.gg/hjUhu33uAn).

## License

This project is licensed under the [GPL-3.0 License](LICENSE).
