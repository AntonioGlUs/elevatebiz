"use client";

import { useEffect, useRef, useState } from "react";
import { STATS, Lang } from "@/lib/content";

export default function StatsBand({ lang }: { lang: Lang }) {
  const [statValues, setStatValues] = useState([0, 0, 0]);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsStarted = useRef(false);

  // Count-up, triggered once the band is visible
  useEffect(() => {
    if (!statsRef.current || typeof window === "undefined") return;
    const el = statsRef.current;
    function startCount() {
      const start = Date.now();
      const DURATION = 1400;
      const timer = setInterval(() => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / DURATION, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setStatValues(STATS.map((s) => Math.round(s.target * eased)));
        if (progress >= 1) clearInterval(timer);
      }, 40);
    }
    if (window.IntersectionObserver) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !statsStarted.current) {
            statsStarted.current = true;
            startCount();
            obs.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    } else {
      startCount();
    }
  }, []);

  const statsDisplay = STATS.map((s, i) => ({
    value: s.prefix + statValues[i] + s.suffix,
    label: s.label[lang],
  }));

  return (
    <div ref={statsRef} className="eb-stats" style={{ background: "#1e3a5f", padding: "64px 80px", boxSizing: "border-box", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 48 }}>
      {statsDisplay.map((stat, i) => (
        <div key={i} style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 52, color: "#01c3cc", marginBottom: 8 }}>{stat.value}</div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,.78)" }}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
