"use client";

import { useState } from "react";
import type { Texts } from "./types";

export default function PainPoints({ t }: { t: Texts }) {
  const [painHoverIndex, setPainHoverIndex] = useState(-1);

  const painRows = [0, 1, 2].map((i) => {
    const active = painHoverIndex === i;
    return {
      bg: active ? "rgba(20,39,32,.035)" : "transparent",
      shadow: active ? "0 10px 26px rgba(20,39,32,.13)" : "0 0px 0px rgba(20,39,32,0)",
      transform: active ? "translateY(-3px)" : "translateY(0)",
      transition: active
        ? "background 150ms ease, box-shadow 150ms ease, transform 150ms ease"
        : "background 650ms ease, box-shadow 650ms ease, transform 650ms ease",
    };
  });

  return (
    <div style={{ background: "#f3f6f3", boxSizing: "border-box" }}>
      <svg viewBox="0 0 1440 70" width="100%" height="70" preserveAspectRatio="none" style={{ display: "block", marginBottom: -1 }}>
        <path d="M0,35 C 360,80 1080,-10 1440,35 L1440,70 L0,70 Z" fill="#ffffff" />
      </svg>
      <div className="eb-pain-inner" style={{ padding: "40px 80px 100px", boxSizing: "border-box", display: "flex", gap: 80, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div className="eb-pain-left" style={{ flex: "0 0 300px" }}>
          <h2 className="eb-h2" style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 34, margin: "0 0 16px 0", color: "#142720" }}>{t.painTitle}</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#5e6d64", margin: 0 }}>{t.painSubtitle}</p>
        </div>
        <div className="eb-pain-right" style={{ flex: 1, minWidth: 360, display: "flex", flexDirection: "column", borderBottom: "1px solid rgba(20,39,32,.12)" }}>
          {[t.pain1, t.pain2, t.pain3].map((text, i) => (
            <div
              key={i}
              onMouseEnter={() => setPainHoverIndex(i)}
              onMouseLeave={() => setPainHoverIndex(-1)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 20,
                padding: "26px 20px",
                margin: "0 -20px",
                borderTop: "1px solid rgba(20,39,32,.12)",
                borderRadius: 12,
                background: painRows[i].bg,
                boxShadow: painRows[i].shadow,
                transform: painRows[i].transform,
                transition: painRows[i].transition,
              }}
            >
              <PainIcon index={i} />
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: "#142720", maxWidth: 520 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PainIcon({ index }: { index: number }) {
  const common = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "#1e3a5f", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, style: { flexShrink: 0, marginTop: 2 } };
  if (index === 0)
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    );
  if (index === 1)
    return (
      <svg {...common}>
        <path d="M4 5h16v11H9l-4 3V5Z" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M9 18h6M10 21h4M12 2a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 2Z" />
    </svg>
  );
}
