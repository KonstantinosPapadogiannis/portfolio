// Facts drawn on the ErgoHub case study, from the project's repository.
// Names are the ones in the code and configuration, so they are the same in
// both languages.

// The stages of the two kubectl pipelines, as named in Jenkinsfile-backend
// and Jenkinsfile-frontend, grouped by what they do. Numbers run on across
// the groups, as the stages run in one pipeline.
export const pipelineStages = {
  api: {
    build: ["Compile", "Unit Tests", "Integration Tests", "Package"],
    publish: ["Azure Login & Setup", "Build & Push Docker Image"],
    deploy: ["Deploy to Azure AKS", "Health Check"],
  },
  frontend: {
    build: [
      "Checkout",
      "Install Dependencies",
      "Lint",
      "Unit Tests",
      "Integration Tests",
      "Build",
      "Security Audit",
    ],
    publish: ["Azure Login & Setup", "Build & Push Docker Image"],
    deploy: ["Deploy to Azure AKS", "Health Check", "Verify Application"],
  },
} as const;

export const pipelinePhases = ["build", "publish", "deploy"] as const;

// The three ways to deploy; each has a Jenkinsfile for the API and one for
// the front end.
export const deliveryPaths = ["kubectl", "ansible", "minikube"] as const;

// What ran in the freelance namespace on AKS, from the manifests in
// kubernetes/: one replica each, with the Service in front of it, the
// storage it claimed and the probes Kubernetes ran against it.
type ProbeKind = "startup" | "liveness" | "readiness";

export const workloads: readonly {
  name: "frontend" | "backend" | "postgres" | "minio" | "mailhog";
  service: string;
  ports: string;
  nodePort?: true;
  volume?: string;
  probes: readonly ProbeKind[];
}[] = [
  { name: "frontend", service: "frontend-service", ports: "80", probes: ["liveness", "readiness"] },
  {
    name: "backend",
    service: "backend-service",
    ports: "8080",
    probes: ["startup", "liveness", "readiness"],
  },
  {
    name: "postgres",
    service: "postgres-service",
    ports: "5432",
    volume: "5 Gi",
    probes: ["liveness", "readiness"],
  },
  {
    name: "minio",
    service: "minio-service",
    ports: "9000, 9001",
    nodePort: true,
    volume: "10 Gi",
    probes: [],
  },
  { name: "mailhog", service: "mailhog", ports: "8025, 1025", probes: [] },
];

// The Ingress rules on the main host: the path, and the Service and port it
// sends requests to.
export const ingressRoutes = [
  { path: "/", service: "frontend-service", port: "80" },
  { path: "/api", service: "backend-service", port: "8080" },
] as const;
