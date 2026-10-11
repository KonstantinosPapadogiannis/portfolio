import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Separator } from "@/components/ui/separator";
import { SystemsMotif } from "@/components/home/systems-motif";
import { ogImageSize } from "@/lib/metadata";
import { br } from "@/lib/rich-text";

// The share image of each language, drawn with the site's own type, colours
// and motif. scripts/og-images.mjs photographs #og-card at 1200×630 into
// public/og/{locale}.png. Like the typography page, a route only in QA builds
// (".qa.tsx", see pageExtensions in next.config.ts).

export const metadata: Metadata = {
  title: "Share image QA",
  robots: { index: false, follow: false },
};

export default async function OgQaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "hero" });
  const tEducation = await getTranslations({ locale, namespace: "about.education" });

  return (
    <div className="overflow-x-auto py-10">
      <div
        id="og-card"
        style={ogImageSize}
        className="mx-auto grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-14 bg-background px-20 py-[72px] text-ink"
      >
        <div className="flex min-w-0 self-stretch flex-col justify-between">
          <p className="font-label text-[19px] leading-6 tracking-[0.02em] text-muted uppercase">
            {t("name")}
            <Separator className="pr-[4px] pl-4" />
            {t("location")}
          </p>
          <p className="text-[56px] leading-[62px] font-semibold tracking-[-0.025em]">
            {t.rich("headline", { br })}
          </p>
          <p
            className={`border-t border-border pt-6 leading-[28px] text-muted ${
              locale === "el" ? "text-[18px]" : "text-[20px]"
            }`}
          >
            {tEducation("degree")}, {tEducation("university")}
          </p>
        </div>
        <SystemsMotif className="block w-[270px]" />
      </div>
    </div>
  );
}
