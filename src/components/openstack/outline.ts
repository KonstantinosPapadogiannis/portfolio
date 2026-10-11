// The sections of the OpenStack case study, in reading order. Each id is the
// section's anchor and its key under openstackPage.sections in the messages;
// the contents list and the section numbers both come from this order.
export const openstackSections = [
  "environment",
  "openstack",
  "network",
  "debugging",
  "application",
  "reflection",
] as const;

export type OpenstackSectionId = (typeof openstackSections)[number];

// "01" to "06".
export function openstackSectionNumber(id: OpenstackSectionId) {
  return String(openstackSections.indexOf(id) + 1).padStart(2, "0");
}
