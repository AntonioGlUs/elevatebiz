"use client";

import { useEffect, useRef, useState } from "react";
import { STATS, Lang } from "@/lib/content";
import styles from "./StatsBand.module.css";

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
    <div ref={statsRef} className={`eb-stats ${styles.band}`}>
      {statsDisplay.map((stat, i) => (
        <div key={i} className={styles.stat}>
          <div className={styles.value}>{stat.value}</div>
          <div className={styles.label}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
