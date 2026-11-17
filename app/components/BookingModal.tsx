"use client";

import { useEffect, useState } from "react";
import styles from "./BookingModal.module.css";
import { track } from "./analytics";
import { BOOKING_URL } from "./constants";

const CALENDAR_SRC = BOOKING_URL;

const LABELS = {
  es: { title: "Agenda tu llamada gratis", close: "Cerrar", loading: "Cargando calendario…" },
  en: { title: "Book your free call", close: "Close", loading: "Loading calendar…" },
};

type Props = {
  lang: "es" | "en";
  open: boolean; // set by any "Book a call" button of the page
  onClose: () => void;
};

// Pop-up with the GoHighLevel booking calendar, opened from every "Book a call" button.
export default function BookingModal({ lang, open, onClose }: Props) {
  const [loaded, setLoaded] = useState(false);
  const l = LABELS[lang] ?? LABELS.en;

  // The calendar is only loaded the first time the pop-up opens
  const [everOpened, setEverOpened] = useState(false);
  useEffect(() => {
    if (open) setEverOpened(true);
  }, [open]);

  // While it is up: the page behind does not scroll, and Escape closes it
  useEffect(() => {
    if (!open) return;
    track("booking_calendar_open", { language: lang });
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, lang]);

  if (!everOpened) return null;

  return (
    <div
      className={`${styles.overlay} ${open ? "" : styles.hidden}`}
      role="dialog"
      aria-modal="true"
      aria-label={l.title}
      aria-hidden={!open}
      data-lenis-prevent
      onClick={onClose}
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{l.title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label={l.close}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className={styles.body}>
          {!loaded && <p className={styles.loading}>{l.loading}</p>}
          <iframe
            src={CALENDAR_SRC}
            title={l.title}
            className={styles.frame}
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>
    </div>
  );
}
