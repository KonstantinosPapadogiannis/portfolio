// Homepage section ids. The header links to the first three, and the case
// studies link back to work and moreWork, so the homepage must keep
// rendering a <section> with each of these ids.
export const sectionIds = {
  work: "work",
  about: "about",
  contact: "contact",
  moreWork: "more-work",
} as const;

export type SectionId = (typeof sectionIds)[keyof typeof sectionIds];

export type NavItem =
  | { key: "work" | "about" | "contact"; section: SectionId }
  | { key: "resume"; pathname: "/resume" };

export const primaryNav: readonly NavItem[] = [
  { key: "work", section: sectionIds.work },
  { key: "about", section: sectionIds.about },
  { key: "resume", pathname: "/resume" },
  { key: "contact", section: sectionIds.contact },
];
