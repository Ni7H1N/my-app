// Static content for portfolio sections
export const PROFILE = {
  name: "Aarav Mehta",
  handle: "@aaravsec",
  role: "DevSecOps & Cloud Security Engineer",
  location: "Remote — GMT+1",
  status: "Available for select engagements",
  summary:
    "I design and operate zero-trust cloud platforms, ship secure supply chains, and automate the boring parts of security. Six years turning ambiguity into reliable infrastructure.",
  roles: [
    "DevSecOps Engineer",
    "Cloud Security Architect",
    "Platform Engineer",
    "Automation Specialist",
    "AI Security Researcher",
  ],
  links: {
    github: "https://github.com/",
    linkedin: "https://linkedin.com/in/",
    tryhackme: "https://tryhackme.com/p/",
    email: "hello@example.com",
    resume: "#",
  },
};

export const TECH_TICKER = [
  "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Python", "Linux",
  "Terraform", "Jenkins", "GitHub Actions", "Argo CD", "Prometheus", "Grafana",
  "React", "Next.js", "TypeScript", "Burp Suite", "Nmap", "Wireshark", "OpenAI", "Framer Motion",
];

export const DEVSECOPS_PIPELINE = [
  { key: "code", label: "Code", detail: "Signed commits, pre-commit hooks, secret scanning" },
  { key: "build", label: "Build", detail: "Hermetic multi-stage builds, distroless bases" },
  { key: "test", label: "Test", detail: "Unit, integration, contract, mutation coverage" },
  { key: "sast", label: "SAST", detail: "Semgrep, CodeQL, dependency review" },
  { key: "scan", label: "Scan", detail: "Trivy image + fs, Grype, license policy" },
  { key: "sign", label: "Sign", detail: "Cosign keyless, SLSA provenance, Rekor log" },
  { key: "deploy", label: "Deploy", detail: "Argo CD progressive rollout, Kyverno gates" },
  { key: "observe", label: "Observe", detail: "OpenTelemetry, SLOs, Falco runtime" },
];

export const SKILL_DOMAINS = [
  {
    title: "Cloud Engineering",
    items: ["AWS", "Azure", "GCP", "Landing Zones", "Multi-Account", "Networking", "Serverless"],
    span: "col-span-1 md:col-span-2 md:row-span-2",
    icon: "cloud",
  },
  {
    title: "DevSecOps",
    items: ["CI/CD", "GitOps", "IaC", "SBOM", "SLSA", "Cosign", "Argo CD"],
    span: "col-span-1 md:col-span-2",
    icon: "workflow",
  },
  {
    title: "Cybersecurity",
    items: ["OWASP Top 10", "Threat Modeling", "Recon", "Burp", "Nmap", "Wireshark"],
    span: "col-span-1 md:col-span-2",
    icon: "shield",
  },
  {
    title: "Containers & Orchestration",
    items: ["Docker", "Kubernetes", "Helm", "Cilium", "Kyverno", "OPA"],
    span: "col-span-1 md:col-span-3",
    icon: "boxes",
  },
  {
    title: "Observability",
    items: ["Prometheus", "Grafana", "Loki", "Tempo", "OpenTelemetry"],
    span: "col-span-1 md:col-span-3",
    icon: "activity",
  },
  {
    title: "AI & Automation",
    items: ["Python", "OpenAI", "LangChain", "RAG", "n8n", "GitHub Actions"],
    span: "col-span-1 md:col-span-2",
    icon: "sparkles",
  },
  {
    title: "Infrastructure as Code",
    items: ["Terraform", "Terragrunt", "Ansible", "Pulumi", "CloudFormation"],
    span: "col-span-1 md:col-span-2",
    icon: "layers",
  },
  {
    title: "Languages",
    items: ["Python", "Go", "TypeScript", "Bash", "Rego", "HCL"],
    span: "col-span-1 md:col-span-2",
    icon: "code",
  },
];

