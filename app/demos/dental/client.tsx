"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./dental.module.css";
import { Person } from "./art";
import { BookButton } from "./booking";
import { CLINIC_NAME, CONTACT, MENU, SLIDES } from "./data";

// Fades and slides its children in the first time they scroll into view.
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${shown ? styles.revealed : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Five gold stars that pop in one by one once visible.
export function Stars() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={styles.stars} aria-label="Five star rating">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`${styles.star} ${shown ? styles.starShown : ""}`}
          style={{ transitionDelay: `${i * 120}ms` }}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

// Fixed header: transparent over the hero, white once scrolled; hamburger opens a side panel.
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <div className={styles.logos}>
          <a href="#top" className={styles.logoCircle} aria-label={CLINIC_NAME}>
            <span className={styles.logoBig}>DENTAL</span>
            <span className={styles.logoSmall}>CLINIC</span>
          </a>
          <a href="#top" className={styles.logoCircle} aria-label={`${CLINIC_NAME} Kids`}>
            <span className={styles.logoSmall}>DENTAL</span>
            <span className={styles.logoKids}>Kids</span>
          </a>
        </div>
        <div className={styles.headerActions}>
          <a href={`tel:${CONTACT.phone}`} className={styles.pill}>
            Call
          </a>
          <BookButton className={styles.pill}>Book</BookButton>
          <button
            type="button"
            className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`} onClick={() => setOpen(false)} />
      <nav className={`${styles.panel} ${open ? styles.panelOpen : ""}`} aria-label="Main menu" aria-hidden={!open}>
        {MENU.map((group) => (
          <div key={group.heading} className={styles.panelGroup}>
            <h3>{group.heading}</h3>
            {group.links.map((link) => (
              <a key={link} href="#services" onClick={() => setOpen(false)}>
                {link}
              </a>
            ))}
          </div>
        ))}
      </nav>
    </>
  );
}

// Illustrated "photo" carousel with a round arrow button.
export function Carousel() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselPanel} style={{ background: slide.tone }} key={index}>
        <Person skin={slide.skin} hair={slide.hair} scrubs="#2f4858" className={styles.carouselPerson} />
        <p className={styles.carouselCaption}>{slide.caption}</p>
      </div>
      <button
        type="button"
        className={styles.arrow}
        onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
        aria-label="Next slide"
      >
        ›
      </button>
    </div>
  );
}
