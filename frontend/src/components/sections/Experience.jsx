import { motion } from "framer-motion";
import { EXPERIENCE, EDUCATION } from "@/lib/data";
import { GraduationCap } from "lucide-react";

export default function Experience() {
  return (
    <section id="experience" className="relative py-24 sm:py-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-400/80">
              {"// 07 · trajectory"}
            </p>
            <h2 className="mt-4 font-cabinet text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
              <span className="text-metallic">Experience</span>{" "}
              <span className="text-white/60">& education.</span>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {EXPERIENCE.map((e, i) => (
              <motion.div
                key={e.company + e.period}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
                className="surface-glass p-6 md:p-8 hover:border-cyan-400/25 transition-colors duration-300"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="font-cabinet text-2xl text-white">{e.role}</p>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">{e.period}</span>
                </div>
                <p className="mt-1 text-sm text-cyan-400">{e.company} <span className="text-white/40">· {e.location}</span></p>
                <ul className="mt-4 space-y-2">
                  {e.bullets.map((b) => (
                    <li key={b} className="text-sm text-white/60 leading-relaxed pl-4 relative">
                      <span className="absolute left-0 top-2 h-1 w-1 bg-cyan-400 rounded-full" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-white/40">education</p>
            {EDUCATION.map((ed) => (
              <div key={ed.school} className="surface-glass p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 border border-white/10 bg-white/[0.03]">
                    <GraduationCap className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-cabinet text-lg text-white">{ed.school}</p>
                    <p className="text-xs text-white/50 mt-1">{ed.degree}</p>
                    <p className="text-[11px] font-mono text-white/35 mt-2 uppercase tracking-widest">{ed.period}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
