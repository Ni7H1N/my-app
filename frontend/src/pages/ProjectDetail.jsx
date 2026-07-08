import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { fetchProject } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function Block({ title, children, index }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.05 }}
      className="surface-glass p-6 md:p-8"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-400/80">
        {String(index + 1).padStart(2, "0")} · {title}
      </p>
      <div className="mt-3 text-sm text-white/70 leading-relaxed space-y-2">{children}</div>
    </motion.section>
  );
}

function BulletList({ items }) {
  if (!items?.length) return null;
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="pl-4 relative">
          <span className="absolute left-0 top-2 h-1 w-1 bg-cyan-400 rounded-full" />
          {it}
        </li>
      ))}
    </ul>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    fetchProject(slug).then(setP).catch(() => setErr(true));
  }, [slug]);

  if (err) {
    return (
      <div className="relative min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-40 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-400/70">404</p>
          <h1 className="mt-4 font-cabinet text-4xl text-white">Case study not found.</h1>
          <Link to="/" className="mt-6 inline-block font-mono text-sm text-cyan-400 hover:text-white">← back home</Link>
        </div>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="relative min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-40">
          <div className="h-40 surface-glass animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <Link
            to="/#work"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-white/50 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to work
          </Link>

          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-400/80">
              case study · {p.year} · {p.status}
            </p>
            <h1 className="mt-3 font-cabinet text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
              <span className="text-metallic">{p.title}</span>
            </h1>
            <p className="mt-5 text-white/60 text-base max-w-3xl leading-relaxed">{p.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <span key={t} className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest border border-white/10 text-white/60">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {p.github_url && (
                <a href={p.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 border border-white/15 hover:border-cyan-400/60 font-mono text-[11px] uppercase tracking-widest text-white transition-colors">
                  <Github className="h-3.5 w-3.5" /> Repository
                </a>
              )}
              {p.demo_url && (
                <a href={p.demo_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black hover:bg-cyan-400 font-mono text-[11px] uppercase tracking-widest transition-colors">
                  Live demo <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </motion.header>

          <div className="mt-10 aspect-[16/8] w-full overflow-hidden border border-white/8">
            <img src={p.image} alt={p.title} className="h-full w-full object-cover opacity-80" />
          </div>

          <div className="mt-12 grid gap-6">
            {p.problem && (
              <Block title="Problem" index={0}>
                <p>{p.problem}</p>
              </Block>
            )}
            {p.objectives?.length ? (
              <Block title="Objectives" index={1}>
                <BulletList items={p.objectives} />
              </Block>
            ) : null}
            {p.architecture && (
              <Block title="Architecture" index={2}>
                <p>{p.architecture}</p>
              </Block>
            )}
            {p.implementation?.length ? (
              <Block title="Implementation" index={3}>
                <BulletList items={p.implementation} />
              </Block>
            ) : null}
            {p.security_measures?.length ? (
              <Block title="Security measures" index={4}>
                <BulletList items={p.security_measures} />
              </Block>
            ) : null}
            {p.devsecops_pipeline?.length ? (
              <Block title="DevSecOps pipeline" index={5}>
                <BulletList items={p.devsecops_pipeline} />
              </Block>
            ) : null}
            {p.cloud_architecture?.length ? (
              <Block title="Cloud architecture" index={6}>
                <BulletList items={p.cloud_architecture} />
              </Block>
            ) : null}
            {p.challenges?.length ? (
              <Block title="Challenges" index={7}>
                <BulletList items={p.challenges} />
              </Block>
            ) : null}
            {p.lessons_learned?.length ? (
              <Block title="Lessons learned" index={8}>
                <BulletList items={p.lessons_learned} />
              </Block>
            ) : null}
            {p.future_improvements?.length ? (
              <Block title="Future improvements" index={9}>
                <BulletList items={p.future_improvements} />
              </Block>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
