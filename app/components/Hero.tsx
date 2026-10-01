"use client";

import { useEffect, useState } from "react";
import { BOOK_CALL_HREF } from "./constants";
import type { Texts } from "./types";

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

  const heroCardOpacity = heroLoaded ? 1 : 0;
  const heroCardTransform = heroLoaded ? "translateX(0)" : "translateX(-36px)";
  const heroBtnOpacity = heroLoaded ? 1 : 0;
  const heroBtnTransform = heroLoaded ? "translateX(0)" : "translateX(-24px)";

  return (
    <div className="eb-hero" style={{ position: "relative", overflow: "hidden", height: 660 + heroOffset, paddingTop: heroOffset, display: "flex", alignItems: "center", boxSizing: "border-box" }}>
      <img
        src="/images/hero-bg.png"
        alt="A calm, organized workspace with a tablet showing the ElevateBiz dashboard"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, display: "block" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(120deg, rgba(20,39,32,.18) 0%, rgba(20,39,32,0) 55%)",
          zIndex: 0,
        }}
      />
      <div
        className="eb-hero-card"
        style={{
          position: "relative",
          zIndex: 1,
          background: "rgba(255,255,255,.64)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: 20,
          padding: 40,
          maxWidth: 387,
          minHeight: 331,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          margin: "0 0 0 80px",
          boxShadow: "0 1px 0 rgba(255,255,255,.6) inset, 0 8px 20px rgba(20,39,32,.14), 0 32px 72px rgba(20,39,32,.32)",
          border: "1px solid rgba(255,255,255,.55)",
          opacity: heroCardOpacity,
          transform: heroCardTransform,
          transition: "opacity 700ms cubic-bezier(.16,.8,.4,1), transform 700ms cubic-bezier(.16,.8,.4,1)",
        }}
      >
        <h1 className="eb-hero-title" style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 32, lineHeight: 1.2, margin: "0 0 14px 0", color: "#142720" }}>
          {t.heroTitle}
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.55, color: "#5e6d64", margin: "0 0 24px 0" }}>{t.heroSubtitle}</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            flexWrap: "wrap",
            opacity: heroBtnOpacity,
            transform: heroBtnTransform,
            transition: "opacity 650ms cubic-bezier(.16,.8,.4,1) 180ms, transform 650ms cubic-bezier(.16,.8,.4,1) 180ms",
          }}
        >
          <a
            href={BOOK_CALL_HREF}
            style={{
              background: "#007a73",
              color: "#ffffff",
              padding: "14px 28px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 16,
              display: "inline-block",
            }}
          >
            {t.heroBtnPrimary}
          </a>
          <a
            href="#see-it-in-action"
            style={{
              color: "#142720",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 16,
              borderBottom: "2px solid #01c3cc",
              paddingBottom: 2,
            }}
          >
            {t.heroBtnSecondary}
          </a>
        </div>
      </div>
    </div>
  );
}
