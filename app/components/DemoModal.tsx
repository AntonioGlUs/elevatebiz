"use client";

import { useEffect, useState } from "react";
import base from "./BookingModal.module.css";
import styles from "./DemoModal.module.css";
import { track } from "./analytics";
import { ASSESSMENT_WEBHOOK_URL, BOOKING_URL } from "./constants";

// "Book a demo" pop-up: a short qualification, one question per screen, then the booking calendar with the visitor's
// details already filled in (so they are not asked twice). Answers are saved in Supabase, table demo_requests.

type Lang = "en" | "es";
type Option = { value: string; en: string; es: string };
type MultiKey = "branding" | "social_networks"; // questions where several options can be picked
// unsure: the question also offers "I don't know what this means" (we explain it in the call, not in the form)
type Base = {
  en: string;
  es: string;
  options: Option[];
  unsure?: true;
};
type Question =
  | (Base & { key: Exclude<keyof Answers, MultiKey> })
  | (Base & { key: MultiKey; multi: true });
type Answers = {
  industry: string;
  branding: string[];
  google_profile: string;
  social_networks: string[];
  automation: string;
  paid_ads: string;
};
type Contact = {
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  phone: string;
};

const o = (value: string, en: string, es: string): Option => ({
  value,
  en,
  es,
});

// Same businesses as the Solutions menu
const QUESTIONS: Question[] = [
  {
    key: "industry",
    en: "What industry are you in?",
    es: "¿En qué giro está tu negocio?",
    options: [
      o("sales", "Sales", "Ventas"),
      o("operations", "Operations", "Operaciones"),
      o("marketing", "Marketing", "Marketing"),
      o("human-resources", "Human Resources", "Recursos humanos"),
      o("dental-clinic", "Dental Clinic", "Clínica dental"),
      o("real-estate", "Real Estate", "Bienes raíces"),
      o("nutritionist", "Nutritionist", "Nutriólogos"),
      o("gym", "Gym", "Gimnasio"),
      o("spa", "Spa", "Spa"),
      o("restaurants", "Restaurants", "Restaurantes"),
      o("law-firms", "Law Firm", "Abogados"),
      o("online-store", "Online Store", "Tienda en línea"),
      o("education", "Education", "Educación"),
      o("insurance", "Insurance", "Seguros"),
      o("accounting", "Accounting", "Contabilidad"),
      o("automotive", "Automotive", "Automotriz"),
      o("other", "Other", "Otro"),
    ],
  },
  {
    key: "branding",
    multi: true,
    en: "Which of these does your brand already have?",
    es: "¿Cuáles de estos ya tiene tu marca?",
    unsure: true,
    options: [
      o("logo", "Logo", "Logo"),
      o("colors", "Brand colors", "Colores de marca"),
      o("slogan", "Slogan", "Eslogan"),
      o("website", "Website", "Sitio web"),
      o("content", "Own photos or content", "Fotos o contenido propio"),
      o("none", "None yet", "Ninguno todavía"),
    ],
  },
  {
    key: "google_profile",
    en: "Do you have a Google Business Profile?",
    es: "¿Tienes perfil de empresa en Google?",
    unsure: true,
    options: [
      o("yes-updated", "Yes, and it is up to date", "Sí, y está actualizado"),
      o(
        "yes-outdated",
        "Yes, but it is outdated",
        "Sí, pero está desactualizado",
      ),
      o("no", "No", "No"),
      o("not-sure", "I'm not sure", "No estoy seguro"),
    ],
  },
  {
    key: "social_networks",
    multi: true,
    en: "Which social networks does your business use?",
    es: "¿Qué redes sociales usa tu negocio?",
    unsure: true,
    options: [
      o("facebook", "Facebook", "Facebook"),
      o("instagram", "Instagram", "Instagram"),
      o("tiktok", "TikTok", "TikTok"),
      o("linkedin", "LinkedIn", "LinkedIn"),
      o("youtube", "YouTube", "YouTube"),
      o("none", "None", "Ninguna"),
    ],
  },
  {
    key: "automation",
    en: "How automated is your business today?",
    es: "¿Qué tan automatizado está tu negocio hoy?",
    unsure: true,
    options: [
      o("manual", "Everything is done by hand", "Todo se hace a mano"),
      o(
        "some-tools",
        "We use some tools (calendar, CRM)",
        "Usamos algunas herramientas (agenda, CRM)",
      ),
      o("partly", "Partly automated", "Parcialmente automatizado"),
      o("mostly", "Mostly automated", "Mayormente automatizado"),
    ],
  },
  {
    key: "paid_ads",
    en: "Are you running paid ads right now?",
    es: "¿Estás pagando anuncios en este momento?",
    unsure: true,
    options: [
      o("yes-working", "Yes, and they work", "Sí, y funcionan"),
      o(
        "yes-unsure",
        "Yes, but I'm not sure they work",
        "Sí, pero no sé si funcionan",
      ),
      o("before", "Not now, but I have before", "Ahora no, pero antes sí"),
      o("never", "Never", "Nunca"),
    ],
  },
];

