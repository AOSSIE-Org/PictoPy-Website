import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/**/*.test.{ts,tsx}"],
    setupFiles: ["tests/setup.ts"],
    // next-intl imports "next/navigation" without an extension, which Node cannot
    // resolve; letting Vite transform it also lets tests mock the Next.js router.
    server: { deps: { inline: ["next-intl"] } },
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "lcov"],
      // The whole application: every page, layout, component, hook, config and helper in src/.
      // (Message catalogs, CSS and images are data, not code, and are checked by their own tests.)
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        // Type declarations only (src/types/): no runtime code to execute.
        "**/*.d.ts",
      ],
      // Enforced in CI by `npm run test:coverage`.
      thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
