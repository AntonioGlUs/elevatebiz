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
    icon: s.icon,
    eyebrow: s.eyebrow[lang],
    value: s.prefix + statValues[i] + s.suffix,
    label: s.label[lang],
  }));

  // Parallax: the background image drifts sideways as the page scrolls
  const shapesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    function update() {
      frame = 0;
      const band = statsRef.current;
      if (!band || !shapesRef.current) return;
      const rect = band.getBoundingClientRect();
      // 0 when the band is centered on the screen, negative above, positive below
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      shapesRef.current.style.transform = `translate3d(${(offset * -0.18).toFixed(1)}px, 0, 0)`;
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={statsRef} className={`eb-stats ${styles.band}`}>
      <div ref={shapesRef} className={styles.shapes} aria-hidden="true" />
      <div className={styles.cards}>
        {statsDisplay.map((stat, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.icon}>
              <StatIcon kind={stat.icon} />
            </div>
            <div className={styles.text}>
              <div className={styles.eyebrow}>{stat.eyebrow}</div>
              <div className={styles.value}>{stat.value}</div>
              <span className={styles.rule} />
              <div className={styles.label}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatIcon({ kind }: { kind: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === "clock" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      )}
      {kind === "moon" && <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />}
      {kind === "bolt" && <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" />}
    </svg>
  );
}
