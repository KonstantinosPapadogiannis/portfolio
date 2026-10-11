// Structure of the work and technology sections. The words for each entry
// (names, titles, descriptions) live in the message dictionaries under the
// same keys; facts are from docs/CONTENT_AND_VOICE.md and the résumé.

export type ProjectEntry = {
  key: string;
  number: string;
  year: string;
  // The project's own case study, for the projects that have one.
  href?: "/work/ergohub" | "/work/openstack" | "/work/cuda" | "/work/computer-vision";
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

// Computer vision, shared by its homepage entry and its case study. From the
// project's submitted notebooks: an individual assignment of February 2026,
// five exercises in PyTorch on Google Colab. Accuracies are percentages on
// each dataset's test split at the last epoch, which is how the notebooks
// report them; one run each. The CIFAR-10 seconds are one training epoch plus
// the pass over the test split, on an NVIDIA A100, as the notebook printed
// them.
export const vision = {
  href: "/work/computer-vision",
  year: "2026",
  // ResNet18 on Oxford-IIIT Pet, 37 breeds.
  pets: {
    featureExtraction: 87.24,
    fineTuning: 90.32,
    augmentation: 88.28,
  },
  // ViT-B/16 and VGG16-BN on CIFAR-10, both fine-tuned from ImageNet weights.
  cifar10: {
    vit: { five: 95.85, ten: 95.63, seconds: 376 },
    vgg: { five: 92.84, ten: 93.26, seconds: 141 },
  },
  // U-Net on SBD, pixel accuracy on a held-out fifth of the training images.
  segmentation: 75.79,
  // Faster R-CNN on VOC 2007: mean training loss of the first and the tenth
  // epoch with SGD. No mAP was computed.
  detectionLoss: { first: 0.6444, last: 0.1611 },
} as const;

// Primary projects, after the thesis.
export const moreWork = [
  { key: "ergohub", number: "02", year: ergohub.year, href: ergohub.href },
  { key: "openstack", number: "03", year: openstack.year, href: openstack.href },
  { key: "cuda", number: "04", year: cuda.year, href: cuda.href },
] as const satisfies readonly ProjectEntry[];

// Secondary projects, shown more quietly.
export const additionalWork = [
  { key: "vision", number: "05", year: vision.year, href: vision.href },
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
