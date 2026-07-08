import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, GitFork, ExternalLink } from "lucide-react";
import { fetchRepos } from "@/lib/api";
import { IDS } from "@/constants/testIds";

const LANG_COLORS = {
  HCL: "#5C4EE5",
  Python: "#3572A5",
  Go: "#00ADD8",
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  Shell: "#89E051",
  Rust: "#DEA584",
};

function LanguageDot({ language }) {
  return (
    <span
      className="inline-block h-2 w-2 rounded-full"
      style={{ background: LANG_COLORS[language] || "#7C7C7C" }}
      aria-hidden="true"
    />
  );
}

export default function GitHubSection() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepos()
      .then(setRepos)
      .catch(() => setRepos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="github" className="relative py-24 sm:py-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-400/80">
              {"// 06 · open source"}
            </p>
            <h2 className="mt-4 font-cabinet text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
              <span className="text-metallic">Pinned</span>{" "}
              <span className="text-white/60">repositories.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/50">
            A live feed of what I&apos;ve been building and breaking in public. Stars are optional; PRs are welcome.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="surface-glass p-6 h-40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {repos.map((r, i) => (
              <motion.a
                key={r.name}
                href={r.html_url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 4) * 0.05 }}
                data-testid={IDS.githubRepoCard(r.name)}
                className="surface-glass p-6 hover:border-cyan-400/25 transition-colors duration-300 group block"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-white/40 text-[11px] uppercase tracking-widest">public</p>
                    <p className="font-cabinet text-xl text-white mt-1 group-hover:text-cyan-400 transition-colors duration-200">
                      {r.name}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-white/80 transition-colors duration-200" />
                </div>
                <p className="mt-3 text-sm text-white/60 leading-relaxed line-clamp-2">{r.description}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {r.topics.slice(0, 5).map((t) => (
                    <span key={t} className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-cyan-400/5 border border-cyan-400/15 text-cyan-300/80">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[12px] font-mono text-white/50">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5"><LanguageDot language={r.language} />{r.language}</span>
                    <span className="inline-flex items-center gap-1"><Star className="h-3 w-3" />{r.stars}</span>
                    <span className="inline-flex items-center gap-1"><GitFork className="h-3 w-3" />{r.forks}</span>
                  </div>
                  <span>updated {r.updated_at}</span>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