// Icons of the answer options, by "question:option". Emoji for general ideas; the social networks get their own logos.
const brand = (bg: string, path: string, viewBox = "0 0 24 24") => (
  <svg viewBox={viewBox} width="26" height="26" aria-hidden="true">
    <rect width="24" height="24" rx="7" fill={bg} />
    <path d={path} fill="#fff" />
  </svg>
);
const ICONS: Record<string, React.ReactNode> = {
  "industry:sales": "💼",
  "industry:operations": "⚙️",
  "industry:marketing": "📣",
  "industry:human-resources": "👥",
  "industry:dental-clinic": "🦷",
  "industry:real-estate": "🏠",
  "industry:nutritionist": "🥗",
  "industry:gym": "🏋️",
  "industry:spa": "💆",
  "industry:restaurants": "🍽️",
  "industry:law-firms": "⚖️",
  "industry:online-store": "🛒",
  "industry:education": "🎓",
  "industry:insurance": "🛡️",
  "industry:accounting": "🧮",
  "industry:automotive": "🚗",
  "industry:other": "➕",
  "branding:logo": "🔷",
  "branding:colors": "🎨",
  "branding:slogan": "💬",
  "branding:website": "🌐",
  "branding:content": "📸",
  "branding:none": "🚫",
  "google_profile:yes-updated": "✅",
  "google_profile:yes-outdated": "⚠️",
  "google_profile:no": "❌",
  "google_profile:not-sure": "🤔",
  "social_networks:facebook": brand(
    "#1877f2",
    "M13.4 20v-6.6h2.2l.4-2.6h-2.6V9.2c0-.8.3-1.3 1.3-1.3H16V5.6c-.3 0-1.1-.1-2-.1-2 0-3.3 1.2-3.3 3.4v1.9H8.5v2.6h2.2V20h2.7z",
  ),
  "social_networks:instagram": brand(
    "#e1306c",
    "M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4.9-8.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 4.6c2.4 0 2.7 0 3.6.1 2.4.1 3.6 1.3 3.7 3.7.1.9.1 1.2.1 3.6s0 2.7-.1 3.6c-.1 2.4-1.3 3.6-3.7 3.7-.9.1-1.2.1-3.6.1s-2.7 0-3.6-.1c-2.4-.1-3.6-1.3-3.7-3.7-.1-.9-.1-1.2-.1-3.6s0-2.7.1-3.6C4.7 6 5.9 4.8 8.4 4.7c.9-.1 1.2-.1 3.6-.1zm0-1.6c-2.4 0-2.8 0-3.7.1C5 3.2 3.2 5 3.1 8.3 3 9.2 3 9.6 3 12s0 2.8.1 3.7c.1 3.3 1.9 5.1 5.2 5.2.9.1 1.3.1 3.7.1s2.8 0 3.7-.1c3.3-.1 5.1-1.9 5.2-5.2.1-.9.1-1.3.1-3.7s0-2.8-.1-3.7C20.8 5 19 3.2 15.7 3.1 14.8 3 14.4 3 12 3z",
  ),
  "social_networks:tiktok": brand(
    "#111",
    "M16.6 5.8A3.9 3.9 0 0 1 15.7 3h-2.9v11.6a2.4 2.4 0 1 1-2.4-2.4c.2 0 .5 0 .7.1V9.3a5.4 5.4 0 1 0 4.6 5.3V8.7a6.9 6.9 0 0 0 4 1.3V7.1a4 4 0 0 1-3.1-1.3z",
  ),
  "social_networks:linkedin": brand(
    "#0a66c2",
    "M7.1 9.4H4.5V19h2.6V9.4zM5.8 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm13.7 8.6c0-2.6-.6-4.4-3.6-4.4-1.4 0-2.4.8-2.8 1.5V9.4h-2.5V19h2.6v-4.8c0-1.3.2-2.5 1.8-2.5s1.6 1.5 1.6 2.6V19h2.6l.3-5.4z",
  ),
  "social_networks:youtube": brand("#ff0000", "M10 8.7v6.6l5.7-3.3L10 8.7z"),
  "social_networks:none": "🚫",
  "automation:manual": "✍️",
  "automation:some-tools": "🧰",
  "automation:partly": "⚙️",
  "automation:mostly": "🤖",
  "paid_ads:yes-working": "📈",
  "paid_ads:yes-unsure": "🤷",
  "paid_ads:before": "⏸️",
  "paid_ads:never": "🚫",
};

