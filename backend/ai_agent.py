"""AI agent that answers questions about Nithin Karipalli's portfolio.

Primary: Gemini via emergentintegrations. If the provider fails (budget
exceeded, network, missing key), a keyword-based fallback answers common
recruiter questions from the same FACTS block so the widget always feels alive.
"""
from __future__ import annotations

import os
import time
import logging
import re
from typing import Dict

from emergentintegrations.llm.chat import LlmChat, UserMessage

logger = logging.getLogger(__name__)

MODEL_PROVIDER = "gemini"
MODEL_NAME = "gemini-2.0-flash"

SYSTEM_PROMPT = """You are the "Portfolio Agent" for Nithin Karipalli.

You know only the FACTS block below. Answer questions **grounded strictly in it**.

RULES
- Be concise. 2–4 short sentences by default. Use bullet points only when listing items.
- When a question spans multiple areas, EXPLICITLY connect them ("The Netflix DevSecOps Pipeline uses Trivy, which pairs with Nithin's OWASP Top 10 practice from TryHackMe").
- If asked something outside the portfolio (weather, general programming, unrelated topics), politely redirect: "I can only speak about Nithin's work — try asking about his projects, certifications, CTF wins, or DevSecOps stack."
- Never invent projects, employers, or credentials. If the answer isn't in the FACTS, say so.
- Use plain text — no markdown headings, no code fences. Inline `code` styling is fine for tool names.
- Refer to Nithin in third person ("Nithin has…", "his DevSecOps pipeline…").

FACTS
Name: Nithin Karipalli
Handle: @Ni7H1N
Location: Hyderabad, Telangana, India
Availability: Available for internships and full-time roles
Contact: nithinkaripalli@gmail.com · +91 9398775370
Links: github.com/Ni7H1N · linkedin.com/in/nithin-karipalli · tryhackme.com/p/Ni7H1N

Focus areas: Cybersecurity, Cloud Security, DevSecOps, AI Security, Security Automation.

Languages: Python, JavaScript, TypeScript, SQL, Bash.
Cybersecurity practice: Penetration testing, Vulnerability assessment, OWASP Top 10, Threat Intelligence,
Reconnaissance, Web AppSec, Network security, Linux security, Cryptography, Security Automation.
Cloud: AWS (EC2, IAM, S3), Microsoft Azure, Google Cloud Platform.
DevSecOps stack: Docker, Kubernetes, Jenkins, GitHub Actions, Argo CD, SonarQube, Trivy,
Prometheus, Grafana, Terraform (basic).
Security tools: Burp Suite, Nmap, Wireshark, SQLMap, Hydra, Gobuster, John the Ripper, Metasploit.
OS: Kali Linux, Ubuntu, Windows.
AI: Generative AI, LLMs, Prompt engineering, AI security.

Projects (5):
1. Netflix DevSecOps Pipeline — Jenkins + Docker + Kubernetes + Argo CD + SonarQube + Trivy + Prometheus + Grafana.
   End-to-end DevSecOps CI/CD with SAST gate, container CVE scan, GitOps deploy, live monitoring. Shipped 2025.
2. GPS Intelligence Dashboard — Next.js + React + Python + Flask + ML. Live GPS traces + AI-predicted movement. 2025.
3. Security Utilities Suite — Python + JS + WebAssembly + Bash. Five utilities: Server Scanner,
   Nginx Log Analyzer, LCS Scanner, Password Strength WASM Tool, Caesar Cipher. Open-source. 2024.
4. AI Fish Catch Prediction — Python + Flask + scikit-learn. ML on environmental data with dashboard. 2024.
5. MedBot AI Healthcare — Flask + MySQL + Dialogflow. Appointment + patient + billing + conversational AI. 2024.

Achievements:
- Top 1% globally on TryHackMe with 263+ hands-on cybersecurity labs and 23+ badges.
- Top 100 Performer at the Great AppSec Hackathon CTF.
- 3rd Place at the Overnight Capture The Flag competition organised by The Hackers Meetup, Nagpur Chapter.
- Hands-on Azure security challenges and cloud-based CTFs.

Certifications:
- ISC2 Certified in Cybersecurity (CC)
- Cisco Introduction to Cybersecurity
- Cisco Cybersecurity Essentials
- ArcX Foundation Level Threat Intelligence Analyst
- Learn Bug Bounty Hunting & Web Security Testing (Udemy)
- Google Cloud Skills Boost — Introduction to Generative AI
- Google Cloud Skills Boost — Introduction to Large Language Models
- Google Cloud Skills Boost — Introduction to Image Generation

Education: B.Tech Computer Science and Engineering,
Vignan's Institute of Information Technology (Autonomous), Visakhapatnam. Graduating April 2026.

CONNECTIONS (use these to make your answers feel joined-up):
- Netflix DevSecOps Pipeline ↔ Cybersecurity practice: SonarQube + Trivy operationalise Nithin's OWASP Top 10 knowledge.
- Netflix DevSecOps Pipeline ↔ Cloud: Kubernetes + Argo CD experience maps onto the AWS EKS / Azure AKS / GKE portfolio target.
- Security Utilities Suite ↔ CTFs: several utilities (LCS Scanner, Caesar Cipher) came directly from CTF challenge writeups.
- AI Fish Catch Prediction + MedBot + GPS Dashboard ↔ AI security certs: applied ML and Dialogflow work backs up the Generative AI / LLM certifications.
- Threat Intelligence Analyst cert ↔ TryHackMe rooms in threat intel and network forensics.

If asked "what should I hire Nithin for" or "why hire", answer with a concise pitch:
He builds secure, monitored, GitOps-driven pipelines and has hands-on adversarial cybersecurity experience —
rare in a fresh graduate. Suggest DevSecOps engineer, Cloud security engineer or Security automation engineer roles.
"""

