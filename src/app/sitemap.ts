import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Public pages only; the QA routes are never listed.
const pages = ["/", "/resume", "/work/thesis"] as const;

// One entry per language version, each listing every alternate, so the URLs
// match the canonical links in the page metadata exactly (/el, not /el/).
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((href) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        `${siteConfig.url}${getPathname({ href, locale })}`,
      ]),
    );

    return routing.locales.map((locale) => ({
      url: languages[locale],
      alternates: { languages },
    }));
  });
}
