import Marquee from "react-fast-marquee";
import { TECH_TICKER } from "@/lib/data";
import { TECH_ICONS } from "@/lib/techIcons";
import { IDS } from "@/constants/testIds";

export default function TechTicker() {
  return (
    <div
      data-testid={IDS.techTicker}
      className="border-y border-white/5 bg-white/[0.01] py-4 marquee-mask"
      aria-label="Technologies I work with"
    >
      <Marquee gradient={false} speed={38} pauseOnHover>
        {TECH_TICKER.concat(TECH_TICKER).map((t, i) => {
          const Icon = TECH_ICONS[t];
          return (
            <span
              key={`${t}-${i}`}
              className="mx-6 inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.22em] text-white/40 hover:text-cyan-400 transition-colors duration-200"
            >
              {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden /> : null}
              {t}
              <span className="ml-6 text-white/15">/</span>
            </span>
          );
        })}
      </Marquee>
    </div>
  );
}
