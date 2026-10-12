import { collaboratorConfig, siteConfig } from "@/config/site";

// The site's structured data speaks of one person and one website. Both
// homepages describe them in full, in the same words whatever the page's
// language; every other page refers to the person by @id, so search engines
// read the portfolio, the portrait, the profiles and the projects as one
// identity.
const homepage = `${siteConfig.url}/`;
export const personId = `${homepage}#person`;
export const websiteId = `${homepage}#website`;

// The author of a case study: the person of the homepage, with the name and
// address repeated for readers that do not follow the @id.
export const personReference = {
  "@type": "Person",
  "@id": personId,
  name: siteConfig.name,
  url: homepage,
} as const;

// A contributor to the thesis and to ErgoHub, whose pages credit her by name
// and link. Each case study is Konstantinos's own writing, so she is not
// listed as its author; the energy page does not name its second member, and
// neither does its structured data.
export const anastasiaZerva = {
  "@type": "Person",
  name: collaboratorConfig.anastasiaZerva.name,
  sameAs: collaboratorConfig.anastasiaZerva.linkedin,
} as const;

// What the homepage shows about its subject, and nothing more: no job title,
// employer or list of skills. The university comes in both languages, as the
// two homepages name it.
export function homepageGraph(university: { en: string; el: string }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: homepage,
        name: siteConfig.name,
        alternateName: siteConfig.greekName,
        inLanguage: ["en", "el"],
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: siteConfig.name,
        alternateName: siteConfig.greekName,
        url: homepage,
        image: `${siteConfig.url}${siteConfig.portrait}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Athens",
          addressCountry: "GR",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: university.en,
          alternateName: university.el,
        },
        sameAs: [siteConfig.github, siteConfig.linkedin, siteConfig.orcid],
      },
    ],
  };
}
