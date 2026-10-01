"use client";

import { useState } from "react";
import { FAQ_DATA, Lang } from "@/lib/content";
import { BOOK_CALL_HREF } from "./constants";
import type { Texts } from "./types";
import styles from "./Faq.module.css";

export default function Faq({ t, lang }: { t: Texts; lang: Lang }) {
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

  const faqItems = FAQ_DATA.map((item, i) => {
    const isOpen = !!faqOpen[i];
    return {
      ...item,
      title: item.title[lang],
      subtitle: item.subtitle[lang],
      steps: item.steps[lang],
      actionLabel: item.actionLabel[lang],
      actionText: item.actionText[lang],
      open: isOpen,
      teal: i % 2 === 0,
      iconColor: i % 2 === 0 ? "#007a73" : "#1e3a5f",
      toggle: () =>
        setFaqOpen((prev) => ({ ...prev, [i]: !prev[i] })),
    };
  });

  return (
    <div id="faq" className={`eb-section ${styles.section}`}>
      <div className={styles.header}>
        <h2 className={`eb-h2 ${styles.title}`}>{t.faqTitle}</h2>
        <p className={styles.subtitle}>{t.faqSubtitle}</p>
      </div>

      <div className={styles.grid}>
        {faqItems.map((item, i) => (
          <div key={i} className={`${styles.card} ${item.open ? styles.cardOpen : ""}`}>
            <button type="button" onClick={item.toggle} aria-expanded={item.open} className={styles.toggle}>
              <div className={styles.top}>
                <div className={`${styles.icon} ${item.teal ? styles.iconTeal : styles.iconNavy}`}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={item.iconColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.iconPath} />
                  </svg>
                </div>
                <span className={styles.number}>{item.number}</span>
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardSubtitle}>{item.subtitle}</p>
            </button>

            <div className={`${styles.answer} ${item.open ? styles.answerOpen : ""}`}>
              <div className={styles.answerInner}>
                <ol className={styles.steps}>
                  {item.steps.map((step, j) => (
                    <li key={j}>{step}</li>
                  ))}
                </ol>
                <div className={styles.action}>
                  <p className={styles.actionLabel}>{item.actionLabel}</p>
                  <a href={BOOK_CALL_HREF} className={styles.actionLink}>
                    {item.actionText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
