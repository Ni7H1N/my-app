import { useEffect } from "react";

export default function MouseSpotlight() {
  useEffect(() => {
    const handler = (e) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return <div className="spotlight" aria-hidden="true" />;
}
