"use client";

import { useEffect, useRef, useState } from "react";
import { TEAM_MEMBERS, Lang } from "@/lib/content";
import type { Texts } from "./types";
import styles from "./LeadRoutingDiagram.module.css";

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
  const routerShadow = `0 0 ${Math.round(routerPulse)}px ${Math.round(routerPulse / 2)}px rgba(63,169,245,.55)`;
  const routerClass = `${styles.router} ${routerActiveWindow ? styles.routerActive : ""}`;
  const pillClass = `${styles.pill} ${de >= 1350 ? styles.pillVisible : ""} ${assignedActive ? styles.pillAssigned : ""}`;
  const routePillText =
    (lang === "es" ? "RUTA · " : "ROUTE · ") +
    TEAM_MEMBERS[targetIndex].specialty[lang].toUpperCase();
  const diagTeam = TEAM_MEMBERS.map((m, i) => ({
    initial: m.initial[lang],
    name: m.name[lang],
    specialty: m.specialty[lang],
    avatarBg: m.bg,
    active: i === targetIndex && assignedActive,
  }));

  function renderDiagTeamCard(m: (typeof diagTeam)[number], i: number) {
    return (
      <div key={i} className={`${styles.member} ${m.active ? styles.memberActive : ""}`}>
        <div className={styles.memberAvatar} style={{ background: m.avatarBg }}>
          <span className={styles.memberInitial}>{m.initial}</span>
        </div>
        <div className={styles.memberInfo}>
          <div className={styles.memberName}>{m.name}</div>
          <div className={styles.memberSpecialty}>{m.specialty}</div>
        </div>
        {m.active && <span className={styles.assigned}>{t.diagAssignedBadge}</span>}
      </div>
    );
  }

  return (
    <div id="lead-routing-diagram" ref={diagRef} className={`eb-section ${styles.section}`}>
      <h2 className={`eb-h2 ${styles.title}`}>{t.whoTitle}</h2>
      <p className={styles.subtitle}>{t.diagSubtitle}</p>

      <div className={`eb-diag-box ${styles.box}`}>
        <div ref={diagStageRef} className={`eb-diag-desktop ${styles.desktop}`} style={{ height: 390 * diagScale }}>
          <div className={styles.stage} style={{ transform: `scale(${diagScale})` }}>
            <svg viewBox="0 0 1000 390" width="1000" height="390" className={styles.lines} preserveAspectRatio="xMidYMid meet">
              <path d="M238,190 L435,190" stroke="rgba(255,255,255,.08)" strokeWidth="2" fill="none" />
              <path d="M238,190 L435,190" stroke="#3fa9f5" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="200" strokeDashoffset={line1Offset} opacity={line1GlowOpacity} className={styles.glow} />
              <path d="M238,190 L435,190" stroke="#3fa9f5" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="200" strokeDashoffset={line1Offset} />
              <path d={line2Path} stroke="#3fa9f5" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={line2Length} strokeDashoffset={line2Offset} opacity={line2GlowOpacity} className={styles.glow} />
              <path d={line2Path} stroke="#3fa9f5" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray={line2Length} strokeDashoffset={line2Offset} />
            </svg>

            <div className={`${styles.label} ${styles.leadLabel}`}>{t.diagLeadLabel}</div>

            <div className={styles.leadHalo} />
            <div className={styles.leadRing} />
            <div className={styles.leadAvatar}>
              <PersonIcon size={60} />
            </div>
            <div className={styles.leadPhone}>{t.diagLeadPhone}</div>
            <div className={styles.leadVia}>{t.diagLeadVia}</div>

            <div className={`${routerClass} ${styles.routerDesktop}`} style={{ boxShadow: routerShadow }}>
              <img src="/images/logo-icon-v2.webp" alt="" loading="lazy" className={styles.routerLogo} />
              <div className={styles.routerLabel}>{t.diagRouterLabel}</div>
            </div>

            <div className={`${pillClass} ${styles.pillDesktop}`}>
              <span className={styles.pillText}>{routePillText}</span>
            </div>

            <div className={`${styles.label} ${styles.teamLabel}`}>{t.diagTeamLabel}</div>
            <div className={styles.teamDesktop}>{diagTeam.map(renderDiagTeamCard)}</div>
          </div>
        </div>

        {/* Mobile version: same animation, stacked vertically */}
        <div className="eb-diag-mobile">
          <div className={`${styles.label} ${styles.mobileLabel}`}>{t.diagLeadLabel}</div>
          <div className={styles.mobileRow}>
            <div className={styles.mobileLeadAvatar}>
              <PersonIcon size={30} />
            </div>
            <div>
              <div className={styles.mobileLeadPhone}>{t.diagLeadPhone}</div>
              <div className={styles.mobileLeadVia}>{t.diagLeadVia}</div>
            </div>
          </div>

          <DiagMobileLine progress={line1Progress} glow={line1GlowOpacity} />

          <div className={styles.mobileRow}>
            <div className={`${routerClass} ${styles.routerMobile}`} style={{ boxShadow: routerShadow }}>
              <img src="/images/logo-icon-v2.webp" alt="" loading="lazy" className={styles.routerLogoMobile} />
            </div>
            <div className={styles.mobileRouterInfo}>
              <div className={`${styles.routerLabel} ${styles.mobileRouterLabel}`}>{t.diagRouterLabel}</div>
              <div className={`${pillClass} ${styles.pillMobile}`}>
                <span className={styles.pillText}>{routePillText}</span>
              </div>
            </div>
          </div>

          <DiagMobileLine progress={line2Progress} glow={line2GlowOpacity} />

          <div className={`${styles.label} ${styles.mobileTeamLabel}`}>{t.diagTeamLabel}</div>
          <div className={styles.teamMobile}>{diagTeam.map(renderDiagTeamCard)}</div>
        </div>
      </div>
    </div>
  );
}

function PersonIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
    </svg>
  );
}

function DiagMobileLine({ progress, glow }: { progress: number; glow: number }) {
  return (
    <div className={styles.mobileLine}>
      <div
        className={styles.mobileLineFill}
        style={{
          height: `${Math.round(progress * 100)}%`,
          boxShadow: `0 0 10px 2px rgba(63,169,245,${(0.8 * glow).toFixed(2)})`,
        }}
      />
    </div>
  );
}
