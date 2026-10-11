"use client";

import { Fragment } from "react";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import { localeLabels, routing } from "@/i18n/routing";
import { GlobeIcon } from "@/components/icons";

const tones = {
  header: {
    group: "text-[0.8125rem] text-muted",
    // Decorative. Below 360px the header needs its width for the name.
    icon: "max-[360px]:hidden",
    link: "hover:text-ink",
    current: "text-ink",
  },
  footer: {
    // The first label lines up with the text above it on phones.
    group: "-ml-1 text-[0.6875rem] text-footer-muted",
    icon: "",
    // 44px touch targets below 1024px, as for the other footer links.
    link: "inline-flex min-h-11 items-center hover:text-footer-ink lg:min-h-0",
    current: "text-footer-ink",
  },
} as const;

// Set in the sans of each language rather than in IBM Plex Mono: Plex Mono
// has no Greek, and "EN" and "ΕΛ" should read as one control. Each label
// carries its own lang, so "EN" is set in Geist and "ΕΛ" in Inter on both
// locales; "ΕΛ" through the family that holds Inter's Greek file alone
// (globals.css), so English pages need no other Inter file.
//
// The hrefs are the canonical URLs of the same page in each language (/resume,
// /el/resume). next-intl's Link would render /en/resume for English, which
// only redirects to /resume; that hop exists to update the locale cookie, and
// this site sets none. Not prefetched: switching language is rare, and every
// page would otherwise download the other language's payload.
export function LanguageSwitcher({
  tone = "header",
  showIcon = true,
}: {
  tone?: keyof typeof tones;
  showIcon?: boolean;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("language");
  const styles = tones[tone];

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={`flex items-center gap-0.5 font-medium tracking-[0.04em] ${styles.group}`}
    >
      {showIcon && <GlobeIcon size={15} className={`mr-1 shrink-0 ${styles.icon}`} />}
      {routing.locales.map((target, index) => {
        const isCurrent = target === locale;
        return (
          <Fragment key={target}>
            {index > 0 && <span aria-hidden="true">·</span>}
            <NextLink
              href={getPathname({ href: pathname, locale: target })}
              prefetch={false}
              lang={target}
              hrefLang={target}
              aria-label={localeLabels[target].name}
              aria-current={isCurrent ? "true" : undefined}
              className={`px-1 py-2 transition-colors duration-150 ${styles.link} ${isCurrent ? styles.current : ""} ${target === "el" ? "font-[family-name:var(--font-inter-greek)]" : ""}`}
            >
              {localeLabels[target].short}
            </NextLink>
          </Fragment>
        );
      })}
    </div>
  );
}
