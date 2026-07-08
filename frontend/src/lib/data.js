// Static content for portfolio sections — Nithin Karipalli
export const PROFILE = {
  name: "Nithin Karipalli",
  handle: "@Ni7H1N",
  role: "Cybersecurity · Cloud Security · DevSecOps · AI Security",
  location: "Hyderabad, Telangana · India",
  status: "Available for internships & full-time roles",
  summary:
    "Computer Science graduate building at the intersection of Cybersecurity, DevSecOps, Cloud Security and AI. Ranked in the Top 1% globally on TryHackMe with 263+ completed labs and 23 badges. I ship secure CI/CD pipelines, run CTFs for fun, and continuously push my offensive + defensive craft.",
  roles: [
    "Cybersecurity Engineer",
    "DevSecOps Practitioner",
    "Cloud Security Specialist",
    "AI Security Researcher",
    "CTF Player",
    "Penetration Tester",
  ],
  githubUsername: "Ni7H1N",
  links: {
    github: "https://github.com/Ni7H1N",
    linkedin: "https://in.linkedin.com/in/nithin-karipalli",
    tryhackme: "https://tryhackme.com/p/Ni7H1N",
    email: "nithinkaripalli@gmail.com",
    phone: "+91 9398775370",
    resume: "/resume.pdf",
  },
};

export const TECH_TICKER = [
  "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Python", "Linux",
  "Jenkins", "GitHub Actions", "Argo CD", "SonarQube", "Trivy", "Prometheus", "Grafana",
  "Burp Suite", "Nmap", "Wireshark", "Metasploit", "SQLMap", "TryHackMe", "OWASP",
];

export const DEVSECOPS_PIPELINE = [
  { key: "code", label: "Code", detail: "Signed commits, pre-commit hooks, secret scanning" },
  { key: "build", label: "Build", detail: "Multi-stage Docker images, minimal base layers" },
  { key: "quality", label: "SonarQube", detail: "Static code analysis + quality gates" },
  { key: "scan", label: "Trivy", detail: "Container + filesystem CVE scans" },
  { key: "ci", label: "Jenkins", detail: "Automated build & test pipeline" },
  { key: "gitops", label: "Argo CD", detail: "GitOps continuous delivery to Kubernetes" },
  { key: "monitor", label: "Prometheus", detail: "Metrics collection + alerting" },
  { key: "observe", label: "Grafana", detail: "Dashboards, SLOs, incident insight" },
];

export const SKILL_DOMAINS = [
  {
    title: "Cybersecurity",
    items: ["Penetration Testing", "Vulnerability Assessment", "OWASP Top 10", "Threat Intelligence", "Reconnaissance", "Cryptography", "Web AppSec"],
    span: "col-span-1 md:col-span-3 md:row-span-2",
    icon: "shield",
  },
  {
    title: "DevSecOps",
    items: ["Docker", "Kubernetes", "Jenkins", "Argo CD", "GitHub Actions", "SonarQube", "Trivy"],
    span: "col-span-1 md:col-span-3",
    icon: "workflow",
  },
  {
    title: "Cloud Platforms",
    items: ["AWS (EC2, IAM, S3)", "Microsoft Azure", "Google Cloud Platform"],
    span: "col-span-1 md:col-span-3",
    icon: "cloud",
  },
  {
    title: "Security Tools",
    items: ["Burp Suite", "Nmap", "Wireshark", "SQLMap", "Hydra", "Gobuster", "John the Ripper", "Metasploit"],
    span: "col-span-1 md:col-span-3",
    icon: "boxes",
  },
  {
    title: "Observability",
    items: ["Prometheus", "Grafana", "Log Analysis"],
    span: "col-span-1 md:col-span-3",
    icon: "activity",
  },
  {
    title: "AI & LLMs",
    items: ["Generative AI", "LLMs", "Prompt Engineering", "AI Security", "Python"],
    span: "col-span-1 md:col-span-3",
    icon: "sparkles",
  },
  {
    title: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "SQL", "Bash"],
    span: "col-span-1 md:col-span-3",
    icon: "code",
  },
  {
    title: "Operating Systems",
    items: ["Kali Linux", "Ubuntu", "Windows"],
    span: "col-span-1 md:col-span-3",
    icon: "layers",
  },
];