// Answers are sent to GoHighLevel with the labels of its "Business Assessment" fields (same text, so its lists match)
const GHL_LABELS: Record<string, Record<string, string>> = {
  industry: {
    sales: "Sales", operations: "Operations", marketing: "Marketing", "human-resources": "Human Resources",
    "dental-clinic": "Dental Clinic", "real-estate": "Real Estate", nutritionist: "Nutritionist", gym: "Gym", spa: "Spa",
    restaurants: "Restaurants", "law-firms": "Law Firm", "online-store": "Online Store", education: "Education",
    insurance: "Insurance", accounting: "Accounting", automotive: "Automotive", other: "Other",
  },
  branding: {
    logo: "Logo", colors: "Brand colors", slogan: "Slogan", website: "Website", content: "Own photos or content",
    none: "None yet", unknown: "I don't know",
  },
  google_profile: {
    "yes-updated": "Yes, up to date", "yes-outdated": "Yes, but outdated", no: "No", "not-sure": "Not sure", unknown: "I don't know",
  },
  social_networks: {
    facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", linkedin: "LinkedIn", youtube: "YouTube", none: "None",
    unknown: "I don't know",
  },
  automation: {
    manual: "Everything by hand", "some-tools": "Some tools (calendar, CRM)", partly: "Partly automated",
    mostly: "Mostly automated", unknown: "I don't know",
  },
  paid_ads: {
    "yes-working": "Yes, and they work", "yes-unsure": "Yes, not sure they work", before: "Not now, but before",
    never: "Never", unknown: "I don't know",
  },
  unknown_terms: {
    branding: "Branding", google_profile: "Google Business Profile", social_networks: "Social Networks",
    automation: "Automation", paid_ads: "Paid Ads",
  },
};
const label = (question: string, value: string | string[]) =>
  (Array.isArray(value) ? value : [value]).map((v) => GHL_LABELS[question]?.[v] ?? v).join(", ");

// Country codes for the phone (the calendar defaults to Mexico, so the number is always sent with its code)
const COUNTRIES = [
  { code: "+1", en: "US/CA +1", es: "EE. UU./Canadá +1" },
  { code: "+52", en: "Mexico +52", es: "México +52" },
];

