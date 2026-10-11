import { deployment } from "./deployment";

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
  // English only. Built from cv/ by cv/build.sh, which writes this file
  // (public/downloads/konstantinos-papadogiannis-cv.pdf, committed).
  resumePdf: "/downloads/konstantinos-papadogiannis-cv.pdf",
  // Canonical origin for metadata, the sitemap, robots.txt and structured
  // data; it depends on where the site is deployed (see deployment.ts).
  url: deployment.siteUrl,
} as const;

export type SiteConfig = typeof siteConfig;

export const collaboratorConfig = {
  anastasiaZerva: {
    linkedin: "https://www.linkedin.com/in/anastasia-zervas/",
  },
} as const;
