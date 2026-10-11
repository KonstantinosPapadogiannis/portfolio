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
import { VisionHero } from "@/components/vision/hero";
import { visionSectionNumber, visionSections } from "@/components/vision/outline";
import {
  Classification,
  Comparison,
  Lessons,
  SegmentationDetection,
} from "@/components/vision/sections";
import { siteConfig } from "@/config/site";
import { vision } from "@/config/work";

export const instant = false;

const href = vision.href;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "visionPage" });

  return pageMetadata({
    locale,
    href,
    title: t("metaTitle"),
    description: t("description"),
    type: "article",
  });
}

// The computer vision case study, laid out as the CUDA one is and lighter
// still: from 1280px the contents list runs beside the sections. Each section
// comes in once as a block when it scrolls into view, the results table with
// its section; nothing inside it moves and no number counts up.
export default async function ComputerVisionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "visionPage" });
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
      <VisionHero />
      <Rule />
      <Container className="xl:grid xl:grid-cols-[11rem_minmax(0,1fr)] xl:gap-x-16">
        <div className="hidden pt-16 xl:block">
          <ContentsNav
            label={t("contents")}
            items={visionSections.map((id) => ({
              id,
              number: visionSectionNumber(id),
              label: t(`sections.${id}.nav`),
            }))}
          />
        </div>
        <Reveal>
          <Classification />
          <Comparison />
          <SegmentationDetection />
          <Lessons />
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