# Session cache: {session_id: (chat_instance, last_used_epoch)}
_CHAT_SESSIONS: Dict[str, tuple[LlmChat, float]] = {}
_SESSION_TTL = 60 * 30  # 30 minutes


def _sweep_sessions() -> None:
    now = time.time()
    stale = [sid for sid, (_, ts) in _CHAT_SESSIONS.items() if now - ts > _SESSION_TTL]
    for sid in stale:
        _CHAT_SESSIONS.pop(sid, None)


def get_chat(session_id: str) -> LlmChat:
    _sweep_sessions()
    entry = _CHAT_SESSIONS.get(session_id)
    if entry:
        chat, _ = entry
        _CHAT_SESSIONS[session_id] = (chat, time.time())
        return chat

    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise RuntimeError("EMERGENT_LLM_KEY missing from environment")

    chat = LlmChat(
        api_key=api_key,
        session_id=session_id,
        system_message=SYSTEM_PROMPT,
    ).with_model(MODEL_PROVIDER, MODEL_NAME)
    _CHAT_SESSIONS[session_id] = (chat, time.time())
    return chat


# ---------- keyword-based fallback ----------
# Each entry: (list of trigger keywords, canned reply grounded in the FACTS block)
_FALLBACK_RULES: list[tuple[tuple[str, ...], str]] = [
    (
        ("hire", "why", "pitch", "recommend", "role", "fit"),
        "Nithin builds secure, monitored, GitOps-driven pipelines and has hands-on adversarial cybersecurity experience — "
        "a rare combination in a fresh graduate. He's a strong fit for DevSecOps engineer, Cloud security engineer, or "
        "Security automation engineer roles. Reach him at nithinkaripalli@gmail.com or on LinkedIn (linkedin.com/in/nithin-karipalli)."
    ),
    (
        ("devsecops", "pipeline", "stack", "ci/cd", "cicd", "jenkins"),
        "Nithin's DevSecOps stack: Docker, Kubernetes, Jenkins, GitHub Actions, Argo CD, SonarQube, Trivy, Prometheus and Grafana. "
        "His flagship Netflix DevSecOps Pipeline project runs the full flow — signed commits, SAST gate (SonarQube), container CVE scan (Trivy), "
        "GitOps deploy via Argo CD, then live SLO monitoring in Prometheus + Grafana."
    ),
    (
        ("kubernetes", "k8s", "docker", "container", "gitops", "argo"),
        "Container + orchestration work shows up in the Netflix DevSecOps Pipeline: multi-stage Docker builds, Kubernetes deploys, and GitOps sync with Argo CD. "
        "Trivy scans images for CVEs before rollout, and Prometheus/Grafana watch runtime SLOs."
    ),
    (
        ("cyber", "security", "pentest", "owasp", "vulnerab", "appsec"),
        "Cybersecurity practice: penetration testing, vulnerability assessment, OWASP Top 10, threat intelligence, reconnaissance, Web AppSec, network security, "
        "Linux security, cryptography and security automation. Backed by the ISC2 CC cert, ArcX Threat Intelligence cert, and 263+ TryHackMe labs (Top 1% globally)."
    ),
    (
        ("ctf", "hackathon", "capture the flag", "tryhackme", "compet"),
        "CTF & competition record: Top 1% on TryHackMe (263+ labs, 23+ badges), Top 100 Performer at the Great AppSec Hackathon CTF, "
        "and 3rd Place at the Overnight Capture The Flag competition organised by The Hackers Meetup, Nagpur Chapter."
    ),
    (
        ("cloud", "aws", "azure", "gcp", "google cloud"),
        "Cloud coverage: AWS (EC2, IAM, S3), Microsoft Azure, and Google Cloud Platform — including hands-on Azure security challenges. "
        "His Kubernetes + Argo CD experience maps directly onto managed offerings like EKS, AKS and GKE."
    ),
    (
        ("ai", "ml", "llm", "gpt", "genai", "machine learning", "gemini"),
        "AI work: Generative AI, LLMs, prompt engineering, and AI security. Applied ML shows up in three projects — AI Fish Catch Prediction (scikit-learn), "
        "MedBot Healthcare (Dialogflow conversational AI), and the GPS Intelligence Dashboard (movement prediction). "
        "Backed by three Google Cloud Skills Boost certs on GenAI, LLMs and Image Generation."
    ),
    (
        ("cert", "certification", "isc2", "cisco", "arcx"),
        "Certifications: ISC2 Certified in Cybersecurity (CC), Cisco Introduction to Cybersecurity, Cisco Cybersecurity Essentials, "
        "ArcX Foundation Level Threat Intelligence Analyst, Bug Bounty Hunting & Web Security Testing (Udemy), and three Google Cloud Skills Boost certs "
        "(Generative AI, LLMs, Image Generation)."
    ),
    (
        ("project", "work", "portfolio", "built", "shipped"),
        "Five shipped projects: 1) Netflix DevSecOps Pipeline (Jenkins/K8s/Argo CD/SonarQube/Trivy/Prometheus/Grafana), "
        "2) GPS Intelligence Dashboard (Next.js + Flask + ML), 3) Security Utilities Suite (5 open-source tools), "
        "4) AI Fish Catch Prediction (scikit-learn), 5) MedBot AI Healthcare (Flask + MySQL + Dialogflow)."
    ),
    (
        ("netflix",),
        "The Netflix DevSecOps Pipeline is Nithin's flagship: an end-to-end CI/CD flow that ships a Netflix-clone with signed commits, "
        "SAST via SonarQube, container CVE scanning via Trivy, GitOps deploy to Kubernetes through Argo CD, and live monitoring in Prometheus + Grafana. Shipped 2025."
    ),
    (
        ("gps",),
        "GPS Intelligence Dashboard: Next.js + React frontend with a Python/Flask backend and an ML model that predicts movement from live GPS traces. Shipped 2025."
    ),
    (
        ("medbot", "healthcare", "medical"),
        "MedBot AI Healthcare: Flask + MySQL app with appointment scheduling, patient records, billing and a Dialogflow conversational AI assistant. Shipped 2024."
    ),
    (
        ("contact", "email", "reach", "hire", "connect"),
        "You can reach Nithin at nithinkaripalli@gmail.com or +91 9398775370. Links: github.com/Ni7H1N, linkedin.com/in/nithin-karipalli, tryhackme.com/p/Ni7H1N."
    ),
    (
        ("education", "college", "degree", "university", "vignan"),
        "Nithin is completing his B.Tech in Computer Science and Engineering at Vignan's Institute of Information Technology (Autonomous), Visakhapatnam, graduating April 2026."
    ),
    (
        ("language", "python", "typescript", "javascript", "bash"),
        "Languages: Python, JavaScript, TypeScript, SQL and Bash — used across projects from the Flask ML backends to the WebAssembly password-strength tool."
    ),
    (
        ("tool", "burp", "nmap", "wireshark", "metasploit", "sqlmap"),
        "Offensive/security tools Nithin uses: Burp Suite, Nmap, Wireshark, SQLMap, Hydra, Gobuster, John the Ripper and Metasploit — mainly on Kali Linux."
    ),
]

