"use client";

import { useEffect, useState } from "react";
import { BOOK_CALL_HREF } from "./constants";
import type { Texts } from "./types";
import styles from "./Hero.module.css";

type Props = {
  t: Texts;
  // Extra height when the announcement bar is closed, so the card keeps its position under the fixed nav
  heroOffset: number;
};

export default function Hero({ t, heroOffset }: Props) {
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Entrance animation (once, on mount)
  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`eb-hero ${styles.hero} ${heroLoaded ? styles.loaded : ""}`}
      style={{ height: 660 + heroOffset, paddingTop: heroOffset }}
    >
      <img
        src="/images/hero-bg.webp"
        alt="A calm, organized workspace with a tablet showing the ElevateBiz dashboard"
        className={styles.bg}
      />
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
