import { useEffect, useState, lazy, Suspense } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactLenis from "lenis/react";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import ScrollProgress from "@/components/effects/ScrollProgress";
import BackToTop from "@/components/effects/BackToTop";
import MouseSpotlight from "@/components/effects/MouseSpotlight";
import CommandPalette from "@/components/effects/CommandPalette";

const AIAgent = lazy(() => import("@/components/effects/AIAgent"));

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        smoothWheel: true,
        syncTouch: true,
        wheelMultiplier: 1.05,
      }}
    >
      <div className="App relative">
        <MouseSpotlight />
        <ScrollProgress />
        <BackToTop />
        <Suspense fallback={null}>
          <AIAgent />
        </Suspense>
        <Toaster theme="dark" position="bottom-right" richColors />
        <BrowserRouter>
          <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ReactLenis>
  );
}

export default App;
