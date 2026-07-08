import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { IDS } from "@/constants/testIds";

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      data-testid={IDS.backToTop}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll back to top"
      className="fixed bottom-6 right-6 z-50 surface-glass-strong rounded-full p-3 hover:border-cyan-400/40 transition-colors duration-200"
    >
      <ArrowUp className="h-4 w-4 text-white" />
    </button>
  );
}
