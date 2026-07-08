import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Github } from "lucide-react";
import { fetchProjects } from "@/lib/api";
import { IDS } from "@/constants/testIds";

const FILTERS = ["All", "DevSecOps", "Cloud", "Cybersecurity", "AI", "Automation"];

function SectionHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-400/80">
          {"// 03 · engineering case studies"}
        </p>
        <h2 className="mt-4 font-cabinet text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
          <span className="text-metallic">Selected</span>{" "}
          <span className="text-white/60">work.</span>
        </h2>
      </div>
      <p className="max-w-md text-sm text-white/50">
        A small set of production systems. Each is a study in tradeoffs — security, performance, cost, and the humans operating them.
      </p>
    </div>
  );
}

function ProjectCard({ p, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      data-testid={IDS.projectCard(p.slug)}
      className="group relative surface-glass p-6 md:p-8 hover:border-cyan-400/25 transition-colors duration-300"
    >
      <div className="absolute -top-3 left-6 px-2 bg-[#050505] text-[10px] font-mono uppercase tracking-widest text-cyan-400/80">
        {p.year} · {p.status}
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-2 relative overflow-hidden border border-white/5 aspect-[4/3]">
          <img
            src={p.image}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-[1.03] transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            {p.tags.slice(0, 2).map((t) => (
              <span key={t} className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-white/8 border border-white/10 text-white/80">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="md:col-span-3 flex flex-col">
          <h3 className="font-cabinet text-2xl md:text-3xl text-white leading-tight">{p.title}</h3>
          <p className="mt-3 text-sm text-white/60 leading-relaxed">{p.summary}</p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {p.tech.slice(0, 6).map((t) => (
              <span key={t} className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest border border-white/8 text-white/60">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/5">
            <Link
              to={`/projects/${p.slug}`}
              data-testid={IDS.projectViewDetails(p.slug)}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white hover:text-cyan-400 transition-colors duration-200"
            >
              View case study <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            {p.github_url && (
              <a
                href={p.github_url}
                target="_blank"
                rel="noreferrer"
                data-testid={IDS.projectGithub(p.slug)}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/50 hover:text-white transition-colors duration-200"
              >
                <Github className="h-3.5 w-3.5" /> Repository
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter((p) => p.tags?.includes(filter));
  }, [projects, filter]);

  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader />
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              data-testid={IDS.projectsFilter(f.toLowerCase())}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest border transition-colors duration-200 ${
                filter === f
                  ? "border-cyan-400 text-cyan-400 bg-cyan-400/5"
                  : "border-white/10 text-white/50 hover:text-white hover:border-white/25"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="surface-glass p-6 h-52 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6">
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} p={p} index={i} />
            ))}
            {filtered.length === 0 && (
              <p className="text-white/40 font-mono text-sm">No projects for this filter.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
