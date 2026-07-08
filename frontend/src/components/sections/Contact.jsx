import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Github, Linkedin, Shield, Copy } from "lucide-react";
import { submitContact } from "@/lib/api";
import { PROFILE } from "@/lib/data";
import { IDS } from "@/constants/testIds";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please complete all fields before sending.");
      return;
    }
    try {
      setSending(true);
      await submitContact(form);
      toast.success("Message received. I'll reply within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error("Something broke on our side. Try again in a moment.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid md:grid-cols-5 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-400/80">
              {"// 09 · handshake"}
            </p>
            <h2 className="mt-4 font-cabinet text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
              <span className="text-metallic">Let&apos;s build</span>{" "}
              <span className="text-white/60">something secure.</span>
            </h2>
            <p className="mt-6 text-sm text-white/55 max-w-md">
              Working on a cloud migration, a compliance program, or a security automation
              problem? Send a note &mdash; I read every message.
            </p>

            <div className="mt-10 space-y-3 text-sm text-white/70">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-cyan-400" />
                <a href={`mailto:${PROFILE.links.email}`} className="hover:text-cyan-400">{PROFILE.links.email}</a>
                <button
                  data-testid="contact-copy-email"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(PROFILE.links.email);
                      toast.success("Email copied to clipboard");
                    } catch {
                      toast.error("Couldn't copy — select the email manually.");
                    }
                  }}
                  aria-label="Copy email"
                  className="ml-1 p-1.5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/[0.04] transition-colors duration-200"
                >
                  <Copy className="h-3 w-3 text-white/70" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-cyan-400" />
                {PROFILE.location}
              </div>
            </div>

            <div className="mt-8 flex gap-2">
              <a href={PROFILE.links.github} className="p-2.5 border border-white/10 hover:border-cyan-400/50" aria-label="github"><Github className="h-4 w-4 text-white/80" /></a>
              <a href={PROFILE.links.linkedin} className="p-2.5 border border-white/10 hover:border-cyan-400/50" aria-label="linkedin"><Linkedin className="h-4 w-4 text-white/80" /></a>
              <a href={PROFILE.links.tryhackme} className="p-2.5 border border-white/10 hover:border-cyan-400/50" aria-label="tryhackme"><Shield className="h-4 w-4 text-white/80" /></a>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={onSubmit}
            className="md:col-span-3 surface-glass p-6 md:p-10"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-white/40 block mb-2">Name</label>
                <input
                  data-testid={IDS.contactName}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Ada Lovelace"
                  className="w-full bg-transparent border border-white/10 focus:border-cyan-400/60 outline-none px-3 py-2.5 text-sm text-white placeholder:text-white/25 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-white/40 block mb-2">Email</label>
                <input
                  data-testid={IDS.contactEmail}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  type="email"
                  placeholder="ada@analytical.engine"
                  className="w-full bg-transparent border border-white/10 focus:border-cyan-400/60 outline-none px-3 py-2.5 text-sm text-white placeholder:text-white/25 transition-colors duration-200"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="font-mono text-[10px] uppercase tracking-widest text-white/40 block mb-2">Subject</label>
              <input
                data-testid={IDS.contactSubject}
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                placeholder="Zero-trust EKS review"
                className="w-full bg-transparent border border-white/10 focus:border-cyan-400/60 outline-none px-3 py-2.5 text-sm text-white placeholder:text-white/25 transition-colors duration-200"
              />
            </div>
            <div className="mt-4">
              <label className="font-mono text-[10px] uppercase tracking-widest text-white/40 block mb-2">Message</label>
              <textarea
                data-testid={IDS.contactMessage}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                rows={6}
                placeholder="Tell me about the system, the team, and the constraint you're up against..."
                className="w-full bg-transparent border border-white/10 focus:border-cyan-400/60 outline-none px-3 py-2.5 text-sm text-white placeholder:text-white/25 resize-none transition-colors duration-200"
              />
            </div>
            <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
              <p className="text-[11px] font-mono uppercase tracking-widest text-white/35">
                encrypted in transit · TLS 1.3
              </p>
              <button
                data-testid={IDS.contactSubmit}
                disabled={sending}
                className="group inline-flex items-center gap-2 px-5 py-3 bg-white text-black hover:bg-cyan-400 disabled:opacity-60 font-mono text-xs uppercase tracking-widest transition-colors duration-200"
              >
                {sending ? "Sending" : "Send message"}
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
