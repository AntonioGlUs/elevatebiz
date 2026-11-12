'use client'

import { useEffect, useRef, useState } from 'react'
import { TEAM_MEMBERS } from '@/lib/content'

function PersonIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
    </svg>
  )
}

// Mixes a #rrggbb colour with white (amount 0..1)
function lighten(hex, amount) {
  const n = parseInt(hex.slice(1), 16)
  const mix = (c) => Math.round(c + (255 - c) * amount)
  return `rgb(${mix(n >> 16)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`
}

// A new lead travels to the AI router and then to a team member; the whole sequence loops every 6 s
export default function LeadRouting({ t, lang }) {
  const [diagElapsed, setDiagElapsed] = useState(0)
  const [diagCycleCount, setDiagCycleCount] = useState(0)
  const diagRef = useRef(null)
  const started = useRef(false)
  const stageRef = useRef(null)
  const [diagScale, setDiagScale] = useState(1)
  const compactRef = useRef(null)
  const [compactScale, setCompactScale] = useState(1)
  const [compactLeft, setCompactLeft] = useState(0)

  // Scale the fixed-size diagrams to fit: 1000x390 on wide screens, a roomier 360x224 one on phones
  useEffect(() => {
    const measure = () => {
      if (stageRef.current) setDiagScale(Math.min(1, stageRef.current.clientWidth / 1000))
      if (compactRef.current) {
        // Never larger than 1.25x; when the box is wider than that, the diagram is centred in it
        const width = compactRef.current.clientWidth
        const scale = Math.min(1.25, width / 360)
        setCompactScale(scale)
        setCompactLeft(Math.max(0, (width - 360 * scale) / 2))
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Animation loop, triggered once visible
  useEffect(() => {
    const el = diagRef.current
    let timer
    const start = () => {
      const t0 = Date.now()
      let last = 0
      timer = setInterval(() => {
        const elapsed = (Date.now() - t0) % 6000
        if (elapsed < last) setDiagCycleCount((p) => p + 1)
        setDiagElapsed(elapsed)
        last = elapsed
      }, 50)
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          start()
          obs.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      clearInterval(timer)
    }
  }, [])

  // ---- Lead routing diagram math ----
  const de = diagElapsed
  const ROUTING_ORDER = [1, 3, 2, 0]
  const targetIndex = ROUTING_ORDER[diagCycleCount % ROUTING_ORDER.length]
  const TEAM_Y = [76, 162, 248, 334]
  const targetY = TEAM_Y[targetIndex]
  const clamp01 = (v) => Math.max(0, Math.min(1, v))
  const line1Progress = clamp01((de - 500) / 900)
  const line1Offset = Math.round(200 * (1 - line1Progress))
  const routerActiveWindow = de >= 1350 && de < 4000
  const line2Progress = clamp01((de - 2600) / 900)
  const line2dx = 175
  const line2dy = targetY - 190
  const line2Length = Math.round(Math.sqrt(line2dx * line2dx + line2dy * line2dy) * 1.15)
  const line2Offset = Math.round(line2Length * (1 - line2Progress))
  const line2Path = `M565,190 Q660,190 740,${targetY}`
  const line1GlowOpacity = de < 500 ? 0 : de < 1400 ? 1 : de < 1700 ? Math.max(0, 1 - (de - 1400) / 300) : 0
  const line2GlowOpacity = de < 2600 ? 0 : de < 3500 ? 1 : de < 3800 ? Math.max(0, 1 - (de - 3500) / 300) : 0
  const assignedActive = de >= 3500 && de < 5500
  const routerPulse = routerActiveWindow ? 16 + Math.sin(de / 130) * 9 : 6
  const routerShadow = `0 0 ${Math.round(routerPulse)}px ${Math.round(routerPulse / 2)}px rgba(1, 195, 204,.55)`
  const routerClass = `lr-router ${routerActiveWindow ? 'lr-router-active' : ''}`
  const pillClass = `lr-pill ${de >= 1350 ? 'lr-pill-visible' : ''} ${assignedActive ? 'lr-pill-assigned' : ''}`
  const routePillText = (lang === 'es' ? 'RUTA · ' : 'ROUTE · ') + TEAM_MEMBERS[targetIndex].specialty[lang].toUpperCase()
  // Same routing on the compact (phone) stage: the lead and the router sit at y = 121
  const compactY = [43, 95, 147, 199][targetIndex]
  const compactLen = Math.round(Math.sqrt(52 * 52 + (compactY - 121) * (compactY - 121)) * 1.15)
  const compactPath = `M162,121 Q192,121 214,${compactY}`
  const compactOffset1 = Math.round(48 * (1 - line1Progress))
  const compactOffset2 = Math.round(compactLen * (1 - line2Progress))
  // The line from the router to the team takes the colour of the member it is heading to (lightened so it glows
  // on the dark background)
  const routeColor = lighten(TEAM_MEMBERS[targetIndex].bg, 0.35)
  const diagTeam = TEAM_MEMBERS.map((m, i) => ({
    initial: m.initial[lang],
    name: m.name[lang],
    specialty: m.specialty[lang],
    avatarBg: m.bg,
    active: i === targetIndex && assignedActive,
  }))

  const renderCard = (m, i) => (
    <div key={i} className={`lr-member ${m.active ? 'lr-member-active' : ''}`}>
      <div className="lr-member-avatar" style={{ background: m.avatarBg }}>
        <span className="lr-member-initial">{m.initial}</span>
      </div>
      <div className="lr-member-info">
        <div className="lr-member-name">{m.name}</div>
        <div className="lr-member-specialty">{m.specialty}</div>
      </div>
      {m.active && <span className="lr-assigned">{t.diagAssignedBadge}</span>}
    </div>
  )

  return (
    <div id="lead-routing-diagram" ref={diagRef}>
      <div className="eb-diag-box lr-box">
        <div ref={stageRef} className="eb-diag-desktop lr-desktop" style={{ height: 390 * diagScale }}>
          <div className="lr-stage" style={{ transform: `scale(${diagScale})` }}>
            <svg viewBox="0 0 1000 390" width="1000" height="390" className="lr-lines" preserveAspectRatio="xMidYMid meet">
              <path d="M238,190 L435,190" stroke="rgba(255,255,255,.08)" strokeWidth="2" fill="none" />
              <path d="M238,190 L435,190" stroke="#01c3cc" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="200" strokeDashoffset={line1Offset} opacity={line1GlowOpacity} className="lr-glow" />
              <path d="M238,190 L435,190" stroke="#01c3cc" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="200" strokeDashoffset={line1Offset} />
              <path d={line2Path} stroke={routeColor} strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={line2Length} strokeDashoffset={line2Offset} opacity={line2GlowOpacity} className="lr-glow" />
              <path d={line2Path} stroke={routeColor} strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray={line2Length} strokeDashoffset={line2Offset} />
            </svg>

            <div className="lr-label lr-lead-label">{t.diagLeadLabel}</div>

            <div className="lr-lead-halo" />
            <div className="lr-lead-ring" />
            <div className="lr-lead-avatar">
              <PersonIcon size={60} />
            </div>
            <div className="lr-lead-phone">{t.diagLeadPhone}</div>
            <div className="lr-lead-via">{t.diagLeadVia}</div>

            <div className={`${routerClass} lr-router-desktop`} style={{ boxShadow: routerShadow }}>
              <img src="/images/logo-icon-v2.webp" alt="" width="128" height="128" loading="lazy" className="lr-router-logo" />
              <div className="lr-router-label">{t.diagRouterLabel}</div>
            </div>

            <div className={`${pillClass} lr-pill-desktop`}>
              <span className="lr-pill-text">{routePillText}</span>
            </div>

            <div className="lr-label lr-team-label">{t.diagTeamLabel}</div>
            <div className="lr-team-desktop">{diagTeam.map(renderCard)}</div>
          </div>
        </div>

        {/* Phone version: the same horizontal diagram, redrawn on a 360x224 stage so the text stays readable */}
        <div ref={compactRef} className="eb-diag-mobile" style={{ height: 224 * compactScale }}>
          <div className="lr-stage lr-compact" style={{ transform: `translateX(${compactLeft}px) scale(${compactScale})` }}>
            <svg viewBox="0 0 360 224" width="360" height="224" className="lr-lines">
              <path d="M60,121 L108,121" stroke="rgba(255,255,255,.08)" strokeWidth="1.5" fill="none" />
              <path d="M60,121 L108,121" stroke="#01c3cc" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="48" strokeDashoffset={compactOffset1} opacity={line1GlowOpacity} className="lr-glow" />
              <path d="M60,121 L108,121" stroke="#01c3cc" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="48" strokeDashoffset={compactOffset1} opacity={line1Progress > 0 ? 1 : 0} />
              <path d={compactPath} stroke={routeColor} strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray={compactLen} strokeDashoffset={compactOffset2} opacity={line2GlowOpacity} className="lr-glow" />
              <path d={compactPath} stroke={routeColor} strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray={compactLen} strokeDashoffset={compactOffset2} opacity={line2Progress > 0 ? 1 : 0} />
            </svg>

            <div className="lr-label lr-c-lead-label">{t.diagLeadLabel}</div>
            <div className="lr-c-lead-avatar">
              <PersonIcon size={22} />
            </div>
            <div className="lr-c-lead-phone">{t.diagLeadPhone}</div>
            <div className="lr-c-lead-via">{t.diagLeadVia}</div>

            <div className={`${routerClass} lr-c-router`} style={{ boxShadow: routerShadow }}>
              <img src="/images/logo-icon-v2.webp" alt="" width="128" height="128" loading="lazy" className="lr-c-router-logo" />
              <div className="lr-router-label">{t.diagRouterLabel}</div>
            </div>

            <div className={`${pillClass} lr-c-pill`}>
              <span className="lr-pill-text">{routePillText}</span>
            </div>

            <div className="lr-label lr-c-team-label">{t.diagTeamLabel}</div>
            <div className="lr-c-team">{diagTeam.map(renderCard)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
