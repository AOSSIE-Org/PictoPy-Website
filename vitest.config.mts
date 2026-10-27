import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "lcov"],
      // Logic modules (routing, SEO, platform detection, release lookup).
      // Presentational components are verified by the build and visual review.
      include: [
        "src/lib/**",
        "src/config/**",
        "src/hooks/**",
        "src/i18n/metadata.ts",
        "src/app/sitemap.ts",
      ],
      thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
