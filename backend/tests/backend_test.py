"""
Backend regression suite for Engineering Portfolio API.
Runs against REACT_APP_BACKEND_URL/api.
Covers: health, projects list + filters, project detail, github repos,
stats, contact form (happy path + validation).
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
        assert "online" in data["message"].lower() or "portfolio" in data["message"].lower()


# -------- projects list + filters --------
class TestProjects:
    def test_list_projects_returns_six(self, client):
        r = client.get(f"{BASE}/projects")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 6
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

    def test_project_detail_zero_trust_full_case_study(self, client):
        slug = "zero-trust-k8s-platform"
        r = client.get(f"{BASE}/projects/{slug}")
        assert r.status_code == 200
        p = r.json()
        assert p["slug"] == slug
        # full case study fields
        for k in ("problem", "objectives", "architecture", "implementation", "devsecops_pipeline"):
            assert k in p, f"missing case study field {k}"
            assert p[k] is not None
        assert isinstance(p["objectives"], list)
        assert isinstance(p["implementation"], list)
        assert isinstance(p["devsecops_pipeline"], list)

    def test_project_detail_not_found(self, client):
        r = client.get(f"{BASE}/projects/does-not-exist")
        assert r.status_code == 404
        data = r.json()
        assert "detail" in data


# -------- github repos --------
class TestGitHub:
    def test_github_repos_shape(self, client):
        r = client.get(f"{BASE}/github/repos")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 6
        required = {"name", "stars", "forks", "language", "topics", "updated_at"}
        for repo in data:
            missing = required - set(repo.keys())
            assert not missing, f"repo missing keys: {missing}"
            assert isinstance(repo["stars"], int)
            assert isinstance(repo["forks"], int)
            assert isinstance(repo["topics"], list)


# -------- stats --------
class TestStats:
    def test_stats_shape(self, client):
        r = client.get(f"{BASE}/stats")
        assert r.status_code == 200
        data = r.json()
        for k in ("projects_shipped", "years_experience", "certifications", "open_source_stars", "clouds"):
            assert k in data, f"stats missing {k}"
            assert isinstance(data[k], int)
        assert data["projects_shipped"] > 0
        assert data["open_source_stars"] > 0


# -------- contact --------
class TestContact:
    def test_contact_valid_persists(self, client):
        payload = {
            "name": "TEST_Aarav Contact",
            "email": "test-contact@example.com",
            "subject": "TEST_Zero-trust review",
            "message": "TEST_Automated backend test message. Please ignore.",
        }
        r = client.post(f"{BASE}/contact", json=payload)
        assert r.status_code == 200, f"body={r.text}"
        data = r.json()
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert "created_at" in data
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["subject"] == payload["subject"]
        assert data["message"] == payload["message"]

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

    def test_contact_empty_message_rejected(self, client):
        payload = {
            "name": "TEST_x",
            "email": "test@example.com",
            "subject": "TEST_x",
            "message": "",
        }
        r = client.post(f"{BASE}/contact", json=payload)
        assert r.status_code == 422
