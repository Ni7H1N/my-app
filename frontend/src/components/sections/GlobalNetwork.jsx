import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GLOBE_ARCS, GLOBE_POINTS } from "@/lib/data";
import { IDS } from "@/constants/testIds";

const Globe = lazy(() => import("react-globe.gl"));

export default function GlobalNetwork() {
  const containerRef = useRef(null);
  const globeRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 520 });
  const [inView, setInView] = useState(false);

  // Observe intersection so we only pay the WebGL cost when the user reaches it
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Size observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // Enable slow auto-rotate once the globe mounts
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      if (!globeRef.current) return;
      const controls = globeRef.current.controls?.();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.42;
        controls.enableZoom = false;
      }
      // Clamp devicePixelRatio to save GPU on retina
      try {
        const renderer = globeRef.current.renderer?.();
        if (renderer && renderer.setPixelRatio) {
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        }
      } catch (_) {
        /* renderer not exposed */
      }
    }, 300);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <section id="network" className="relative py-24 sm:py-32 border-t border-white/5 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-400/80">
              {"// 01 · edge network"}
            </p>
            <h2 className="mt-4 font-cabinet text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
              <span className="text-metallic">Global</span>{" "}
              <span className="text-white/60">by design.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/50">
            Systems I&apos;ve shipped run across three clouds and eleven regions. Latency to any user &lt; 60 ms.
          </p>
        </div>

        <div
          ref={containerRef}
          data-testid={IDS.globeCanvas}
          className="relative h-[440px] md:h-[560px] surface-glass overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none z-10 grain" />
          <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest text-white/40 z-10">
            NET.STATUS <span className="text-emerald-400">OK</span>
          </div>
          <div className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-widest text-white/40 z-10">
            REGIONS: {GLOBE_POINTS.length} · ARCS: {GLOBE_ARCS.length}
          </div>
          <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-widest text-white/40 z-10">
            drag to rotate · auto-orbit engaged
          </div>

          {inView ? (
            <Suspense fallback={<div className="h-full w-full grid place-items-center text-white/40 font-mono text-xs">rendering globe…</div>}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0 }}
                className="absolute inset-0 grid place-items-center"
              >
                <Globe
                  ref={globeRef}
                  width={size.w}
                  height={size.h}
                  backgroundColor="rgba(0,0,0,0)"
                  atmosphereColor="#00E5FF"
                  atmosphereAltitude={0.22}
                  showGlobe
                  showAtmosphere
                  animateIn={false}
                  rendererConfig={{ antialias: false, powerPreference: "low-power" }}
                  globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
                  bumpImageUrl={null}
                  arcsData={GLOBE_ARCS}
                  arcColor={() => ["rgba(0, 229, 255, 0.6)", "rgba(204, 255, 0, 0.6)"]}
                  arcAltitude={() => 0.24}
                  arcStroke={0.4}
                  arcDashLength={0.5}
                  arcDashGap={1.5}
                  arcDashInitialGap={() => Math.random() * 3}
                  arcDashAnimateTime={2600}
                  pointsData={GLOBE_POINTS}
                  pointColor={() => "#00E5FF"}
                  pointAltitude={0.02}
                  pointRadius={(d) => 0.4 + d.size * 0.6}
                  pointLabel={(d) => `<div style='font-family:JetBrains Mono;font-size:11px;color:#00E5FF;background:#0a0a0c;border:1px solid #333;padding:4px 8px;text-transform:uppercase;letter-spacing:.14em'>${d.label}</div>`}
                />
              </motion.div>
            </Suspense>
          ) : (
            <div className="h-full w-full grid place-items-center">
              <div className="text-center">
                <div className="relative h-24 w-24 mx-auto">
                  <div className="absolute inset-0 rounded-full border border-cyan-400/30" />
                  <div className="absolute inset-2 rounded-full border border-cyan-400/20" />
                  <div className="absolute inset-4 rounded-full border border-cyan-400/10" />
                </div>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-white/30">
                  scroll to load globe
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
