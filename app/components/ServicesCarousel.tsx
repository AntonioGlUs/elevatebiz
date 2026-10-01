"use client";

import { useEffect, useRef, useState } from "react";
import type { Texts } from "./types";

export default function ServicesCarousel({ t }: { t: Texts }) {
  const [servicesVisible, setServicesVisible] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const [carouselX, setCarouselX] = useState(0);
  const [carouselDir, setCarouselDir] = useState(0);
  // How far the track can move depends on the screen width; measured below
  const [carouselMax, setCarouselMax] = useState(752);
  const [svcImgHover, setSvcImgHover] = useState([false, false, false, false]);
  // Touch screens have no hover: "See more" opens each description
  const [svcOpen, setSvcOpen] = useState([false, false, false, false]);

  // Reveal the cards when the carousel scrolls into view
  useEffect(() => {
    function onScroll() {
      if (!servicesVisible && servicesRef.current) {
        const rect = servicesRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.78) setServicesVisible(true);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [servicesVisible]);

  // Auto-scroll while hovering the left/right zones
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

  // Measure the scroll limit (track width - visible width)
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
    // Darken on mouse hover, or on touch screens once "See more" is open
    const dark = hover || svcOpen[i];
    return {
      height: hover ? 170 : 46,
      bg: hover ? "rgba(255,255,255,.88)" : "rgba(255,255,255,.55)",
      overlay: dark ? "rgba(20,39,32,.48)" : "rgba(20,39,32,0)",
      enter: () =>
        setSvcImgHover((prev) => prev.map((v, idx) => (idx === i ? true : v))),
      leave: () =>
        setSvcImgHover((prev) => prev.map((v, idx) => (idx === i ? false : v))),
    };
  }

  const svcImages = [
    "/images/svc-marketing.jpg",
    "/images/svc-customer-service.png",
    "/images/svc-custom-automation.png",
    "/images/svc-ai-ready.png",
  ];
  const svcTitles = [t.svc1Title, t.svc2Title, t.svc3Title, t.svc4Title];
  const svcDescs = [t.svc1Desc, t.svc2Desc, t.svc3Desc, t.svc4Desc];
  const svcDelay = [0, 0, 800, 800];

  return (
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
                  // Hover only with a real mouse; touch screens use "See more" instead
                  onPointerEnter={(e) => e.pointerType === "mouse" && !window.matchMedia("(hover: none)").matches && panel.enter()}
                  onPointerLeave={panel.leave}
                  className="eb-svc-img"
                  style={{ position: "relative", overflow: "hidden", borderRadius: 16, height: 340, boxShadow: "0 10px 28px rgba(20,39,32,.16)" }}
                >
                  <img src={src} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: panel.overlay, transition: "background 450ms ease", pointerEvents: "none" }} />
                  <div
                    className={svcOpen[i] ? "eb-svc-panel is-open" : "eb-svc-panel"}
                    // Touch screens: tapping anywhere on the panel opens/closes the description
                    onClick={() => {
                      if (!window.matchMedia("(hover: none)").matches) return;
                      setSvcOpen((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
                    }}
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
                    <p className="eb-svc-desc" style={{ margin: "12px 0 0 0", fontSize: 15.5, lineHeight: 1.55, color: "#142720" }}>{svcDescs[i]}</p>
                    <button type="button" className="eb-svc-more">
                      {svcOpen[i] ? t.svcLess : t.svcMore}
                    </button>
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
  );
}

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
