import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias["next-intl/config"] = path.resolve(
      process.cwd(),
      "./src/i18n/request.ts",
    );
    return config;
  },
  turbopack: {
    root: path.resolve(process.cwd()),
    resolveAlias: {
      "next-intl/config": "./src/i18n/request.ts",
    },
  },
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
