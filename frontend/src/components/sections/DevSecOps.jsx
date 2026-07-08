import { motion } from "framer-motion";
import { DEVSECOPS_PIPELINE, SKILL_DOMAINS } from "@/lib/data";
import {
  Cloud, Workflow, Shield, Boxes, Activity, Sparkles, Layers, Code, Lock, Bug, Radar, Cpu,
} from "lucide-react";

const ICONS = { cloud: Cloud, workflow: Workflow, shield: Shield, boxes: Boxes, activity: Activity, sparkles: Sparkles, layers: Layers, code: Code };

export default function DevSecOps() {
  return (
    <section id="stack" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-400/80">
              {"// 02 · pipeline as product"}
            </p>
            <h2 className="mt-4 font-cabinet text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
              <span className="text-metallic">DevSecOps</span>{" "}
              <span className="text-white/60">by default.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/50">
            Every commit walks the same path — from signed source to attested deployment. No exceptions, only pull requests.
          </p>
        </div>

        {/* Pipeline visualization */}
        <div className="surface-glass p-6 md:p-10 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3">
            {DEVSECOPS_PIPELINE.map((stage, i) => (
              <motion.div
                key={stage.key}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="relative group"
              >
                <div className="p-3 border border-white/8 hover:border-cyan-400/40 transition-colors duration-200 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.7)]" />
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="font-cabinet text-base text-white">{stage.label}</p>
                  <p className="mt-1.5 text-[11px] text-white/45 leading-snug">{stage.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skills bento */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4 auto-rows-[minmax(140px,auto)]">
          {SKILL_DOMAINS.map((s, i) => {
            const Icon = ICONS[s.icon] || Cpu;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: (i % 4) * 0.06 }}
                className={`${s.span} surface-glass p-5 md:p-6 hover:border-cyan-400/25 transition-colors duration-300 relative overflow-hidden`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 border border-white/10 bg-white/[0.03]">
                    <Icon className="h-4 w-4 text-cyan-400" />
                  </div>
                  <p className="font-cabinet text-lg text-white">{s.title}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {s.items.map((it) => (
                    <span key={it} className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest border border-white/8 text-white/60">
                      {it}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
