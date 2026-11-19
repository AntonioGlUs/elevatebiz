"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/content";
import { BOOKING_URL } from "@/app/components/constants";
import BookingModal from "@/app/components/BookingModal";
import styles from "./links.module.css";

type IconName = "calendar" | "laptop" | "instagram" | "user";

const ICONS: Record<IconName, React.ReactNode> = {
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="3" />
      <path d="M8 2.5v4M16 2.5v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01" />
    </>
  ),
  laptop: (
    <>
      <rect x="4.5" y="5" width="15" height="11" rx="1.8" />
      <path d="M2.5 19.5h19" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.2 6.8h.01" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5" />
    </>
  ),
};

function Icon({ name }: { name: IconName }) {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke={name === "instagram" ? "url(#igGrad)" : "currentColor"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

// Page reached by scanning the NFC wristband: a small link hub (like a Linktree).
const COPY: Record<Lang, { tagline: string; links: { label: string; hint: string; href: string; icon: IconName; primary?: boolean; download?: boolean }[] }> = {
  en: {
    tagline: "AI automation and marketing for small and medium businesses.",
    links: [
      { label: "Book a free call", icon: "calendar", hint: "Let's talk about your business", href: BOOKING_URL, primary: true },
      { label: "Visit our website", icon: "laptop", hint: "elevatebiz.ai", href: "https://elevatebiz.ai" },
      { label: "Save contact", icon: "user", hint: "Add ElevateBiz to your phone", href: "/elevatebiz.vcf", download: true },
    ],
  },
  es: {
    tagline: "Automatización con IA y marketing para pequeñas y medianas empresas.",
    links: [
      { label: "Agenda una llamada gratis", icon: "calendar", hint: "Hablemos de tu negocio", href: BOOKING_URL, primary: true },
      { label: "Visita nuestro sitio", icon: "laptop", hint: "elevatebiz.ai", href: "https://elevatebiz.ai" },
      { label: "Guardar contacto", icon: "user", hint: "Agrega ElevateBiz a tu teléfono", href: "/elevatebiz.vcf", download: true },
    ],
  },
};

export default function LinksPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [soon, setSoon] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("eb-lang");
    if (saved === "en" || saved === "es") setLang(saved);
    else if (navigator.language.toLowerCase().startsWith("es")) setLang("es");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("eb-lang", lang);
  }, [lang]);

  // The small "coming soon" bubble over the Facebook icon hides by itself after 3 seconds, or earlier when the visitor taps anywhere else (or presses Escape)
  useEffect(() => {
    if (!soon) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest("[data-fb]")) setSoon(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSoon(false);
    };
    const timer = window.setTimeout(() => setSoon(false), 3000);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [soon]);

  const t = COPY[lang];

  return (
    <main className={styles.page}>
      <svg className={styles.waves} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="igGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#feb040" />
            <stop offset="0.45" stopColor="#e8336d" />
            <stop offset="1" stopColor="#8b3df0" />
          </linearGradient>
          <linearGradient id="wCyan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8fe3f5" stopOpacity="0.75" />
            <stop offset="1" stopColor="#c7f1fb" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="wLilac" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d9c8fb" stopOpacity="0.7" />
            <stop offset="1" stopColor="#efe7fd" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path className={styles.w1} d="M-20 0H640C560 70 470 120 330 160C190 200 80 250 -20 330Z" fill="url(#wCyan)" />
        <path className={styles.w2} d="M-20 170C120 140 260 120 400 70C340 130 200 200 -20 300Z" fill="url(#wLilac)" />
        <path className={styles.w3} d="M-20 700C140 700 330 790 470 880C540 925 600 960 640 1010H-20Z" fill="url(#wLilac)" />
        <path className={styles.w4} d="M1620 660C1480 670 1320 780 1180 900C1130 945 1080 980 1040 1010H1620Z" fill="url(#wCyan)" />
      </svg>
      <div className={styles.blobs} aria-hidden="true">
        <span className={styles.b1} />
        <span className={styles.b2} />
        <span className={styles.b3} />
      </div>
      <header className={styles.banner}>
        <div className={styles.bannerBg} aria-hidden="true" />
        <div className={styles.langs} role="group" aria-label="Language">
        {(["en", "es"] as const).map((code) => (
          <button
            key={code}
            type="button"
            aria-pressed={lang === code}
            onClick={() => setLang(code)}
            className={`${styles.lang} ${lang === code ? styles.langActive : ""}`}
          >
            {code.toUpperCase()}
          </button>
        ))}
        </div>

        <img src="/images/logo-icon-v2.webp" alt="" width="128" height="128" className={styles.logo} />
        <h1 className={styles.name}>ElevateBiz</h1>
        <p className={styles.tagline}>{t.tagline}</p>

      </header>

      <section className={styles.card}>
        <ul className={styles.list}>
          {t.links.map((link) => (
            <li key={link.href + link.label}>
              <a
                href={link.href}
                className={`${styles.link} ${link.primary ? styles.primary : ""}`}
                {...(link.download ? { download: "elevatebiz.vcf" } : {})}
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...(link.href === BOOKING_URL
                  ? {
                      // The calendar opens in a pop-up on this page (the link still works if scripts are off)
                      onClick: (e: React.MouseEvent) => {
                        e.preventDefault();
                        setBookOpen(true);
                      },
                    }
                  : {})}
              >
                <span className={styles.icon}>
                  <Icon name={link.icon} />
                </span>
                <span className={styles.text}>
                  <span className={styles.label}>{link.label}</span>
                  <span className={styles.hint}>{link.hint}</span>
                </span>
                <svg className={styles.chevron} viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 5 7 7-7 7" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <nav className={styles.social} aria-label="Social">
        <a href="https://www.instagram.com/elevatebiz.ai/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.2 6.8h.01" /></svg>
        </a>
        <span className={styles.fbWrap} data-fb="">
          <button type="button" aria-label="Facebook" onClick={() => setSoon((v) => !v)}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 3h-3a5 5 0 0 0-5 5v3H6v4h3v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1h3V3Z" /></svg>
          </button>
          {soon && (
            <span className={styles.tip} role="status">
              {lang === "es" ? "Próximamente" : "Coming soon"}
            </span>
          )}
        </span>
        <a href="tel:+16506908587" aria-label="Call">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h3.2l1.6 4-2 1.3a11 11 0 0 0 5.9 5.9l1.3-2 4 1.6V18a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 3 6.2 2 2 0 0 1 5 4Z" /></svg>
        </a>
      </nav>
      <a href="https://wa.me/16506908587" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={styles.waFab}>
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>
      <BookingModal lang={lang} open={bookOpen} onClose={() => setBookOpen(false)} />
    </main>
  );
}
