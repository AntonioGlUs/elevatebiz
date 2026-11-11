"use client";

import { useEffect, useRef, useState } from "react";
import { COMING_SOON_HREF } from "./constants";
import type { Texts } from "./types";
import styles from "./ServicesCarousel.module.css";

const SERVICE_PHOTOS = [
  { src: "/images/svc-marketing.webp", pos: "56% 50%" },
  { src: "/images/svc-customer-service.webp", pos: "62% 40%" },
  { src: "/images/svc-custom-automation.webp", pos: "50% 50%" },
  { src: "/images/svc-ai-ready.webp", pos: "50% 50%" },
  { src: "/images/svc-bookings.webp", pos: "68% 50%" },
];

// Curved 3D carousel: every card is narrow and vertical; the card in the middle is flat, and it widens when the mouse is over it.
export default function ServicesCarousel({ t }: { t: Texts }) {
  // The card in the middle; it starts on the central one of the list (the third of five)
  const [active, setActive] = useState(Math.floor(SERVICE_PHOTOS.length / 2));
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  // Which card the mouse is resting on. "See more" only shows for the card in the middle, and only once the
  // visitor has settled on it: hovering is ignored while the carousel is still moving.
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const lastMove = useRef(0);
  const SETTLE_MS = 1300;

  // True right after a swipe/drag, so the end of the swipe is not taken as a click on the link
  const justDragged = useRef(false);
  // -1 / 1 while the mouse is over the cards on the left / right of the one in the middle, 0 otherwise
  const [edgeDir, setEdgeDir] = useState<-1 | 0 | 1>(0);
  // After clicking a side card the carousel must not keep sliding just because the mouse is still over the side cards;
  // it is unlocked when the mouse comes back to the card in the middle or leaves the carousel
  const edgeLocked = useRef(false);

  // Same order as SERVICE_PHOTOS
  const titles = [t.svc1Title, t.svc2Title, t.svc3Title, t.svc4Title, t.svc5Title];
  const descs = [t.svc1Desc, t.svc2Desc, t.svc3Desc, t.svc4Desc, t.svc5Desc];
  const last = SERVICE_PHOTOS.length - 1;

  function go(next: number) {
    setActive(Math.max(0, Math.min(last, next)));
  }

  // Every time the carousel moves, forget the hover: the visitor has to hover again once the card has arrived
  useEffect(() => {
    lastMove.current = performance.now();
    setHoverIdx(null);
  }, [active]);

  function hoverCard(e: React.PointerEvent, i: number) {
    if (e.pointerType !== "mouse") return;
    if (i !== active) return; // only the card in the middle reacts to the mouse; the others just wait to be clicked
    if (performance.now() - lastMove.current < SETTLE_MS) return;
    setHoverIdx(i);
  }

  // Fade the carousel in when it scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Hovering the cards beside the middle one moves the carousel one card at a time, again and again while the mouse stays there
  useEffect(() => {
    if (edgeDir === 0) return;
    const move = () => setActive((a) => Math.max(0, Math.min(last, a + edgeDir)));
    const first = setTimeout(move, 450);
    const repeat = setInterval(move, 1700);
    return () => {
      clearTimeout(first);
      clearInterval(repeat);
    };
  }, [edgeDir, last]);

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || dragStart.current !== null) return;
    // Everything to the left / right of the card in the middle counts: the side cards and the space around them
    const mid = e.currentTarget.querySelector<HTMLElement>('[data-active="true"]')?.getBoundingClientRect();
    let dir: -1 | 0 | 1 = 0;
    if (mid) dir = e.clientX < mid.left - 12 ? -1 : e.clientX > mid.right + 12 ? 1 : 0;
    if (dir === 0) edgeLocked.current = false;
    else if (edgeLocked.current) dir = 0;
    if (dir !== edgeDir) setEdgeDir(dir);
  }

  // Arrow keys when the carousel has focus
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") go(active - 1);
    if (e.key === "ArrowRight") go(active + 1);
  }

  // Swipe / drag with mouse or finger
  function onPointerDown(e: React.PointerEvent) {
    dragStart.current = e.clientX;
  }
  function onPointerUp(e: React.PointerEvent) {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    dragStart.current = null;
    justDragged.current = Math.abs(dx) > 8;
    if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
  }

  return (
    <div className={`eb-section ${styles.section}`}>
      <h2 className={`eb-h2 ${styles.title}`}>{t.servicesTitle}</h2>

      <div
        ref={sectionRef}
        className={`${styles.stage} ${hoverIdx === active ? styles.stageWide : ""} ${visible ? styles.stageVisible : ""}`}
        role="group"
        aria-roledescription="carousel"
        aria-label={t.servicesTitle}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (dragStart.current = null)}
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          setEdgeDir(0);
          edgeLocked.current = false;
        }}
        style={{ cursor: edgeDir === -1 ? "w-resize" : edgeDir === 1 ? "e-resize" : undefined }}
      >
        {SERVICE_PHOTOS.map((photo, i) => {
          const d = i - active; // 0 = in the middle, negative = left, positive = right
          const abs = Math.abs(d);
          return (
            <div
              key={i}
              role="group"
              className={`${styles.slide} ${d === 0 ? styles.slideActive : ""} ${d === 0 && hoverIdx === i ? `${styles.slideWide} ${styles.slideLifted}` : ""}`}
              onPointerEnter={(e) => hoverCard(e, i)}
              onPointerMove={(e) => hoverCard(e, i)}
              onPointerLeave={() => setHoverIdx(null)}
              style={{
                transform: `translateX(calc(-50% + ${d} * var(--step))) translateZ(${-abs * 90}px) rotateY(${d * -36}deg) scale(${d === 0 ? 1 : 1 - abs * 0.1})`,
                zIndex: 10 - abs,
                opacity: abs > 2 ? 0 : 1,
                filter: d === 0 ? "none" : `brightness(${1 - abs * 0.06})`,
              }}
              data-active={d === 0 ? "true" : undefined}
              onClick={() => {
                if (d === 0) return;
                edgeLocked.current = true;
                setEdgeDir(0);
                go(i);
              }}
              aria-label={titles[i]}
              aria-current={d === 0}
            >
              <img
                src={photo.src}
                alt=""
                loading="lazy"
                draggable={false}
                className={styles.img}
                style={{ objectPosition: photo.pos }}
              />
              {/* Only the card in the middle: after the zoom the photo darkens and invites to open the details page */}
              {d === 0 && (
                <a
                  href={COMING_SOON_HREF}
                  target="_blank"
                  rel="noopener"
                  draggable={false}
                  className={styles.overlay}
                  onClick={(e) => {
                    if (justDragged.current) {
                      e.preventDefault();
                      justDragged.current = false;
                    }
                  }}
                >
                  <span className={styles.overlayText}>
                    {t.svcMore}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </span>
                  <span className={styles.srOnly}>: {titles[i]} (opens in a new tab)</span>
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Title and description of the active card: also a link to its details page, clickable at any time */}
      <div className={styles.info} aria-live="polite">
        <a href={COMING_SOON_HREF} target="_blank" rel="noopener" className={styles.infoLink}>
          <h3 key={active} className={styles.cardTitle}>
            {titles[active]}
            <svg className={styles.titleArrow} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </h3>
          <p key={`d${active}`} className={styles.desc}>
            {descs[active]}
          </p>
        </a>
      </div>

      <div className={styles.nav}>
        <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous" className={styles.navButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#142720" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className={styles.dots} aria-hidden="true">
          {SERVICE_PHOTOS.map((_, i) => (
            <span key={i} className={`${styles.dot} ${i === active ? styles.dotActive : ""}`} />
          ))}
        </div>
        <button type="button" onClick={() => go(active + 1)} disabled={active === last} aria-label="Next" className={styles.navButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#142720" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
