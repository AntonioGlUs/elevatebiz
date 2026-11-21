"use client";

import { useEffect, useState } from "react";
import BookingModal from "@/app/components/BookingModal";
import { BOOK_CALL_HREF } from "@/app/components/constants";
import styles from "./landing.module.css";

type Lang = "en" | "es";

// Path of the video file (for example "/videos/ready-to-scale.mp4"). While it is empty, the page shows a reserved space.
const VIDEO_SRC = "/videos/ready-to-scale.mp4";

const COPY = {
  en: {
    ribbon: "Free 45-minute call · No contract · Cancel anytime",
    audience: "Business owners:",
    title: "Build a business that runs without you.",
    lead: "Watch how we combine smart advertising, AI assistants and automation to bring you new clients and give you back your time.",
    videoSoon: "Video coming soon",
    book: "Book my free consultation",
    home: "Back to the home page",
  },
  es: {
    ribbon: "Llamada gratis de 45 minutos · Sin contrato · Cancela cuando quieras",
    audience: "Dueños de negocio:",
    title: "Construye un negocio que funcione sin ti.",
    lead: "Mira cómo combinamos publicidad inteligente, asistentes con IA y automatización para traerte nuevos clientes y devolverte tu tiempo.",
    videoSoon: "Video próximamente",
    book: "Agendar mi consulta gratis",
    home: "Volver al inicio",
  },
} as const;

export default function GetMoreClientsView() {
  const [lang, setLang] = useState<Lang>("en");
  const [bookOpen, setBookOpen] = useState(false);

  // Same language choice as the rest of the site
  useEffect(() => {
    try {
      const saved = localStorage.getItem("eb-lang");
      if (saved === "en" || saved === "es") setLang(saved);
      else if (navigator.language.toLowerCase().startsWith("es")) setLang("es");
    } catch {
      /* storage unavailable: keep English */
    }
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("eb-lang", lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const t = COPY[lang];
  // The button opens the booking calendar in a pop-up instead of leaving the page
  const openBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    setBookOpen(true);
  };

  return (
    <div className={styles.page}>
      <p className={styles.ribbon}>{t.ribbon}</p>

      {/* Only the logo and the language switch: no menu, so nothing pulls the visitor away from the video */}
      <header className={styles.top}>
        <a href={lang === "es" ? "/es/" : "/"} className={styles.brand} aria-label={t.home}>
          <img src="/images/logo-icon-v2.webp" alt="" width="34" height="34" />
          <span>ElevateBiz</span>
        </a>
        <div className={styles.langs} role="group" aria-label="Language">
          {(["en", "es"] as const).map((code) => (
            <button key={code} type="button" aria-pressed={lang === code} onClick={() => setLang(code)} className={lang === code ? styles.langOn : ""}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <main className={styles.main}>
        <p className={styles.audience}>{t.audience}</p>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.lead}>{t.lead}</p>

        <div className={styles.video}>
          {VIDEO_SRC ? (
            <video src={VIDEO_SRC} poster="/videos/ready-to-scale-poster.jpg" controls playsInline preload="metadata" />
          ) : (
            <div className={styles.videoEmpty}>
              <span className={styles.play} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
                  <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
                </svg>
              </span>
              <span>{t.videoSoon}</span>
            </div>
          )}
        </div>

        <a href={BOOK_CALL_HREF} onClick={openBooking} className={styles.btn}>
          {t.book}
        </a>
      </main>

      <BookingModal lang={lang} open={bookOpen} onClose={() => setBookOpen(false)} />
    </div>
  );
}