const COPY = {
  en: {
    title: "Book a demo",
    intro: "A few quick questions so we can prepare your call.",
    step: (n: number, total: number) => `Question ${n} of ${total}`,
    contactStep: "Last step",
    pickAll: "Choose all that apply",
    dontKnow: "I don't know what this means",
    next: "Continue",
    back: "Back",
    close: "Close",
    contactTitle: "Where can we reach you?",
    contactText:
      "Then pick a day and time. Your details will already be filled in.",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    country: "Country code",
    phone: "Phone",
    submit: "Choose a day and time",
    sending: "Saving...",
    invalid: "Please fill in every field with a valid email and phone.",
    failed:
      "We could not save your answers. Check your connection and try again.",
    calendarTitle: "Pick a day and time",
    loading: "Loading calendar…",
  },
  es: {
    title: "Agenda un demo",
    intro: "Unas preguntas rápidas para preparar tu llamada.",
    step: (n: number, total: number) => `Pregunta ${n} de ${total}`,
    contactStep: "Último paso",
    pickAll: "Elige todas las que apliquen",
    dontKnow: "No sé qué significa esto",
    next: "Continuar",
    back: "Atrás",
    close: "Cerrar",
    contactTitle: "¿Dónde te contactamos?",
    contactText: "Después eliges día y hora. Tus datos ya aparecerán escritos.",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo",
    country: "Lada",
    phone: "Teléfono",
    submit: "Elegir día y hora",
    sending: "Guardando...",
    invalid: "Llena todos los campos con un correo y un teléfono válidos.",
    failed:
      "No pudimos guardar tus respuestas. Revisa tu conexión e intenta de nuevo.",
    calendarTitle: "Elige día y hora",
    loading: "Cargando calendario…",
  },
} as const;

const EMPTY: Answers = {
  industry: "",
  branding: [],
  google_profile: "",
  social_networks: [],
  automation: "",
  paid_ads: "",
};
const TOTAL = QUESTIONS.length + 1; // the questions plus the contact step

type Props = { lang: Lang; open: boolean; onClose: () => void };