export const EXPERIENCE = [
  {
    company: "Northwind Cloud",
    role: "Staff DevSecOps Engineer",
    period: "2023 — Present",
    location: "Remote",
    bullets: [
      "Led migration of 200+ services to a zero-trust EKS platform with Argo CD and Cilium.",
      "Reduced mean-time-to-remediate cloud misconfigurations from 11 days to 18 hours.",
      "Built SLSA-3 supply chain with Sigstore; blocked 100% of unsigned images at admission.",
    ],
  },
  {
    company: "Helix Security",
    role: "Senior Cloud Security Engineer",
    period: "2021 — 2023",
    location: "London",
    bullets: [
      "Owned AWS Landing Zone for a 40-account org with per-team detective + preventative guardrails.",
      "Shipped an in-house attack surface scanner adopted across 6 product teams.",
    ],
  },
  {
    company: "Orbit Labs",
    role: "Platform Engineer",
    period: "2019 — 2021",
    location: "Berlin",
    bullets: [
      "Rebuilt CI/CD from Jenkins to GitHub Actions + Argo CD, cutting deploy times by 70%.",
      "Introduced Terraform modules used by 30+ engineers.",
    ],
  },
];

export const CERTIFICATIONS = [
  { name: "AWS Certified Security — Specialty", issuer: "Amazon Web Services", year: "2024", id: "SCS-C02" },
  { name: "Certified Kubernetes Security Specialist", issuer: "CNCF", year: "2024", id: "CKS" },
  { name: "AWS Certified Solutions Architect — Professional", issuer: "Amazon Web Services", year: "2023", id: "SAP-C02" },
  { name: "Microsoft Azure Security Engineer Associate", issuer: "Microsoft", year: "2023", id: "AZ-500" },
  { name: "HashiCorp Certified: Terraform Associate", issuer: "HashiCorp", year: "2022", id: "003" },
  { name: "OSCP", issuer: "Offensive Security", year: "2022", id: "OS-101" },
  { name: "Certified Kubernetes Administrator", issuer: "CNCF", year: "2021", id: "CKA" },
];

export const EDUCATION = [
  { school: "TU Munich", degree: "M.Sc. Computer Science — Systems Security", period: "2017 — 2019" },
  { school: "IIT Bombay", degree: "B.Tech. Computer Science", period: "2013 — 2017" },
];

// Globe network arcs (source/target coords)
export const GLOBE_ARCS = [
  { startLat: 37.7749, startLng: -122.4194, endLat: 51.5074, endLng: -0.1278 },
  { startLat: 51.5074, startLng: -0.1278, endLat: 1.3521, endLng: 103.8198 },
  { startLat: 1.3521, startLng: 103.8198, endLat: -33.8688, endLng: 151.2093 },
  { startLat: -33.8688, startLng: 151.2093, endLat: 35.6895, endLng: 139.6917 },
  { startLat: 35.6895, startLng: 139.6917, endLat: 37.7749, endLng: -122.4194 },
  { startLat: 40.7128, startLng: -74.006, endLat: 52.52, endLng: 13.405 },
  { startLat: 52.52, startLng: 13.405, endLat: 19.076, endLng: 72.8777 },
  { startLat: 19.076, startLng: 72.8777, endLat: -23.5505, endLng: -46.6333 },
  { startLat: -23.5505, startLng: -46.6333, endLat: 40.7128, endLng: -74.006 },
  { startLat: 55.7558, startLng: 37.6173, endLat: 48.8566, endLng: 2.3522 },
];

export const GLOBE_POINTS = [
  { lat: 37.7749, lng: -122.4194, label: "us-west-2", size: 0.6 },
  { lat: 40.7128, lng: -74.006, label: "us-east-1", size: 0.7 },
  { lat: 51.5074, lng: -0.1278, label: "eu-west-2", size: 0.6 },
  { lat: 52.52, lng: 13.405, label: "eu-central-1", size: 0.5 },
  { lat: 48.8566, lng: 2.3522, label: "eu-west-3", size: 0.4 },
  { lat: 1.3521, lng: 103.8198, label: "ap-southeast-1", size: 0.6 },
  { lat: 35.6895, lng: 139.6917, label: "ap-northeast-1", size: 0.6 },
  { lat: -33.8688, lng: 151.2093, label: "ap-southeast-2", size: 0.5 },
  { lat: 19.076, lng: 72.8777, label: "ap-south-1", size: 0.5 },
  { lat: -23.5505, lng: -46.6333, label: "sa-east-1", size: 0.4 },
  { lat: 55.7558, lng: 37.6173, label: "ru-central-1", size: 0.3 },
];
