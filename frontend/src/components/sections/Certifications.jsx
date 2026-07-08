import { motion } from "framer-motion";
import { CERTIFICATIONS } from "@/lib/data";
import { Award } from "lucide-react";

export default function Certifications() {
  return (
    <section id="certifications" className="relative py-24 sm:py-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-400/80">
              {"// 08 · credentials"}
            </p>
            <h2 className="mt-4 font-cabinet text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
              <span className="text-metallic">Certifications</span>{" "}
              <span className="text-white/60">that mattered.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/50">
            Signals of preparation, not proof of skill. The proof is in the projects.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {CERTIFICATIONS.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
              data-testid={`cert-card-${c.id}`}
              className="surface-glass p-5 hover:border-cyan-400/25 transition-colors duration-300"
            >
              <div className="flex items-start justify-between gap-3">
                <Award className="h-4 w-4 text-cyan-400 shrink-0 mt-1" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">{c.year}</span>
              </div>
              <p className="mt-3 font-cabinet text-base text-white leading-snug">{c.name}</p>
              <p className="mt-1 text-xs text-white/45">{c.issuer}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-white/30">id · {c.id}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
