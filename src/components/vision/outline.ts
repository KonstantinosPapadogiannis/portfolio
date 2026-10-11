// The sections of the computer vision case study, in reading order. The ids
// are the anchors of the contents list.
export const visionSections = [
  "classification",
  "comparison",
  "segmentation-detection",
  "lessons",
] as const;

export type VisionSectionId = (typeof visionSections)[number];

export function visionSectionNumber(id: VisionSectionId) {
  return String(visionSections.indexOf(id) + 1).padStart(2, "0");
}