export default function DemoModal({ lang, open, onClose }: Props) {
  const t = COPY[lang] ?? COPY.en;
  const [step, setStep] = useState(0); // 0..5 questions, 6 contact, 7 calendar
  const [unknownTerms, setUnknownTerms] = useState<string[]>([]); // questions where "I don't know what this means" was pressed
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [contact, setContact] = useState<Contact>({
    first_name: "",
    last_name: "",
    email: "",
    country: lang === "es" ? "+52" : "+1",
    phone: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "invalid" | "failed"
  >("idle");
  const [calendarSrc, setCalendarSrc] = useState("");
  const [loaded, setLoaded] = useState(false);

  // While it is up: the page behind does not scroll, and Escape closes it
  useEffect(() => {
    if (!open) return;
    track("demo_form_open", { language: lang });
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    html.classList.add("eb-modal-open"); // hides the floating chat button, which would cover the pop-up
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = previous;
      html.classList.remove("eb-modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, lang]);

  if (!open) return null;

  const question = step < QUESTIONS.length ? QUESTIONS[step] : null;
  const isUnsure = (key: keyof Answers) => {
    const answer = answers[key];
    return Array.isArray(answer) ? answer.includes("unknown") : answer === "unknown";
  };

  // One-choice questions move on as soon as an option is picked
  const choose = (value: string) => {
    if (!question) return;
    const answered = question.key;
    setUnknownTerms((prev) => prev.filter((k) => k !== answered)); // a real answer replaces "I don't know"
    if ("multi" in question) {
      // "None" excludes the other options, and any option excludes "None"
      const key = question.key;
      setAnswers((prev) => {
        const current: string[] = Array.isArray(prev[key]) ? prev[key] : []; // guards against an answer saved in an older shape
        const kept = current.filter((v) => v !== "unknown"); // a real pick replaces a skipped answer
        const next =
          value === "none"
            ? ["none"]
            : kept.includes(value)
              ? kept.filter((v) => v !== value)
              : [...kept.filter((v) => v !== "none"), value];
        return { ...prev, [key]: next };
      });
      return;
    }
    setAnswers({ ...answers, [question.key]: value });
    setStep(step + 1);
  };

  const phoneDigits = contact.phone.replace(/\D/g, "");
  const valid =
    contact.first_name.trim() !== "" &&
    contact.last_name.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()) &&
    phoneDigits.length >= 7 &&
    phoneDigits.length <= 15;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return setStatus("invalid");
    setStatus("sending");
    const phone = `${contact.country}${phoneDigits}`;
    // Straight to GoHighLevel: its workflow "Website - Business Assessment" creates or updates the contact and adds a
    // Business Assessment record with these answers
    try {
      const response = await fetch(ASSESSMENT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: contact.first_name.trim(),
          last_name: contact.last_name.trim(),
          email: contact.email.trim().toLowerCase(),
          phone,
          language: lang === "es" ? "Spanish" : "English",
          source: "Book a demo",
          industry: label("industry", answers.industry),
          branding: label("branding", answers.branding),
          google_business_profile: label("google_profile", answers.google_profile),
          social_networks: label("social_networks", answers.social_networks),
          automation_level: label("automation", answers.automation),
          paid_ads: label("paid_ads", answers.paid_ads),
          unknown_topics: label("unknown_terms", unknownTerms),
          page: window.location.pathname,
        }),
      });
      if (!response.ok) return setStatus("failed");
    } catch {
      return setStatus("failed");
    }
    track("demo_form_complete", { language: lang, industry: answers.industry });
    // GoHighLevel fills its booking form from these parameters
    const params = new URLSearchParams({
      first_name: contact.first_name.trim(),
      last_name: contact.last_name.trim(),
      email: contact.email.trim(),
      phone,
    });
    setCalendarSrc(`${BOOKING_URL}?${params}`);
    setStatus("idle");
    setStep(TOTAL);
  };

  const shownStep = Math.min(step + 1, TOTAL);
  const inCalendar = step === TOTAL;

  return (
    <div
      className={base.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      data-lenis-prevent
      onClick={onClose}
    >
      <div
        className={`${base.panel} ${inCalendar ? "" : styles.panel}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={base.header}>
          <div className={styles.headLeft}>
            {/* From the calendar, back to the form (answers are kept) */}
            {inCalendar && (
              <button
                type="button"
                className={base.close}
                aria-label={t.back}
                onClick={() => {
                  setLoaded(false);
                  setStep(TOTAL - 1);
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            <h2 className={base.title}>
              {inCalendar ? t.calendarTitle : t.title}
            </h2>
          </div>
          <button
            type="button"
            className={base.close}
            onClick={onClose}
            aria-label={t.close}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {inCalendar ? (
          <div className={base.body}>
            {!loaded && <p className={base.loading}>{t.loading}</p>}
            <iframe
              src={calendarSrc}
              title={t.calendarTitle}
              className={base.frame}
              onLoad={() => setLoaded(true)}
            />
          </div>
        ) : (
          <div className={styles.body}>
            {/* Progress */}
            <div className={styles.progressRow}>
              <span>{question ? t.step(shownStep, TOTAL) : t.contactStep}</span>
              <span>
                {shownStep}/{TOTAL}
              </span>
            </div>
            <div className={styles.bar} aria-hidden="true">
              <i style={{ width: `${(shownStep / TOTAL) * 100}%` }} />
            </div>

            {step === 0 && <p className={styles.intro}>{t.intro}</p>}

            {question ? (
              <>
                <h3 className={styles.question}>{question[lang]}</h3>
                {"multi" in question && (
                  <p className={styles.hint}>{t.pickAll}</p>
                )}
                <div
                  className={`${styles.options} ${question.options.length > 8 ? styles.grid : question.options.length + (question.unsure ? 1 : 0) > 4 ? styles.cards3 : styles.cards2}`}
                >
                  {question.options.map((option) => {
                    const picked =
                      "multi" in question
                        ? answers[question.key].includes(option.value)
                        : answers[question.key] === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={picked ? `${styles.option} ${styles.picked}` : styles.option}
                        aria-pressed={picked}
                        onClick={() => choose(option.value)}
                      >
                        <span className={styles.icon} aria-hidden="true">
                          {ICONS[`${question.key}:${option.value}`]}
                        </span>
                        <span>{option[lang]}</span>
                      </button>
                    );
                  })}
                  {/* "I don't know what this means": an answer like the others. It is saved and we cover it in the call */}
                  {question.unsure && (
                    <button
                      type="button"
                      className={
                        isUnsure(question.key)
                          ? `${styles.option} ${styles.picked} ${styles.unsure}`
                          : `${styles.option} ${styles.unsure}`
                      }
                      aria-pressed={isUnsure(question.key)}
                      onClick={() => {
                        const key = question.key;
                        setAnswers((prev) => ({ ...prev, [key]: "multi" in question ? ["unknown"] : "unknown" }));
                        setUnknownTerms((prev) => (prev.includes(key) ? prev : [...prev, key]));
                        setStep(step + 1);
                      }}
                    >
                      <span className={styles.icon} aria-hidden="true">
                        ❓
                      </span>
                      <span>{t.dontKnow}</span>
                    </button>
                  )}
                </div>
                <div className={styles.nav}>
                  {step > 0 ? (
                    <button
                      type="button"
                      className={styles.back}
                      onClick={() => setStep(step - 1)}
                    >
                      {t.back}
                    </button>
                  ) : (
                    <span />
                  )}
                  {/* Multiple choice needs a button to go on; one-choice questions show it once answered (after going back) */}
                  {("multi" in question
                    ? answers[question.key].length > 0
                    : answers[question.key] !== "") && (
                    <button
                      type="button"
                      className={styles.next}
                      onClick={() => setStep(step + 1)}
                    >
                      {t.next}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <form onSubmit={submit} noValidate className={styles.form}>
                <h3 className={styles.question}>{t.contactTitle}</h3>
                <p className={styles.hint}>{t.contactText}</p>
                <div className={styles.fields}>
                  <label>
                    {t.firstName}
                    <input
                      autoComplete="given-name"
                      value={contact.first_name}
                      onChange={(e) =>
                        setContact({ ...contact, first_name: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    {t.lastName}
                    <input
                      autoComplete="family-name"
                      value={contact.last_name}
                      onChange={(e) =>
                        setContact({ ...contact, last_name: e.target.value })
                      }
                    />
                  </label>
                  <label className={styles.wide}>
                    {t.email}
                    <input
                      type="email"
                      autoComplete="email"
                      value={contact.email}
                      onChange={(e) =>
                        setContact({ ...contact, email: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    {t.country}
                    <select
                      value={contact.country}
                      onChange={(e) =>
                        setContact({ ...contact, country: e.target.value })
                      }
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c[lang]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {t.phone}
                    <input
                      type="tel"
                      autoComplete="tel-national"
                      inputMode="tel"
                      value={contact.phone}
                      onChange={(e) =>
                        setContact({ ...contact, phone: e.target.value })
                      }
                    />
                  </label>
                </div>
                {(status === "invalid" || status === "failed") && (
                  <p className={styles.error} role="alert">
                    {status === "invalid" ? t.invalid : t.failed}
                  </p>
                )}
                <div className={styles.nav}>
                  <button
                    type="button"
                    className={styles.back}
                    onClick={() => setStep(step - 1)}
                  >
                    {t.back}
                  </button>
                  <button
                    type="submit"
                    className={styles.next}
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? t.sending : t.submit}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
