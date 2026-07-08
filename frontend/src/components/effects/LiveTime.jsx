import { useEffect, useState } from "react";

// Displays local time in the given IANA timezone in a compact monospace pill.
export default function LiveTime({ tz = "Asia/Kolkata", label = "HYD" }) {
  const [time, setTime] = useState(() => formatTime(tz));

  useEffect(() => {
    const tick = () => setTime(formatTime(tz));
    tick();
    // update every 15s so seconds don't flash on the nav
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [tz]);

  return (
    <span
      className="hidden lg:inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white/40"
      aria-label={`Current time in ${label}`}
      data-testid="live-time"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
      {label} {time}
    </span>
  );
}

function formatTime(tz) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: tz,
    }).format(new Date());
  } catch {
    return "--:--";
  }
}
