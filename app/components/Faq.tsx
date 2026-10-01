"use client";

import { useState } from "react";
import { FAQ_DATA, Lang } from "@/lib/content";
import { BOOK_CALL_HREF } from "./constants";
import type { Texts } from "./types";

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
      borderColor: isOpen ? "#01c3cc" : "rgba(20,39,32,.14)",
      maxHeight: isOpen ? "480px" : "0px",
      iconBg: i % 2 === 0 ? "#01c3cc1f" : "#1e3a5f14",
      iconColor: i % 2 === 0 ? "#007a73" : "#1e3a5f",
      toggle: () =>
        setFaqOpen((prev) => ({ ...prev, [i]: !prev[i] })),
    };
  });

  return (
    <div id="faq" className="eb-section" style={{ padding: "100px 80px", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 640, margin: "0 0 56px 0" }}>
        <h2 className="eb-h2" style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 34, margin: "0 0 14px 0", color: "#142720" }}>{t.faqTitle}</h2>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: "#5e6d64", margin: 0 }}>{t.faqSubtitle}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(380px, 100%), 1fr))", gap: 28 }}>
        {faqItems.map((item, i) => (
          <div key={i} style={{ background: "#ffffff", border: `1.5px solid ${item.borderColor}`, borderRadius: 14, padding: 26, boxSizing: "border-box", transition: "border-color 200ms ease" }}>
            <button
              type="button"
              onClick={item.toggle}
              aria-expanded={item.open}
              style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: 0, margin: 0, cursor: "pointer", display: "block" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: item.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={item.iconColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.iconPath} />
                  </svg>
                </div>
                <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 13, color: "#5e6d64" }}>{item.number}</span>
              </div>
              <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 19, margin: "18px 0 6px 0", color: "#142720" }}>{item.title}</h3>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5, color: "#5e6d64" }}>{item.subtitle}</p>
            </button>

            <div style={{ maxHeight: item.maxHeight, overflow: "hidden", transition: "max-height 500ms ease" }}>
              <div style={{ paddingTop: 18, marginTop: 18, borderTop: "1px solid rgba(20,39,32,.1)" }}>
                <ol style={{ margin: "0 0 16px 0", paddingLeft: 20, fontSize: 14.5, color: "#142720", lineHeight: 1.7 }}>
                  {item.steps.map((step, j) => (
                    <li key={j}>{step}</li>
                  ))}
                </ol>
                <div style={{ background: "#01c3cc1a", borderRadius: 10, padding: "14px 16px" }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: 14, color: "#142720", fontWeight: 600 }}>{item.actionLabel}</p>
                  <a href={BOOK_CALL_HREF} style={{ fontSize: 14, fontWeight: 600, color: "#007a73" }}>
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
