// The sections of the ErgoHub case study, in reading order. Each id is the
// section's anchor and its key under ergohubPage.sections in the messages;
// the contents list and the section numbers both come from this order.
export const ergohubSections = [
  "overview",
  "application",
  "containers",
  "pipeline",
  "kubernetes",
  "challenges",
  "learned",
] as const;

export type ErgohubSectionId = (typeof ergohubSections)[number];

// "01" to "07".
export function ergohubSectionNumber(id: ErgohubSectionId) {
  return String(ergohubSections.indexOf(id) + 1).padStart(2, "0");
}
