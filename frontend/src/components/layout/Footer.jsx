import { PROFILE } from "@/lib/data";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">
            {"// signal"}
          </p>
          <p className="font-cabinet text-2xl text-white">Ship secure, ship fast.</p>
          <p className="mt-2 text-sm text-white/50 max-w-sm">
            Built with intention. Instrumented with obsession. Deployed with policy-as-code.
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">
            {"// find me"}
          </p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><a className="hover:text-cyan-400" href={PROFILE.links.github}>GitHub</a></li>
            <li><a className="hover:text-cyan-400" href={PROFILE.links.linkedin}>LinkedIn</a></li>
            <li><a className="hover:text-cyan-400" href={PROFILE.links.tryhackme}>TryHackMe</a></li>
            <li><a className="hover:text-cyan-400" href={`mailto:${PROFILE.links.email}`}>{PROFILE.links.email}</a></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">
            {"// colophon"}
          </p>
          <p className="text-sm text-white/50">
            React · FastAPI · Framer Motion · Three.js · Lenis.
            <br />No cookies. No trackers. Just craft.
          </p>
          <div className="flex gap-3 mt-4">
            <a href={PROFILE.links.github} aria-label="github" className="p-2 border border-white/10 hover:border-cyan-400/50"><Github className="h-4 w-4 text-white/70" /></a>
            <a href={PROFILE.links.linkedin} aria-label="linkedin" className="p-2 border border-white/10 hover:border-cyan-400/50"><Linkedin className="h-4 w-4 text-white/70" /></a>
            <a href={`mailto:${PROFILE.links.email}`} aria-label="email" className="p-2 border border-white/10 hover:border-cyan-400/50"><Mail className="h-4 w-4 text-white/70" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-4 flex items-center justify-between text-xs font-mono text-white/40">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <span>v1.0.0 · main</span>
        </div>
      </div>
    </footer>
  );
}
