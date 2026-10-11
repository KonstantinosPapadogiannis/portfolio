import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { routing } from "@/i18n/routing";
import { SiteDocument } from "@/components/site-document";
import { deployment } from "@/config/deployment";
import { siteConfig } from "@/config/site";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Shared by every page under the locale. Each page adds its own description,
// canonical address, language versions and share cards (lib/metadata.ts).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const tSite = await getTranslations({ locale, namespace: "site" });
  const name = tSite("name");

  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    title: {
      default: name,
      template: `%s — ${name}`,
    },
    icons: {
      icon: "/favicon.ico",
    },
    robots: deployment.indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return <SiteDocument locale={locale}>{children}</SiteDocument>;
}
