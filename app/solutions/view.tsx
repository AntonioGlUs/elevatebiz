"use client";

import { useEffect, useState } from "react";
import BookingModal from "@/app/components/BookingModal";
import { BOOK_CALL_HREF } from "@/app/components/constants";
import type { Lang, Solution } from "./data";
import styles from "./solution.module.css";

// Text shared by every solution page (the industry-specific text lives in ./data.ts)
const COPY = {
  en: {
    book: "Book free consultation",
    bookShort: "Book a call",
    how: "See how it works",
    back: "ElevateBiz",
    beforeAfter: "Before and after",
    without: "Without ElevateBiz",
    with: "With ElevateBiz",
    howTitle: "How it works",
    steps: [
      { t: "Your assistant answers", d: "Calls, messages and emails get an instant reply, day or night." },
      { t: "It qualifies and organizes", d: "It asks the right questions and records each contact, with its history, in one system." },
      { t: "It books and follows up", d: "It schedules the appointment or visit, confirms it, sends reminders and follows up afterwards." },
    ],
    marketingTitle: "Ads and email marketing, in the same system",
    marketing: [
      {
        t: "Ads that feed the system",
        d: "Your Facebook, Instagram and Google ads connect to the assistant. Every person who responds gets an instant reply and is recorded with its source.",
        points: ["Instant reply to every ad lead", "Each contact tagged with the ad it came from", "Reports that show which ads bring real customers"],
      },
      {
        t: "Email and message marketing",
        d: "Campaigns and automatic sequences by email and by message (WhatsApp and text), for new and past contacts.",
        points: ["Welcome and follow-up sequences", "Reactivation of contacts who went quiet", "Promotions, reminders and newsletters"],
      },
    ],
    channelsTitle: "Every channel, one assistant",
    channels: [
      { t: "Phone calls", d: "A natural voice that answers, qualifies and books." },
      { t: "WhatsApp and text", d: "Instant replies to questions, in the customer's language." },
      { t: "Website chat", d: "Turns visitors into booked appointments." },
      { t: "Email", d: "Automatic replies and follow-up sequences." },
    ],
    benefitsTitle: "How it helps",
    useCasesTitle: "What it does day to day",
    faqTitle: "Frequently asked questions",
    ctaTitle: "Ready to see it working in your business?",
    ctaText: "In a free consultation we review how you work today and show you where the assistant helps most.",
    noContract: "No contract · Cancel anytime*",
    note: "* Limited-time offer, for the launch only: no contract and cancel anytime.",
    home: "Back to the home page",
  },
  es: {
    book: "Agendar consulta gratis",
    bookShort: "Agenda una llamada",
    how: "Ver cómo funciona",
    back: "ElevateBiz",
    beforeAfter: "Antes y después",
    without: "Sin ElevateBiz",
    with: "Con ElevateBiz",
    howTitle: "Cómo funciona",
    steps: [
      { t: "Tu asistente contesta", d: "Llamadas, mensajes y correos reciben respuesta al instante, de día o de noche." },
      { t: "Califica y ordena", d: "Hace las preguntas correctas y registra cada contacto, con su historial, en un solo sistema." },
      { t: "Agenda y da seguimiento", d: "Programa la cita o visita, la confirma, envía recordatorios y da seguimiento después." },
    ],
    marketingTitle: "Anuncios y email marketing, en el mismo sistema",
    marketing: [
      {
        t: "Anuncios que alimentan el sistema",
        d: "Tus anuncios de Facebook, Instagram y Google se conectan al asistente. Cada persona que responde recibe respuesta al instante y queda registrada con su origen.",
        points: ["Respuesta inmediata a cada prospecto de anuncios", "Cada contacto marcado con el anuncio del que vino", "Reportes que muestran qué anuncios traen clientes reales"],
      },
      {
        t: "Email y mensajes de marketing",
        d: "Campañas y secuencias automáticas por correo y por mensajes (WhatsApp y texto), para contactos nuevos y anteriores.",
        points: ["Secuencias de bienvenida y de seguimiento", "Reactivación de contactos que dejaron de responder", "Promociones, recordatorios y boletines"],
      },
    ],
    channelsTitle: "Todos los canales, un solo asistente",
    channels: [
      { t: "Llamadas", d: "Una voz natural que contesta, califica y agenda." },
      { t: "WhatsApp y mensajes", d: "Respuestas inmediatas, en el idioma del cliente." },
      { t: "Chat de tu sitio web", d: "Convierte visitantes en citas agendadas." },
      { t: "Correo", d: "Respuestas automáticas y secuencias de seguimiento." },
    ],
    benefitsTitle: "Cómo te ayuda",
    useCasesTitle: "Qué hace en el día a día",
    faqTitle: "Preguntas frecuentes",
    ctaTitle: "¿Listo para verlo funcionando en tu negocio?",
    ctaText: "En una consulta gratuita revisamos cómo trabajas hoy y te mostramos dónde te ayuda más el asistente.",
    noContract: "Sin contrato · Cancela cuando quieras*",
    note: "* Oferta por tiempo limitado, solo por lanzamiento: sin contrato y cancelas cuando quieras.",
    home: "Volver al inicio",
  },
} as const;

