"use client";

import { useEffect, useState } from "react";
import { CLIENTS } from "@/lib/content";
import type { Texts } from "./types";

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
      <p className="eb-trusted" style={{ margin: "32px 0 24px 80px", fontSize: 14, color: "#5e6d64", letterSpacing: ".02em" }}>{t.trustedBy}</p>
      <div style={{ position: "relative", zIndex: 1, overflow: "hidden", padding: "0px 0px 44px", boxSizing: "border-box" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 56,
            width: "max-content",
            transform: marqueeTransform,
            transition: "transform 700ms cubic-bezier(.4,0,.2,1)",
          }}
        >
          {clientsLoop.map((c, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flexShrink: 0, width: 96 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 999,
                  background: "#ffffff",
                  border: `2px solid ${c.bg}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxSizing: "border-box",
                }}
              >
                <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 28, color: c.bg }}>{c.initial}</span>
              </div>
              <span style={{ fontSize: 12.5, color: "#5e6d64", textAlign: "center", lineHeight: 1.3 }}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
