import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactLenis from "lenis/react";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import ScrollProgress from "@/components/effects/ScrollProgress";
import BackToTop from "@/components/effects/BackToTop";
import MouseSpotlight from "@/components/effects/MouseSpotlight";

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <ReactLenis root options={{ duration: 1.1, smoothWheel: true, easing: (t) => 1 - Math.pow(1 - t, 3) }}>
      <div className="App relative">
        <MouseSpotlight />
        <ScrollProgress />
        <BackToTop />
        <Toaster theme="dark" position="bottom-right" richColors />
        <BrowserRouter>
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