export default function SolutionView({ solution }: { solution: Solution }) {
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
    document.title = `${solution.name[lang]} | ElevateBiz`;
  }, [lang, solution]);

  const t = COPY[lang];
  const openBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    setBookOpen(true);
  };

  return (
    <div className={styles.page}>
      <header className={styles.bar}>
        <a href="/" className={styles.brand}>
          <img src="/images/logo-icon-v2.webp" alt="" width="36" height="36" />
          <span>ElevateBiz</span>
        </a>
        <div className={styles.barRight}>
          <div className={styles.langs} role="group" aria-label="Language">
            {(["en", "es"] as const).map((code) => (
              <button key={code} type="button" aria-pressed={lang === code} onClick={() => setLang(code)} className={lang === code ? styles.langOn : ""}>
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <a href={BOOK_CALL_HREF} onClick={openBooking} className={styles.barBook}>
            {t.bookShort}
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <p className={styles.kicker}>{solution.name[lang]}</p>
          <h1>{solution.title[lang]}</h1>
          <p className={styles.lead}>{solution.subtitle[lang]}</p>
          <div className={styles.actions}>
            <a href={BOOK_CALL_HREF} onClick={openBooking} className={styles.btn}>
              {t.book}
            </a>
            <a href="#how" className={styles.btnGhost}>
              {t.how}
            </a>
          </div>
          <p className={styles.assure}>
            <a href="#launch-note">{t.noContract}</a>
          </p>
        </section>

        {/* The problem */}
        <section className={styles.problem}>
          <h2>{solution.problemTitle[lang]}</h2>
          <p>{solution.problemText[lang]}</p>
        </section>

        {/* Before and after */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t.beforeAfter}</h2>
          <div className={styles.compare}>
            <div className={styles.without}>
              <h3>{t.without}</h3>
              <ul>
                {solution.before.map((item, i) => (
                  <li key={i}>
                    <span aria-hidden="true">✕</span>
                    {item[lang]}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.with}>
              <h3>{t.with}</h3>
              <ul>
                {solution.after.map((item, i) => (
                  <li key={i}>
                    <span aria-hidden="true">✓</span>
                    {item[lang]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className={styles.section}>
          <h2 className={styles.h2}>{t.howTitle}</h2>
          <ol className={styles.steps}>
            {t.steps.map((shared, i) => {
              // The last step can be worded for the business (a store sells, a restaurant takes reservations)
              const step = i === t.steps.length - 1 && solution.lastStep ? { t: solution.lastStep.t[lang], d: solution.lastStep.d[lang] } : shared;
              return (
              <li key={i}>
                <span className={styles.stepNum}>{i + 1}</span>
                <h3>{step.t}</h3>
                <p>{step.d}</p>
              </li>
              );
            })}
          </ol>
        </section>

        {/* How it helps in this business */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t.benefitsTitle}</h2>
          <div className={styles.benefits}>
            {solution.benefits.map((b, i) => (
              <article key={i}>
                <h3>{b.title[lang]}</h3>
                <p>{b.text[lang]}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Ads and email marketing (hidden where it does not apply, like HR) */}
        {!solution.hideMarketing && (
        <section className={styles.section}>
          <h2 className={styles.h2}>{t.marketingTitle}</h2>
          <div className={styles.marketing}>
            {t.marketing.map((m, i) => (
              <article key={i}>
                <h3>{m.t}</h3>
                <p>{m.d}</p>
                <ul>
                  {m.points.map((point, j) => (
                    <li key={j}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
        )}

        {/* Channels */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t.channelsTitle}</h2>
          <div className={styles.channels}>
            {t.channels.map((c, i) => (
              <div key={i}>
                <h3>{c.t}</h3>
                {/* The website chat line can be worded for the business */}
                <p>{i === 2 && solution.chatLine ? solution.chatLine[lang] : c.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Use cases */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t.useCasesTitle}</h2>
          <ul className={styles.useCases}>
            {solution.useCases.map((u, i) => (
              <li key={i}>{u[lang]}</li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{t.faqTitle}</h2>
          <div className={styles.faq}>
            {solution.faqs.map((f, i) => (
              <details key={i}>
                <summary>{f.q[lang]}</summary>
                <p>{f.a[lang]}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Closing call to action */}
        <section className={styles.cta}>
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaText}</p>
          <a href={BOOK_CALL_HREF} onClick={openBooking} className={styles.btn}>
            {t.book}
          </a>
          <p className={styles.assure}>
            <a href="#launch-note">{t.noContract}</a>
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <p id="launch-note" className={styles.note}>
          {t.note}
        </p>
        <div className={styles.footerRow}>
          <span>© 2026 ElevateBiz</span>
          <a href="/">{t.home}</a>
        </div>
      </footer>

      <BookingModal lang={lang} open={bookOpen} onClose={() => setBookOpen(false)} />
    </div>
  );
}
