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

export const instant = false;

// A request for /old.pdf reaches this route with "old.pdf" as the locale. The
// first one waits for the complete render, so it is answered 404 rather than
// with a 200 fallback shell.
export const ensureStatic = "navigation";

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
