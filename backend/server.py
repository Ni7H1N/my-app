from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Engineering Portfolio API")
api_router = APIRouter(prefix="/api")


# ============ Models ============
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TechBadge(BaseModel):
    name: str
    category: str


class Project(BaseModel):
    id: str
    slug: str
    title: str
    summary: str
    description: str
    image: str
    tech: List[str]
    tags: List[str]
    year: str
    status: str
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    featured: bool = False
    problem: Optional[str] = None
    objectives: Optional[List[str]] = None
    architecture: Optional[str] = None
    implementation: Optional[List[str]] = None
    challenges: Optional[List[str]] = None
    security_measures: Optional[List[str]] = None
    devsecops_pipeline: Optional[List[str]] = None
    cloud_architecture: Optional[List[str]] = None
    lessons_learned: Optional[List[str]] = None
    future_improvements: Optional[List[str]] = None


class Repo(BaseModel):
    name: str
    description: str
    language: str
    stars: int
    forks: int
    updated_at: str
    topics: List[str]
    html_url: str


# ============ Static content ============
PROJECTS: List[dict] = [
    {
        "id": "p1",
        "slug": "zero-trust-k8s-platform",
        "title": "Zero-Trust Kubernetes Platform",
        "summary": "Multi-tenant EKS platform with policy-as-code, mTLS service mesh, and drift-free GitOps.",
        "description": "Production-grade Kubernetes platform designed under zero-trust principles. Enforces workload identity, network segmentation via Cilium, image provenance via Cosign/Sigstore, and continuous compliance with OPA/Kyverno. Deployment is fully declarative through Argo CD.",
        "image": "https://images.unsplash.com/photo-1762163516269-3c143e04175c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxzZXJ2ZXIlMjByYWNrJTIwZGFya3xlbnwwfHx8fDE3ODM1MzYyNTR8MA&ixlib=rb-4.1.0&q=85",
        "tech": ["AWS EKS", "Terraform", "Argo CD", "Cilium", "Kyverno", "Sigstore", "Vault", "Prometheus"],
        "tags": ["DevSecOps", "Cloud", "Kubernetes"],
        "year": "2025",
        "status": "Production",
        "github_url": "https://github.com/example/zero-trust-eks",
        "demo_url": None,
        "featured": True,
        "problem": "Legacy multi-tenant Kubernetes had inconsistent RBAC, untracked cluster drift, and no verifiable supply-chain guarantees for images running in production.",
        "objectives": [
            "Establish workload identity and namespace-level zero-trust boundaries",
            "Guarantee GitOps-only mutations with drift detection",
            "Enforce signed, scanned, SBOM-attested container images",
            "Achieve continuous compliance evidence for SOC2 / ISO 27001",
        ],
        "architecture": "Terraform provisions VPC, EKS, IRSA, KMS, and Vault. Cilium provides eBPF-based network policy and Hubble observability. Argo CD manages application delivery. Kyverno + OPA Gatekeeper enforce cluster policies. Cosign + Sigstore Rekor sign and verify every image; Trivy generates SBOMs written to an OCI registry.",
        "implementation": [
            "Terraform modules split by environment with remote state encrypted in S3 + DynamoDB locking",
            "Argo CD app-of-apps pattern with per-tenant projects and sync waves",
            "Kyverno policies deny unsigned images and enforce runAsNonRoot, readOnlyRootFilesystem",
            "Cilium ClusterMesh for cross-region service discovery with mTLS via SPIFFE",
            "Prometheus + Loki + Tempo bundled through OpenTelemetry collector",
        ],
        "challenges": [
            "Migrating live workloads without downtime while flipping default-deny NetworkPolicies",
            "Reconciling image signature verification latency in air-gapped clusters",
        ],
        "security_measures": [
            "IRSA-scoped IAM per workload, no node-wide credentials",
            "KMS envelope encryption for etcd + secrets",
            "Falco runtime detection with routed alerts to SIEM",
            "Kyverno admission-time policy enforcement",
        ],
        "devsecops_pipeline": [
            "GitHub Actions: lint, unit, SAST (Semgrep), secret scan (Gitleaks)",
            "Build: multi-stage Docker with distroless base",
            "Scan: Trivy (fs + image) + Grype; SBOM published to registry",
            "Sign: Cosign with keyless OIDC identity",
            "Deploy: Argo CD auto-sync with policy gates",
        ],
        "cloud_architecture": [
            "Multi-AZ EKS with managed node groups + Karpenter",
            "PrivateLink endpoints, no public egress by default",
            "Route 53 + AWS Global Accelerator for anycast entry",
        ],
        "lessons_learned": [
            "Policy-as-code beats runbooks — every exception must be a PR",
            "Signed images are cheap; verifying at admission is the leverage point",
        ],
        "future_improvements": [
            "Adopt Cedar for finer-grained authorization",
            "Extend supply-chain guarantees to Helm chart signing",
        ],
    },
    {
        "id": "p2",
        "slug": "cloud-attack-surface-scanner",
        "title": "Cloud Attack Surface Scanner",
        "summary": "Continuously enumerates AWS + Azure exposure, correlates with CVEs, and files auto-remediation PRs.",
        "description": "Agentless scanner that reads cloud APIs, models a graph of assets, and continuously evaluates exposure against threat intel feeds. Findings are triaged, deduplicated, and either auto-fixed via Terraform PRs or escalated to on-call.",
        "image": "https://images.pexels.com/photos/2653362/pexels-photo-2653362.jpeg",
        "tech": ["Python", "Neo4j", "AWS", "Azure", "OpenAI", "Terraform", "GitHub Actions"],
        "tags": ["Cybersecurity", "Cloud", "Automation"],
        "year": "2025",
        "status": "Live",
        "github_url": "https://github.com/example/cloud-asm",
        "demo_url": None,
        "featured": True,
        "problem": "Security teams could not keep pace with ephemeral cloud assets — misconfigurations were found days after exposure, and remediation stalled in ticket queues.",
        "objectives": [
            "Provide < 5 minute detection window for new public exposure",
            "Reduce mean-time-to-remediate below 24 hours",
            "Explain each finding in plain English for engineering teams",
        ],
        "architecture": "A Python worker pool pulls inventory via boto3 / azure-sdk, materializes assets into Neo4j, then evaluates rule graphs. An LLM layer translates findings into engineer-friendly summaries and drafts Terraform patch PRs.",
        "implementation": [
            "Async workers with exponential backoff + jitter",
            "Neo4j graph modelling identity, network, and data-plane relationships",
            "Rule engine using OPA Rego for evaluated policy",
            "LLM prompt templates versioned in Git; outputs validated by JSON schema",
        ],
        "challenges": [
            "API rate limits on multi-account scans",
            "False-positive suppression across environments",
        ],
        "security_measures": [
            "Read-only roles with session tags",
            "STS session credentials with 15-minute TTL",
            "Provenance-signed remediation PRs",
        ],
        "devsecops_pipeline": [
            "Pre-commit: ruff, black, mypy",
            "CI: pytest, coverage gate 85%, container scan",
            "CD: canary rollout to staging tenants, then GA",
        ],
        "cloud_architecture": [
            "Serverless-first: Lambda + SQS + Step Functions",
            "S3 with Object Lock for evidence retention",
        ],
        "lessons_learned": [
            "Graph modelling makes lateral-movement analysis natural",
            "Ship a PR, not a ticket",
        ],
        "future_improvements": [
            "Add GCP + Kubernetes providers",
            "Cross-tenant blast-radius simulation",
        ],
    },
    {
        "id": "p3",
        "slug": "supply-chain-guard",
        "title": "Supply Chain Guard",
        "summary": "SLSA-3 build attestations, Cosign verification, and dependency risk scoring on every commit.",
        "description": "End-to-end supply chain assurance for polyglot monorepos. Enforces reproducible builds, generates SLSA provenance, and blocks deploys that fail signature or SBOM policy at admission time.",
        "image": "https://images.pexels.com/photos/37994983/pexels-photo-37994983.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "tech": ["Sigstore", "SLSA", "Cosign", "GitHub Actions", "Kyverno", "Go"],
        "tags": ["DevSecOps", "Security"],
        "year": "2024",
        "status": "Production",
        "github_url": "https://github.com/example/supply-chain-guard",
        "demo_url": None,
        "featured": True,
        "problem": "Downstream consumers had no cryptographic guarantee that images running in production matched the source that produced them.",
        "objectives": [
            "Attain SLSA level 3 for all default branches",
            "Zero unsigned images admitted to production clusters",
        ],
        "architecture": "GitHub Actions produce hermetic builds using ephemeral runners. Provenance is attested with Sigstore and stored in a Rekor transparency log. Kyverno verifies attestations at admission.",
        "implementation": [
            "Reusable workflows for build + sign + attest",
            "Attestation predicate types: SLSA provenance + SBOM + vulnerability report",
            "Kyverno ClusterPolicy verifyImages with keyless issuers",
        ],
        "challenges": [
            "Balancing signing latency with deploy cadence",
            "Educating teams on ephemeral OIDC identity",
        ],
        "security_measures": [
            "Isolated OIDC identity per workflow",
            "Rekor inclusion proofs stored alongside deploys",
        ],
        "devsecops_pipeline": [
            "Lint / test / build / SBOM / sign / attest / verify",
        ],
        "cloud_architecture": [
            "OIDC federation between GitHub and AWS",
        ],
        "lessons_learned": [
            "Provenance is worth more than any scanner report",
        ],
        "future_improvements": [
            "Move to reproducible builds with Bazel",
        ],
    },
    {
        "id": "p4",
        "slug": "ai-threat-copilot",
        "title": "AI Threat Copilot",
        "summary": "LLM-assisted SOC copilot that triages alerts, drafts IR playbooks, and enriches with MITRE ATT&CK context.",
        "description": "A copilot for security operations that ingests SIEM alerts, correlates with threat intel, and drafts investigation notes and containment steps for analysts to review and approve.",
        "image": "https://images.pexels.com/photos/2653362/pexels-photo-2653362.jpeg",
        "tech": ["Python", "OpenAI", "Elasticsearch", "MITRE ATT&CK", "FastAPI", "Redis"],
        "tags": ["AI", "Cybersecurity", "Automation"],
        "year": "2024",
        "status": "Beta",
        "github_url": "https://github.com/example/threat-copilot",
        "demo_url": None,
        "featured": False,
        "problem": "SOC analysts spent 60% of their day on tier-1 triage, leaving little time for hunting or engineering.",
        "objectives": [
            "Cut tier-1 triage time by 70%",
            "Preserve full audit trail of AI decisions",
        ],
        "architecture": "Alerts fan out from SIEM to a queue. Python workers enrich with MITRE mappings, ask the LLM for a hypothesis, and post a structured note back into the ticketing system.",
        "implementation": [
            "Structured output validation with Pydantic",
            "Retrieval-augmented context from a curated IR playbook corpus",
            "Human-in-the-loop approval before any containment action",
        ],
        "challenges": [
            "Hallucination guardrails for security-critical output",
        ],
        "security_measures": [
            "No PII sent to LLM without redaction pass",
            "Cryptographic hashing of prompts and responses for audit",
        ],
        "devsecops_pipeline": [
            "Prompt regression tests on every PR",
        ],
        "cloud_architecture": [
            "VPC-private inference gateway",
        ],
        "lessons_learned": [
            "Copilot > autopilot for security",
        ],
        "future_improvements": [
            "Fine-tune small local model for redaction",
        ],
    },
    {
        "id": "p5",
        "slug": "iac-drift-sentinel",
        "title": "IaC Drift Sentinel",
        "summary": "Detects and reconciles Terraform drift across 200+ AWS accounts with per-team ownership routing.",
        "description": "Continuous drift detection service for large Terraform footprints. Diffs live state vs planned state, categorizes drift by severity, and routes tickets to owning teams with a suggested reconciliation plan.",
        "image": "https://images.unsplash.com/photo-1762163516269-3c143e04175c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxzZXJ2ZXIlMjByYWNrJTIwZGFya3xlbnwwfHx8fDE3ODM1MzYyNTR8MA&ixlib=rb-4.1.0&q=85",
        "tech": ["Go", "Terraform", "AWS Organizations", "Slack", "PostgreSQL"],
        "tags": ["Cloud", "Automation", "DevOps"],
        "year": "2024",
        "status": "Production",
        "github_url": "https://github.com/example/iac-drift-sentinel",
        "demo_url": None,
        "featured": False,
    },
    {
        "id": "p6",
        "slug": "owasp-lab-platform",
        "title": "OWASP Lab Platform",
        "summary": "Self-service, ephemeral CTF labs for OWASP Top 10 training with per-user isolated Kubernetes namespaces.",
        "description": "Training platform that spins up per-user vulnerable environments on demand for OWASP Top 10, network recon, and cloud attack scenarios. Auto-destructs after 4 hours.",
        "image": "https://images.pexels.com/photos/2653362/pexels-photo-2653362.jpeg",
        "tech": ["Kubernetes", "Helm", "Vault", "React", "FastAPI"],
        "tags": ["Cybersecurity", "Education"],
        "year": "2023",
        "status": "Live",
        "github_url": "https://github.com/example/owasp-lab",
        "demo_url": None,
        "featured": False,
    },
]


