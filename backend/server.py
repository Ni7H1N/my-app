from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import time
import asyncio
import httpx
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

GITHUB_USERNAME = os.environ.get('GITHUB_USERNAME', 'Ni7H1N')

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


# ============ Real projects (Nithin Karipalli) ============
IMG_INFRA = "https://images.unsplash.com/photo-1762163516269-3c143e04175c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxzZXJ2ZXIlMjByYWNrJTIwZGFya3xlbnwwfHx8fDE3ODM1MzYyNTR8MA&ixlib=rb-4.1.0&q=85"
IMG_CODE = "https://images.pexels.com/photos/2653362/pexels-photo-2653362.jpeg"
IMG_TOWER = "https://images.pexels.com/photos/37994983/pexels-photo-37994983.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"

GITHUB_PROFILE = f"https://github.com/{GITHUB_USERNAME}"

PROJECTS: List[dict] = [
    {
        "id": "p1",
        "slug": "netflix-devsecops-pipeline",
        "title": "Netflix DevSecOps Pipeline",
        "summary": "End-to-end DevSecOps pipeline with Docker, Jenkins, Kubernetes, Argo CD, SonarQube, Trivy, Prometheus and Grafana.",
        "description": "A production-style DevSecOps pipeline that deploys a Netflix-clone web application through a fully automated CI/CD flow. Every commit runs static analysis, container CVE scanning, image build, GitOps deploy to Kubernetes and live monitoring — a hands-on demonstration of secure software delivery.",
        "image": IMG_INFRA,
        "tech": ["Jenkins", "Docker", "Kubernetes", "Argo CD", "SonarQube", "Trivy", "Prometheus", "Grafana"],
        "tags": ["DevSecOps", "Cloud", "Automation"],
        "year": "2025",
        "status": "Shipped",
        "github_url": GITHUB_PROFILE,
        "demo_url": None,
        "featured": True,
        "problem": "Building software without embedded security creates blind spots — vulnerable dependencies, unscanned containers and unmonitored production. This project answers that with a fully instrumented CI/CD.",
        "objectives": [
            "Automate build, test and deploy for a real-world web application",
            "Embed code-quality and CVE gates before any image reaches production",
            "Adopt GitOps so cluster state matches the repository at all times",
            "Deliver observability from day one via Prometheus + Grafana",
        ],
        "architecture": "Jenkins orchestrates the pipeline. Source is analysed by SonarQube; Docker images are scanned by Trivy and pushed to a registry. Argo CD watches a Git repo and continuously reconciles the desired state onto a Kubernetes cluster. Prometheus scrapes cluster + application metrics; Grafana visualises SLOs and alerting.",
        "implementation": [
            "Jenkins declarative pipeline: checkout → SAST (SonarQube) → build → Trivy scan → push → Argo CD sync",
            "Kubernetes manifests kept in Git as single source of truth",
            "Argo CD app-of-apps pattern for environment promotion",
            "Prometheus + Grafana stack deployed via Helm with pre-baked dashboards",
        ],
        "challenges": [
            "Balancing image scan latency with pipeline speed",
            "Configuring RBAC + service accounts across Argo CD, Jenkins and Trivy",
        ],
        "security_measures": [
            "SonarQube quality gate blocks merges on critical smells / vulns",
            "Trivy hard-fails builds on HIGH/CRITICAL CVEs",
            "Least-privilege service accounts on Kubernetes",
        ],
        "devsecops_pipeline": [
            "Checkout · SonarQube SAST · Build · Trivy image scan · Push · Argo CD sync · Prometheus metrics · Grafana alerting",
        ],
        "cloud_architecture": [
            "Kubernetes cluster with dedicated namespaces per environment",
            "Ingress controller for external traffic + TLS termination",
        ],
        "lessons_learned": [
            "Security gates work best when integrated into the pipeline, not bolted on later",
            "Observability from day one saves days of debugging",
        ],
        "future_improvements": [
            "Add supply-chain signing with Cosign + policy enforcement via Kyverno",
            "Integrate Falco runtime detection",
        ],
    },
    {
        "id": "p2",
        "slug": "gps-intelligence-dashboard",
        "title": "GPS Intelligence Dashboard",
        "summary": "Interactive geospatial dashboard fusing GPS telemetry with AI-powered prediction models.",
        "description": "A modern geospatial intelligence dashboard that ingests GPS data, visualises movement patterns and layers AI-driven predictions on top. Designed with Next.js on the frontend and Python for the ML backend.",
        "image": IMG_TOWER,
        "tech": ["Next.js", "React", "Python", "Flask", "Machine Learning", "Tailwind"],
        "tags": ["AI", "Cloud", "Automation"],
        "year": "2025",
        "status": "Live",
        "github_url": GITHUB_PROFILE,
        "demo_url": None,
        "featured": True,
        "problem": "Raw GPS traces are hard to reason about — a dashboard is needed that both visualises movement and surfaces predictions humans can act on.",
        "objectives": [
            "Render live GPS traces on an interactive map",
            "Predict short-horizon movement using a Python ML model",
            "Ship a UI recruiters can click through in under a minute",
        ],
        "architecture": "Next.js SSR frontend consumes a Python Flask API. The API loads a serialised ML model and returns predictions per request. State is kept in the URL for shareable views.",
        "implementation": [
            "Custom map layer with animated markers and trail rendering",
            "Prediction endpoint with cached model in memory",
            "Responsive UI with keyboard shortcuts",
        ],
        "security_measures": [
            "Input validation on all API endpoints",
            "CORS locked to the frontend origin",
        ],
        "lessons_learned": [
            "AI features only earn trust when their inputs and outputs are visible on the same screen",
        ],
    },
    {
        "id": "p3",
        "slug": "security-utilities-suite",
        "title": "Security Utilities Suite",
        "summary": "A collection of open-source security tools — server scanner, log analyser, LCS scanner, password strength WASM and Caesar cipher.",
        "description": "Five hands-on security utilities published on GitHub. Each solves a small, real problem and demonstrates a different aspect of applied cybersecurity — network probing, log correlation, cryptography, and browser-native cryptography via WebAssembly.",
        "image": IMG_CODE,
        "tech": ["Python", "JavaScript", "WebAssembly", "Bash", "Nginx"],
        "tags": ["Cybersecurity", "Automation"],
        "year": "2024",
        "status": "Open Source",
        "github_url": GITHUB_PROFILE,
        "demo_url": None,
        "featured": True,
        "problem": "Security tooling is often heavy, GUI-driven, or locked behind licenses. Small, focused CLI utilities close the gap for day-to-day defensive work.",
        "objectives": [
            "Ship five focused utilities, each doing one thing well",
            "Prioritise minimal dependencies + readable code",
            "Publish everything to GitHub under a permissive licence",
        ],
        "implementation": [
            "Server Scanner — port + service enumeration wrapper",
            "Nginx Log Analyzer — parses access logs, flags anomalies",
            "LCS Scanner — longest common subsequence for text similarity",
            "Password Strength WASM Tool — client-side entropy scoring",
            "Caesar Cipher Tool — classical crypto teaching aid",
        ],
        "security_measures": [
            "All utilities run without elevated privileges",
            "No telemetry or outbound calls",
        ],
        "lessons_learned": [
            "Small tools compose into a personal security workflow better than any monolith",
        ],
    },
    {
        "id": "p4",
        "slug": "ai-fish-catch-prediction",
        "title": "AI Fish Catch Prediction",
        "summary": "Machine learning application predicting fish catch from environmental data, with an interactive dashboard.",
        "description": "A Python + Flask machine learning app that takes environmental variables and predicts fish catch probabilities. Includes preprocessing pipelines and a visual dashboard for exploration.",
        "image": IMG_INFRA,
        "tech": ["Python", "Flask", "scikit-learn", "Pandas", "Chart.js"],
        "tags": ["AI", "Automation"],
        "year": "2024",
        "status": "Shipped",
        "github_url": GITHUB_PROFILE,
        "demo_url": None,
        "featured": False,
        "problem": "Small-scale fishing decisions rely on intuition. This project explores whether a lightweight ML model can add signal on top of environmental telemetry.",
        "objectives": [
            "Ingest and clean environmental datasets",
            "Train and evaluate a baseline predictive model",
            "Surface results in an interactive dashboard",
        ],
        "implementation": [
            "Pandas preprocessing pipeline with feature engineering",
            "scikit-learn baseline model with cross-validation",
            "Flask API serving predictions to a JS dashboard",
        ],
        "lessons_learned": [
            "A well-cleaned dataset beats a fancy model every time",
        ],
    },
    {
        "id": "p5",
        "slug": "medbot-ai-healthcare",
        "title": "MedBot — AI Healthcare Management",
        "summary": "Healthcare management platform combining Flask + MySQL with a Dialogflow conversational AI layer.",
        "description": "A Flask-based healthcare management system with appointment scheduling, patient records, billing and a Dialogflow-powered chatbot that assists patients and staff in natural language.",
        "image": IMG_CODE,
        "tech": ["Python", "Flask", "MySQL", "Dialogflow", "HTML", "CSS"],
        "tags": ["AI", "Automation"],
        "year": "2024",
        "status": "Shipped",
        "github_url": GITHUB_PROFILE,
        "demo_url": None,
        "featured": False,
        "problem": "Healthcare admin workflows are still fragmented across paper, spreadsheets and disconnected apps.",
        "objectives": [
            "Consolidate appointment, patient and billing management in one platform",
            "Layer a conversational assistant to reduce staff overhead",
        ],
        "implementation": [
            "Relational schema for patients, appointments, invoices",
            "Dialogflow intents for common queries + fulfillment endpoints",
        ],
        "security_measures": [
            "Parameterised SQL queries throughout",
            "Session-based auth with hashed passwords",
        ],
    },
]


