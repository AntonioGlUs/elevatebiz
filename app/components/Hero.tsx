"use client";

import { useEffect, useState } from "react";
import { BOOK_CALL_HREF } from "./constants";
import type { Texts } from "./types";
import styles from "./Hero.module.css";

type Props = {
  t: Texts;
  // Space left at the top for the announcement bar that floats over the hero
  heroOffset: number;
};

// The same storefront at two times of day. The visitor's local hour picks one;
// "?time=day" or "?time=night" in the URL forces it (handy to preview).
const PHOTOS = {
  day: {
    src: "/images/hero-store-day.webp",
    alt: "A boutique storefront in daylight with a neon sign that reads Open 24 hours and two friendly robots helping inside",
  },
  night: {
    src: "/images/hero-store.webp",
    alt: "A boutique storefront at dusk with a glowing neon sign that reads Open 24 hours and two friendly robots helping inside",
  },
};

type Period = keyof typeof PHOTOS;

function currentPeriod(): Period {
  const forced = new URLSearchParams(window.location.search).get("time");
  if (forced === "day" || forced === "night") return forced;
  const hour = new Date().getHours();
  return hour >= 7 && hour < 17 ? "day" : "night";
}

export default function Hero({ t, heroOffset }: Props) {
  const [heroLoaded, setHeroLoaded] = useState(false);
  // Unknown until the page is in the browser (the site is exported as static HTML)
  const [period, setPeriod] = useState<Period | null>(null);

  // Entrance animation (once, on mount)
  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 60);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setPeriod(currentPeriod());
  }, []);

  return (
    <div
      className={`eb-hero ${styles.hero} ${heroLoaded ? styles.loaded : ""}`}
      style={{ height: "max(660px, 100svh)", paddingTop: heroOffset }}
    >
      {/* Both photos are in the page; only the one for the visitor's hour fades in */}
      {(Object.keys(PHOTOS) as Period[]).map((key) => (
        <img
          key={key}
          src={PHOTOS[key].src}
          alt={PHOTOS[key].alt}
          aria-hidden={period !== key}
          width={1536}
          height={1024}
          fetchPriority="high"
          className={`${styles.bg} ${period === key ? styles.bgShown : ""}`}
        />
      ))}
      <div className={styles.overlay} />
      <div className={`eb-hero-card ${styles.card}`}>
        <h1 className={`eb-hero-title ${styles.title}`}>{t.heroTitle}</h1>
        <p className={styles.subtitle}>{t.heroSubtitle}</p>
        <div className={styles.actions}>
          <a href={BOOK_CALL_HREF} className={styles.primary}>
            {t.heroBtnPrimary}
          </a>
          <a href="#see-it-in-action" className={styles.secondary}>
            {t.heroBtnSecondary}
          </a>
        </div>
      </div>
    </div>
  );
}
