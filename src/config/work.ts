// Structure of the work and technology sections. The words for each entry
// (names, titles, descriptions) live in the message dictionaries under the
// same keys; facts are from docs/CONTENT_AND_VOICE.md and the résumé.

export type ProjectEntry = {
  key: string;
  number: string;
  year: string;
  // The project's own case study, for the projects that have one.
  href?: "/work/ergohub" | "/work/openstack" | "/work/cuda";
};

// ErgoHub, shared by its homepage entry and its case study. From the
// project's repository: the first and last commits fall in February and July
// 2025, two people committed to every part of it, and there are six
// Jenkinsfiles, one for the back end and one for the front end for each of
// three delivery paths. Names of tools, the same in both languages.
export const ergohub = {
  href: "/work/ergohub",
  year: "2025",
  pipelines: 6,
  // Where the homepage entry says it ran: images, registry, cluster.
  platform: ["Docker", "ACR", "AKS"],
  stack: [
    {
      key: "application",
      items: [
        "Java 21",
        "Spring Boot 3",
        "Spring Security",
        "JWT",
        "React",
        "Redux Toolkit",
        "JUnit",
        "Jest",
      ],
    },
    { key: "data", items: ["PostgreSQL", "Spring Data JPA", "MinIO"] },
    {
      key: "delivery",
      items: ["Docker", "Jenkins", "Ansible", "Azure Container Registry", "AKS"],
    },
    { key: "edge", items: ["NGINX Ingress", "cert-manager", "Let’s Encrypt TLS"] },
  ],
} as const;

// OpenStack, shared by its homepage entry and its case study. From the
// project's report and notes: an individual assignment, built in June 2026.
export const openstack = {
  href: "/work/openstack",
  year: "2026",
} as const;

// CUDA, shared by its homepage entry and its case study. From the project's
// source, report and program output: an individual assignment of June 2026,
// run on an NVIDIA Tesla T4 in Google Colab. The kernel times at N = 4096,
// in seconds, as the program printed them: one timed launch of each kernel,
// copies from host to GPU excluded. Every figure on the page is derived from
// these three.
export const cuda = {
  href: "/work/cuda",
  year: "2026",
  size: 4096,
  seconds: {
    naive: 0.305967,
    tiled: 0.190668,
    registerBlocked: 0.086069,
  },
} as const;

// Primary projects, after the thesis.
export const moreWork = [
  { key: "ergohub", number: "02", year: ergohub.year, href: ergohub.href },
  { key: "openstack", number: "03", year: openstack.year, href: openstack.href },
  { key: "cuda", number: "04", year: cuda.year, href: cuda.href },
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
