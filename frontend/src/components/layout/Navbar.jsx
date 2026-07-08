import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { IDS } from "@/constants/testIds";

const LINKS = [
  { key: "work", label: "Work", href: "#work" },
  { key: "stack", label: "Stack", href: "#stack" },
  { key: "network", label: "Network", href: "#network" },
  { key: "terminal", label: "Terminal", href: "#terminal" },
  { key: "experience", label: "Experience", href: "#experience" },
  { key: "contact", label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 ${scrolled ? "surface-glass-strong" : "bg-transparent"} transition-colors duration-300`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 h-16 flex items-center justify-between">
        <Link
          to="/"
          data-testid={IDS.navBrand}
          className="flex items-center gap-2 group"
          aria-label="Home"
        >
          <div className="h-8 w-8 rounded-md border border-white/10 grid place-items-center bg-white/[0.03] group-hover:border-cyan-400/40 transition-colors duration-200">
            <Terminal className="h-4 w-4 text-cyan-400" />
          </div>
          <span className="font-mono text-sm text-white/80 tracking-tight">
            ni7h1n<span className="text-cyan-400">/</span>sec
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.key}
              href={l.href}
              data-testid={IDS.navLink(l.key)}
              className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-mono uppercase tracking-widest"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            data-testid="nav-resume-download"
            className="px-4 py-2 border border-white/15 hover:border-cyan-400/60 hover:bg-white/[0.04] text-sm text-white font-mono uppercase tracking-wider transition-colors duration-200"
          >
            Resume
          </a>
          <a
            href="#contact"
            data-testid={IDS.navResumeBtn}
            className="px-4 py-2 bg-white text-black hover:bg-cyan-400 text-sm font-mono uppercase tracking-wider transition-colors duration-200"
          >
            Get in touch
          </a>
        </div>

        <button
          className="md:hidden text-white"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 surface-glass-strong"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {LINKS.map((l) => (
                <a
                  key={l.key}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-mono text-sm text-white/70 hover:text-white uppercase tracking-widest"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="font-mono text-sm text-cyan-400 hover:text-white uppercase tracking-widest"
              >
                Resume ↓
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
