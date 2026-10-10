// Structure of the work and technology sections. The words for each entry
// (names, titles, descriptions) live in the message dictionaries under the
// same keys; facts are from docs/CONTENT_AND_VOICE.md and the résumé.

export type ProjectEntry = {
  key: string;
  number: string;
  year: string;
};

// Primary projects, after the thesis.
export const moreWork = [
  { key: "ergohub", number: "02", year: "2025" },
  { key: "openstack", number: "03", year: "2026" },
  { key: "cuda", number: "04", year: "2026" },
] as const satisfies readonly ProjectEntry[];

// Secondary projects, shown more quietly.
export const additionalWork = [
  { key: "vision", number: "05", year: "2026" },
  { key: "energy", number: "06", year: "2026" },
] as const satisfies readonly ProjectEntry[];

// Proper names, identical in both languages. Only the group labels are
// translated.
export const technologies = [
  {
    key: "programming",
    items: ["Go", "TypeScript", "JavaScript", "Java", "Python", "SQL", "C", "CUDA", "Bash"],
  },
  {
    key: "backend",
    items: ["Hyperledger Fabric", "Spring Boot", "REST", "gRPC", "Keycloak (OIDC)", "JWT"],
  },
  {
    key: "frontend",
    items: ["React", "Redux", "Tailwind CSS", "Vite", "Manifest V3", "Web Crypto API"],
  },
  {
    key: "cloud",
    items: [
      "Docker",
      "Kubernetes (AKS)",
      "Jenkins",
      "Ansible",
      "OpenStack",
      "Google Cloud",
      "Azure",
      "Nginx",
      "Linux",
      "Git",
    ],
  },
  {
    key: "data",
    items: ["PostgreSQL", "PyTorch", "TensorFlow/Keras", "scikit-learn", "pandas"],
  },
  {
    key: "testing",
    items: ["Go testing", "Vitest", "Playwright", "JUnit", "Jest"],
  },
] as const;
