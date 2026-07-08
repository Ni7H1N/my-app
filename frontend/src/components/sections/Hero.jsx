import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Shield } from "lucide-react";
import { IDS } from "@/constants/testIds";
import { PROFILE } from "@/lib/data";
import TechTicker from "./TechTicker";

const ROLES = PROFILE.roles;

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="top" className="relative min-h-[100svh] pt-28 pb-16 overflow-hidden">
      <div className="aurora" aria-hidden="true" />
      <div className="absolute inset-0 cyber-grid opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-white/[0.03] rounded-full"
            data-testid={IDS.heroAvailabilityBadge}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 pulse-dot" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-white/70">
              {PROFILE.status}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-cabinet text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mt-8 leading-[0.95] tracking-tight"
          >
            <span className="block text-metallic">{PROFILE.name}</span>
            <span className="block mt-2 text-white/70">
              engineers{" "}
              <span className="relative inline-block align-baseline">
                <motion.span
                  key={ROLES[roleIndex]}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5 }}
                  data-testid={IDS.heroRoleRotator}
                  className="text-white font-cabinet text-glow"
                >
                  {ROLES[roleIndex]}.
                </motion.span>
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 max-w-2xl text-base sm:text-lg text-white/60 leading-relaxed"
          >
            {PROFILE.summary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#work"
              data-testid={IDS.heroPrimaryCta}
              className="group inline-flex items-center gap-2 px-5 py-3 bg-white text-black font-mono text-xs uppercase tracking-widest hover:bg-cyan-400 transition-colors duration-200"
            >
              View case studies
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href={PROFILE.links.resume}
              target="_blank"
              rel="noreferrer"
              data-testid="hero-resume-download"
              className="group inline-flex items-center gap-2 px-5 py-3 border border-white/15 hover:border-cyan-400/60 hover:bg-white/[0.04] font-mono text-xs uppercase tracking-widest text-white transition-colors duration-200"
            >
              Download resume
              <span className="text-cyan-400">↓</span>
            </a>
            <a
              href="#terminal"
              data-testid={IDS.heroSecondaryCta}
              className="group inline-flex items-center gap-2 px-5 py-3 border border-white/15 hover:border-cyan-400/60 hover:bg-white/[0.04] font-mono text-xs uppercase tracking-widest text-white transition-colors duration-200"
            >
              Open terminal
              <span className="text-cyan-400">▸</span>
            </a>
            <div className="flex items-center gap-2 ml-1">
              <a data-testid={IDS.heroGithub} href={PROFILE.links.github} aria-label="GitHub" className="p-2.5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/[0.04] transition-colors duration-200"><Github className="h-4 w-4 text-white/80" /></a>
              <a data-testid={IDS.heroLinkedin} href={PROFILE.links.linkedin} aria-label="LinkedIn" className="p-2.5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/[0.04] transition-colors duration-200"><Linkedin className="h-4 w-4 text-white/80" /></a>
              <a data-testid={IDS.heroTryhackme} href={PROFILE.links.tryhackme} aria-label="TryHackMe" className="p-2.5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/[0.04] transition-colors duration-200"><Shield className="h-4 w-4 text-white/80" /></a>
            </div>
          </motion.div>
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="md:col-span-4 relative"
        >
          <div className="surface-glass rounded-none p-6 relative">
            <div className="absolute -top-3 left-6 px-2 bg-[#050505] text-[10px] font-mono uppercase tracking-widest text-cyan-400/80">
              /var/log/current
            </div>
            <div className="font-mono text-[13px] leading-relaxed space-y-2 text-white/70">
              <p><span className="text-white/40">$</span> whoami</p>
              <p className="text-white">{PROFILE.handle}</p>
              <p><span className="text-white/40">$</span> loc</p>
              <p className="text-white">{PROFILE.location}</p>
              <p><span className="text-white/40">$</span> now</p>
              <p className="text-white">
                Shipping DevSecOps pipelines · running CTFs · Top 1% on TryHackMe.
              </p>
              <p className="text-emerald-400/90">$ ready<span className="cursor-blink">_</span></p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {["Top 1% THM", "263+ labs", "23 badges"].map((s) => (
              <div key={s} className="p-3 border border-white/8 text-center">
                <p className="text-white font-cabinet text-xl">{s.split(" ")[0]}</p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mt-1">{s.split(" ").slice(1).join(" ")}</p>
              </div>
            ))}
          </div>
        </motion.aside>
      </div>

      <div className="mt-16 relative z-[2]">
        <TechTicker />
      </div>
    </section>
  );
}
