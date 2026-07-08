import { motion, useScroll, useSpring } from "framer-motion";
import { IDS } from "@/constants/testIds";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      data-testid={IDS.scrollProgress}
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60]"
      style={{ scaleX: width, background: "linear-gradient(90deg, #00E5FF, #CCFF00)" }}
      aria-hidden="true"
    />
  );
}
