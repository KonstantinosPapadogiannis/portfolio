import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { openGraphLocales, routing } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Rule } from "@/components/ui/rule";
import { ContentsNav } from "@/components/thesis/contents-nav";
import { OpenstackHero } from "@/components/openstack/hero";
import { openstackSectionNumber, openstackSections } from "@/components/openstack/outline";
import {
  Application,
  Debugging,
  Environment,
  Network,
  OpenstackLayer,
  Reflection,
} from "@/components/openstack/sections";
import { siteConfig } from "@/config/site";
import { openstack } from "@/config/work";

export const instant = false;

const href = openstack.href;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "openstackPage" });
  const tSite = await getTranslations({ locale, namespace: "site" });
  const path = getPathname({ href, locale });

  return {
    title: t("metaTitle"),
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
      title: t("metaTitle"),
      description: t("description"),
    },
  };
}

// The OpenStack case study, laid out as the ErgoHub one is but shorter: from
// 1280px the contents list runs beside the sections. Each section comes in
// once as a block when it scrolls into view; nothing inside it moves.
export default async function OpenstackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "openstackPage" });
  const tSite = await getTranslations({ locale, namespace: "site" });

  // The case study as a piece of writing by its author, as for the others.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: t("metaTitle"),
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
      <OpenstackHero />
      <Rule />
      <Container className="xl:grid xl:grid-cols-[11rem_minmax(0,1fr)] xl:gap-x-16">
        <div className="hidden pt-16 xl:block">
          <ContentsNav
            label={t("contents")}
            items={openstackSections.map((id) => ({
              id,
              number: openstackSectionNumber(id),
              label: t(`sections.${id}.nav`),
            }))}
          />
        </div>
        <Reveal>
          <Environment />
          <OpenstackLayer />
          <Network />
          <Debugging />
          <Application />
          <Reflection />
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
