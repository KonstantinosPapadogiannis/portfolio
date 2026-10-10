// The sections of the thesis case study, in reading order. Each id is the
// section's anchor and its key under thesisPage.sections in the messages;
// the contents list and the section numbers both come from this order.
export const caseSections = [
  "overview",
  "challenge",
  "design",
  "architecture",
  "policy",
  "signing",
  "privacy",
  "perspectives",
  "testing",
  "performance",
  "limitations",
  "learned",
  "outcome",
] as const;

export type CaseSectionId = (typeof caseSections)[number];

// "01" to "13".
export function sectionNumber(id: CaseSectionId) {
  return String(caseSections.indexOf(id) + 1).padStart(2, "0");
}
