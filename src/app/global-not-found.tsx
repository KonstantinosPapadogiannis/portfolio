import type { Metadata } from "next";
import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SiteDocument } from "@/components/site-document";
import { NotFoundContent } from "@/components/not-found-content";

// Every address no route matches. The locale layout cannot answer these with
// server-rendered HTML: a notFound() thrown under it reaches the browser as an
// empty document that only JavaScript fills in. This page is rendered on the
// server in the language of the address, which the proxy passes on, so it
// renders per request.
export const instant = false;

async function requestLocale() {
  const requested = (await headers()).get("x-next-intl-locale");
  return hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const t = await getTranslations({ locale, namespace: "notFound" });
  const tSite = await getTranslations({ locale, namespace: "site" });

  return {
    title: `${t("title")} — ${tSite("name")}`,
    description: t("body"),
    icons: { icon: "/favicon.ico" },
  };
}

export default async function GlobalNotFound() {
  const locale = await requestLocale();
  setRequestLocale(locale);

  return (
    <SiteDocument locale={locale}>
      <NotFoundContent />
    </SiteDocument>
  );
}
