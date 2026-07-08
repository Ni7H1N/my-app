import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Github, Linkedin, Shield, Mail, FileDown, Terminal, Cloud, ShieldCheck, Boxes, Globe as GlobeIcon, MessageSquare, User, Copy, ArrowUpRight, Award, Sparkles,
} from "lucide-react";
import { PROFILE } from "@/lib/data";

const SECTIONS = [
  { id: "top", label: "Hero", icon: User, hint: "Home" },
  { id: "stack", label: "Stack & DevSecOps", icon: Boxes, hint: "Pipeline" },
  { id: "work", label: "Selected work", icon: Sparkles, hint: "Projects" },
  { id: "cybersec", label: "Cybersecurity", icon: ShieldCheck, hint: "Practice" },
  { id: "achievements", label: "Achievements", icon: Award, hint: "Signals" },
  { id: "terminal", label: "Interactive terminal", icon: Terminal, hint: "Type" },
  { id: "network", label: "Global network", icon: GlobeIcon, hint: "Globe" },
  { id: "github", label: "Open source", icon: Github, hint: "Repos" },
  { id: "experience", label: "Highlights & education", icon: Award, hint: "Timeline" },
  { id: "certifications", label: "Certifications", icon: Cloud, hint: "Credentials" },
  { id: "contact", label: "Contact", icon: MessageSquare, hint: "Handshake" },
];

const PROJECT_SLUGS = [
  { slug: "netflix-devsecops-pipeline", title: "Netflix DevSecOps Pipeline" },
  { slug: "gps-intelligence-dashboard", title: "GPS Intelligence Dashboard" },
  { slug: "security-utilities-suite", title: "Security Utilities Suite" },
  { slug: "ai-fish-catch-prediction", title: "AI Fish Catch Prediction" },
  { slug: "medbot-ai-healthcare", title: "MedBot AI Healthcare" },
];

export default function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const close = () => onOpenChange(false);
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ block: "start", behavior: "smooth" });
    close();
  };
  const goto = (path) => { navigate(path); close(); };
  const openLink = (href) => { window.open(href, "_blank", "noreferrer"); close(); };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.links.email);
      toast.success("Email copied to clipboard");
    } catch {
      toast.error("Couldn't copy — select and copy manually.");
    }
    close();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      data-testid="command-palette"
    >
      <div className="bg-[#0a0a0c] text-white border border-white/10">
        <Command
          className="bg-transparent [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-white/40 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3"
          loop
        >
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Type a command or search…"
            className="bg-transparent text-white placeholder:text-white/30 font-mono text-sm"
            data-testid="command-palette-input"
          />
          <CommandList className="max-h-[420px]">
            <CommandEmpty className="p-6 text-center text-white/40 font-mono text-xs">
              No results. Try &quot;projects&quot;, &quot;resume&quot; or &quot;github&quot;.
            </CommandEmpty>

            <CommandGroup heading="Navigate">
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <CommandItem
                    key={s.id}
                    value={`nav ${s.label} ${s.hint}`}
                    onSelect={() => scrollTo(s.id)}
                    className="aria-selected:bg-white/[0.06] text-white/85 font-mono text-[13px] gap-3 rounded-none"
                    data-testid={`palette-nav-${s.id}`}
                  >
                    <Icon className="h-4 w-4 text-cyan-400" />
                    {s.label}
                    <span className="ml-auto text-white/30 text-[10px] uppercase tracking-widest">{s.hint}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            <CommandSeparator className="bg-white/5" />

            <CommandGroup heading="Actions">
              <CommandItem
                value="action copy email address"
                onSelect={copyEmail}
                className="aria-selected:bg-white/[0.06] text-white/85 font-mono text-[13px] gap-3 rounded-none"
                data-testid="palette-copy-email"
              >
                <Copy className="h-4 w-4 text-cyan-400" />
                Copy email
                <CommandShortcut className="ml-auto text-white/30">{PROFILE.links.email}</CommandShortcut>
              </CommandItem>
              <CommandItem
                value="action download resume pdf"
                onSelect={() => openLink("/resume.pdf")}
                className="aria-selected:bg-white/[0.06] text-white/85 font-mono text-[13px] gap-3 rounded-none"
                data-testid="palette-resume"
              >
                <FileDown className="h-4 w-4 text-cyan-400" />
                Download resume
                <span className="ml-auto text-white/30 text-[10px]">PDF</span>
              </CommandItem>
              <CommandItem
                value="action send message"
                onSelect={() => scrollTo("contact")}
                className="aria-selected:bg-white/[0.06] text-white/85 font-mono text-[13px] gap-3 rounded-none"
              >
                <MessageSquare className="h-4 w-4 text-cyan-400" />
                Send a message
              </CommandItem>
            </CommandGroup>

            <CommandSeparator className="bg-white/5" />

            <CommandGroup heading="Projects">
              {PROJECT_SLUGS.map((p) => (
                <CommandItem
                  key={p.slug}
                  value={`project ${p.title}`}
                  onSelect={() => goto(`/projects/${p.slug}`)}
                  className="aria-selected:bg-white/[0.06] text-white/85 font-mono text-[13px] gap-3 rounded-none"
                  data-testid={`palette-project-${p.slug}`}
                >
                  <ArrowUpRight className="h-4 w-4 text-cyan-400" />
                  {p.title}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator className="bg-white/5" />

            <CommandGroup heading="Elsewhere">
              <CommandItem
                value="social github"
                onSelect={() => openLink(PROFILE.links.github)}
                className="aria-selected:bg-white/[0.06] text-white/85 font-mono text-[13px] gap-3 rounded-none"
              >
                <Github className="h-4 w-4 text-cyan-400" /> GitHub
              </CommandItem>
              <CommandItem
                value="social linkedin"
                onSelect={() => openLink(PROFILE.links.linkedin)}
                className="aria-selected:bg-white/[0.06] text-white/85 font-mono text-[13px] gap-3 rounded-none"
              >
                <Linkedin className="h-4 w-4 text-cyan-400" /> LinkedIn
              </CommandItem>
              <CommandItem
                value="social tryhackme"
                onSelect={() => openLink(PROFILE.links.tryhackme)}
                className="aria-selected:bg-white/[0.06] text-white/85 font-mono text-[13px] gap-3 rounded-none"
              >
                <Shield className="h-4 w-4 text-cyan-400" /> TryHackMe
              </CommandItem>
              <CommandItem
                value="social email"
                onSelect={() => openLink(`mailto:${PROFILE.links.email}`)}
                className="aria-selected:bg-white/[0.06] text-white/85 font-mono text-[13px] gap-3 rounded-none"
              >
                <Mail className="h-4 w-4 text-cyan-400" /> Email
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </CommandDialog>
  );
}
