"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/content";
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
      { label: "Book a free call", icon: "calendar", hint: "Let's talk about your business", href: "mailto:hello@elevatebiz.ai?subject=I%27d%20like%20to%20book%20a%20call", primary: true },
      { label: "Visit our website", icon: "laptop", hint: "elevatebiz.ai", href: "https://elevatebiz.ai" },
      { label: "Instagram", icon: "instagram", hint: "@elevatebiz.ai", href: "https://www.instagram.com/elevatebiz.ai/" },
      { label: "Save contact", icon: "user", hint: "Add ElevateBiz to your phone", href: "/elevatebiz.vcf", download: true },
    ],
  },
  es: {
    tagline: "Automatización con IA y marketing para pequeñas y medianas empresas.",
    links: [
      { label: "Agenda una llamada gratis", icon: "calendar", hint: "Hablemos de tu negocio", href: "mailto:hello@elevatebiz.ai?subject=Quiero%20agendar%20una%20llamada", primary: true },
      { label: "Visita nuestro sitio", icon: "laptop", hint: "elevatebiz.ai", href: "https://elevatebiz.ai" },
      { label: "Instagram", icon: "instagram", hint: "@elevatebiz.ai", href: "https://www.instagram.com/elevatebiz.ai/" },
      { label: "Guardar contacto", icon: "user", hint: "Agrega ElevateBiz a tu teléfono", href: "/elevatebiz.vcf", download: true },
    ],
  },
};

export default function LinksPage() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("eb-lang");
    if (saved === "en" || saved === "es") setLang(saved);
    else if (navigator.language.toLowerCase().startsWith("es")) setLang("es");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("eb-lang", lang);
  }, [lang]);

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
        <path d="M-20 0H640C560 70 470 120 330 160C190 200 80 250 -20 330Z" fill="url(#wCyan)" />
        <path d="M-20 170C120 140 260 120 400 70C340 130 200 200 -20 300Z" fill="url(#wLilac)" />
        <path d="M-20 700C140 700 330 790 470 880C540 925 600 960 640 1010H-20Z" fill="url(#wLilac)" />
        <path d="M1620 660C1480 670 1320 780 1180 900C1130 945 1080 980 1040 1010H1620Z" fill="url(#wCyan)" />
      </svg>
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

      <section className={styles.card}>
        <img src="/images/logo-icon-v2.webp" alt="" width="128" height="128" className={styles.logo} />
        <h1 className={styles.name}>ElevateBiz</h1>
        <p className={styles.tagline}>{t.tagline}</p>

        <ul className={styles.list}>
          {t.links.map((link) => (
            <li key={link.href + link.label}>
              <a
                href={link.href}
                className={`${styles.link} ${link.primary ? styles.primary : ""}`}
                {...(link.download ? { download: "elevatebiz.vcf" } : {})}
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
    </main>
  );
}