# ============ Live GitHub repos with cache + fallback ============
_repo_cache = {"ts": 0.0, "data": None}
_CACHE_TTL_SECONDS = 600  # 10 minutes


def _fallback_repos() -> List[dict]:
    """Static fallback used only if the GitHub API is unreachable."""
    return [
        {
            "name": "netflix-devsecops",
            "description": "End-to-end DevSecOps pipeline for a Netflix-clone app.",
            "language": "Groovy",
            "stars": 0,
            "forks": 0,
            "updated_at": "2025-11-01",
            "topics": ["devsecops", "jenkins", "kubernetes", "argo-cd", "sonarqube", "trivy"],
            "html_url": GITHUB_PROFILE,
        },
        {
            "name": "gps-intelligence-dashboard",
            "description": "Geospatial dashboard with AI-driven movement predictions.",
            "language": "TypeScript",
            "stars": 0,
            "forks": 0,
            "updated_at": "2025-09-15",
            "topics": ["nextjs", "python", "ai", "geospatial"],
            "html_url": GITHUB_PROFILE,
        },
        {
            "name": "security-utilities",
            "description": "Server scanner, log analyser, WASM password tool and more.",
            "language": "Python",
            "stars": 0,
            "forks": 0,
            "updated_at": "2025-08-02",
            "topics": ["cybersecurity", "wasm", "cli", "utilities"],
            "html_url": GITHUB_PROFILE,
        },
    ]


