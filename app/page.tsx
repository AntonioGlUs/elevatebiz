"use client";

import { useEffect, useRef, useState } from "react";
import {
  TEXT,
  STATS,
  CLIENTS,
  TEAM_MEMBERS,
  NAV_DATA,
  FAQ_DATA,
  CHAT_SCRIPT,
  Lang,
} from "@/lib/content";

const BRAND_NAME = "ElevateBiz";
const BOOK_CALL_HREF =
  "mailto:hello@elevatebiz.ai?subject=I%27d%20like%20to%20book%20a%20call";

export default function Page() {
  // ---------- Language ----------
  const [lang, setLang] = useState<Lang>("en");
  const t = TEXT[lang];

  // ---------- Announcement bar ----------
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // ---------- Preview-mode notice (shown on load) ----------
  const [showPreviewNotice, setShowPreviewNotice] = useState(false);
  const annRef = useRef<HTMLDivElement>(null);
  const [annHeight, setAnnHeight] = useState(0);

  // ---------- Nav scroll state ----------
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // ---------- Hero entrance ----------
  const [heroLoaded, setHeroLoaded] = useState(false);

  // ---------- Stats counter ----------
  const [statValues, setStatValues] = useState([0, 0, 0]);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsStarted = useRef(false);

  // ---------- Marquee ----------
  const [marqueeStep, setMarqueeStep] = useState(0);

  // ---------- Services carousel reveal + interaction ----------
  const [servicesVisible, setServicesVisible] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const [carouselX, setCarouselX] = useState(0);
  const [carouselDir, setCarouselDir] = useState(0);
  // How far the track can move depends on the screen width; measured below
  const [carouselMax, setCarouselMax] = useState(752);
  const [svcImgHover, setSvcImgHover] = useState([false, false, false, false]);

  // ---------- Pain points hover ----------
  const [painHoverIndex, setPainHoverIndex] = useState(-1);

  // ---------- How it works reveal ----------
  const [howVisible, setHowVisible] = useState(false);
  const howRef = useRef<HTMLDivElement>(null);

  // ---------- WhatsApp chat lag + animation ----------
  const [chatSmoothY, setChatSmoothY] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);

  // ---------- Lead routing diagram ----------
  const [diagElapsed, setDiagElapsed] = useState(0);
  const [diagCycleCount, setDiagCycleCount] = useState(0);
  const diagRef = useRef<HTMLDivElement>(null);
  const diagStarted = useRef(false);
  const diagStageRef = useRef<HTMLDivElement>(null);
  const [diagScale, setDiagScale] = useState(1);

  // ---------- FAQ ----------
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

  // ================= EFFECTS =================

  // Preview-mode notice: open on load, close with Escape
  useEffect(() => {
    setShowPreviewNotice(true);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowPreviewNotice(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Hero entrance (once, on mount)
  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 60);
    return () => clearTimeout(timer);
  }, []);

  // Announcement bar height (it wraps to more lines on small screens; the nav sits right below it)
  useEffect(() => {
    function measure() {
      if (annRef.current) setAnnHeight(annRef.current.offsetHeight);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [showAnnouncement]);

  // Scale the fixed-size (1000x390) lead-routing diagram down to fit narrower screens
  useEffect(() => {
    function measure() {
      if (diagStageRef.current) setDiagScale(Math.min(1, diagStageRef.current.clientWidth / 1000));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // WhatsApp chat sequence loop
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function playNext(index: number) {
      if (index >= CHAT_SCRIPT.length) {
        timer = setTimeout(() => {
          setVisibleCount(0);
          setTyping(false);
          timer = setTimeout(() => playNext(0), 700);
        }, 2600);
        return;
      }
      const msg = CHAT_SCRIPT[index];
      if (msg.from === "bot") {
        setTyping(true);
        timer = setTimeout(() => {
          setTyping(false);
          setVisibleCount(index + 1);
          timer = setTimeout(() => playNext(index + 1), 500);
        }, 900);
      } else {
        timer = setTimeout(() => {
          setVisibleCount(index + 1);
          playNext(index + 1);
        }, 700);
      }
    }
    timer = setTimeout(() => playNext(0), 500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll listener: nav shrink + services/how-it-works reveal trigger
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);

      if (!servicesVisible && servicesRef.current) {
        const rect = servicesRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.78) setServicesVisible(true);
      }
      if (!howVisible && howRef.current) {
        const rect = howRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5) setHowVisible(true);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicesVisible, howVisible]);

  // Stats count-up, triggered once stats band is visible
  useEffect(() => {
    if (!statsRef.current || typeof window === "undefined") return;
    const el = statsRef.current;
    function startCount() {
      const start = Date.now();
      const DURATION = 1400;
      const timer = setInterval(() => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / DURATION, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setStatValues(STATS.map((s) => Math.round(s.target * eased)));
        if (progress >= 1) clearInterval(timer);
      }, 40);
    }
    if (window.IntersectionObserver) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !statsStarted.current) {
            statsStarted.current = true;
            startCount();
            obs.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    } else {
      startCount();
    }
  }, []);

  // Marquee step ticker (pauses 3s, then shifts one position)
  useEffect(() => {
    const timer = setInterval(() => {
      setMarqueeStep((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Chat card inertia/lag effect
  useEffect(() => {
    const timer = setInterval(() => {
      setChatSmoothY((prev) => prev + (window.scrollY - prev) * 0.09);
    }, 16);
    return () => clearInterval(timer);
  }, []);

  // Services carousel auto-scroll while hovering left/right zones
  useEffect(() => {
    const timer = setInterval(() => {
      if (carouselDir !== 0) {
        setCarouselX((prev) =>
          Math.max(0, Math.min(carouselMax, prev + carouselDir * 5))
        );
      }
    }, 20);
    return () => clearInterval(timer);
  }, [carouselDir, carouselMax]);

  // Services carousel: measure the scroll limit (track width - visible width)
  useEffect(() => {
    function measure() {
      const el = servicesRef.current;
      const track = el?.firstElementChild as HTMLElement | null;
      if (!el || !track) return;
      const max = Math.max(0, track.scrollWidth - el.clientWidth);
      setCarouselMax(max);
      setCarouselX((prev) => Math.min(prev, max));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Lead-routing diagram animation loop, triggered once visible
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

  // ================= DERIVED VALUES =================

  const navWrapperTop = scrolled ? "0" : `${showAnnouncement ? Math.max(42, annHeight + 3) : 42}px`;
  const navWrapperSide = scrolled ? "0" : "80px";
  const navBarRadius = scrolled ? "0px" : "18px";
  const navBarPadding = scrolled ? "14px 80px" : "10px 26px";
  const navBarShadow = scrolled
    ? "0 6px 20px rgba(20,39,32,.12)"
    : "0 14px 32px rgba(20,39,32,.10),0 2px 6px rgba(20,39,32,.05)";
  const navBarBackground = scrolled ? "rgba(255,255,255,.72)" : "#ffffff";

  // When the announcement bar is closed the hero moves up under the fixed nav;
  // grow it by the bar's (last measured) height so the card keeps its position.
  const heroOffset = showAnnouncement ? 0 : annHeight;

  const heroCardOpacity = heroLoaded ? 1 : 0;
  const heroCardTransform = heroLoaded ? "translateX(0)" : "translateX(-36px)";
  const heroBtnOpacity = heroLoaded ? 1 : 0;
  const heroBtnTransform = heroLoaded ? "translateX(0)" : "translateX(-24px)";

  const clientsLoop = [...CLIENTS, ...CLIENTS];
  const marqueeStepPct = 50 / CLIENTS.length;
  const marqueePct = (marqueeStep * marqueeStepPct) % 50;
  const marqueeTransform = `translateX(-${marqueePct.toFixed(2)}%)`;

  const statsDisplay = STATS.map((s, i) => ({
    value: s.prefix + statValues[i] + s.suffix,
    label: s.label[lang],
  }));

  // Small, temporary lag while scrolling (settles back to 0), capped so the card never leaves its section
  const chatLagRaw = ((typeof window !== "undefined" ? window.scrollY : 0) - chatSmoothY) * -0.15;
  const chatLagOffset = Math.max(-40, Math.min(40, chatLagRaw));
  const chatLagTransform = `translateY(${chatLagOffset.toFixed(1)}px)`;

  const messages = CHAT_SCRIPT.slice(0, visibleCount).map((m) => ({
    text: m.text[lang],
    time: m.time,
    outgoing: m.from === "bot",
    justify: m.from === "bot" ? "flex-end" : "flex-start",
    bg: m.from === "bot" ? "#d9fdd3" : "#ffffff",
    radius: m.from === "bot" ? "8px 2px 8px 8px" : "2px 8px 8px 8px",
  }));

  const svcRevealOpacity = servicesVisible ? 1 : 0;
  const svcRevealTransform = servicesVisible ? "translateY(0)" : "translateY(48px)";
  const carouselTransform = `translateX(-${carouselX}px)`;

  // Desktop moves the track with carouselX; on smaller screens the carousel is a
  // native swipe/scroll container (see globals.css), so scroll it instead.
  function scrollServices(dir: -1 | 1) {
    const el = servicesRef.current;
    if (el && getComputedStyle(el).overflowX === "auto") {
      // Go to the start of the next/previous card (or the end of the track)
      const track = el.firstElementChild as HTMLElement | null;
      const cards = track ? (Array.from(track.children) as HTMLElement[]) : [];
      const max = el.scrollWidth - el.clientWidth;
      const first = cards[0]?.offsetLeft ?? 0;
      const stops = cards.map((c) => Math.min(c.offsetLeft - first, max));
      const cur = el.scrollLeft;
      const target =
        dir === 1
          ? stops.find((x) => x > cur + 1) ?? max
          : [...stops].reverse().find((x) => x < cur - 1) ?? 0;
      el.scrollTo({ left: target, behavior: "smooth" });
    } else {
      // Measure at click time so the limit is always right for the current width
      const track = el?.firstElementChild as HTMLElement | null;
      const max = el && track ? Math.max(0, track.scrollWidth - el.clientWidth) : carouselMax;
      setCarouselMax(max);
      // Stop at the start of a card (every 524px = card + gap), or at the end
      const stops: number[] = [];
      for (let x = 0; x < max; x += 524) stops.push(x);
      stops.push(max);
      setCarouselX((prev) =>
        dir === 1
          ? stops.find((x) => x > prev + 1) ?? max
          : [...stops].reverse().find((x) => x < prev - 1) ?? 0
      );
    }
  }

  function svcPanel(i: number) {
    const hover = svcImgHover[i];
    return {
      height: hover ? 225 : 46,
      bg: hover ? "rgba(255,255,255,.88)" : "rgba(255,255,255,.55)",
      overlay: hover ? "rgba(20,39,32,.48)" : "rgba(20,39,32,0)",
      enter: () =>
        setSvcImgHover((prev) => prev.map((v, idx) => (idx === i ? true : v))),
      leave: () =>
        setSvcImgHover((prev) => prev.map((v, idx) => (idx === i ? false : v))),
    };
  }

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

  const howOpacity = howVisible ? 1 : 0;
  const howTransform = howVisible ? "translateX(0)" : "translateX(70px)";

  const openMenuIndex = openMenu;
  const navMenus = NAV_DATA.map((menu, i) => ({
    label: menu.label[lang],
    open: openMenuIndex === i,
    chevronRotate: openMenuIndex === i ? "rotate(180deg)" : "rotate(0deg)",
    items: menu.items.map((it) => it[lang]),
    toggle: () => setOpenMenu(openMenuIndex === i ? null : i),
  }));

  const langEnBg = lang === "en" ? "#007a73" : "transparent";
  const langEnColor = lang === "en" ? "#ffffff" : "#5e6d64";
  const langEsBg = lang === "es" ? "#007a73" : "transparent";
  const langEsColor = lang === "es" ? "#ffffff" : "#5e6d64";

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

  const svcImages = [
    "/images/svc-marketing.jpg",
    "/images/svc-customer-service.png",
    "/images/svc-custom-automation.png",
    "/images/svc-ai-ready.png",
  ];
  const svcTitles = [t.svc1Title, t.svc2Title, t.svc3Title, t.svc4Title];
  const svcDescs = [t.svc1Desc, t.svc2Desc, t.svc3Desc, t.svc4Desc];
  const svcDelay = [0, 0, 800, 800];

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

  // ================= RENDER =================

  return (
    <div className="eb-root" style={{ width: "100%", boxSizing: "border-box" }}>
      {/* Announcement bar */}
      {showAnnouncement && (
        <div
          ref={annRef}
          className="eb-ann"
          style={{
            background: "#01c3cc",
            padding: "10px 80px",
            textAlign: "center",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          <span style={{ fontSize: 14, color: "#0b2027", fontWeight: 600 }}>
            <a
              href="mailto:hello@elevatebiz.ai?subject=Special%20programs%20inquiry"
              style={{ color: "#0b2027", textDecoration: "underline" }}
            >
              {t.annBold}
            </a>
            {t.annRest}
          </span>
          <button
            type="button"
            onClick={() => setShowAnnouncement(false)}
            aria-label={t.annClose}
            style={{
              position: "absolute",
              right: 24,
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              padding: "4px 6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: "#5e6d64",
            }}
          >
            <span className="eb-ann-close-text" style={{ fontSize: 13, fontWeight: 600 }}>{t.annClose}</span>
            <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>×</span>
          </button>
        </div>
      )}

      {/* Nav */}
      <div
        className={`eb-nav-wrap${scrolled ? "" : " eb-nav-float"}`}
        style={{
          position: "fixed",
          top: navWrapperTop,
          left: navWrapperSide,
          right: navWrapperSide,
          boxSizing: "border-box",
          zIndex: 1000,
          transition: "top 300ms ease, left 300ms ease, right 300ms ease",
        }}
      >
        <div
          className={`eb-nav-bar${scrolled ? " is-scrolled" : ""}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            background: navBarBackground,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(20,39,32,.06)",
            borderRadius: navBarRadius,
            padding: navBarPadding,
            boxShadow: navBarShadow,
            transition:
              "background 300ms ease, border-radius 300ms ease, box-shadow 300ms ease, padding 300ms ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <img src="/images/logo-icon.png" alt="" style={{ height: 34, width: "auto", display: "block" }} />
            <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 19, color: "#142720" }}>
              {BRAND_NAME}
            </span>
          </div>

          <div className="eb-nav-menus" style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "center" }}>
            {navMenus.map((menu, i) => (
              <div key={i} style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={menu.toggle}
                  aria-expanded={menu.open}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "transparent",
                    border: "none",
                    padding: "8px 12px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#142720",
                    cursor: "pointer",
                    borderRadius: 6,
                  }}
                >
                  <span>{menu.label}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#5e6d64"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transform: menu.chevronRotate, transition: "transform 200ms ease" }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {menu.open && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      marginTop: 6,
                      background: "#ffffff",
                      border: "1px solid rgba(20,39,32,.12)",
                      borderRadius: 10,
                      boxShadow: "0 12px 32px rgba(20,39,32,.16)",
                      padding: 8,
                      minWidth: 210,
                      zIndex: 40,
                    }}
                  >
                    {menu.items.map((text, j) => (
                      <a
                        key={j}
                        href="#"
                        style={{
                          display: "block",
                          padding: "9px 12px",
                          borderRadius: 6,
                          fontSize: 14.5,
                          color: "#142720",
                          textDecoration: "none",
                        }}
                      >
                        {text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(20,39,32,.06)",
                borderRadius: 999,
                padding: 3,
                gap: 2,
              }}
            >
              <button
                type="button"
                onClick={() => setLang("en")}
                style={{
                  padding: "5px 11px",
                  borderRadius: 999,
                  border: "none",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  background: langEnBg,
                  color: langEnColor,
                }}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("es")}
                style={{
                  padding: "5px 11px",
                  borderRadius: 999,
                  border: "none",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  background: langEsBg,
                  color: langEsColor,
                }}
              >
                ES
              </button>
            </div>
            <a
              href="tel:+16508005771"
              className="eb-nav-phone"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#142720",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
                whiteSpace: "nowrap",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007a73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
              </svg>
              +1 650 800 5771
            </a>
            <a
              href={BOOK_CALL_HREF}
              className="eb-nav-book"
              style={{
                background: "#007a73",
                color: "#ffffff",
                padding: "9px 20px",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
                whiteSpace: "nowrap",
                boxShadow: "0 4px 10px rgba(0,122,115,.28)",
              }}
            >
              {t.navBookCall}
            </a>
            <button
              type="button"
              className="eb-nav-burger"
              onClick={() => setMobileNavOpen((open) => !open)}
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileNavOpen}
              style={{
                background: "transparent",
                border: "none",
                padding: 6,
                cursor: "pointer",
                color: "#142720",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileNavOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu panel (only shown on small screens, see globals.css) */}
        {mobileNavOpen && (
          <div
            className="eb-mobile-panel"
            style={{
              marginTop: 8,
              background: "#ffffff",
              border: "1px solid rgba(20,39,32,.12)",
              borderRadius: 14,
              boxShadow: "0 12px 32px rgba(20,39,32,.16)",
              padding: 12,
              maxHeight: "calc(100vh - 140px)",
              overflowY: "auto",
            }}
          >
            {navMenus.map((menu, i) => (
              <div key={i} style={{ borderBottom: "1px solid rgba(20,39,32,.08)" }}>
                <button
                  type="button"
                  onClick={menu.toggle}
                  aria-expanded={menu.open}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "transparent",
                    border: "none",
                    padding: "12px 8px",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#142720",
                    cursor: "pointer",
                  }}
                >
                  <span>{menu.label}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5e6d64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: menu.chevronRotate, transition: "transform 200ms ease" }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {menu.open && (
                  <div style={{ padding: "0 0 8px 8px" }}>
                    {menu.items.map((text, j) => (
                      <a
                        key={j}
                        href="#"
                        onClick={() => setMobileNavOpen(false)}
                        style={{ display: "block", padding: "9px 8px", fontSize: 14.5, color: "#142720", textDecoration: "none" }}
                      >
                        {text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a
              href="tel:+16508005771"
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 8px", color: "#142720", textDecoration: "none", fontWeight: 600, fontSize: 15 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007a73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
              </svg>
              +1 650 800 5771
            </a>
            <a
              href={BOOK_CALL_HREF}
              style={{ display: "block", textAlign: "center", background: "#007a73", color: "#ffffff", padding: "12px 20px", borderRadius: 10, textDecoration: "none", fontWeight: 600, fontSize: 15 }}
            >
              {t.navBookCall}
            </a>
          </div>
        )}
      </div>

      {/* Hero */}
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

      {/* Trusted by marquee */}
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

      {/* Stats band */}
      <div ref={statsRef} className="eb-stats" style={{ background: "#1e3a5f", padding: "64px 80px", boxSizing: "border-box", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 48 }}>
        {statsDisplay.map((stat, i) => (
          <div key={i} style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 52, color: "#01c3cc", marginBottom: 8 }}>{stat.value}</div>
            <div style={{ fontSize: 15, color: "rgba(255,255,255,.78)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* See it in action (WhatsApp demo) */}
      <div id="see-it-in-action" className="eb-section eb-seeit" style={{ background: "#ffffff", padding: "100px 80px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 72, flexWrap: "wrap" }}>
        <div className="eb-col" style={{ flex: 1, minWidth: 320, maxWidth: 460 }}>
          <h2 className="eb-h2" style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 34, margin: "0 0 16px 0", color: "#142720" }}>{t.seeItTitle}</h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "#5e6d64", margin: "0 0 28px 0" }}>{t.seeItSubtitle}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[t.seeItCheck1, t.seeItCheck2, t.seeItCheck3].map((check, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#01c3cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M5 12l4 4 10-10" />
                </svg>
                <span style={{ fontSize: 16, color: "#142720" }}>{check}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="eb-col" style={{ flex: 1, minWidth: 320, display: "flex", justifyContent: "center" }}>
          <div className="eb-chat-card" style={{ width: 380, maxWidth: "100%", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 60px rgba(20,39,32,.18)", background: "#e5ddd5", transform: chatLagTransform }}>
            <div style={{ background: "#008069", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 19l-7-7 7-7" />
              </svg>
              <div style={{ width: 38, height: 38, borderRadius: 999, background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="8" width="16" height="12" rx="2" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2M9 13h.01M15 13h.01" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#ffffff", fontWeight: 600, fontSize: 16 }}>{t.waName}</div>
                <div style={{ color: "rgba(255,255,255,.8)", fontSize: 12.5 }}>{t.waOnline}</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 7l-7 5 7 5V7Z" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 16 }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
              </svg>
            </div>

            <div
              style={{
                backgroundColor: "#e5ddd5",
                backgroundImage: "radial-gradient(rgba(20,39,32,.06) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
                padding: 16,
                minHeight: 380,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                boxSizing: "border-box",
              }}
            >
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.justify as any, marginBottom: 8 }}>
                  <div style={{ background: msg.bg, padding: "7px 9px 6px", borderRadius: msg.radius, maxWidth: "78%", boxShadow: "0 1px 1px rgba(20,39,32,.12)" }}>
                    <div style={{ fontSize: 14.5, lineHeight: 1.35, color: "#111b21" }}>{msg.text}</div>
                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4, marginTop: 2 }}>
                      <span style={{ fontSize: 11, color: "#667781" }}>{msg.time}</span>
                      {msg.outgoing && (
                        <svg width="15" height="10" viewBox="0 0 16 11" fill="none">
                          <path d="M1 5.5L5 9.5L11 1.5" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M5.5 5.5L9.5 9.5L15.5 1.5" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {typing && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                  <div style={{ background: "#d9fdd3", padding: "10px 14px", borderRadius: "8px 2px 8px 8px", boxShadow: "0 1px 1px rgba(20,39,32,.12)", display: "flex", gap: 4, alignItems: "center" }}>
                    <div style={{ width: 6, height: 6, borderRadius: 999, background: "#667781" }} />
                    <div style={{ width: 6, height: 6, borderRadius: 999, background: "#667781" }} />
                    <div style={{ width: 6, height: 6, borderRadius: 999, background: "#667781" }} />
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: "#f0f0f0", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, boxSizing: "border-box" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
              </svg>
              <div style={{ flex: 1, background: "#ffffff", borderRadius: 20, padding: "9px 14px", fontSize: 14, color: "#8696a0" }}>{t.waMessagePlaceholder}</div>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: "#008069", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pain points */}
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

      {/* Services carousel */}
      <div className="eb-section" style={{ padding: "100px 80px", boxSizing: "border-box" }}>
        <h2 className="eb-h2" style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 34, margin: "0 0 56px 0", color: "#142720" }}>{t.servicesTitle}</h2>
        <div
          ref={servicesRef}
          className="eb-carousel"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            let dir = 0;
            if (pct < 0.22) dir = -1;
            else if (pct > 0.78) dir = 1;
            if (dir !== carouselDir) setCarouselDir(dir);
          }}
          onMouseLeave={() => setCarouselDir(0)}
          style={{ position: "relative", overflow: "hidden" }}
        >
          <div className="eb-carousel-track" style={{ display: "flex", gap: 64, transform: carouselTransform, transition: "transform 120ms linear" }}>
            {svcImages.map((src, i) => {
              const panel = svcPanel(i);
              return (
                <div
                  key={i}
                  className="eb-svc-card"
                  style={{
                    flex: "0 0 460px",
                    opacity: svcRevealOpacity,
                    transform: svcRevealTransform,
                    transition: `opacity 2200ms cubic-bezier(.16,.8,.4,1) ${svcDelay[i]}ms, transform 2200ms cubic-bezier(.16,.8,.4,1) ${svcDelay[i]}ms`,
                  }}
                >
                  <div
                    onMouseEnter={panel.enter}
                    onMouseLeave={panel.leave}
                    className="eb-svc-img"
                    style={{ position: "relative", overflow: "hidden", borderRadius: 16, height: 340, boxShadow: "0 10px 28px rgba(20,39,32,.16)" }}
                  >
                    <img src={src} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: panel.overlay, transition: "background 450ms ease", pointerEvents: "none" }} />
                    <div
                      className="eb-svc-panel"
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: panel.bg,
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        padding: "8px 24px 16px",
                        height: panel.height,
                        overflow: "hidden",
                        boxSizing: "border-box",
                        transition: "height 450ms cubic-bezier(.16,.8,.4,1), background 450ms ease",
                      }}
                    >
                      <h3 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 21, margin: 0, color: "#142720" }}>{svcTitles[i]}</h3>
                      <p style={{ margin: "12px 0 0 0", fontSize: 15.5, lineHeight: 1.55, color: "#142720" }}>{svcDescs[i]}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll buttons below the carousel */}
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 32 }}>
          <button type="button" onClick={() => scrollServices(-1)} aria-label="Scroll left" style={carouselNavButtonStyle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#142720" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button type="button" onClick={() => scrollServices(1)} aria-label="Scroll right" style={carouselNavButtonStyle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#142720" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* How it works */}
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

      {/* Lead routing diagram */}
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

      {/* FAQ */}
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

      {/* Testimonial */}
      <div className="eb-section" style={{ background: "#f3f6f3", padding: "100px 80px", boxSizing: "border-box" }}>
        <div className="eb-testimonial" style={{ display: "flex", gap: 40, alignItems: "center", maxWidth: 760 }}>
          <div style={{ width: 72, height: 72, borderRadius: 999, background: "#01c3cc33", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#007a73" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <p className="eb-testimonial-quote" style={{ margin: "0 0 16px 0", fontFamily: "Fraunces, serif", fontSize: 22, fontStyle: "italic", lineHeight: 1.5, color: "#142720" }}>{t.testimonialQuote}</p>
            <p style={{ margin: 0, fontSize: 15, color: "#5e6d64" }}>{t.testimonialName}</p>
          </div>
        </div>
      </div>

      {/* Newsletter / contact form */}
      <div className="eb-section" style={{ padding: "100px 80px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ textAlign: "center", margin: "0 0 40px 0" }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 28, margin: "0 0 12px 0", color: "#142720" }}>{t.newsletterTitle}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "#5e6d64", margin: 0 }}>{t.newsletterSubtitle}</p>
          </div>
          <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="contact-name" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#142720", marginBottom: 6 }}>{t.newsletterNameLabel}</label>
              <input id="contact-name" type="text" placeholder={t.newsletterNamePlaceholder} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="newsletter-email" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#142720", marginBottom: 6 }}>{t.newsletterLabel}</label>
              <input id="newsletter-email" type="email" placeholder="you@business.com" style={inputStyle} />
            </div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
              <input type="checkbox" style={{ width: 18, height: 18, marginTop: 1, flexShrink: 0, accentColor: "#007a73" }} />
              <span style={{ fontSize: 14.5, lineHeight: 1.5, color: "#5e6d64" }}>{t.newsletterCheckboxLabel}</span>
            </label>
            <div>
              <label htmlFor="contact-comments" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#142720", marginBottom: 6 }}>{t.newsletterCommentsLabel}</label>
              <textarea id="contact-comments" rows={4} placeholder={t.newsletterCommentsPlaceholder} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <button type="submit" style={{ background: "#007a73", color: "#ffffff", padding: "14px 26px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
              {t.newsletterButton}
            </button>
          </form>
        </div>
      </div>

      {/* CTA band */}
      <div className="eb-section" style={{ background: "#01c3cc", padding: "100px 80px", boxSizing: "border-box", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32 }}>
        <div style={{ maxWidth: 520 }}>
          <h2 className="eb-h2" style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 34, margin: "0 0 12px 0", color: "#0b2027" }}>{t.ctaTitle}</h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "#0b2027", opacity: 0.85, margin: 0, maxWidth: 480 }}>{t.ctaSubtitle}</p>
        </div>
        <a href={BOOK_CALL_HREF} style={{ background: "#007a73", color: "#ffffff", padding: "16px 32px", borderRadius: 8, fontWeight: 600, fontSize: 17, textDecoration: "none", display: "inline-block", whiteSpace: "nowrap" }}>
          {t.ctaButton}
        </a>
      </div>

      {/* Footer */}
      <div className="eb-footer" style={{ background: "#1e3a5f", padding: "64px 80px 48px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24, paddingBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: "#eef1f3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src="/images/logo-icon-v2.png" alt="" style={{ height: 20, width: "auto", display: "block" }} />
              </div>
              <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 19, color: "#ffffff" }}>{BRAND_NAME}</span>
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,.65)", maxWidth: 280 }}>{t.footerTagline}</div>
          </div>
          <a href={BOOK_CALL_HREF} style={{ background: "#01c3cc", color: "#0b2027", padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 15 }}>
            {t.footerBookCall}
          </a>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.15)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,.6)" }}>{t.footerCopyright}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <a href="https://www.instagram.com/elevatebiz.ai/" aria-label="Instagram" style={{ display: "flex", color: "rgba(255,255,255,.6)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook" style={{ display: "flex", color: "rgba(255,255,255,.6)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 8h-2a2 2 0 0 0-2 2v3H9v3h2v6h3v-6h2.2l.8-3H14v-2a1 1 0 0 1 1-1h2V8Z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" style={{ display: "flex", color: "rgba(255,255,255,.6)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <path d="M7 10v7M7 7v.01M11 17v-4.5a2.5 2.5 0 0 1 5 0V17M11 10v7" />
                </svg>
              </a>
              <a href="#" aria-label="X" style={{ display: "flex", color: "rgba(255,255,255,.6)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l16 16M20 4 4 20" />
                </svg>
              </a>
            </div>
            <a href="mailto:hello@elevatebiz.ai" style={{ fontSize: 14, color: "#01c3cc" }}>
              hello@elevatebiz.ai
            </a>
          </div>
        </div>
        <div style={{ textAlign: "center", paddingTop: 18 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#f5c518" }}>{t.footerDemoNotice}</span>
        </div>
      </div>

      {/* Preview-mode notice: closes with the button or a click outside the box */}
      {showPreviewNotice && (
        <div
          onClick={() => setShowPreviewNotice(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "rgba(20,39,32,.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            boxSizing: "border-box",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-describedby="preview-notice-text"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#ffffff",
              borderRadius: 16,
              maxWidth: 420,
              width: "100%",
              padding: "28px 28px 24px",
              boxSizing: "border-box",
              boxShadow: "0 24px 60px rgba(20,39,32,.25)",
              textAlign: "center",
            }}
          >
            <p id="preview-notice-text" style={{ margin: "0 0 22px 0", fontSize: 16, lineHeight: 1.55, color: "#142720" }}>
              {t.previewNotice}
            </p>
            <button
              type="button"
              onClick={() => setShowPreviewNotice(false)}
              autoFocus
              style={{ background: "#007a73", color: "#ffffff", border: "none", borderRadius: 8, padding: "12px 28px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}
            >
              {t.previewNoticeButton}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  border: "1px solid rgba(20,39,32,.25)",
  borderRadius: 8,
  fontSize: 15,
  color: "#142720",
  boxSizing: "border-box",
};

const carouselNavButtonStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 999,
  border: "1px solid rgba(20,39,32,.15)",
  background: "#ffffff",
  boxShadow: "0 4px 12px rgba(20,39,32,.12)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

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
