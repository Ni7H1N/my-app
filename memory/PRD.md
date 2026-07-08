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
