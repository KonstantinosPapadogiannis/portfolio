import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";
import { routing } from "./src/i18n/routing";
import { isIndexable } from "./src/config/deployment";
import { interLatin } from "./src/config/fonts";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withMDX = createMDX();

const isDev = process.env.NODE_ENV === "development";

// Static pages and Partial Prerendering rule out per-request nonces, and
// Next.js and the theme script both write inline scripts, so script-src keeps
// 'unsafe-inline' (the "without nonces" setup in the Next.js CSP guide).
// Everything else is limited to this origin: the fonts and images are served
// from it and no third-party script, frame or connection is used.
// docs/SECURITY.md explains each directive.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self'",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  // Vercel preview and development deployments are never indexed, the PDF
  // included (see src/config/deployment.ts).
  ...(isIndexable() ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // A file named page.qa.tsx is a route only in QA builds (the Playwright run).
  pageExtensions: [
    "ts",
    "tsx",
    "mdx",
    ...(process.env.ENABLE_QA_ROUTES === "1" ? ["qa.tsx"] : []),
  ],
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // English URLs carry no locale prefix and the proxy rewrites them
    // (/resume → /en/resume). Optimistic routing cannot see that rewrite: once
    // it learns /[locale] from /en or /el it predicts /resume as
    // /[locale] with locale "resume", and the prefetch answers 404. Route
    // trees are therefore always resolved by the server.
    optimisticRouting: false,
    // Unmatched addresses get src/app/global-not-found.tsx, rendered on the
    // server with the site's header and footer.
    globalNotFound: true,
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The policy is for pages. The CV is served without it, so no browser's
      // PDF viewer is restricted by a policy written for HTML.
      {
        source: "/((?!downloads/).*)",
        headers: [{ key: "Content-Security-Policy", value: contentSecurityPolicy }],
      },
      // Greek pages preload Inter's Latin file as well (src/config/fonts.ts),
      // through this header and not through React. React would also send the
      // preload to the client router, which adds it to a page already open;
      // Chromium and WebKit do not match such a preload to the font's own
      // request, report it as unused, and WebKit loads the file twice. The
      // router's own requests carry an rsc header and do not get it.
      {
        source: "/el/:path*",
        missing: [{ type: "header", key: "rsc" }],
        headers: [
          {
            key: "Link",
            value: `<${interLatin}>; rel=preload; as="font"; crossorigin=""; type="font/woff2"`,
          },
        ],
      },
      // Inter's files never change under their folder name (globals.css).
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [],
      // Addresses the proxy skips (a dot in them, like /old.pdf, or an /api
      // prefix) and no file in public/ answers would reach /[locale] with
      // their first segment as the locale, and its notFound() sends an empty
      // page. Under the default locale they match no route and get the
      // server-rendered global 404 instead.
      afterFiles: [
        {
          source: `/:first((?!(?:${routing.locales.join("|")})(?:/|$))[^/]+)/:rest*`,
          destination: `/${routing.defaultLocale}/:first/:rest*`,
        },
      ],
      fallback: [],
    };
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