// Repurposed "Experience" cards → Achievements & Highlights (Nithin is a fresh grad)
export const EXPERIENCE = [
  {
    company: "TryHackMe",
    role: "Top 1% Global · 263+ labs · 23 badges",
    period: "2023 — Present",
    location: "Online",
    bullets: [
      "Ranked inside the global Top 1% of TryHackMe with 263+ completed hands-on cybersecurity labs.",
      "Earned 23+ badges across web exploitation, network security, forensics, reverse engineering, and cryptography.",
      "Regularly practices offensive and defensive techniques on live vulnerable machines.",
    ],
  },
  {
    company: "Capture The Flag competitions",
    role: "Top 100 Performer · 3rd Place · CTF Player",
    period: "2024 — 2025",
    location: "Multiple Events",
    bullets: [
      "Recognized as a Top 100 Performer in the Great AppSec Hackathon CTF.",
      "Secured 3rd place at the Overnight CTF organized by The Hackers Meetup · Nagpur Chapter.",
      "Solved challenges across web, forensics, reverse engineering, cryptography, and binary exploitation.",
    ],
  },
  {
    company: "Self-directed engineering",
    role: "DevSecOps & Cloud Security projects",
    period: "2024 — Present",
    location: "Remote",
    bullets: [
      "Built an end-to-end DevSecOps pipeline with Docker, Jenkins, Kubernetes, Argo CD, SonarQube, Trivy, Prometheus and Grafana.",
      "Shipped multiple open-source security utilities on GitHub (scanners, log analysers, WASM tools).",
      "Hands-on experience solving Azure security challenges and cloud-based CTF environments.",
    ],
  },
];

export const CERTIFICATIONS = [
  { name: "Certified in Cybersecurity (CC)", issuer: "ISC2", year: "2024", id: "ISC2-CC" },
  { name: "Introduction to Cybersecurity", issuer: "Cisco Networking Academy", year: "2024", id: "CISCO-INTRO" },
  { name: "Cybersecurity Essentials", issuer: "Cisco Networking Academy", year: "2024", id: "CISCO-ESS" },
  { name: "Foundation Level Threat Intelligence Analyst", issuer: "ArcX", year: "2024", id: "ARCX-FL" },
  { name: "Learn Bug Bounty Hunting & Web Security Testing", issuer: "Udemy", year: "2024", id: "UDEMY-BB" },
  { name: "Introduction to Generative AI", issuer: "Google Cloud Skills Boost", year: "2024", id: "GCP-GENAI" },
  { name: "Introduction to Large Language Models", issuer: "Google Cloud Skills Boost", year: "2024", id: "GCP-LLM" },
  { name: "Introduction to Image Generation", issuer: "Google Cloud Skills Boost", year: "2024", id: "GCP-IMG" },
];

export const EDUCATION = [
  {
    school: "Vignan's Institute of Information Technology (Autonomous)",
    degree: "B.Tech · Computer Science and Engineering",
    period: "2022 — 2026",
  },
];

export const GLOBE_ARCS = [
  { startLat: 37.7749, startLng: -122.4194, endLat: 51.5074, endLng: -0.1278 },
  { startLat: 51.5074, startLng: -0.1278, endLat: 1.3521, endLng: 103.8198 },
  { startLat: 1.3521, startLng: 103.8198, endLat: -33.8688, endLng: 151.2093 },
  { startLat: -33.8688, startLng: 151.2093, endLat: 35.6895, endLng: 139.6917 },
  { startLat: 35.6895, startLng: 139.6917, endLat: 37.7749, endLng: -122.4194 },
  { startLat: 40.7128, startLng: -74.006, endLat: 52.52, endLng: 13.405 },
  { startLat: 52.52, startLng: 13.405, endLat: 17.385, endLng: 78.4867 },
  { startLat: 17.385, startLng: 78.4867, endLat: -23.5505, endLng: -46.6333 },
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
  { lat: 17.385, lng: 78.4867, label: "hyderabad · home", size: 0.9 },
  { lat: -23.5505, lng: -46.6333, label: "sa-east-1", size: 0.4 },
  { lat: 55.7558, lng: 37.6173, label: "ru-central-1", size: 0.3 },
];
