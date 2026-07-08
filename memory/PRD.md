# Engineering Portfolio — PRD

## Original problem statement
Build a premium, enterprise-grade portfolio for a DevSecOps / Cloud Engineering / Cybersecurity / AI / Automation engineer. Must feel like an engineering product — not a template. Inspired by Vercel, Linear, Stripe, Cloudflare, OpenAI, Framer, Apple, Supabase. Includes interactive 3D globe, animated terminal, DevSecOps pipeline visualization, case study pages, GitHub repos, certifications, experience, and contact form.

## Architecture
- **Backend**: FastAPI, MongoDB (Motor). Endpoints prefixed `/api`. Serves projects, GitHub repos (mocked JSON), stats, contact form. All routes documented in `server.py`.
- **Frontend**: React 19 + CRA (Craco), Tailwind CSS, Framer Motion for animation, Lenis (via `lenis/react`) for smooth scroll, `react-globe.gl` (three.js) for the interactive globe, `react-fast-marquee` for the tech ticker, Sonner for toasts, lucide-react for icons.
- **Fonts**: Cabinet Grotesk (headings), Satoshi (body), JetBrains Mono (technical). Loaded via Fontshare + Google Fonts.
- **Theme**: Dark-only (`.dark` class applied on mount). Cyan (#00E5FF) + acid yellow (#CCFF00) accents on near-black background with radial aurora + cyber grid.

## Users
- Primary: Recruiters, hiring managers, engineering directors evaluating a DevSecOps / Cloud Security candidate.
- Secondary: Peers, community members visiting via GitHub / social links.

## Core requirements (static)
- Hero with animated name reveal, rotating role, availability badge, primary + secondary CTA, social links, background aurora + grid, tech ticker.
- Infinite scrolling tech ticker (AWS, Azure, GCP, Docker, K8s, Python, Linux, Terraform, Jenkins, GA, Argo CD, Prom, Grafana, React, Next, TS, Burp, Nmap, Wireshark, OpenAI, Framer Motion).
- DevSecOps pipeline visualization (Code → Build → Test → SAST → Scan → Sign → Deploy → Observe).
- Skills bento (Cloud, DevSecOps, Cybersecurity, Containers, Observability, AI, IaC, Languages).
- Projects grid with filter (All / DevSecOps / Cloud / Cybersecurity / AI / Automation) → detailed case study pages (Problem, Objectives, Architecture, Implementation, Security, DevSecOps pipeline, Cloud arch, Challenges, Lessons, Future).
- Cybersecurity practice cards (AppSec, OffSec, Threat Intel, Linux, Cloud Sec, Security Automation).
- Interactive terminal (commands: help, about, skills, projects, github, resume, contact, experience, education, certifications, whoami, clear, history, pwd, ls, cat) with autocomplete + history + blinking cursor.
- Global network 3D globe (react-globe.gl) with atmosphere, animated arcs, region points, auto-rotate.
- GitHub repositories section (stars, forks, language, topics, updated_at).
- Experience timeline + Education.
- Certifications grid.
- Contact form (name, email, subject, message) posting to `/api/contact`.
- Global effects: Lenis smooth scroll, scroll progress bar, mouse spotlight, back-to-top.

## Backend endpoints
- `GET /api/` health
- `GET /api/projects?featured=&tag=` list projects
- `GET /api/projects/{slug}` single project
- `GET /api/github/repos` list repos
- `GET /api/stats` aggregate stats
- `POST /api/contact` submit contact form
- `GET /api/status` + `POST /api/status` (legacy)

## What's been implemented (2025-12)
- Full frontend with all sections listed above
- Backend endpoints listed above
- Design tokens, motion timings, focus states, keyboard nav, aria-labels
- Lint clean (pre-existing shadcn calendar / command warnings remain, not on our code)
- No auth required

## Backlog
- P1: Wire GitHub section to live GitHub API using a user handle env var
- P1: PDF resume download route
- P2: Blog / Writing section (MDX)
- P2: Theme toggle (light mode already defined in tokens)
- P2: SEO metadata + OG images per project detail page
- P2: Server-side analytics endpoint for contact conversion tracking
- P3: i18n

## Next tasks
- Testing agent verification of API + UI
- User replaces PROFILE (name, links, email) in `src/lib/data.js`
EOF

## Update — real content + live GitHub + resume (2025-12)
- Replaced placeholder `PROFILE`, `EXPERIENCE` (repurposed as achievements), `EDUCATION`, `CERTIFICATIONS` in `/app/frontend/src/lib/data.js` with **Nithin Karipalli**'s real details.
- Replaced `PROJECTS` in `/app/backend/server.py` with 5 real projects (Netflix DevSecOps Pipeline, GPS Intelligence Dashboard, Security Utilities Suite, AI Fish Catch Prediction, MedBot).
- Wired `/api/github/repos` to fetch **live** from `https://api.github.com/users/Ni7H1N/repos` with 10-minute in-memory cache and static fallback on error. Env vars: `GITHUB_USERNAME` (default `Ni7H1N`), optional `GITHUB_TOKEN` for higher rate limits.
- Added placeholder `/app/frontend/public/resume.pdf` (1.8 KB reportlab-generated PDF) — user can drop their real PDF over it.
- Navbar now has separate **Resume** (→ `/resume.pdf`) and **Get in touch** buttons; Hero now has three CTAs (View case studies · Download resume · Open terminal).
- Terminal `projects` output reflects new slugs; brand text → `ni7h1n/sec`; terminal header → `nithin@portfolio`.
- Iteration 2 testing: 15/15 backend, 14/14 frontend — passed.

## Next tasks
- User to drop real one-page PDF at `/app/frontend/public/resume.pdf`
- Optional: set `GITHUB_TOKEN` in `/app/backend/.env` to avoid GitHub 60-req/hr anon rate limit
- Optional: connect real GitHub star counts to the hero stats

## Update — perf + top-notch features (iter 3)
- Rotated `GITHUB_TOKEN` to the new PAT in `/app/backend/.env`.
- **Command Palette (⌘K / Ctrl+K)** — shadcn Command dialog with Navigate / Actions / Projects / Elsewhere groups. Copy email, download resume, jump to any section or open any project. Component: `/app/frontend/src/components/effects/CommandPalette.jsx`.
- **Live Time pill** in navbar showing current time in Asia/Kolkata (`HYD HH:MM`) with a green pulse. Component: `/app/frontend/src/components/effects/LiveTime.jsx`.
- **Achievements section** ("// signals · Proof of practice.") with 4 cards: Top 1% TryHackMe / Top 100 Great AppSec / 3rd Place Overnight CTF / 263 labs. Sits between Cybersecurity and Terminal.
- **Copy-email button** next to email in Contact section (sonner toast on success/failure).
- **Perf: lazy-mount globe** — `IntersectionObserver` gate before mounting `react-globe.gl` (three.js). Shows an animated concentric-circle placeholder until the user reaches the section. Also clamps devicePixelRatio to 1.5 and uses `low-power` GPU preference. Big paint-and-boot win.
- **Perf: Lenis re-tuned** — switched from duration-based smoothing to `lerp: 0.09` with `syncTouch: true` for a snappier, more "native" feel.
- **Perf: font preconnect** — added preconnects for Fontshare and dns-prefetch for unpkg / api.github.com in `/app/frontend/public/index.html`.
- **SEO fix** — replaced default title/description with real Nithin content.
- **Accessibility** — added visually-hidden DialogTitle to command palette to satisfy Radix a11y contract.
- **Iter 3 testing**: 15/15 backend, 18/18 frontend features — passed. FCP ~840ms, DCL ~920ms.
