import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
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
  const t = await getTranslations({ locale, namespace: "resume" });

  return {
    title: t("title"),
    alternates: {
      canonical: getPathname({ href: "/resume", locale }),
      languages: {
        ...Object.fromEntries(
          routing.locales.map((target) => [
            target,
            getPathname({ href: "/resume", locale: target }),
          ]),
        ),
        "x-default": getPathname({
          href: "/resume",
          locale: routing.defaultLocale,
        }),
      },
    },
  };
}

// Temporary page. It keeps the header's Résumé link working and exposes the
// existing PDF until the résumé layout is built.
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
        className="text-[40px] font-bold leading-[1.06] tracking-[-0.02em] text-ink md:text-[64px]"
      >
        {t("title")}
      </h1>
      <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.6] text-muted">
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
