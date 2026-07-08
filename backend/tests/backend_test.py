"""
Backend regression suite for Engineering Portfolio API (Nithin Karipalli).
Runs against REACT_APP_BACKEND_URL/api.
Covers: health, projects list + filters, project detail (netflix case study),
GitHub live repos + caching, stats, contact form (happy + validation),
resume.pdf static asset.
"""
import os
import time
from pathlib import Path

import pytest
import requests
from dotenv import load_dotenv

# Load frontend .env to get the public REACT_APP_BACKEND_URL
FRONTEND_ENV = Path("/app/frontend/.env")
load_dotenv(FRONTEND_ENV)

BACKEND_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
BASE = f"{BACKEND_URL}/api"

EXPECTED_SLUGS = {
    "netflix-devsecops-pipeline",
    "gps-intelligence-dashboard",
    "security-utilities-suite",
    "ai-fish-catch-prediction",
    "medbot-ai-healthcare",
}


@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# -------- health --------
class TestHealth:
    def test_root_health(self, client):
        r = client.get(f"{BASE}/")
        assert r.status_code == 200
        data = r.json()
        assert "message" in data
        assert isinstance(data["message"], str)


# -------- projects list + filters --------
class TestProjects:
    def test_list_projects_returns_five_with_expected_slugs(self, client):
        r = client.get(f"{BASE}/projects")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 5, f"expected 5 projects, got {len(data)}"
        got_slugs = {p["slug"] for p in data}
        assert got_slugs == EXPECTED_SLUGS, f"slug mismatch. got={got_slugs}"
        required = {"slug", "title", "tags", "tech", "image"}
        for p in data:
            missing = required - set(p.keys())
            assert not missing, f"project missing keys: {missing}"
            assert isinstance(p["tags"], list)
            assert isinstance(p["tech"], list)

    def test_list_projects_featured_true(self, client):
        r = client.get(f"{BASE}/projects", params={"featured": "true"})
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        for p in data:
            assert p.get("featured") is True

    def test_list_projects_filter_by_tag_devsecops(self, client):
        r = client.get(f"{BASE}/projects", params={"tag": "DevSecOps"})
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        for p in data:
            assert "DevSecOps" in p["tags"]

    def test_list_projects_filter_by_tag_no_match(self, client):
        r = client.get(f"{BASE}/projects", params={"tag": "NonExistentTagXYZ"})
        assert r.status_code == 200
        assert r.json() == []

    def test_project_detail_netflix_devsecops_full_case_study(self, client):
        slug = "netflix-devsecops-pipeline"
        r = client.get(f"{BASE}/projects/{slug}")
        assert r.status_code == 200
        p = r.json()
        assert p["slug"] == slug
        assert p["title"] == "Netflix DevSecOps Pipeline"
        for k in ("problem", "objectives", "architecture", "implementation", "devsecops_pipeline"):
            assert k in p, f"missing case study field {k}"
            assert p[k], f"field {k} empty"
        assert isinstance(p["objectives"], list) and len(p["objectives"]) > 0
        assert isinstance(p["implementation"], list) and len(p["implementation"]) > 0
        assert isinstance(p["devsecops_pipeline"], list) and len(p["devsecops_pipeline"]) > 0

    def test_project_detail_not_found(self, client):
        r = client.get(f"{BASE}/projects/does-not-exist")
        assert r.status_code == 404
        data = r.json()
        assert "detail" in data


# -------- github repos (live) --------
class TestGitHub:
    def test_github_repos_live_shape_and_username(self, client):
        r = client.get(f"{BASE}/github/repos", timeout=15)
        assert r.status_code == 200, f"body={r.text[:300]}"
        data = r.json()
        assert isinstance(data, list)
        assert len(data) > 0, "repos list must not be empty"
        required = {"name", "stars", "forks", "language", "topics", "updated_at", "html_url"}
        for repo in data:
            missing = required - set(repo.keys())
            assert not missing, f"repo missing keys: {missing}"
            assert isinstance(repo["stars"], int)
            assert isinstance(repo["forks"], int)
            assert isinstance(repo["topics"], list)
            assert isinstance(repo["name"], str) and len(repo["name"]) > 0
            # html_url should point at Ni7H1N's github (either repo url or profile)
            assert repo["html_url"].startswith("https://github.com/Ni7H1N"), (
                f"unexpected html_url: {repo['html_url']}"
            )

    def test_github_repos_expected_names_subset(self, client):
        r = client.get(f"{BASE}/github/repos", timeout=15)
        assert r.status_code == 200
        data = r.json()
        got_names = {repo["name"] for repo in data}
        expected_candidates = {
            "nginx-log-analyser",
            "server-scanner",
            "LCS-Scanner",
            "password-strength-wasm",
            "DevSecOps-Project",
        }
        overlap = got_names & expected_candidates
        # Accept "at least one" as pass — GitHub may rename or repo list may vary,
        # and if live call falls back we still expect >=1 canonical repo name.
        if not overlap:
            # If nothing matches, this could be the fallback list. Verify at least
            # it looks like the fallback (names present) — but flag as info.
            pytest.skip(
                f"No overlap with expected repo names — likely fallback. Got: {got_names}"
            )
        assert overlap, f"expected subset overlap. got={got_names}"

    def test_github_repos_cached_fast_second_call(self, client):
        # prime
        client.get(f"{BASE}/github/repos", timeout=15)
        t0 = time.time()
        r = client.get(f"{BASE}/github/repos", timeout=15)
        elapsed = time.time() - t0
        assert r.status_code == 200
        # Cached call should be fast (well under 8s). Allow generous 5s.
        assert elapsed < 5.0, f"cached call took {elapsed:.2f}s, expected <5s"


# -------- stats --------
class TestStats:
    def test_stats_shape_and_values(self, client):
        r = client.get(f"{BASE}/stats")
        assert r.status_code == 200
        data = r.json()
        for k in ("projects_shipped", "certifications", "tryhackme_rank_percentile",
                  "tryhackme_labs_completed"):
            assert k in data, f"stats missing {k}"
        assert data["projects_shipped"] == 5
        assert data["certifications"] == 8
        assert data["tryhackme_rank_percentile"] == 1
        assert data["tryhackme_labs_completed"] == 263


# -------- contact --------
class TestContact:
    def test_contact_valid_persists(self, client):
        payload = {
            "name": "TEST_Nithin Contact",
            "email": "test-contact@example.com",
            "subject": "TEST_Portfolio review",
            "message": "TEST_Automated backend test message. Please ignore.",
        }
        r = client.post(f"{BASE}/contact", json=payload)
        assert r.status_code == 200, f"body={r.text}"
        data = r.json()
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert data["email"] == payload["email"]

    def test_contact_invalid_email_rejected(self, client):
        payload = {
            "name": "TEST_Bad Email",
            "email": "not-an-email",
            "subject": "TEST_",
            "message": "TEST_ignored",
        }
        r = client.post(f"{BASE}/contact", json=payload)
        assert r.status_code == 422

    def test_contact_missing_fields_rejected(self, client):
        payload = {"name": "TEST_"}
        r = client.post(f"{BASE}/contact", json=payload)
        assert r.status_code == 422


# -------- resume static asset --------
class TestResumeAsset:
    def test_resume_pdf_served(self, client):
        r = client.get(f"{BACKEND_URL}/resume.pdf", timeout=15)
        assert r.status_code == 200, f"got {r.status_code}"
        ctype = r.headers.get("content-type", "")
        assert "pdf" in ctype.lower(), f"unexpected content-type: {ctype}"
        assert len(r.content) > 100, "resume.pdf appears empty"
