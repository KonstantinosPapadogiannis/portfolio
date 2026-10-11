const orcidId = "0009-0008-9445-2484";

export const siteConfig = {
  name: "Konstantinos Papadogiannis",
  location: "Athens, Greece",
  email: "konstantinospapadogiannis.dev@gmail.com",
  github: "https://github.com/KonstantinosPapadogiannis",
  linkedin: "https://www.linkedin.com/in/konstantinos-papadogiannis/",
  // The public ORCID record, never the my-orcid?orcid= address, which is the
  // record holder's own signed-in view.
  orcid: `https://orcid.org/${orcidId}`,
  orcidId,
  // English only. Built from the LaTeX CV kept outside this repository and
  // not tracked by Git.
  resumePdf: "/downloads/konstantinos-papadogiannis-cv.pdf",
  // Canonical origin for metadata, the sitemap and robots.txt. The Vercel
  // deployment (kpapadogiannis.vercel.app) is only an alias of it.
  url: "https://kpapadogiannis.dev",
} as const;

export type SiteConfig = typeof siteConfig;
