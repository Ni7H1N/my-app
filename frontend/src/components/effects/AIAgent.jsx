import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2, Bot } from "lucide-react";
import { api } from "@/lib/api";

const STORAGE_KEY = "ni7h1n-agent-session";
const HISTORY_KEY = "ni7h1n-agent-history";

function generateSessionId() {
  return `sess_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function loadSession() {
  let sid = localStorage.getItem(STORAGE_KEY);
  if (!sid) {
    sid = generateSessionId();
    localStorage.setItem(STORAGE_KEY, sid);
  }
  return sid;
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-30)));
  } catch {
    /* quota - ignore */
  }
}

const DEFAULT_SUGGESTIONS = [
  "What projects use Kubernetes?",
  "Show me his DevSecOps stack",
  "Why should I hire Nithin?",
  "Which certs back the AI work?",
];

export default function AIAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => loadHistory());
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);
  const sessionIdRef = useRef(loadSession());
  const scrollRef = useRef(null);

  useEffect(() => {
    saveHistory(messages);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Prefetch dynamic suggestions once
    api.get("/ai/suggestions").then((r) => {
      if (r?.data?.suggestions?.length) setSuggestions(r.data.suggestions);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = async (raw) => {
    const text = (raw ?? input).trim();
    if (!text || pending) return;
    setInput("");
    setPending(true);
    const next = [...messages, { role: "user", content: text, ts: Date.now() }];
    setMessages(next);
    try {
      const r = await api.post("/ai/chat", {
        session_id: sessionIdRef.current,
        message: text,
      });
      setMessages([...next, { role: "assistant", content: r.data.reply, ts: Date.now() }]);
    } catch (err) {
      const detail = err?.response?.data?.detail || err?.message || "Something went wrong.";
      setMessages([
        ...next,
        { role: "assistant", content: `⚠️ Agent unavailable: ${detail}`, ts: Date.now(), error: true },
      ]);
    } finally {
      setPending(false);
    }
  };

  const reset = () => {
    setMessages([]);
    localStorage.removeItem(HISTORY_KEY);
    sessionIdRef.current = generateSessionId();
    localStorage.setItem(STORAGE_KEY, sessionIdRef.current);
  };

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -2 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open portfolio AI agent"
        data-testid="ai-agent-toggle"
        className="fixed bottom-6 left-6 z-40 group"
      >
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/25 blur-xl group-hover:bg-cyan-400/40 transition-all duration-300" aria-hidden />
          <div className="relative flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0c] border border-cyan-400/40 hover:border-cyan-400 shadow-[0_10px_40px_-10px_rgba(0,229,255,0.5)] transition-colors duration-200">
            <div className="relative">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
            </div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-white">
              Ask the agent
            </span>
          </div>
        </div>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.aside
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-3 bottom-3 md:inset-auto md:left-6 md:bottom-6 md:w-[420px] md:h-[600px] max-h-[85svh] z-50 flex flex-col surface-glass-strong shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
              data-testid="ai-agent-panel"
              role="dialog"
              aria-label="Portfolio AI agent"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/8">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-cyan-400/40 bg-cyan-400/5">
                    <Bot className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-cabinet text-sm text-white leading-tight">Portfolio Agent</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                      portfolio · connects the dots
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={reset}
                    aria-label="Reset conversation"
                    data-testid="ai-agent-reset"
                    className="font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-white px-2 py-1"
                  >
                    reset
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close agent"
                    className="p-1.5 hover:bg-white/[0.06]"
                  >
                    <X className="h-4 w-4 text-white/60" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
                data-testid="ai-agent-messages"
              >
                {messages.length === 0 && (
                  <div>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Hi! I&apos;m Nithin&apos;s portfolio agent. I can connect the dots between his projects,
                      cybersecurity practice, DevSecOps stack, certifications and CTF wins.
                    </p>
                    <p className="mt-3 text-[11px] text-white/40 font-mono uppercase tracking-widest">
                      Try one of these
                    </p>
                    <div className="mt-2 grid gap-1.5">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          data-testid="ai-agent-suggestion"
                          className="text-left px-3 py-2 text-[13px] text-white/80 border border-white/8 hover:border-cyan-400/40 hover:bg-white/[0.03] transition-colors duration-200"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    <div
                      className={
                        m.role === "user"
                          ? "max-w-[85%] px-3 py-2 bg-cyan-400/10 border border-cyan-400/25 text-white text-[13px] leading-relaxed font-satoshi"
                          : m.error
                          ? "max-w-[90%] px-3 py-2 border border-red-500/30 text-red-200 text-[13px] leading-relaxed font-satoshi"
                          : "max-w-[90%] px-3 py-2 border border-white/8 bg-white/[0.02] text-white/85 text-[13px] leading-relaxed font-satoshi whitespace-pre-wrap"
                      }
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {pending && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] px-3 py-2 border border-white/8 bg-white/[0.02] text-white/60 text-[13px] font-mono inline-flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                      thinking…
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="p-3 border-t border-white/8 flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about a project, skill or cert…"
                  disabled={pending}
                  data-testid="ai-agent-input"
                  className="flex-1 bg-transparent border border-white/10 focus:border-cyan-400/60 outline-none px-3 py-2 text-[13px] text-white placeholder:text-white/25 font-satoshi transition-colors duration-200"
                  aria-label="Message the portfolio agent"
                />
                <button
                  type="submit"
                  disabled={pending || !input.trim()}
                  data-testid="ai-agent-send"
                  aria-label="Send"
                  className="p-2.5 bg-white text-black hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
              <p className="px-3 pb-3 text-[10px] font-mono text-white/25 uppercase tracking-widest">
                answers may be paraphrased · esc to close
              </p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