REPOS: List[dict] = [
    {
        "name": "zero-trust-eks",
        "description": "Zero-trust multi-tenant EKS reference platform with Argo CD, Cilium, Kyverno and Sigstore.",
        "language": "HCL",
        "stars": 421,
        "forks": 58,
        "updated_at": "2025-11-12",
        "topics": ["kubernetes", "devsecops", "terraform", "argo-cd", "zero-trust"],
        "html_url": "https://github.com/example/zero-trust-eks",
    },
    {
        "name": "cloud-asm",
        "description": "Attack surface management for AWS and Azure with graph-based reasoning and auto-remediation PRs.",
        "language": "Python",
        "stars": 312,
        "forks": 41,
        "updated_at": "2025-10-28",
        "topics": ["cloud-security", "asm", "aws", "azure", "graph"],
        "html_url": "https://github.com/example/cloud-asm",
    },
    {
        "name": "supply-chain-guard",
        "description": "SLSA-3 provenance, Cosign verification and Kyverno admission policies for hardened supply chains.",
        "language": "Go",
        "stars": 289,
        "forks": 34,
        "updated_at": "2025-09-14",
        "topics": ["sigstore", "slsa", "supply-chain", "cosign"],
        "html_url": "https://github.com/example/supply-chain-guard",
    },
    {
        "name": "threat-copilot",
        "description": "LLM-powered SOC copilot for alert triage, IR drafting and MITRE ATT&CK enrichment.",
        "language": "Python",
        "stars": 198,
        "forks": 26,
        "updated_at": "2025-08-04",
        "topics": ["ai", "security", "soc", "llm", "mitre"],
        "html_url": "https://github.com/example/threat-copilot",
    },
    {
        "name": "iac-drift-sentinel",
        "description": "Detects Terraform drift across large multi-account AWS footprints and files reconciliation PRs.",
        "language": "Go",
        "stars": 156,
        "forks": 18,
        "updated_at": "2025-07-19",
        "topics": ["terraform", "drift", "aws", "automation"],
        "html_url": "https://github.com/example/iac-drift-sentinel",
    },
    {
        "name": "owasp-lab-platform",
        "description": "Self-service OWASP Top 10 lab platform running on ephemeral Kubernetes namespaces.",
        "language": "TypeScript",
        "stars": 134,
        "forks": 21,
        "updated_at": "2025-06-02",
        "topics": ["owasp", "ctf", "training", "kubernetes"],
        "html_url": "https://github.com/example/owasp-lab-platform",
    },
]


