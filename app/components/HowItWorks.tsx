"use client";

import { useEffect, useRef, useState } from "react";
import type { Texts } from "./types";

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

  const howOpacity = howVisible ? 1 : 0;
  const howTransform = howVisible ? "translateX(0)" : "translateX(70px)";

  return (
    <div id="how-it-works" ref={howRef} className="eb-section" style={{ background: "#f3f6f3", padding: "100px 80px", boxSizing: "border-box" }}>
      <h2 className="eb-h2" style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 34, margin: "0 0 48px 0", color: "#142720" }}>{t.howTitle}</h2>
      <div className="eb-how-steps" style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
        {[
          { label: t.step1Label, title: t.step1Title, desc: t.step1Desc, delay: 0, icon: <StepIcon1 /> },
          { label: t.step2Label, title: t.step2Title, desc: t.step2Desc, delay: 220, icon: <StepIcon2 /> },
          { label: t.step3Label, title: t.step3Title, desc: t.step3Desc, delay: 440, icon: <StepIcon3 /> },
        ].map((step, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              minWidth: 260,
              opacity: howOpacity,
              transform: howTransform,
              transition: `opacity 1500ms cubic-bezier(.16,.8,.4,1) ${step.delay}ms, transform 1500ms cubic-bezier(.16,.8,.4,1) ${step.delay}ms`,
            }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 999, background: "#01c3cc33", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              {step.icon}
            </div>
            <p style={{ margin: "0 0 6px 0", fontSize: 13, color: "#5e6d64" }}>{step.label}</p>
            <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 20, margin: "0 0 10px 0", color: "#142720" }}>{step.title}</h3>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "#5e6d64", maxWidth: 320 }}>{step.desc}</p>
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
