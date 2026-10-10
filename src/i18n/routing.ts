import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "el"],
  defaultLocale: "en",
  // The URL alone decides the language: / is always English and /el always
  // Greek, whatever the browser language or an earlier visit. A link to the
  // English page opens in English for everyone, and no locale cookie is set.
  localeDetection: false,
  localeCookie: false,
  // The page metadata lists the language versions on the production domain.
  // The middleware's Link header would list them on whichever host served
  // the request, the Vercel alias included.
  alternateLinks: false,
  localePrefix: {
    mode: "as-needed",
    prefixes: {
      el: "/el",
    },
  },
  pathnames: {
    "/": "/",
    "/work/thesis": "/work/thesis",
    "/work/ergohub": "/work/ergohub",
    "/work/openstack": "/work/openstack",
    "/work/cuda": "/work/cuda",
    "/work/computer-vision": "/work/computer-vision",
    "/work/energy-data-mining": "/work/energy-data-mining",
    "/resume": "/resume",
  },
});

export type AppLocale = (typeof routing.locales)[number];

// Each language is named in itself, so these labels are not translated.
export const localeLabels: Record<AppLocale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  el: { short: "ΕΛ", name: "Ελληνικά" },
};

export const openGraphLocales: Record<AppLocale, string> = {
  en: "en_US",
  el: "el_GR",
};
