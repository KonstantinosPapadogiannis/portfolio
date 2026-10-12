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
import { ContentsNav } from "@/components/thesis/contents-nav";
import { CudaHero } from "@/components/cuda/hero";
import { cudaSectionNumber, cudaSections } from "@/components/cuda/outline";
import { Baseline, Bottleneck, Optimisation, Result } from "@/components/cuda/sections";
import { siteConfig } from "@/config/site";
import { cuda } from "@/config/work";

export const instant = false;

const href = cuda.href;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "cudaPage" });

  return pageMetadata({
    locale,
    href,
    title: t("metaTitle"),
    description: t("description"),
    type: "article",
  });
}

// The CUDA case study, laid out as the OpenStack one is and shorter still:
// from 1280px the contents list runs beside the sections. Each section comes
// in once as a block when it scrolls into view, the benchmark figure with
// its section; nothing inside it moves and no number counts up.
export default async function CudaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "cudaPage" });

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
      <CudaHero />
      <Rule />
      <Container className="xl:grid xl:grid-cols-[11rem_minmax(0,1fr)] xl:gap-x-16">
        <div className="hidden pt-16 xl:block">
          <ContentsNav
            label={t("contents")}
            items={cudaSections.map((id) => ({
              id,
              number: cudaSectionNumber(id),
              label: t(`sections.${id}.nav`),
            }))}
          />
        </div>
        <Reveal>
          <Baseline />
          <Bottleneck />
          <Optimisation />
          <Result />
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
