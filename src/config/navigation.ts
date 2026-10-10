// Homepage section ids. The header links to them, so the homepage must keep
// rendering a <section> with each of these ids.
export const sectionIds = {
  work: "work",
  about: "about",
  contact: "contact",
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