# ============ Routes ============
@api_router.get("/")
async def root():
    return {"message": "Engineering Portfolio API online"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    rows = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for r in rows:
        if isinstance(r['timestamp'], str):
            r['timestamp'] = datetime.fromisoformat(r['timestamp'])
    return rows


@api_router.get("/projects", response_model=List[Project])
async def list_projects(featured: Optional[bool] = None, tag: Optional[str] = None):
    result = PROJECTS
    if featured is not None:
        result = [p for p in result if p.get("featured") == featured]
    if tag:
        result = [p for p in result if tag in p.get("tags", [])]
    return result


@api_router.get("/projects/{slug}", response_model=Project)
async def get_project(slug: str):
    for p in PROJECTS:
        if p["slug"] == slug:
            return p
    raise HTTPException(status_code=404, detail="Project not found")


@api_router.get("/github/repos", response_model=List[Repo])
async def list_repos():
    return REPOS


@api_router.get("/stats")
async def portfolio_stats():
    return {
        "projects_shipped": 40,
        "years_experience": 6,
        "certifications": 7,
        "open_source_stars": sum(r["stars"] for r in REPOS),
        "clouds": 3,
    }


@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact(payload: ContactMessageCreate):
    msg = ContactMessage(**payload.model_dump())
    doc = msg.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    return msg


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
