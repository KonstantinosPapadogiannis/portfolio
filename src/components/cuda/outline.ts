// The sections of the CUDA case study, in reading order. Each id is the
// section's anchor and its key under cudaPage.sections in the messages; the
// contents list and the section numbers both come from this order.
export const cudaSections = ["baseline", "bottleneck", "optimisation", "result"] as const;

export type CudaSectionId = (typeof cudaSections)[number];

// "01" to "04".
export function cudaSectionNumber(id: CudaSectionId) {
  return String(cudaSections.indexOf(id) + 1).padStart(2, "0");
}
