import { motion } from "framer-motion";
import { ShieldCheck, Bug, Radar, Terminal, Network, Lock } from "lucide-react";

const DOMAINS = [
  { icon: ShieldCheck, title: "Application Security", desc: "OWASP Top 10, secure code review, threat modeling with STRIDE, and shift-left SAST/DAST.", chips: ["OWASP", "SAST", "DAST", "STRIDE"] },
  { icon: Bug, title: "Offensive Security", desc: "Web + network CTFs, red-team style recon, and exploit development in isolated labs.", chips: ["Burp Suite", "Nmap", "Metasploit", "Wireshark"] },
  { icon: Radar, title: "Threat Intelligence", desc: "ATT&CK mapping, TTP tracking, and IOC enrichment for faster SOC triage.", chips: ["MITRE ATT&CK", "IOC", "TTPs", "OSINT"] },
  { icon: Terminal, title: "Linux & Networking", desc: "Kernel-level tooling, eBPF observability, and deep packet inspection in production.", chips: ["Linux", "eBPF", "TCP/IP", "iptables"] },
  { icon: Network, title: "Cloud Security", desc: "Zero-trust identity, workload isolation, KMS envelope encryption, and continuous compliance.", chips: ["IAM", "KMS", "SCPs", "GuardDuty"] },
  { icon: Lock, title: "Security Automation", desc: "Policy-as-code with OPA/Kyverno, IR playbooks, and LLM-assisted analyst copilots.", chips: ["OPA", "Kyverno", "SOAR", "Rego"] },
];

export default function Cybersecurity() {
  return (
    <section id="cybersec" className="relative py-24 sm:py-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-400/80">
              {"// 04 · offense informs defense"}
            </p>
            <h2 className="mt-4 font-cabinet text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
              <span className="text-metallic">Cybersecurity</span>{" "}
              <span className="text-white/60">practice.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/50">
            Practical experience across the offensive and defensive spectrum — from CTFs to cloud posture management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOMAINS.map((d, i) => {
            const Icon = d.icon;
            return (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.06 }}
                className="surface-glass p-6 hover:border-cyan-400/25 transition-colors duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-white/10 bg-white/[0.03] group-hover:border-cyan-400/40 transition-colors duration-200">
                    <Icon className="h-4 w-4 text-cyan-400" />
                  </div>
                  <p className="font-cabinet text-xl text-white">{d.title}</p>
                </div>
                <p className="mt-4 text-sm text-white/55 leading-relaxed">{d.desc}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {d.chips.map((c) => (
                    <span key={c} className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest border border-white/8 text-white/55">
                      {c}
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
