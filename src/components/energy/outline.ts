// The sections of the energy data mining case study, in reading order. Three
// only, so the page has no contents list; the ids are still anchors.
export const energySections = ["classification", "forecasting", "comparison"] as const;

export type EnergySectionId = (typeof energySections)[number];

export function energySectionNumber(id: EnergySectionId) {
  return String(energySections.indexOf(id) + 1).padStart(2, "0");
}
