import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withMDX = createMDX();

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // English URLs carry no locale prefix and the proxy rewrites them
    // (/resume → /en/resume). Optimistic routing cannot see that rewrite: once
    // it learns /[locale] from /en or /el it predicts /resume as
    // /[locale] with locale "resume", and the prefetch answers 404. Route
    // trees are therefore always resolved by the server.
    optimisticRouting: false,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(withMDX(nextConfig));
