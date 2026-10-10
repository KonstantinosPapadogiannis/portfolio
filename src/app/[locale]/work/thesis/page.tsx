import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { openGraphLocales, routing } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { Rule } from "@/components/ui/rule";
import { CaseHero } from "@/components/thesis/case-hero";
import { ContentsNav } from "@/components/thesis/contents-nav";
import { caseSections, sectionNumber } from "@/components/thesis/outline";
import { Overview } from "@/components/thesis/overview";
import { Challenge } from "@/components/thesis/challenge";
import { DesignResponse } from "@/components/thesis/design-response";
import { Architecture } from "@/components/thesis/architecture";
import { Policy } from "@/components/thesis/policy";
import { Signing } from "@/components/thesis/signing";
import { Privacy } from "@/components/thesis/privacy";
import { Perspectives } from "@/components/thesis/perspectives";
import { Testing } from "@/components/thesis/testing";
import { Performance } from "@/components/thesis/performance";
import { Limitations } from "@/components/thesis/limitations";
import { Learned } from "@/components/thesis/learned";
import { Outcome } from "@/components/thesis/outcome";
import { siteConfig } from "@/config/site";

export const instant = false;

const href = "/work/thesis";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "thesisPage" });
  const tSite = await getTranslations({ locale, namespace: "site" });
  const path = getPathname({ href, locale });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: path,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((target) => [target, getPathname({ href, locale: target })]),
        ),
        "x-default": getPathname({ href, locale: routing.defaultLocale }),
      },
    },
    openGraph: {
      type: "article",
      locale: openGraphLocales[locale],
      url: path,
      siteName: tSite("name"),
      title: t("title"),
      description: t("description"),
    },
  };
}

// The thesis case study. From 1280px the contents list runs beside the
// sections; below that the sections follow each other with their numbers.
export default async function ThesisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "thesisPage" });
  const tSite = await getTranslations({ locale, namespace: "site" });

  // The case study as a piece of writing by its author. No publisher or
  // publication date: the thesis itself is not published here.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: t("title"),
    alternativeHeadline: t("subtitle"),
    description: t("description"),
    url: `${siteConfig.url}${getPathname({ href, locale })}`,
    inLanguage: locale,
    author: {
      "@type": "Person",
      name: tSite("name"),
      url: siteConfig.url,
    },
  };

  return (
    <article aria-labelledby="case-title">
      <CaseHero />
      <Rule />
      <Container className="xl:grid xl:grid-cols-[11rem_minmax(0,1fr)] xl:gap-x-16">
        <div className="hidden pt-16 xl:block">
          <ContentsNav
            label={t("contents")}
            items={caseSections.map((id) => ({
              id,
              number: sectionNumber(id),
              label: t(`sections.${id}.nav`),
            }))}
          />
        </div>
        <div>
          <Overview />
          <Challenge />
          <DesignResponse />
          <Architecture />
          <Policy />
          <Signing />
          <Privacy />
          <Perspectives />
          <Testing />
          <Performance />
          <Limitations />
          <Learned />
          <Outcome />
        </div>
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
