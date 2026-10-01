"use client";

import { useEffect, useRef, useState } from "react";
import { TEAM_MEMBERS, Lang } from "@/lib/content";
import type { Texts } from "./types";

export default function LeadRoutingDiagram({ t, lang }: { t: Texts; lang: Lang }) {
  const [diagElapsed, setDiagElapsed] = useState(0);
  const [diagCycleCount, setDiagCycleCount] = useState(0);
  const diagRef = useRef<HTMLDivElement>(null);
  const diagStarted = useRef(false);
  const diagStageRef = useRef<HTMLDivElement>(null);
  const [diagScale, setDiagScale] = useState(1);

  // Scale the fixed-size (1000x390) diagram down to fit narrower screens
  useEffect(() => {
    function measure() {
      if (diagStageRef.current) setDiagScale(Math.min(1, diagStageRef.current.clientWidth / 1000));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Animation loop, triggered once visible
  useEffect(() => {
    if (!diagRef.current || typeof window === "undefined") return;
    const el = diagRef.current;
    function startDiagram() {
      const start = Date.now();
      let last = 0;
      const timer = setInterval(() => {
        const elapsed = (Date.now() - start) % 6000;
        if (elapsed < last) {
          setDiagCycleCount((prev) => prev + 1);
        }
        setDiagElapsed(elapsed);
        last = elapsed;
      }, 50);
      return timer;
    }
    if (window.IntersectionObserver) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !diagStarted.current) {
            diagStarted.current = true;
            startDiagram();
            obs.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    } else if (!diagStarted.current) {
      diagStarted.current = true;
      startDiagram();
    }
  }, []);

  // ---- Lead routing diagram math ----
  const de = diagElapsed;
  const ROUTING_ORDER = [1, 3, 2, 0];
  const targetIndex = ROUTING_ORDER[diagCycleCount % ROUTING_ORDER.length];
  const TEAM_Y = [76, 162, 248, 334];
  const targetY = TEAM_Y[targetIndex];
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  const line1Progress = clamp01((de - 500) / 900);
  const line1Offset = Math.round(200 * (1 - line1Progress));
  const routerActiveWindow = de >= 1350 && de < 4000;
  const line2Progress = clamp01((de - 2600) / 900);
  const line2dx = 175;
  const line2dy = targetY - 190;
  const line2Length = Math.round(Math.sqrt(line2dx * line2dx + line2dy * line2dy) * 1.15);
  const line2Offset = Math.round(line2Length * (1 - line2Progress));
  const line2Path = `M565,190 Q660,190 740,${targetY}`;
  const line1GlowOpacity =
    de < 500 ? 0 : de < 1400 ? 1 : de < 1700 ? Math.max(0, 1 - (de - 1400) / 300) : 0;
  const line2GlowOpacity =
    de < 2600 ? 0 : de < 3500 ? 1 : de < 3800 ? Math.max(0, 1 - (de - 3500) / 300) : 0;
  const assignedActive = de >= 3500 && de < 5500;
  const routerPulse = routerActiveWindow ? 16 + Math.sin(de / 130) * 9 : 6;
  const routerBorder = routerActiveWindow ? "#3fa9f5" : "rgba(63,169,245,.55)";
  const routerShadow = `0 0 ${Math.round(routerPulse)}px ${Math.round(routerPulse / 2)}px rgba(63,169,245,.55)`;
  const pillBorder = assignedActive ? "rgba(63,169,245,.6)" : "rgba(63,169,245,.25)";
  const pillOpacity = de >= 1350 ? 1 : 0;
  const routePillText =
    (lang === "es" ? "RUTA · " : "ROUTE · ") +
    TEAM_MEMBERS[targetIndex].specialty[lang].toUpperCase();
  const diagTeam = TEAM_MEMBERS.map((m, i) => {
    const active = i === targetIndex && assignedActive;
    return {
      initial: m.initial[lang],
      name: m.name[lang],
      specialty: m.specialty[lang],
      avatarBg: m.bg,
      active,
      cardBg: active ? "rgba(63,169,245,.06)" : "rgba(255,255,255,.02)",
      cardBorder: active ? "#3fa9f5" : "rgba(255,255,255,.08)",
      cardShadow: active ? "0 0 24px rgba(63,169,245,.30)" : "none",
    };
  });

  function renderDiagTeamCard(m: (typeof diagTeam)[number], i: number) {
    return (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, background: m.cardBg, border: `1.5px solid ${m.cardBorder}`, boxShadow: m.cardShadow, boxSizing: "border-box", transition: "border-color 250ms ease, box-shadow 250ms ease" }}>
        <div style={{ width: 44, height: 44, borderRadius: 999, background: m.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#ffffff" }}>{m.initial}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#ffffff" }}>{m.name}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.45)" }}>{m.specialty}</div>
        </div>
        {m.active && <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: ".08em", color: "#3fa9f5", whiteSpace: "nowrap" }}>{t.diagAssignedBadge}</span>}
      </div>
    );
  }

  return (
    <div id="lead-routing-diagram" ref={diagRef} className="eb-section" style={{ padding: "100px 80px", boxSizing: "border-box" }}>
      <h2 className="eb-h2" style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 34, margin: "0 0 12px 0", color: "#142720" }}>{t.whoTitle}</h2>
      <p style={{ fontSize: 16, lineHeight: 1.6, color: "#5e6d64", margin: "0 0 48px 0", maxWidth: 560 }}>{t.diagSubtitle}</p>

      <div className="eb-diag-box" style={{ background: "#07080b", borderRadius: 24, padding: 56, boxShadow: "0 30px 70px rgba(20,39,32,.28)" }}>
        <div ref={diagStageRef} className="eb-diag-desktop" style={{ width: "100%", maxWidth: 1000, height: 390 * diagScale, margin: "0 auto" }}>
        <div style={{ position: "relative", width: 1000, height: 390, transform: `scale(${diagScale})`, transformOrigin: "top left" }}>
          <svg viewBox="0 0 1000 390" width="1000" height="390" style={{ display: "block", position: "absolute", top: 0, left: 0 }} preserveAspectRatio="xMidYMid meet">
            <path d="M238,190 L435,190" stroke="rgba(255,255,255,.08)" strokeWidth="2" fill="none" />
            <path d="M238,190 L435,190" stroke="#3fa9f5" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="200" strokeDashoffset={line1Offset} opacity={line1GlowOpacity} style={{ filter: "blur(5px)" }} />
            <path d="M238,190 L435,190" stroke="#3fa9f5" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="200" strokeDashoffset={line1Offset} />
            <path d={line2Path} stroke="#3fa9f5" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={line2Length} strokeDashoffset={line2Offset} opacity={line2GlowOpacity} style={{ filter: "blur(5px)" }} />
            <path d={line2Path} stroke="#3fa9f5" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray={line2Length} strokeDashoffset={line2Offset} />
          </svg>

          <div style={{ position: "absolute", left: 20, top: 20, fontWeight: 700, fontSize: 12.5, letterSpacing: ".14em", color: "rgba(255,255,255,.4)" }}>{t.diagLeadLabel}</div>

          <div style={{ position: "absolute", left: 62, top: 102, width: 176, height: 176, borderRadius: 999, background: "radial-gradient(circle, rgba(63,169,245,.10) 0%, rgba(63,169,245,0) 70%)" }} />
          <div style={{ position: "absolute", left: 62, top: 102, width: 176, height: 176, borderRadius: 999, border: "1px solid rgba(255,255,255,.06)" }} />
          <div style={{ position: "absolute", left: 74, top: 114, width: 152, height: 152, borderRadius: 999, background: "#2b2e34", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
            </svg>
          </div>
          <div style={{ position: "absolute", left: 20, top: 288, width: 220, textAlign: "center", fontWeight: 700, fontSize: 19, color: "#ffffff" }}>{t.diagLeadPhone}</div>
          <div style={{ position: "absolute", left: 20, top: 314, width: 220, textAlign: "center", fontSize: 14, color: "rgba(255,255,255,.45)" }}>{t.diagLeadVia}</div>

          <div style={{ position: "absolute", left: 435, top: 125, width: 130, height: 130, borderRadius: 22, background: "#050608", border: `2px solid ${routerBorder}`, boxShadow: routerShadow, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, transition: "border-color 200ms ease", boxSizing: "border-box" }}>
            <img src="/images/logo-icon-v2.png" alt="" style={{ width: 52, height: "auto", display: "block" }} />
            <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: ".1em", color: "rgba(255,255,255,.6)" }}>{t.diagRouterLabel}</div>
          </div>

          <div style={{ position: "absolute", left: 405, top: 270, width: 190, textAlign: "center", background: "rgba(63,169,245,.08)", border: `1px solid ${pillBorder}`, borderRadius: 999, padding: "9px 4px", opacity: pillOpacity, transition: "opacity 300ms ease" }}>
            <span style={{ fontWeight: 700, fontSize: 11.5, letterSpacing: ".12em", color: "#3fa9f5" }}>{routePillText}</span>
          </div>

          <div style={{ position: "absolute", left: 740, top: 20, fontWeight: 700, fontSize: 12.5, letterSpacing: ".14em", color: "rgba(255,255,255,.4)" }}>{t.diagTeamLabel}</div>
          <div style={{ position: "absolute", left: 740, top: 40, width: 240, display: "flex", flexDirection: "column", gap: 14 }}>
            {diagTeam.map(renderDiagTeamCard)}
          </div>
        </div>
        </div>

        {/* Mobile version: same animation, stacked vertically */}
        <div className="eb-diag-mobile">
          <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: ".14em", color: "rgba(255,255,255,.4)", marginBottom: 16 }}>{t.diagLeadLabel}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: "#2b2e34", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: "#ffffff" }}>{t.diagLeadPhone}</div>
              <div style={{ fontSize: 13.5, color: "rgba(255,255,255,.45)" }}>{t.diagLeadVia}</div>
            </div>
          </div>

          <DiagMobileLine progress={line1Progress} glow={line1GlowOpacity} />

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "#050608", border: `2px solid ${routerBorder}`, boxShadow: routerShadow, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxSizing: "border-box", transition: "border-color 200ms ease" }}>
              <img src="/images/logo-icon-v2.png" alt="" style={{ width: 32, height: "auto", display: "block" }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: ".1em", color: "rgba(255,255,255,.6)", marginBottom: 6 }}>{t.diagRouterLabel}</div>
              <div style={{ display: "inline-block", background: "rgba(63,169,245,.08)", border: `1px solid ${pillBorder}`, borderRadius: 999, padding: "6px 12px", opacity: pillOpacity, transition: "opacity 300ms ease" }}>
                <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: ".1em", color: "#3fa9f5" }}>{routePillText}</span>
              </div>
            </div>
          </div>

          <DiagMobileLine progress={line2Progress} glow={line2GlowOpacity} />

          <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: ".14em", color: "rgba(255,255,255,.4)", marginBottom: 12 }}>{t.diagTeamLabel}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{diagTeam.map(renderDiagTeamCard)}</div>
        </div>
      </div>
    </div>
  );
}

function DiagMobileLine({ progress, glow }: { progress: number; glow: number }) {
  return (
    <div style={{ position: "relative", width: 3, height: 36, margin: "10px 0 10px 30px", background: "rgba(255,255,255,.08)", borderRadius: 2 }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: `${Math.round(progress * 100)}%`,
          background: "#3fa9f5",
          borderRadius: 2,
          boxShadow: `0 0 10px 2px rgba(63,169,245,${(0.8 * glow).toFixed(2)})`,
        }}
      />
    </div>
  );
}
