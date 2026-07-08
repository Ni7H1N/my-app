import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IDS } from "@/constants/testIds";
import { PROFILE, SKILL_DOMAINS, CERTIFICATIONS, EXPERIENCE, EDUCATION } from "@/lib/data";

const COMMANDS = ["help", "about", "skills", "projects", "github", "resume", "contact", "experience", "education", "certifications", "whoami", "clear", "history", "pwd", "ls", "cat"];

const now = () => new Date().toLocaleTimeString("en-US", { hour12: false });

function renderOutput(cmd, arg) {
  switch (cmd) {
    case "help":
      return [
        "available commands:",
        ...COMMANDS.map((c) => `  ${c.padEnd(16)} — ${describe(c)}`),
        "tip: use ↑/↓ for history, Tab for autocomplete.",
      ];
    case "about":
      return [
        `${PROFILE.name} · ${PROFILE.role}`,
        PROFILE.summary,
      ];
    case "whoami":
      return [`${PROFILE.handle} (uid=1000) groups=devsecops,cloud,secops`];
    case "pwd":
      return ["/home/aarav/portfolio"];
    case "ls":
      return ["about.md  projects/  github/  skills/  certifications/  contact/  resume.pdf"];
    case "cat":
      if (!arg) return ["usage: cat <file>"];
      if (arg.includes("resume")) return [`opening ${arg} ...`, "→ see /resume link in navbar"];
      if (arg.includes("about")) return renderOutput("about");
      return [`cat: ${arg}: file not found`];
    case "skills":
      return SKILL_DOMAINS.map((d) => `${d.title.padEnd(24)} → ${d.items.join(", ")}`);
    case "projects":
      return [
        "featured case studies:",
        "  01  netflix-devsecops-pipeline",
        "  02  gps-intelligence-dashboard",
        "  03  security-utilities-suite",
        "  04  ai-fish-catch-prediction",
        "  05  medbot-ai-healthcare",
        "use view: click a project card above.",
      ];
    case "github":
      return [`redirect → ${PROFILE.links.github}`, "opening in a new tab..."];
    case "resume":
      return [`resume → ${PROFILE.links.resume}`];
    case "contact":
      return [`email  → ${PROFILE.links.email}`, `linkedin → ${PROFILE.links.linkedin}`];
    case "experience":
      return EXPERIENCE.map((e) => `${e.period.padEnd(16)} ${e.role} @ ${e.company}`);
    case "education":
      return EDUCATION.map((e) => `${e.period.padEnd(16)} ${e.degree} — ${e.school}`);
    case "certifications":
      return CERTIFICATIONS.map((c) => `${c.year}  ${c.name}  (${c.id})`);
    default:
      return [`command not found: ${cmd}. type 'help'.`];
  }
}

function describe(c) {
  const map = {
    help: "list available commands",
    about: "short bio",
    skills: "technical domains and tooling",
    projects: "case study list",
    github: "open github profile",
    resume: "download resume",
    contact: "how to reach me",
    experience: "work history",
    education: "academic background",
    certifications: "professional certifications",
    whoami: "current user identity",
    clear: "clear the screen",
    history: "recent commands",
    pwd: "print working directory",
    ls: "list directory contents",
    cat: "concatenate file contents",
  };
  return map[c] || "";
}

const BOOT = [
  { type: "sys", text: `booting aarav/sec :: build ${now()} :: kernel 6.6.2` },
  { type: "sys", text: "loaded modules: cloud, devsecops, offsec, ai." },
  { type: "sys", text: "type 'help' to explore." },
];

