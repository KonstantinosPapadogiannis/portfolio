import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/metadata";
import { personReference } from "@/lib/structured-data";
import { routing } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Rule } from "@/components/ui/rule";
import { EnergyHero } from "@/components/energy/hero";
import { Classification, Comparison, Forecasting } from "@/components/energy/sections";
import { siteConfig } from "@/config/site";
import { energy } from "@/config/work";

export const instant = false;

const href = energy.href;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "energyPage" });

  return pageMetadata({
    locale,
    href,
    title: t("metaTitle"),
    description: t("description"),
    type: "article",
  });
}

// The energy data mining case study, the most compact of the case studies:
// three sections in one column, no contents list. Each section comes in once
// as a block when it scrolls into view, the forecast figure with its
// section; nothing inside it moves and no number counts up.
export default async function EnergyDataMiningPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "energyPage" });

  // The case study as a piece of writing by its author, as for the others.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: t("metaTitle"),
    alternativeHeadline: t("subtitle"),
    description: t("description"),
    url: `${siteConfig.url}${getPathname({ href, locale })}`,
    inLanguage: locale,
    author: personReference,
  };

  return (
    <article aria-labelledby="case-title">
      <EnergyHero />
      <Rule />
      <Container>
        <Reveal>
          <Classification />
          <Forecasting />
          <Comparison />
        </Reveal>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </article>
  );
}
