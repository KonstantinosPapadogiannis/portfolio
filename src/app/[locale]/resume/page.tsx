import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/metadata";
import { routing } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "resume" });

  return pageMetadata({
    locale,
    href: "/resume",
    title: t("title"),
    description: t("description"),
  });
}

// The CV exists as a one-page PDF in English. This page describes it and
// offers it to view or download, in both locales.
export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "resume" });

  return (
    <Container as="section" aria-labelledby="resume-heading" className="py-16 md:py-24">
      <h1
        id="resume-heading"
        className="text-[2.5rem] font-bold leading-[1.06] tracking-[-0.02em] text-ink md:text-[4rem]"
      >
        {t("title")}
      </h1>
      <p className="mt-4 max-w-[60ch] text-[1.0625rem] leading-[1.6] text-muted">
        {t("body")}
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button
          variant="primary"
          href={siteConfig.resumePdf}
          type="application/pdf"
          hrefLang="en"
        >
          {t("view")}
        </Button>
        <Button
          variant="secondary"
          href={siteConfig.resumePdf}
          type="application/pdf"
          hrefLang="en"
          download
        >
          {t("download")}
        </Button>
      </div>
    </Container>
  );
}