export default function TerminalSection() {
  const [history, setHistory] = useState(BOOT);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [hIndex, setHIndex] = useState(-1);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const focus = () => inputRef.current && inputRef.current.focus();

  const execute = useCallback((raw) => {
    const line = raw.trim();
    if (!line) return;
    const [cmd, ...rest] = line.split(/\s+/);
    const arg = rest.join(" ");
    setCmdHistory((h) => [...h, line]);
    setHIndex(-1);

    if (cmd === "clear") {
      setHistory([]);
      return;
    }
    if (cmd === "history") {
      setHistory((h) => [
        ...h,
        { type: "input", text: line },
        ...cmdHistory.map((c, i) => ({ type: "out", text: `${String(i + 1).padStart(3, " ")}  ${c}` })),
      ]);
      return;
    }
    const output = renderOutput(cmd, arg);
    setHistory((h) => [
      ...h,
      { type: "input", text: line },
      ...output.map((line) => ({ type: "out", text: line })),
    ]);
  }, [cmdHistory]);

  const onKey = (e) => {
    if (e.key === "Enter") {
      execute(input);
      setInput("");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = COMMANDS.find((c) => c.startsWith(input));
      if (match) setInput(match);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!cmdHistory.length) return;
      const next = hIndex === -1 ? cmdHistory.length - 1 : Math.max(0, hIndex - 1);
      setHIndex(next);
      setInput(cmdHistory[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIndex === -1) return;
      const next = hIndex + 1;
      if (next >= cmdHistory.length) {
        setHIndex(-1);
        setInput("");
      } else {
        setHIndex(next);
        setInput(cmdHistory[next]);
      }
    }
  };

  const suggestion = useMemo(() => {
    if (!input) return "";
    const match = COMMANDS.find((c) => c.startsWith(input) && c !== input);
    return match ? match.slice(input.length) : "";
  }, [input]);

  return (
    <section id="terminal" className="relative py-24 sm:py-32 border-t border-white/5">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-400/80">
              {"// 05 · interactive"}
            </p>
            <h2 className="mt-4 font-cabinet text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
              <span className="text-metallic">A terminal</span>{" "}
              <span className="text-white/60">that answers.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/50">
            Type <span className="font-mono text-cyan-400">help</span> to explore. Autocomplete with <span className="font-mono text-cyan-400">Tab</span>, history with <span className="font-mono text-cyan-400">↑ ↓</span>.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-lg overflow-hidden border border-white/10 shadow-[0_20px_80px_-20px_rgba(0,229,255,0.25)]"
          onClick={focus}
        >
          <div className="h-10 bg-[#111114] border-b border-white/10 flex items-center px-4 gap-2">
            <span className="h-3 w-3 rounded-full bg-white/15" />
            <span className="h-3 w-3 rounded-full bg-white/15" />
            <span className="h-3 w-3 rounded-full bg-white/15" />
            <span className="ml-3 font-mono text-[11px] text-white/40 uppercase tracking-widest">
              nithin@portfolio: ~/terminal
            </span>
            <button
              data-testid={IDS.terminalClear}
              className="ml-auto font-mono text-[10px] text-white/40 hover:text-white uppercase tracking-widest"
              onClick={(e) => { e.stopPropagation(); setHistory([]); }}
            >
              clear
            </button>
          </div>
          <div
            ref={scrollRef}
            data-testid={IDS.terminalOutput}
            className="bg-[#0A0A0C] p-5 md:p-6 font-mono text-[13px] leading-relaxed text-white/70 h-[420px] overflow-auto"
            role="log"
            aria-live="polite"
          >
            {history.map((row, i) => (
              <div key={i} className={row.type === "sys" ? "text-white/40" : row.type === "input" ? "text-white" : "text-white/60"}>
                {row.type === "input" ? <><span className="text-cyan-400 mr-2">$</span>{row.text}</> : row.text}
              </div>
            ))}
            <div className="flex items-center">
              <span className="text-cyan-400 mr-2">$</span>
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  data-testid={IDS.terminalInput}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="terminal input"
                  className="w-full bg-transparent outline-none border-none text-white placeholder:text-white/25 font-mono text-[13px]"
                  placeholder="type a command..."
                />
                {suggestion && (
                  <span className="pointer-events-none absolute left-0 top-0 text-white/25">
                    <span className="invisible">{input}</span>
                    {suggestion}
                  </span>
                )}
              </div>
              <span className="cursor-blink text-cyan-400 ml-1">▍</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
