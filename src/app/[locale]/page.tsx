import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Rule } from "@/components/ui/rule";
import { Hero } from "@/components/home/hero";
import { SelectedWork } from "@/components/home/selected-work";
import { About } from "@/components/home/about";
import { Story } from "@/components/home/story";
import { AcademicHighlights } from "@/components/home/academic-highlights";
import { Interests } from "@/components/home/interests";
import { MoreWork, Technologies } from "@/components/home/more-work";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

export const instant = false;

// The whole page is prerendered, so a later change cannot make it render per
// request without failing the build.
export const ensureStatic = "navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "home" });
  const tSite = await getTranslations({ locale, namespace: "site" });

  return pageMetadata({
    locale,
    href: "/",
    title: { absolute: `${tSite("name")} — ${t("title")}` },
    description: t("description"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tSite = await getTranslations({ locale, namespace: "site" });
  const tEducation = await getTranslations({ locale, namespace: "about.education" });

  // Who the site is about, as shown on the page: no job title or employer.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: tSite("name"),
    url: siteConfig.url,
    address: {
      "@type": "PostalAddress",
      addressLocality: locale === "el" ? "Αθήνα" : "Athens",
      addressCountry: "GR",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: tEducation("university"),
    },
    sameAs: [siteConfig.github, siteConfig.linkedin, siteConfig.orcid],
  };

  return (
    <>
      <Hero />
      <Rule />
      <SelectedWork />
      <Rule />
      <About />
      <Rule />
      <Story />
      <Rule />
      <AcademicHighlights />
      <Rule />
      <Interests />
      <Rule />
      <MoreWork />
      <Rule />
      <Technologies />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
