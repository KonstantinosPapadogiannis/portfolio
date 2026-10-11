import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/metadata";
import { routing } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Rule } from "@/components/ui/rule";
import { ContentsNav } from "@/components/thesis/contents-nav";
import { ErgoHero } from "@/components/ergohub/hero";
import { ergohubSectionNumber, ergohubSections } from "@/components/ergohub/outline";
import { Overview } from "@/components/ergohub/overview";
import { Application } from "@/components/ergohub/application";
import { Containers } from "@/components/ergohub/containers";
import { Pipeline } from "@/components/ergohub/pipeline";
import { Kubernetes } from "@/components/ergohub/kubernetes";
import { Challenges } from "@/components/ergohub/challenges";
import { Learned } from "@/components/ergohub/learned";
import { siteConfig } from "@/config/site";
import { ergohub } from "@/config/work";

export const instant = false;

const href = ergohub.href;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "ergohubPage" });

  return pageMetadata({
    locale,
    href,
    title: t("metaTitle"),
    description: t("description"),
    type: "article",
  });
}

// The ErgoHub case study, laid out as the thesis one is: from 1280px the
// contents list runs beside the sections. Each section comes in once as a
// block when it scrolls into view; nothing inside it moves on its own.
export default async function ErgohubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ergohubPage" });
  const tSite = await getTranslations({ locale, namespace: "site" });

  // The case study as a piece of writing by its author, as for the thesis.
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
      <ErgoHero />
      <Rule />
      <Container className="xl:grid xl:grid-cols-[11rem_minmax(0,1fr)] xl:gap-x-16">
        <div className="hidden pt-16 xl:block">
          <ContentsNav
            label={t("contents")}
            items={ergohubSections.map((id) => ({
              id,
              number: ergohubSectionNumber(id),
              label: t(`sections.${id}.nav`),
            }))}
          />
        </div>
        <Reveal>
          <Overview />
          <Application />
          <Containers />
          <Pipeline />
          <Kubernetes />
          <Challenges />
          <Learned />
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
