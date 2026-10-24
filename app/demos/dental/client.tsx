"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./dental.module.css";
import { BookButton } from "./booking";
import { CLINIC_NAME, CONTACT, MENU, PHOTOS, SERVICE_MENU, SLIDES } from "./data";

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
            <span className={styles.logoBig}>RD</span>
            <span className={styles.logoSmall}>DENTAL</span>
          </a>
          <a href="#top" className={styles.logoCircle} aria-label={`${CLINIC_NAME} Kids`}>
            <span className={styles.logoBig}>RD</span>
            <span className={styles.logoKids}>Kids</span>
          </a>
        </div>
        <nav className={styles.headerNav} aria-label="Sections">
          <a href="#services">Services</a>
          <a href="#reviews">Reviews</a>
          <a href="#team">Team</a>
          <a href="#book">Contact</a>
        </nav>
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

// Photo carousel with a round arrow button.
export function Carousel() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselPanel} style={{ background: slide.tone }} key={index}>
        <img src={slide.photo} alt={slide.alt} width={1448} height={1086} className={styles.carouselPerson} style={{ objectPosition: slide.pos }} />
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

const TOOTH =
  "M6.8 3.6C4.8 3.6 3.5 5.2 3.5 7.4c0 1.9.8 3.2 1.4 5 .6 1.9.7 7.6 2.7 7.6 1.7 0 1.5-4.5 4.4-4.5s2.7 4.5 4.4 4.5c2 0 2.1-5.7 2.7-7.6.6-1.8 1.4-3.1 1.4-5 0-2.2-1.3-3.8-3.3-3.8-1.6 0-2.6.8-5.2.8S8.4 3.6 6.8 3.6Z";

function ServiceIcon({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === "aligners" ? (
        <>
          <path d="M2.5 12c0-3.6 4.2-5.5 9.5-5.5s9.5 1.9 9.5 5.5c0 4-4.6 6-9.5 6s-9.5-2-9.5-6Z" />
          <path d="M7 10.2v5M10 9.4v6.4M14 9.4v6.4M17 10.2v5" />
        </>
      ) : (
        <>
          <path d={TOOTH} />
          {kind === "kids" ? (
            <>
              <path d="M9.6 8.6v.01M14.4 8.6v.01M10 10.8c.5.5 1.2.8 2 .8s1.5-.3 2-.8" />
              <path d="M12 0.8v1.2M8.6 1.8l.7.9M15.4 1.8l-.7.9" />
            </>
          ) : (
            <path d="M19.5 1.5v3.4M17.8 3.2h3.4" />
          )}
        </>
      )}
    </svg>
  );
}

const ARROW = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

// Services list on the left; hovering (or focusing) a row changes the photo on the right.
export function ServicesMenu() {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.menuLayout}>
      <div>
        <ul className={styles.menuList}>
          {SERVICE_MENU.map((s, i) => (
            <li key={s.name} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
              <BookButton className={`${styles.menuRow} ${active === i ? styles.menuRowActive : ""}`}>
                <span className={styles.menuNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.menuIcon}>
                  <ServiceIcon kind={s.icon} />
                </span>
                <span className={styles.menuText}>
                  <strong>{s.name}</strong>
                  <span>{s.text}</span>
                </span>
                <span className={styles.menuArrow}>{ARROW}</span>
              </BookButton>
            </li>
          ))}
        </ul>
        <BookButton className={styles.menuBook}>
          Book Appointment
          {ARROW}
        </BookButton>
      </div>

      <div>
        <div className={styles.menuPhoto}>
          {SERVICE_MENU.map((s, i) => (
            <div key={s.name} className={`${styles.menuSlide} ${active === i ? styles.menuSlideShown : ""}`}>
              <img
                src={s.photo}
                alt={s.alt}
                aria-hidden={active !== i}
                width={768}
                height={512}
                loading={i === 0 ? "eager" : "lazy"}
                className={styles.menuImg}
              />
              {!s.labeled && (
                <span className={`${styles.menuLabel} ${s.cover ? styles.menuLabelCover : ""}`} aria-hidden="true">
                  <span className={styles.menuLabelNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.menuLabelText}>{s.name}</span>
                </span>
              )}
            </div>
          ))}
        </div>
        <a href="#reviews" className={`${styles.watch} ${styles.menuWatch}`}>
          <span className={styles.watchText}>
            What to expect at your exam &amp; cleaning
            <small>Watch now.</small>
          </span>
          <img src={PHOTOS.pediatricMan} alt="" width={64} height={64} loading="lazy" className={styles.watchThumb} />
        </a>
      </div>
    </div>
  );
}
