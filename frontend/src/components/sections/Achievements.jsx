import { motion } from "framer-motion";
import { Trophy, Flag, Shield, Target } from "lucide-react";

const ITEMS = [
  {
    icon: Shield,
    metric: "Top 1%",
    label: "TryHackMe global rank",
    detail: "263+ hands-on cybersecurity labs completed with 23+ badges across web, network, forensics, reverse engineering and cryptography.",
    accent: "text-cyan-400",
  },
  {
    icon: Trophy,
    metric: "Top 100",
    label: "Great AppSec Hackathon CTF",
    detail: "Recognized as a Top 100 performer among global participants in the Great AppSec Hackathon Capture-the-Flag event.",
    accent: "text-amber-300",
  },
  {
    icon: Flag,
    metric: "3rd Place",
    label: "Overnight CTF · Nagpur",
    detail: "Podium finish at the Overnight Capture The Flag competition organized by The Hackers Meetup, Nagpur Chapter.",
    accent: "text-emerald-400",
  },
  {
    icon: Target,
    metric: "263",
    label: "Labs completed",
    detail: "Practical exposure across web exploitation, privilege escalation, forensics, cryptography, active directory and cloud CTFs.",
    accent: "text-cyan-400",
  },
];

export default function Achievements() {
  return (
    <section id="achievements" className="relative py-24 sm:py-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-400/80">
              {"// signals"}
            </p>
            <h2 className="mt-4 font-cabinet text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
              <span className="text-metallic">Proof</span>{" "}
              <span className="text-white/60">of practice.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/50">
            Certifications signal preparation. These are results — competitive, timed, adversarial environments where the code has to work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ITEMS.map((it, i) => {
            const Icon = it.icon;
            return (
              <motion.div
                key={it.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: (i % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                data-testid={`achievement-${i}`}
                className="surface-glass p-6 hover:border-cyan-400/25 transition-colors duration-300 relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 opacity-[0.06]">
                  <Icon className="h-24 w-24" />
                </div>
                <div className="relative">
                  <div className="p-2 border border-white/10 bg-white/[0.03] w-fit">
                    <Icon className={`h-4 w-4 ${it.accent}`} />
                  </div>
                  <p className="mt-5 font-cabinet text-3xl md:text-4xl leading-none text-white">
                    {it.metric}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-white/50">
                    {it.label}
                  </p>
                  <p className="mt-4 text-[13px] text-white/55 leading-relaxed">{it.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
