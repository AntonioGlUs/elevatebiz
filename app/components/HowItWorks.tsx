"use client";

import { useEffect, useRef, useState } from "react";
import type { Texts } from "./types";
import styles from "./HowItWorks.module.css";

export default function HowItWorks({ t }: { t: Texts }) {
  const [howVisible, setHowVisible] = useState(false);
  const howRef = useRef<HTMLDivElement>(null);

  // Reveal the steps when the section scrolls into view
  useEffect(() => {
    function onScroll() {
      if (!howVisible && howRef.current) {
        const rect = howRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5) setHowVisible(true);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [howVisible]);

  return (
    <div id="how-it-works" ref={howRef} className={`eb-section ${styles.section}`}>
      <h2 className={`eb-h2 ${styles.title}`}>{t.howTitle}</h2>
      <div className={`eb-how-steps ${styles.steps}`}>
        {[
          { label: t.step1Label, title: t.step1Title, desc: t.step1Desc, delay: 0, icon: <StepIcon1 /> },
          { label: t.step2Label, title: t.step2Title, desc: t.step2Desc, delay: 220, icon: <StepIcon2 /> },
          { label: t.step3Label, title: t.step3Title, desc: t.step3Desc, delay: 440, icon: <StepIcon3 /> },
        ].map((step, i) => (
          <div
            key={i}
            className={`${styles.step} ${howVisible ? styles.stepVisible : ""}`}
            style={{ transitionDelay: `${step.delay}ms` }}
          >
            <div className={styles.icon}>{step.icon}</div>
            <p className={styles.label}>{step.label}</p>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.desc}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepIcon1() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007a73" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  );
}
function StepIcon2() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007a73" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  );
}
function StepIcon3() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007a73" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l4 4 10-10" />
    </svg>
  );
}