async def _fetch_live_repos(username: str) -> List[dict]:
    url = f"https://api.github.com/users/{username}/repos"
    params = {"per_page": 30, "sort": "updated", "type": "owner"}
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "portfolio-app"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    async with httpx.AsyncClient(timeout=8.0) as http:
        r = await http.get(url, params=params, headers=headers)
        r.raise_for_status()
        rows = r.json()

    def _clean(repo: dict) -> dict:
        return {
            "name": repo.get("name") or "",
            "description": (repo.get("description") or "").strip() or "No description provided.",
            "language": repo.get("language") or "Other",
            "stars": int(repo.get("stargazers_count", 0)),
            "forks": int(repo.get("forks_count", 0)),
            "updated_at": (repo.get("updated_at") or "")[:10],
            "topics": repo.get("topics") or [],
            "html_url": repo.get("html_url") or f"https://github.com/{username}",
        }

    cleaned = [_clean(r) for r in rows if not r.get("fork") and not r.get("archived")]
    # Rank: stars desc, then most recently updated
    cleaned.sort(key=lambda r: (-r["stars"], r["updated_at"]), reverse=False)
    cleaned.sort(key=lambda r: (r["stars"], r["updated_at"]), reverse=True)
    return cleaned[:8]


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
    now = time.time()
    if _repo_cache["data"] is not None and (now - _repo_cache["ts"]) < _CACHE_TTL_SECONDS:
        return _repo_cache["data"]
    try:
        data = await _fetch_live_repos(GITHUB_USERNAME)
        if not data:
            data = _fallback_repos()
    except Exception as exc:
        logger.warning("GitHub live fetch failed: %s — using fallback.", exc)
        data = _fallback_repos()
    _repo_cache["data"] = data
    _repo_cache["ts"] = now
    return data


@api_router.get("/stats")
async def portfolio_stats():
    try:
        repos = await list_repos()
        stars = sum(r["stars"] for r in repos)
    except Exception:
        stars = 0
    return {
        "projects_shipped": len(PROJECTS),
        "years_experience": 2,
        "certifications": 8,
        "open_source_stars": stars,
        "clouds": 3,
        "tryhackme_rank_percentile": 1,
        "tryhackme_labs_completed": 263,
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
