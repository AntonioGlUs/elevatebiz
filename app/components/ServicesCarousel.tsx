"use client";

import { useEffect, useRef, useState } from "react";
import type { Texts } from "./types";
import styles from "./ServicesCarousel.module.css";

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
      hover,
      // Darken on mouse hover, or on touch screens once "See more" is open
      dark: hover || svcOpen[i],
      enter: () =>
        setSvcImgHover((prev) => prev.map((v, idx) => (idx === i ? true : v))),
      leave: () =>
        setSvcImgHover((prev) => prev.map((v, idx) => (idx === i ? false : v))),
    };
  }

  const svcImages = [
    "/images/svc-marketing.webp",
    "/images/svc-customer-service.webp",
    "/images/svc-custom-automation.webp",
    "/images/svc-ai-ready.webp",
  ];
  const svcTitles = [t.svc1Title, t.svc2Title, t.svc3Title, t.svc4Title];
  const svcDescs = [t.svc1Desc, t.svc2Desc, t.svc3Desc, t.svc4Desc];
  const svcDelay = [0, 0, 800, 800];

  return (
    <div className={`eb-section ${styles.section}`}>
      <h2 className={`eb-h2 ${styles.title}`}>{t.servicesTitle}</h2>
      <div
        ref={servicesRef}
        className={`eb-carousel ${styles.carousel}`}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          let dir = 0;
          if (pct < 0.22) dir = -1;
          else if (pct > 0.78) dir = 1;
          if (dir !== carouselDir) setCarouselDir(dir);
        }}
        onMouseLeave={() => setCarouselDir(0)}
      >
        <div className={`eb-carousel-track ${styles.track}`} style={{ transform: carouselTransform }}>
          {svcImages.map((src, i) => {
            const panel = svcPanel(i);
            return (
              <div
                key={i}
                className={`eb-svc-card ${styles.card} ${servicesVisible ? styles.cardVisible : ""}`}
                style={{ transitionDelay: `${svcDelay[i]}ms` }}
              >
                <div
                  // Hover only with a real mouse; touch screens use "See more" instead
                  onPointerEnter={(e) => e.pointerType === "mouse" && !window.matchMedia("(hover: none)").matches && panel.enter()}
                  onPointerLeave={panel.leave}
                  className={`eb-svc-img ${styles.image}`}
                >
                  <img src={src} alt="" loading="lazy" className={styles.img} />
                  <div className={`${styles.shade} ${panel.dark ? styles.shadeDark : ""}`} />
                  <div
                    className={`eb-svc-panel${svcOpen[i] ? " is-open" : ""} ${styles.panel} ${panel.hover ? styles.panelHover : ""}`}
                    // Touch screens: tapping anywhere on the panel opens/closes the description
                    onClick={() => {
                      if (!window.matchMedia("(hover: none)").matches) return;
                      setSvcOpen((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
                    }}
                  >
                    <h3 className={styles.cardTitle}>{svcTitles[i]}</h3>
                    <p className={`eb-svc-desc ${styles.desc}`}>{svcDescs[i]}</p>
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
      <div className={styles.nav}>
        <button type="button" onClick={() => scrollServices(-1)} aria-label="Scroll left" className={styles.navButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#142720" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button type="button" onClick={() => scrollServices(1)} aria-label="Scroll right" className={styles.navButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#142720" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
