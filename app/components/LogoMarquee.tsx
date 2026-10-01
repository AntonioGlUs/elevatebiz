"use client";

import { useEffect, useState } from "react";
import { CLIENTS } from "@/lib/content";
import type { Texts } from "./types";
import styles from "./LogoMarquee.module.css";

export default function LogoMarquee({ t }: { t: Texts }) {
  const [marqueeStep, setMarqueeStep] = useState(0);

  // Pauses 3s, then shifts one position
  useEffect(() => {
    const timer = setInterval(() => {
      setMarqueeStep((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const clientsLoop = [...CLIENTS, ...CLIENTS];
  const marqueeStepPct = 50 / CLIENTS.length;
  const marqueePct = (marqueeStep * marqueeStepPct) % 50;
  const marqueeTransform = `translateX(-${marqueePct.toFixed(2)}%)`;

  return (
    <>
      <p className={`eb-trusted ${styles.trusted}`}>{t.trustedBy}</p>
      <div className={styles.viewport}>
        <div className={styles.track} style={{ transform: marqueeTransform }}>
          {clientsLoop.map((c, i) => (
            <div key={i} className={styles.client}>
              <div className={styles.badge} style={{ borderColor: c.bg }}>
                <span className={styles.initial} style={{ color: c.bg }}>{c.initial}</span>
              </div>
              <span className={styles.name}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
