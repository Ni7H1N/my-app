import Marquee from "react-fast-marquee";
import { TECH_TICKER } from "@/lib/data";
import { IDS } from "@/constants/testIds";

export default function TechTicker() {
  return (
    <div
      data-testid={IDS.techTicker}
      className="border-y border-white/5 bg-white/[0.01] py-4 marquee-mask"
      aria-label="Technologies I work with"
    >
      <Marquee gradient={false} speed={38} pauseOnHover>
        {TECH_TICKER.concat(TECH_TICKER).map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="mx-8 font-mono text-[13px] uppercase tracking-[0.22em] text-white/40 hover:text-cyan-400 transition-colors duration-200"
          >
            {t}
            <span className="mx-8 text-white/15">/</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