_DEFAULT_FALLBACK = (
    "The AI agent is briefly resting, so here's a quick pitch grounded in Nithin's portfolio: he's a Cybersecurity + DevSecOps engineer "
    "with a shipped Netflix-style CI/CD pipeline (Jenkins, Trivy, SonarQube, Argo CD, Prometheus, Grafana), Top 1% TryHackMe rank, "
    "and ISC2 CC + ArcX Threat Intel certifications. Try asking about a specific project, cert, or his DevSecOps stack — "
    "or reach him directly at nithinkaripalli@gmail.com."
)


def _fallback_reply(message: str) -> str:
    """Match user message against keyword rules; return the best canned reply."""
    lower = message.lower()
    for keywords, reply in _FALLBACK_RULES:
        for kw in keywords:
            # word-boundary match so 'ai' doesn't hit 'said'
            if re.search(rf"\b{re.escape(kw)}\b", lower):
                return reply
    return _DEFAULT_FALLBACK


async def ask(session_id: str, message: str) -> str:
    """Non-streaming ask. Tries the LLM first; falls back to canned replies on any error."""
    try:
        chat = get_chat(session_id)
        result = await chat.send_message(UserMessage(text=message))
        text = result if isinstance(result, str) else str(result)
        # Sanity check: some providers return empty string on quota errors without raising.
        if not text or not text.strip():
            raise RuntimeError("empty LLM response")
        return text
    except Exception as exc:  # noqa: BLE001 — provider errors, budget, network, etc.
        logger.warning("ai_agent falling back to canned reply: %s", exc)
        # Wipe the cached chat so a later retry gets a fresh instance.
        _CHAT_SESSIONS.pop(session_id, None)
        return _fallback_reply(message)
