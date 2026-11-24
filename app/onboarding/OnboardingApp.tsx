"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import Extras, { EMPTY_EXTRAS, TEST_EXTRAS_KEY, type ExtraFile, type ExtraLink, type ExtrasData } from "./Extras";
import Dictate, { useLiveText } from "./Dictate";
import styles from "./onboarding.module.css";

type Lang = "en" | "es";
type Option = { value: string; en: string; es: string };
type QuestionType = "text" | "long_text" | "url" | "single_choice" | "multi_choice" | "links" | "faq_list" | "item_list" | "fields";

type Question = {
  key: string;
  type: QuestionType;
  title_en: string;
  title_es: string;
  help_en: string | null;
  help_es: string | null;
  example_en: string | null; // sample answer, shown by the Help button
  example_es: string | null;
  options: Option[];
  required: boolean;
  allow_none: boolean; // shows "I don't have one" next to the field
  allow_na: boolean; // shows "Does not apply", to move on without answering
  formTitle: { en: string; es: string };
};

type Faq = { question: string; answer: string };
type Item = { name: string; details: string; price: string };

// What the visitor is typing on the current screen, before it is saved
type Draft =
  | { kind: "text"; text: string; none?: boolean } // none: "I don't have one" on link questions
  | { kind: "single"; value: string; other: string }
  | { kind: "multi"; values: string[]; other?: string } // other: what the client types when "Other" is ticked
  | { kind: "links"; links: Record<string, string> } // option value -> link; present = selected
  | { kind: "faq"; items: Faq[] }
  | { kind: "fields"; values: Record<string, string> } // several short fields on one screen (option value -> text)
  | { kind: "items"; items: Item[]; sharePrices: boolean }; // products / treatments / services with their prices

const COPY = {
  en: {
    brand: "ElevateBiz",
    eyebrow: "CLIENT ONBOARDING",
    loginTitle: "Let's set up your AI agents",
    loginText: "Enter your email and we'll send you a link to get in, no password needed. Use the same email to come back and continue later.",
    email: "Email address",
    emailPlaceholder: "you@email.com",
    sendLink: "Send me the link",
    sending: "Sending...",
    sentTitle: "Check your email",
    sentText: "We sent a sign-in link to {email}. Open it on this device to continue.",
    sentPopTitle: "Check your inbox",
    sentPopText: "We just sent your link to {email}. It comes from concierge@elevatebiz.ai; if you do not see it, check your spam folder.",
    sentPopTip: "Can't find it? Check your spam or promotions folder.",
    sentPopOk: "Got it",
    useOther: "Use a different email",
    loginError: "We couldn't send the link. Please try again in a minute.",
    invalidEmail: "Enter a valid email address.",
    loading: "Loading...",
    loadError: "We couldn't load your onboarding. Please reload the page.",
    progress: "Question {n} of {total}",
    optional: "Optional",
    back: "Back",
    next: "Save and continue",
    finish: "Save and finish",
    skip: "Skip",
    saving: "Saving...",
    saveError: "We couldn't save your answer. Please try again.",
    required: "Please answer this question to continue.",
    typeHere: "Type your answer here",
    dontHave: "I don't have one",
    noWebsite: "I don't have a website",
    notApplicable: "Does not apply to my business",
    notApplicableShort: "Does not apply",
    otherPlaceholder: "Tell us which one",
    otherLanguagesPlaceholder: "Which other languages? (e.g. French, Mandarin)",
    linkPlaceholder: "Paste the link (optional)",
    faqQuestion: "Question",
    faqAnswer: "Answer",
    addFaq: "Add another question",
    sharePrices: "Should your agent tell customers the prices?",
    yes: "Yes",
    no: "No",
    itemName: "Name",
    itemN: "Item",
    itemPrice: "Price",
    itemDetails: "Details (optional)",
    addItem: "Add another",
    remove: "Remove",
    doneTitle: "{name}: complete",
    doneText: "Your answers are saved. You can come back and change them at any time.",
    review: "Review my answers",
    homeTitle: "Your onboarding",
    homeText: "Answer these in any order; your progress is saved as you go.",
    optionalTag: "Optional",
    whyLabel: "Why we ask:",
    closeTips: "Close",
    dontShow: "Don't show again",
    seeTips: "See tips",
    helpBtn: "View example",
    helpBtnClose: "Close example",
    exampleLabel: "Example answer",
    openItem: "Open",
    extrasEmpty: "Nothing added yet",
    extrasCount: "{files} files · {colors} colors · {links} links",
    allDone: "Everything is complete. Thank you! We have what we need to start building your agents.",
    answered: "{n} of {total} answered",
    statusNew: "Not started",
    statusProgress: "In progress",
    statusDone: "Complete",
    start: "Start",
    resume: "Continue",
    backToList: "All questionnaires",
    close: "Close",
    continueWith: "Continue with: {name}",
    home: "Back to elevatebiz.ai",
    signOut: "Sign out",
    tryIt: "Try it without signing in (test mode)",
    testBanner: "Test mode: your answers stay in this browser only and are not sent to us.",
    exitTest: "Exit test mode",
    testAccount: "Test mode, not signed in",
    signedInAs: "Signed in as",
    noQuestions: "There are no questions to answer right now.",
  },
  es: {
    brand: "ElevateBiz",
    eyebrow: "ONBOARDING DE CLIENTES",
    loginTitle: "Vamos a preparar tus agentes de IA",
    loginText: "Escribe tu correo y te enviaremos un enlace para entrar, sin contraseña. Usa el mismo correo para volver y continuar después.",
    email: "Correo electrónico",
    emailPlaceholder: "tu@correo.com",
    sendLink: "Enviarme el enlace",
    sending: "Enviando...",
    sentTitle: "Revisa tu correo",
    sentText: "Enviamos un enlace de acceso a {email}. Ábrelo en este dispositivo para continuar.",
    sentPopTitle: "Revisa tu bandeja de entrada",
    sentPopText: "Acabamos de enviar tu enlace a {email}. Llega desde concierge@elevatebiz.ai; si no lo ves, revisa tu carpeta de spam.",
    sentPopTip: "¿No lo ves? Revisa tu carpeta de spam o promociones.",
    sentPopOk: "Entendido",
    useOther: "Usar otro correo",
    loginError: "No pudimos enviar el enlace. Intenta de nuevo en un minuto.",
    invalidEmail: "Escribe un correo válido.",
    loading: "Cargando...",
    loadError: "No pudimos cargar tu onboarding. Recarga la página.",
    progress: "Pregunta {n} de {total}",
    optional: "Opcional",
    back: "Atrás",
    next: "Guardar y continuar",
    finish: "Guardar y terminar",
    skip: "Omitir",
    saving: "Guardando...",
    saveError: "No pudimos guardar tu respuesta. Intenta de nuevo.",
    required: "Responde esta pregunta para continuar.",
    typeHere: "Escribe tu respuesta aquí",
    dontHave: "No tengo",
    noWebsite: "No tengo sitio web",
    notApplicable: "No aplica a mi negocio",
    notApplicableShort: "No aplica",
    otherPlaceholder: "Cuéntanos cuál",
    otherLanguagesPlaceholder: "¿Qué otros idiomas? (p. ej. francés, mandarín)",
    linkPlaceholder: "Pega el link (opcional)",
    faqQuestion: "Pregunta",
    faqAnswer: "Respuesta",
    addFaq: "Agregar otra pregunta",
    sharePrices: "¿Quieres que tu agente les diga los precios a los clientes?",
    yes: "Sí",
    no: "No",
    itemName: "Nombre",
    itemN: "Elemento",
    itemPrice: "Precio",
    itemDetails: "Detalles (opcional)",
    addItem: "Agregar otro",
    remove: "Quitar",
    doneTitle: "{name}: completo",
    doneText: "Tus respuestas están guardadas. Puedes volver y cambiarlas cuando quieras.",
    review: "Revisar mis respuestas",
    homeTitle: "Cuéntanos de tu negocio",
    homeText: "Contéstalos en el orden que quieras; tu avance se guarda conforme avanzas.",
    optionalTag: "Opcional",
    whyLabel: "¿Para qué sirve?",
    closeTips: "Cerrar",
    dontShow: "No volver a mostrar",
    seeTips: "Ver tips",
    helpBtn: "Ver ejemplo",
    helpBtnClose: "Cerrar ejemplo",
    exampleLabel: "Respuesta esperada",
    openItem: "Abrir",
    extrasEmpty: "Aún no agregas nada",
    extrasCount: "{files} archivos · {colores} colores · {links} links",
    allDone: "Todo está completo. ¡Gracias! Ya tenemos lo necesario para empezar a construir tus agentes.",
    answered: "{n} de {total} contestadas",
    statusNew: "Sin empezar",
    statusProgress: "En curso",
    statusDone: "Completo",
    start: "Empezar",
    resume: "Continuar",
    backToList: "Todos los cuestionarios",
    close: "Cerrar",
    continueWith: "Seguir con: {name}",
    home: "Volver a elevatebiz.ai",
    signOut: "Cerrar sesión",
    tryIt: "Probar sin registrarme (modo de prueba)",
    testBanner: "Modo de prueba: tus respuestas se quedan solo en este navegador y no se nos envían.",
    exitTest: "Salir del modo de prueba",
    testAccount: "Modo de prueba, sin sesión",
    signedInAs: "Sesión de",
    noQuestions: "No hay preguntas por contestar en este momento.",
  },
};

// Answers copied to the client's record so the owner can tell clients apart at a glance
const CLIENT_FIELDS: Record<string, "business_name" | "industry" | "website"> = {
  company_name: "business_name",
  industry: "industry",
  website: "website",
};

// Questions shown on the same screen as another one (main question -> companion question)
const COMPANION: Record<string, string[]> = { company_name: ["business_description", "website"] };

// Country dialing codes offered next to the phone fields of the contact information screen
const DIAL_CODES = [
  { code: "+52", flag: "🇲🇽" }, { code: "+1", flag: "🇺🇸" }, { code: "+34", flag: "🇪🇸" }, { code: "+57", flag: "🇨🇴" },
  { code: "+54", flag: "🇦🇷" }, { code: "+56", flag: "🇨🇱" }, { code: "+51", flag: "🇵🇪" }, { code: "+58", flag: "🇻🇪" },
  { code: "+593", flag: "🇪🇨" }, { code: "+502", flag: "🇬🇹" }, { code: "+506", flag: "🇨🇷" }, { code: "+507", flag: "🇵🇦" },
  { code: "+55", flag: "🇧🇷" }, { code: "+44", flag: "🇬🇧" }, { code: "+33", flag: "🇫🇷" }, { code: "+49", flag: "🇩🇪" }, { code: "+39", flag: "🇮🇹" },
];
const DEFAULT_DIAL = "+52";
// Compact dialing-code dropdown (a native select adds a check mark that widens the list)
function DialPicker({ value, onChange, label }: { value: string; onChange: (code: string) => void; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | globalThis.KeyboardEvent) => {
      if (e instanceof MouseEvent ? !ref.current?.contains(e.target as Node) : e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);
  const current = DIAL_CODES.find((d) => d.code === value) ?? DIAL_CODES[0];
  return (
    <span className={styles.dialPicker} ref={ref}>
      <button type="button" className={`${styles.input} ${styles.dialButton}`} aria-label={label} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span>{current.flag} {current.code}</span>
        <span className={styles.dialCaret} aria-hidden="true">▾</span>
      </button>
      {open && (
        <ul className={styles.dialList} role="listbox" aria-label={label}>
          {DIAL_CODES.map((d) => (
            <li key={d.code} role="option" aria-selected={d.code === current.code}>
              <button type="button" className={d.code === current.code ? styles.dialActive : undefined} onClick={() => { onChange(d.code); setOpen(false); }}>
                {d.flag} {d.code}
              </button>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}

// Splits a saved phone ("+52 33 1234 5678") into its dialing code and number
function splitDial(value: string): { dial: string | null; number: string } {
  const m = value.trim().match(/^(\+\d{1,3})\s*(.*)$/);
  if (m && DIAL_CODES.some((d) => d.code === m[1])) return { dial: m[1], number: m[2] };
  return { dial: null, number: value };
}
const COMPANION_KEYS = Object.values(COMPANION).flat();

const label = (option: Option, lang: Lang) => option[lang] ?? option.en;

function emptyDraft(type: QuestionType): Draft {
  if (type === "single_choice") return { kind: "single", value: "", other: "" };
  if (type === "multi_choice") return { kind: "multi", values: [] };
  if (type === "links") return { kind: "links", links: {} };
  if (type === "fields") return { kind: "fields", values: {} };
  if (type === "faq_list") return { kind: "faq", items: [{ question: "", answer: "" }] };
  if (type === "item_list") return { kind: "items", items: [{ name: "", details: "", price: "" }], sharePrices: true };
  return { kind: "text", text: "" };
}

// Saved answer (as stored in the database) -> what the screen edits
function toDraft(question: Question, saved: unknown): Draft {
  const draft = emptyDraft(question.type);
  if (saved === undefined || saved === null) return draft;
  try {
    if (draft.kind === "text" && typeof saved === "string") return { kind: "text", text: saved };
    if (draft.kind === "text" && (saved as { value?: string }).value === "none") return { kind: "text", text: "", none: true };
    if (draft.kind === "single" && typeof saved === "object") {
      const s = saved as { value?: string; label?: string };
      return { kind: "single", value: s.value ?? "", other: s.value === "other" ? (s.label ?? "") : "" };
    }
    if (draft.kind === "multi" && Array.isArray(saved)) {
      const otherLabel = (saved.find((s: { value: string }) => s.value === "other") as { label?: string } | undefined)?.label ?? "";
      const isDefault = question.options.some((o) => o.value === "other" && (o.en === otherLabel || o.es === otherLabel));
      return { kind: "multi", values: saved.map((s: { value: string }) => s.value), other: isDefault ? "" : otherLabel };
    }
    if (draft.kind === "links" && Array.isArray(saved)) {
      const links: Record<string, string> = {};
      saved.forEach((s: { value: string; url?: string }) => (links[s.value] = s.url ?? ""));
      return { kind: "links", links };
    }
    if (draft.kind === "fields" && Array.isArray(saved)) {
      const values: Record<string, string> = {};
      saved.forEach((s: { value: string; text?: string }) => (values[s.value] = s.text ?? ""));
      return { kind: "fields", values };
    }
    if (draft.kind === "faq" && Array.isArray(saved) && saved.length) {
      return { kind: "faq", items: saved.map((s: Faq) => ({ question: s.question ?? "", answer: s.answer ?? "" })) };
    }
    if (draft.kind === "items" && typeof saved === "object") {
      const s = saved as { share_prices?: boolean; items?: Partial<Item>[] };
      const items = (s.items ?? []).map((item) => ({ name: item.name ?? "", details: item.details ?? "", price: item.price ?? "" }));
      return { kind: "items", items: items.length ? items : draft.items, sharePrices: s.share_prices !== false };
    }
  } catch {
    /* unexpected shape: start from an empty answer */
  }
  return draft;
}

// What the screen edits -> the value to store. null = nothing answered.
// Labels are stored next to the values so the answer reads on its own (an AI agent builds the knowledge base from it).
function toAnswer(question: Question, draft: Draft, lang: Lang): unknown {
  const optionLabel = (value: string) => {
    const option = question.options.find((o) => o.value === value);
    return option ? label(option, lang) : value;
  };
  if (draft.kind === "text") {
    if (draft.none) return { value: "none", label: COPY[lang].dontHave };
    let text = draft.text.trim();
    if (!text) return null;
    if (question.type === "url" && !/^https?:\/\//i.test(text)) text = `https://${text}`;
    return text;
  }
  if (draft.kind === "single") {
    if (!draft.value) return null;
    const other = draft.other.trim();
    return { value: draft.value, label: draft.value === "other" && other ? other : optionLabel(draft.value) };
  }
  if (draft.kind === "multi") {
    if (!draft.values.length) return null;
    const other = (draft.other ?? "").trim();
    return draft.values.map((value) => ({ value, label: value === "other" && other ? other : optionLabel(value) }));
  }
  if (draft.kind === "links") {
    const selected = Object.keys(draft.links);
    if (!selected.length) return null;
    return selected.map((value) => ({ value, label: optionLabel(value), url: draft.links[value].trim() }));
  }
  if (draft.kind === "fields") {
    const filled = question.options
      .map((o) => ({ value: o.value, label: label(o, lang), text: (draft.values[o.value] ?? "").trim() }))
      .filter((f) => f.text);
    return filled.length ? filled : null;
  }
  if (draft.kind === "items") {
    // share_prices tells the agent whether it may quote them; prices are dropped when the client says no
    const items = draft.items
      .map((item) => ({ name: item.name.trim(), details: item.details.trim(), price: draft.sharePrices ? item.price.trim() : "" }))
      .filter((item) => item.name);
    return items.length ? { share_prices: draft.sharePrices, items } : null;
  }
  const items = draft.items
    .map((item) => ({ question: item.question.trim(), answer: item.answer.trim() }))
    .filter((item) => item.question || item.answer);
  return items.length ? items : null;
}

// Saved when the client marks "Does not apply": tells the agent the topic does not exist for this business
const NOT_APPLICABLE = "not_applicable";
const isNotApplicable = (saved: unknown) =>
  typeof saved === "object" && saved !== null && (saved as { value?: string }).value === NOT_APPLICABLE;

// Short text for the client's record (business name, industry, website)
function answerSummary(answer: unknown): string | null {
  if (answer === null || answer === undefined) return null;
  if (typeof answer === "string") return answer;
  if (typeof answer === "object" && "label" in (answer as object)) return String((answer as { label: unknown }).label);
  return null;
}

// Test phase: shows a button on the sign-in screen that opens the questionnaire without an account.
// In that mode nothing is saved to the database; answers stay in the visitor's browser. Set to false at launch.
const TEST_MODE = true;
const TEST_STORAGE_KEY = "eb-onboarding-test";

type FormRow = { key: string; title_en: string; title_es: string; industry: string | null; questionnaire: string };
type LinkRow = { form_key: string; question_key: string };
type QuestionRow = Omit<Question, "formTitle">;
type QuestionnaireRow = {
  key: string;
  title_en: string;
  title_es: string;
  description_en: string | null;
  description_es: string | null;
  note_en: string | null; // plain-language "why we ask", shown under the description
  note_es: string | null;
  intro_title_en: string | null; // pop-up shown the first time the client opens it
  intro_title_es: string | null;
  intro_text_en: string | null;
  intro_text_es: string | null;
  kind: "questions" | "extras"; // extras: the free page with files, colors, links and notes
};
type Catalog = { questionnaires: QuestionnaireRow[]; forms: FormRow[]; links: LinkRow[]; items: QuestionRow[]; packOverride: string | null };
type Answers = Record<string, unknown>;

// Industries without a pack of their own get the forms marked "general"
const GENERAL_PACK = "general";

// Which industry pack this client gets: the owner's override, or the client's own industry answer
function packFor(catalog: Catalog, answers: Answers): string {
  const chosen = catalog.packOverride ?? (answers.industry as { value?: string } | undefined)?.value;
  return chosen && catalog.forms.some((form) => form.industry === chosen) ? chosen : GENERAL_PACK;
}

// The questions of one questionnaire, in form order: its forms for everyone plus the client's industry pack
function buildQuestions(catalog: Catalog, answers: Answers, questionnaire: string): Question[] {
  const pack = packFor(catalog, answers);
  const byKey = new Map(catalog.items.map((q) => [q.key, q]));
  const seen = new Set<string>();
  const ordered: Question[] = [];
  for (const form of catalog.forms) {
    if (form.questionnaire !== questionnaire) continue;
    if (form.industry !== null && form.industry !== pack) continue;
    for (const link of catalog.links.filter((l) => l.form_key === form.key)) {
      const q = byKey.get(link.question_key);
      if (!q || seen.has(q.key)) continue;
      seen.add(q.key);
      ordered.push({
        ...q,
        options: Array.isArray(q.options) ? q.options : [],
        formTitle: { en: form.title_en, es: form.title_es },
      });
    }
  }
  return ordered;
}

export default function OnboardingApp() {
  const [lang, setLang] = useState<Lang>("en");
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [testing, setTesting] = useState(false); // questionnaire opened without signing in
  const [askLang, setAskLang] = useState(false); // language pop-up, shown once per browser
  const t = COPY[lang];

  // Same saved language as the rest of the site
  useEffect(() => {
    try {
      const saved = localStorage.getItem("eb-lang");
      if (saved === "es" || (saved !== "en" && navigator.language.toLowerCase().startsWith("es"))) setLang("es");
      if (!localStorage.getItem("eb-onboarding-lang-asked")) setAskLang(true);
    } catch {
      /* private mode: stays in English */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const pickLang = (code: Lang) => {
    chooseLang(code);
    setAskLang(false);
    try {
      localStorage.setItem("eb-onboarding-lang-asked", "1");
    } catch {
      /* private mode: it will ask again next time */
    }
  };

  const chooseLang = (code: Lang) => {
    setLang(code);
    try {
      localStorage.setItem("eb-lang", code);
    } catch {
      /* private mode: language just won't be remembered */
    }
  };

  // The sign-in link from the email lands back on this page; Supabase reads it and opens the session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setAuthReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <main className={styles.page}>
      {askLang && <LangPopup onPick={pickLang} />}
      <header className={styles.top}>
        <a href={lang === "es" ? "/es/" : "/"} className={styles.brand}>
          <img src="/images/logo-icon-v2.webp" alt="" width="32" height="32" />
          <span>{t.brand}</span>
        </a>
        <div className={styles.topActions}>
          <div className={styles.lang} role="group" aria-label="Language">
            <button type="button" className={lang === "en" ? styles.langActive : undefined} onClick={() => chooseLang("en")}>
              EN
            </button>
            <button type="button" className={lang === "es" ? styles.langActive : undefined} onClick={() => chooseLang("es")}>
              ES
            </button>
          </div>
          {session ? (
            <button type="button" className={styles.signOut} onClick={() => supabase.auth.signOut()}>
              {t.signOut}
            </button>
          ) : (
            testing && (
              <button type="button" className={styles.signOut} onClick={() => setTesting(false)}>
                {t.exitTest}
              </button>
            )
          )}
        </div>
      </header>

      <div className={styles.stage}>
        {!authReady ? (
          <p className={styles.note}>{t.loading}</p>
        ) : session ? (
          <Workspace key={session.user.id} userId={session.user.id} email={session.user.email ?? ""} lang={lang} />
        ) : testing ? (
          <Workspace key="test" userId={null} email="" lang={lang} />
        ) : (
          <Login lang={lang} onTry={TEST_MODE ? () => setTesting(true) : undefined} />
        )}
      </div>
    </main>
  );
}

const ICON_PATHS: Record<string, string> = {
  store: "M3 9l1.5-5h15L21 9M4 9v11h16V9M3 9c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3M10 20v-5h4v5",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  mail: "M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3 7l9 6 9-6",
  pin: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18",
  price: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6.5V8M12 16v1.5",
  shield: "M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06 M15 19l2 2l4 -4",
  calendar: "M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3 10h18M8 3v4M16 3v4",
  chat: "M4 5h16v11H9l-5 4zM8 9h8M8 12h5",
  alert: "M12 4l9 16H3zM12 10v4M12 17v.5",
  users: "M9 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 5a3.5 3.5 0 0 1 0 6.5M18 14c2 .6 3.5 2.4 3.5 5",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",
  flask: "M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7.5 14h9",
  health: "M12 5.5c-1.074 -.586 -2.583 -1.5 -4 -1.5c-2.1 0 -4 1.247 -4 5c0 4.899 1.056 8.41 2.671 10.537c.573 .756 1.97 .521 2.567 -.236c.398 -.505 .819 -1.439 1.262 -2.801c.292 -.771 .892 -1.504 1.5 -1.5c.602 0 1.21 .737 1.5 1.5c.443 1.362 .864 2.295 1.262 2.8c.597 .759 2 .993 2.567 .237c1.615 -2.127 2.671 -5.637 2.671 -10.537c0 -3.74 -1.908 -5 -4 -5c-1.423 0 -2.92 .911 -4 1.5z M12 5.5l3 1.5",
  food: "M12 3c1.918 0 3.52 1.35 3.91 3.151a4 4 0 0 1 2.09 7.723l0 7.126h-12v-7.126a4 4 0 1 1 2.092 -7.723a4 4 0 0 1 3.908 -3.151z M6.161 17.009l11.839 -.009",
  legal: "M7 20l10 0 M6 6l6 -1l6 1 M12 3l0 17 M9 12l-3 -6l-3 6a3 3 0 0 0 6 0 M21 12l-3 -6l-3 6a3 3 0 0 0 6 0",
  house: "M5 12l-2 0l9 -9l9 9l-2 0 M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7 M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6",
  bag: "M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z M9 11v-5a3 3 0 0 1 6 0v5",
  sparkle: "M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0 M12 2a3 3 0 0 1 3 3c0 .562 -.259 1.442 -.776 2.64l-.724 1.36l1.76 -1.893c.499 -.6 .922 -1 1.27 -1.205a2.968 2.968 0 0 1 4.07 1.099a3.011 3.011 0 0 1 -1.09 4.098c-.374 .217 -.99 .396 -1.846 .535l-2.664 .366l2.4 .326c1 .145 1.698 .337 2.11 .576a3.011 3.011 0 0 1 1.09 4.098a2.968 2.968 0 0 1 -4.07 1.098c-.348 -.202 -.771 -.604 -1.27 -1.205l-1.76 -1.893l.724 1.36c.516 1.199 .776 2.079 .776 2.64a3 3 0 0 1 -6 0c0 -.562 .259 -1.442 .776 -2.64l.724 -1.36l-1.76 1.893c-.499 .601 -.922 1 -1.27 1.205a2.968 2.968 0 0 1 -4.07 -1.098a3.011 3.011 0 0 1 1.09 -4.098c.374 -.218 .99 -.396 1.846 -.536l2.664 -.366l-2.4 -.325c-1 -.145 -1.698 -.337 -2.11 -.576a3.011 3.011 0 0 1 -1.09 -4.099a2.968 2.968 0 0 1 4.07 -1.099c.348 .203 .771 .604 1.27 1.205l1.76 1.894c-1 -2.292 -1.5 -3.625 -1.5 -4a3 3 0 0 1 3 -3z",
  wrench: "M3 21h4l13 -13a1.5 1.5 0 0 0 -4 -4l-13 13v4 M14.5 5.5l4 4 M12 8l-5 -5l-4 4l5 5 M7 8l-1.5 1.5 M16 12l5 5l-4 4l-5 -5 M16 17l-1.5 1.5",
  briefcase: "M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2 M12 12l0 .01 M3 13a20 20 0 0 0 18 0",
  dots: "M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
  back: "M19 12H5M11 6l-6 6 6 6",
  next: "M5 12h14M13 6l6 6-6 6",
};
const QUESTION_ICON: Record<string, string> = {
  business_hours: "clock",
  contact_phone: "phone",
  contact_whatsapp: "phone",
  contact_email: "mail",
  contact_address: "pin",
  website: "globe",
  support_links: "globe",
  languages: "globe",
  payment_methods: "price",
  treatments: "price",
  services: "price",
  products: "price",
  insurance_accepted: "shield",
  guarantees: "shield",
  never_say: "shield",
  cancellation_policy: "calendar",
  new_patients: "calendar",
  faqs: "chat",
  emergencies: "alert",
  target_customers: "users",
};
// What each entry of a list is called, so the card reads "Treatment 1" instead of a generic "Item 1"
const ITEM_LIST_TITLE: Record<string, { en: string; es: string }> = {
  treatments: { en: "Services list", es: "Listado de servicios" },
  services: { en: "Services list", es: "Listado de servicios" },
  products: { en: "Products list", es: "Listado de productos" },
};
// Icons by Tabler Icons (MIT license, tabler.io/icons)
// 3D icons (Microsoft Fluent Emoji, MIT license) in /public/images/sectors; "other" keeps a simple line icon
const SECTOR_PNG = ["health", "food", "legal", "real_estate", "retail", "beauty", "home_services", "insurance", "professional"];
// Colored icon per industry option (the "Industry" question)
const SECTOR_STYLE: Record<string, { icon: string; color: string; bg: string }> = {
  health: { icon: "health", color: "#0a9f9b", bg: "#dff4f3" },
  food: { icon: "food", color: "#e8590c", bg: "#ffe9d9" },
  legal: { icon: "legal", color: "#4f46e5", bg: "#e8e8ff" },
  real_estate: { icon: "house", color: "#2f9e44", bg: "#e0f5e4" },
  retail: { icon: "bag", color: "#d6336c", bg: "#fde4ee" },
  beauty: { icon: "sparkle", color: "#ae3ec9", bg: "#f3e3fa" },
  home_services: { icon: "wrench", color: "#f08c00", bg: "#fff1d0" },
  insurance: { icon: "shield", color: "#1c7ed6", bg: "#dcebfb" },
  professional: { icon: "briefcase", color: "#495057", bg: "#e9ecef" },
  other: { icon: "dots", color: "#868e96", bg: "#eceef0" },
};

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICON_PATHS[name] ?? ICON_PATHS.store} />
    </svg>
  );
}

// Pop-up shown the first time someone opens the questionnaire: pick the language, then it closes
function LangPopup({ onPick }: { onPick: (code: Lang) => void }) {
  return (
    <div className={styles.introOverlay}>
      <div className={`${styles.intro} ${styles.langPop}`} role="dialog" aria-modal="true" aria-label="Language / Idioma">
        <h2 className={styles.introTitle}>Language / Idioma</h2>
        <p className={styles.text}>Choose the language of the questionnaire.</p>
        <p className={styles.text}>Elige el idioma del cuestionario.</p>
        <div className={styles.introActions}>
          <button type="button" className={styles.primary} autoFocus onClick={() => onPick("en")}>
            English
          </button>
          <button type="button" className={styles.primary} onClick={() => onPick("es")}>
            Español
          </button>
        </div>
      </div>
    </div>
  );
}

function Login({ lang, onTry }: { lang: Lang; onTry?: () => void }) {
  const t = COPY[lang];
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [showSentPop, setShowSentPop] = useState(false); // pop-up explaining where the email comes from
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const address = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) return setError(t.invalidEmail);
    setError(null);
    setState("sending");
    const { error: failure } = await supabase.auth.signInWithOtp({
      email: address,
      // Open registration: a new email gets an account on the spot, a known one signs back in
      // data.lang: the email template shows Spanish or English according to it
      options: { emailRedirectTo: `${window.location.origin}/onboarding/`, data: { lang } },
    });
    if (failure) {
      setState("idle");
      setError(t.loginError);
      return;
    }
    setState("sent");
    setShowSentPop(true);
  };

  if (state === "sent") {
    return (
      <section className={styles.card}>
        {showSentPop && (
          <div className={styles.introOverlay} onClick={() => setShowSentPop(false)}>
            <div className={styles.intro} role="dialog" aria-modal="true" aria-label={t.sentPopTitle} onClick={(e) => e.stopPropagation()}>
              <span className={styles.qIcon} style={{ marginBottom: 14 }}>
                <Icon name="mail" size={30} />
              </span>
              <h2 className={styles.introTitle}>{t.sentPopTitle}</h2>
              <p className={styles.text}>{t.sentPopText.replace("{email}", email.trim().toLowerCase())}</p>
              <p className={styles.text}>{t.sentPopTip}</p>
              <div className={styles.introActions}>
                <button type="button" className={styles.primary} autoFocus onClick={() => setShowSentPop(false)}>
                  {t.sentPopOk}
                </button>
              </div>
            </div>
          </div>
        )}
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h1 className={styles.title}>{t.sentTitle}</h1>
        <p className={styles.text}>{t.sentText.replace("{email}", email.trim().toLowerCase())}</p>
        <button type="button" className={styles.link} onClick={() => setState("idle")}>
          {t.useOther}
        </button>
      </section>
    );
  }

  return (
    <section className={`${styles.card} ${styles.loginCard}`}>
      <div className={styles.loginArt} aria-hidden="true">
        <div className={styles.loginRobot}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/onboarding-robot.webp" alt="" />
          <svg className={styles.loginSpark} viewBox="0 0 40 32" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
            <path d="M8 17 L6 6" />
            <path d="M17 19 L23 10" />
            <path d="M24 27 L34 23" />
          </svg>
        </div>
      </div>
      <div className={styles.loginBody}>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h1 className={styles.title}>{t.loginTitle}</h1>
        <p className={styles.text}>{t.loginText}</p>
        <form onSubmit={submit} noValidate className={styles.form}>
          <label className={`${styles.label} ${styles.loginLabel}`} htmlFor="onb-email">
            <Icon name="mail" size={22} />
            {t.email}
          </label>
          <input
            id="onb-email"
            className={styles.input}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={t.emailPlaceholder}
            value={email}
            disabled={state === "sending"}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
          />
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <button type="submit" className={`${styles.primary} ${styles.loginSend}`} disabled={state === "sending"}>
            {state === "sending" ? t.sending : t.sendLink}
            {state !== "sending" && <Icon name="next" size={20} />}
          </button>
        </form>
        {onTry && (
          <button type="button" className={`${styles.link} ${styles.tryIt}`} onClick={onTry}>
            {t.tryIt}
          </button>
        )}
      </div>
    </section>
  );
}

// Loads the questionnaires and the client's answers, and shows either the list or the one being filled in.
// userId null = test mode: same screens, but answers are kept in the browser instead of the database.
function Workspace({ userId, email, lang }: { userId: string | null; email: string; lang: Lang }) {
  const t = COPY[lang];
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [loadFailed, setLoadFailed] = useState(false);
  // The questionnaire being filled in, and the shared questions it leaves out (decided when it is opened)
  const [active, setActive] = useState<{ key: string; skip: string[] } | null>(null);
  const [extras, setExtras] = useState<ExtrasData>(EMPTY_EXTRAS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [groups, forms, links, items] = await Promise.all([
        supabase.from("onboarding_questionnaires").select("key,title_en,title_es,description_en,description_es,note_en,note_es,intro_title_en,intro_title_es,intro_text_en,intro_text_es,kind,sort_order").eq("active", true).order("sort_order"),
        supabase.from("onboarding_forms").select("key,title_en,title_es,industry,questionnaire,sort_order").eq("active", true).order("sort_order"),
        supabase.from("onboarding_form_questions").select("form_key,question_key,sort_order").order("sort_order"),
        supabase.from("onboarding_questions").select("key,type,title_en,title_es,help_en,help_es,example_en,example_es,options,required,allow_none,allow_na").eq("active", true),
      ]);
      if (cancelled) return;
      if (groups.error || forms.error || links.error || items.error) return setLoadFailed(true);

      const savedAnswers: Answers = {};
      let packOverride: string | null = null;
      if (userId) {
        const [saved, client] = await Promise.all([
          supabase.from("onboarding_answers").select("question_key,answer").eq("user_id", userId),
          supabase.from("onboarding_clients").select("industry_pack").eq("user_id", userId).maybeSingle(),
        ]);
        if (cancelled) return;
        if (saved.error) return setLoadFailed(true);
        (saved.data ?? []).forEach((row) => (savedAnswers[row.question_key] = row.answer));
        packOverride = client.data?.industry_pack ?? null;

        // Materials and extras (not critical: the page still works if this fails)
        const [more, files] = await Promise.all([
          supabase.from("onboarding_extras").select("colors,reference_links,notes").eq("user_id", userId).maybeSingle(),
          supabase.from("onboarding_files").select("id,path,name,size_bytes").eq("user_id", userId).order("created_at"),
        ]);
        if (cancelled) return;
        setExtras({
          colors: (more.data?.colors as string[]) ?? [],
          links: (more.data?.reference_links as ExtraLink[]) ?? [],
          notes: more.data?.notes ?? "",
          files: (files.data as ExtraFile[]) ?? [],
        });
      } else {
        try {
          Object.assign(savedAnswers, JSON.parse(localStorage.getItem(TEST_STORAGE_KEY) ?? "{}"));
          const stored = JSON.parse(localStorage.getItem(TEST_EXTRAS_KEY) ?? "{}");
          setExtras({ colors: stored.colors ?? [], links: stored.links ?? [], notes: stored.notes ?? "", files: [] });
        } catch {
          /* nothing saved, or storage unavailable: start empty */
        }
      }

      setAnswers(savedAnswers);
      setCatalog({
        questionnaires: (groups.data ?? []) as QuestionnaireRow[],
        forms: (forms.data ?? []) as FormRow[],
        links: (links.data ?? []) as LinkRow[],
        items: (items.data ?? []) as QuestionRow[],
        packOverride,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Saves one answer (null = the client left an optional question empty). Returns false if it could not be saved.
  const persist = useCallback(
    async (question: Question, answer: unknown, updated: Answers, nextKey: string | null): Promise<boolean> => {
      if (!catalog) return false;
      if (userId) {
        const result =
          answer === null
            ? await supabase.from("onboarding_answers").delete().eq("user_id", userId).eq("question_key", question.key)
            : await supabase.from("onboarding_answers").upsert(
                {
                  user_id: userId,
                  question_key: question.key,
                  question_text: lang === "es" ? question.title_es : question.title_en,
                  answer,
                },
                { onConflict: "user_id,question_key" },
              );
        if (result.error) return false;

        // Progress on the client's record (not critical: the answers above are what matters)
        const complete = catalog.questionnaires
          .filter((q) => q.kind === "questions")
          .every((q) =>
          buildQuestions(catalog, updated, q.key).every((item) => !item.required || item.key in updated),
        );
        const record: Record<string, unknown> = {
          current_question: nextKey,
          status: complete ? "completed" : "in_progress",
          completed_at: complete ? new Date().toISOString() : null,
        };
        const field = CLIENT_FIELDS[question.key];
        if (field) record[field] = answerSummary(answer);
        await supabase.from("onboarding_clients").update(record).eq("user_id", userId);
      } else {
        try {
          localStorage.setItem(TEST_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          /* storage unavailable: the answers still live in memory for this visit */
        }
      }
      setAnswers(updated);
      return true;
    },
    [catalog, userId, lang],
  );

  if (loadFailed) return <p className={styles.error}>{t.loadError}</p>;
  if (!catalog) return <p className={styles.note}>{t.loading}</p>;
  if (!catalog.questionnaires.length) return <p className={styles.note}>{t.noQuestions}</p>;

  const open = (key: string) => {
    // Questions shared by several questionnaires are asked in each one, prefilled with the saved answer
    setActive({ key, skip: [] });
    window.scrollTo({ top: 0 });
  };

  // Progress of each questionnaire, for the list and to know what comes next
  const summary = catalog.questionnaires.map((q) => {
    if (q.kind === "extras") {
      // Optional page: it never blocks anything, so it only counts what the client added
      const added = extras.files.length + extras.colors.length + extras.links.length + (extras.notes.trim() ? 1 : 0);
      return { q, total: 0, answered: added, status: "done" } as const;
    }
    const list = buildQuestions(catalog, answers, q.key);
    const answered = list.filter((item) => item.key in answers).length;
    const complete = list.every((item) => !item.required || item.key in answers);
    return { q, total: list.length, answered, status: complete ? "done" : answered ? "progress" : "new" } as const;
  });

  if (active) {
    const current = catalog.questionnaires.find((q) => q.key === active.key);
    const pending = summary.find((row) => row.q.key !== active.key && row.status !== "done");
    if (current?.kind === "extras") {
      return <Extras userId={userId} lang={lang} initial={extras} onChange={setExtras} onExit={() => setActive(null)} />;
    }
    if (current) {
      return (
        <Runner
          key={active.key}
          catalog={catalog}
          answers={answers}
          questionnaire={current}
          skip={active.skip}
          lang={lang}
          testMode={!userId}
          persist={persist}
          onExit={() => setActive(null)}
          next={pending ? pending.q : null}
          onOpen={open}
        />
      );
    }
  }

  const everythingDone = summary.every((row) => row.status === "done");
  return (
    <section className={styles.card}>
      {!userId && (
        <p className={styles.testBanner}>
          <Icon name="flask" size={22} />
          {t.testBanner}
        </p>
      )}
      <h1 className={styles.title}>{t.homeTitle}</h1>
      {everythingDone && <p className={styles.text}>{t.allDone}</p>}
      <ul className={styles.list}>
        {summary.map(({ q, total, answered, status }) => (
          <li key={q.key} className={styles.item}>
            <div className={styles.itemHead}>
              <h2 className={styles.itemTitle}>{lang === "es" ? q.title_es : q.title_en}</h2>
              {q.kind === "extras" ? (
                <span className={styles.badge}>{t.optionalTag}</span>
              ) : (
                <span className={status === "done" ? `${styles.badge} ${styles.badgeDone}` : styles.badge}>
                  {status === "done" ? t.statusDone : status === "progress" ? t.statusProgress : t.statusNew}
                </span>
              )}
            </div>
            <p className={styles.itemText}>{lang === "es" ? q.description_es : q.description_en}</p>
            {(lang === "es" ? q.note_es : q.note_en) && (
              <p className={styles.itemNote}>
                <strong>{t.whyLabel}</strong> {lang === "es" ? q.note_es : q.note_en}
              </p>
            )}
            {q.kind === "questions" && (
              <div className={styles.bar}>
                <i style={{ width: `${total ? Math.round((answered / total) * 100) : 100}%` }} />
              </div>
            )}
            <div className={styles.itemFoot}>
              {q.kind === "extras" ? (
                <span>
                  {answered
                    ? t.extrasCount
                        .replace("{files}", String(extras.files.length))
                        .replace(/\{colou?res?\}/, String(extras.colors.length))
                        .replace("{links}", String(extras.links.length))
                    : t.extrasEmpty}
                </span>
              ) : (
                <span>{t.answered.replace("{n}", String(answered)).replace("{total}", String(total))}</span>
              )}
              <button type="button" className={status === "done" ? styles.secondary : styles.primary} onClick={() => open(q.key)}>
                {q.kind === "extras" ? t.openItem : status === "done" ? t.review : status === "progress" ? t.resume : t.start}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className={styles.account}>{userId ? `${t.signedInAs} ${email}` : t.testAccount}</p>
    </section>
  );
}

type RunnerProps = {
  catalog: Catalog;
  answers: Answers;
  questionnaire: QuestionnaireRow;
  skip: string[];
  lang: Lang;
  testMode: boolean;
  persist: (question: Question, answer: unknown, updated: Answers, nextKey: string | null) => Promise<boolean>;
  onExit: () => void;
  next: QuestionnaireRow | null; // another questionnaire still to complete
  onOpen: (key: string) => void;
};

// One questionnaire, one question per screen
function Runner({ catalog, answers, questionnaire, skip, lang, testMode, persist, onExit, next, onOpen }: RunnerProps) {
  const t = COPY[lang];
  const name = lang === "es" ? questionnaire.title_es : questionnaire.title_en;
  const listFor = useCallback(
    (source: Answers) => buildQuestions(catalog, source, questionnaire.key).filter((q) => !skip.includes(q.key) && !COMPANION_KEYS.includes(q.key)),
    [catalog, questionnaire.key, skip],
  );
  // The list depends on the industry answer, so it is rebuilt whenever the answers change
  const questions = useMemo(() => listFor(answers), [listFor, answers]);
  // Opens at the first question without an answer; if all have one, at the beginning to review
  // A screen also counts as unanswered when one of its companion questions (same screen) is missing
  const [index, setIndex] = useState(() =>
    Math.max(questions.findIndex((q) => !(q.key in answers) || (COMPANION[q.key] ?? []).some((c) => !(c in answers))), 0),
  );
  const [done, setDone] = useState(questions.length === 0);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Intro pop-up: shown every time this questionnaire is opened, until the client presses "Don't show again"
  const introText = lang === "es" ? questionnaire.intro_text_es : questionnaire.intro_text_en;
  const introTitle = lang === "es" ? questionnaire.intro_title_es : questionnaire.intro_title_en;
  const introKey = `eb-onboarding-intro-${questionnaire.key}`;
  const [showIntro, setShowIntro] = useState(false);
  const [companionText, setCompanionText] = useState<Record<string, string>>({}); // answers of the companion questions on this screen
  const [companionNone, setCompanionNone] = useState<Record<string, boolean>>({}); // "I don't have one" ticked on a companion
  const [dials, setDials] = useState<Record<string, string>>({}); // dialing code chosen for each phone field
  const [na, setNa] = useState(false); // "Does not apply" is ticked on the current question
  const [showExample, setShowExample] = useState(false); // the Help button's sample answer is open
  // Dictation writes straight into the long answer while the client speaks
  const live = useLiveText(draft?.kind === "text" ? draft.text : "", (text) => setDraft({ kind: "text", text }));
  useEffect(() => {
    try {
      if (!localStorage.getItem(introKey)) setShowIntro(true);
    } catch {
      setShowIntro(true); // storage unavailable: show it, it just won't be remembered
    }
  }, [introKey]);
  const closeIntro = useCallback(() => setShowIntro(false), []);
  const hideIntroForGood = useCallback(() => {
    setShowIntro(false);
    try {
      localStorage.setItem(introKey, "hidden");
    } catch {
      /* not remembered */
    }
  }, [introKey]);
  useEffect(() => {
    if (!showIntro) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") closeIntro();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showIntro, closeIntro]);

  const question = questions[index];
  const companions = useMemo(() => {
    const keys = question ? COMPANION[question.key] : undefined;
    if (!keys) return [];
    const all = buildQuestions(catalog, answers, questionnaire.key);
    return keys.map((key) => all.find((q) => q.key === key)).filter((q): q is Question => !!q);
    // answers only matter for the industry pack, which does not change the companion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.key, catalog, questionnaire.key]);

  // Each screen starts from the saved answer, if there is one
  useEffect(() => {
    if (!question) return;
    const saved = answers[question.key];
    setNa(isNotApplicable(saved));
    setShowExample(false);
    setDraft(toDraft(question, isNotApplicable(saved) ? null : saved));
    const texts: Record<string, string> = {};
    for (const c of companions) {
      const savedText = answers[c.key];
      texts[c.key] = typeof savedText === "string" ? savedText : "";
    }
    setCompanionText(texts);
    const nones: Record<string, boolean> = {};
    for (const c of companions) nones[c.key] = (answers[c.key] as { value?: string } | undefined)?.value === "none";
    setCompanionNone(nones);
    setError(null);
    // answers is read on purpose only when the screen changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.key]);

  const total = questions.length;
  const isLast = index === total - 1;

  const save = useCallback(async () => {
    if (!question || !draft || saving) return;
    // The email field (contact information) must look like an email when it is filled in
    if (!na && draft.kind === "fields") {
      const email = (draft.values.email ?? "").trim();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError(t.invalidEmail);
    }
    const answer = na ? { value: NOT_APPLICABLE, label: t.notApplicableShort } : toAnswer(question, draft, lang);
    if (answer === null && question.required) return setError(t.required);
    const companionAnswers = companions.map((c) => ({ q: c, a: toAnswer(c, { kind: "text", text: companionText[c.key] ?? "", none: !!companionNone[c.key] }, lang) }));
    if (companionAnswers.some((c) => c.a === null && c.q.required)) return setError(t.required);
    setError(null);
    setSaving(true);

    // The industry answer changes which questions follow, so the next one comes from the list as it is after this answer
    const updated = { ...answers };
    if (answer === null) delete updated[question.key];
    else updated[question.key] = answer;
    for (const c of companionAnswers) {
      if (c.a === null) delete updated[c.q.key];
      else updated[c.q.key] = c.a;
    }
    const updatedList = listFor(updated);
    const position = updatedList.findIndex((q) => q.key === question.key);
    const following = updatedList[position + 1];

    let saved = true;
    for (const c of companionAnswers) {
      if (saved) saved = await persist(c.q, c.a, updated, following ? following.key : null);
    }
    if (saved) saved = await persist(question, answer, updated, following ? following.key : null);
    setSaving(false);
    if (!saved) return setError(t.saveError);
    if (following) setIndex(position + 1);
    else setDone(true);
    window.scrollTo({ top: 0 });
  }, [question, companions, companionText, companionNone, draft, na, saving, lang, t, answers, listFor, persist]);

  const progress = useMemo(() => (total ? Math.round(((done ? total : index) / total) * 100) : 0), [done, index, total]);

  if (done) {
    return (
      <section className={styles.card}>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h1 className={styles.title}>{t.doneTitle.replace("{name}", name)}</h1>
        <p className={styles.text}>{t.doneText}</p>
        <div className={`${styles.actions} ${styles.actionsCenter}`}>
          <button type="button" className={styles.primary} onClick={onExit}>
            {t.close}
          </button>
        </div>
      </section>
    );
  }

  if (!question || !draft) return <p className={styles.note}>{t.loading}</p>;

  const title = lang === "es" ? question.title_es : question.title_en;
  const help = lang === "es" ? question.help_es : question.help_en;
  const example = lang === "es" ? question.example_es : question.example_en;
  const onEnter = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      save();
    }
  };

  return (
    <section className={styles.card}>
      {showIntro && introText && (
        <div className={styles.introOverlay} onClick={closeIntro}>
          <div className={styles.intro} role="dialog" aria-modal="true" aria-label={introTitle ?? name} onClick={(e) => e.stopPropagation()}>
            <p className={styles.eyebrow}>{name}</p>
            <h2 className={styles.introTitle}>{introTitle ?? name}</h2>
            {/* Lines starting with "- " are shown as a list of tips; the rest as plain paragraphs */}
            {introText
              .split("\n")
              .filter((line) => line.trim() && !line.startsWith("- "))
              .map((line, i) => (
                <p key={i} className={styles.text}>
                  {line}
                </p>
              ))}
            <ul className={styles.tips}>
              {introText
                .split("\n")
                .filter((line) => line.startsWith("- "))
                .map((line, i) => (
                  <li key={i}>{line.slice(2)}</li>
                ))}
            </ul>
            <div className={styles.introActions}>
              <button type="button" className={styles.secondary} onClick={hideIntroForGood}>
                {t.dontShow}
              </button>
              <button type="button" className={styles.primary} autoFocus onClick={closeIntro}>
                {t.closeTips}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.runnerTop}>
        <button type="button" className={styles.pillBtn} onClick={onExit}>
          <Icon name="back" size={18} />
          {t.backToList}
        </button>
        {introText && (
          <button type="button" className={styles.pillBtn} onClick={() => setShowIntro(true)}>
            <Icon name="bulb" size={18} />
            {t.seeTips}
          </button>
        )}
      </div>
      {testMode && (
        <p className={styles.testBanner}>
          <Icon name="flask" size={22} />
          <span>{t.testBanner}</span>
        </p>
      )}
      <div className={styles.progressRow}>
        <span>{t.progress.replace("{n}", String(index + 1)).replace("{total}", String(total))}</span>
        <span>
          {name} · {question.formTitle[lang]}
        </span>
      </div>
      <div className={styles.barRow}>
        <div className={styles.bar} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <i style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.percent}>{progress} %</span>
      </div>

      <div className={styles.questionRow}>
        <span className={styles.qIcon}>
          <Icon name={QUESTION_ICON[question.key] ?? "store"} size={30} />
        </span>
        <div className={styles.qText}>
          <h1 className={styles.question}>{title}</h1>
          {help && <p className={styles.help}>{help}</p>}
          {!question.required && <p className={styles.optional}>{t.optional}</p>}
        </div>
        {example && (
          <button type="button" className={styles.helpBtn} aria-expanded={showExample} onClick={() => setShowExample((v) => !v)}>
            <Icon name="eye" size={18} />
            {showExample ? t.helpBtnClose : t.helpBtn}
          </button>
        )}
      </div>
      {example && showExample && (
        <div className={styles.example}>
          <strong>{t.exampleLabel}</strong>
          {companions.length ? (
            <>
              <p>
                <em>{title}:</em> {example}
              </p>
              {companions.map((c) => {
                const text = lang === "es" ? c.example_es : c.example_en;
                return text ? (
                  <p key={c.key}>
                    <em>{lang === "es" ? c.title_es : c.title_en}:</em> {text}
                  </p>
                ) : null;
              })}
            </>
          ) : (
            <p>{example}</p>
          )}
        </div>
      )}

      <fieldset className={`${styles.field} ${styles.fieldset}${na ? ` ${styles.fieldNa}` : ""}`} disabled={na}>
        {draft.kind === "text" && question.type === "long_text" && (
          <textarea
            className={styles.textarea}
            rows={6}
            autoFocus
            placeholder={t.typeHere}
            aria-label={title}
            value={draft.text}
            onChange={(e) => {
              live.onTyped();
              setDraft({ kind: "text", text: e.target.value });
              setError(null);
            }}
          />
        )}
        {/* Speak instead of typing: each finished phrase is added at the end of the answer */}
        {draft.kind === "text" && question.type === "long_text" && (
          <Dictate
            key={question.key}
            lang={lang}
            onLive={live.onLive}
            onClear={
              draft.text
                ? () => {
                    live.onTyped();
                    setDraft({ kind: "text", text: "" });
                  }
                : undefined
            }
          />
        )}
        {draft.kind === "text" && question.type !== "long_text" && (
          <input
            className={styles.input}
            type={question.type === "url" ? "url" : "text"}
            inputMode={question.type === "url" ? "url" : "text"}
            autoFocus
            placeholder={question.type === "url" ? "https://" : t.typeHere}
            aria-label={title}
            value={draft.text}
            disabled={draft.none}
            onKeyDown={onEnter}
            onChange={(e) => {
              setDraft({ kind: "text", text: e.target.value });
              setError(null);
            }}
          />
        )}
        {/* A way to say there is none (website, slogan...), instead of leaving it blank */}
        {draft.kind === "text" && question.allow_none && (
          <button
            type="button"
            role="checkbox"
            aria-checked={!!draft.none}
            className={draft.none ? `${styles.option} ${styles.optionOn} ${styles.noneOption}` : `${styles.option} ${styles.noneOption}`}
            onClick={() => {
              setDraft({ kind: "text", text: "", none: !draft.none });
              setError(null);
            }}
          >
            <span className={styles.check} />
            {t.dontHave}
          </button>
        )}

        {draft.kind === "single" && (
          <div className={styles.options} role="radiogroup" aria-label={title}>
            {question.options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={draft.value === option.value}
                className={draft.value === option.value ? `${styles.option} ${styles.optionOn}` : styles.option}
                onClick={() => {
                  setDraft({ ...draft, value: option.value });
                  setError(null);
                }}
              >
                <span className={styles.dot} />
                {question.key === "industry" && SECTOR_PNG.includes(option.value) && (
                  <img className={styles.sectorImg} src={`/images/sectors/${option.value}.png`} alt="" width={36} height={36} />
                )}
                {question.key === "industry" && !SECTOR_PNG.includes(option.value) && SECTOR_STYLE[option.value] && (
                  <span className={styles.sectorIcon} style={{ color: SECTOR_STYLE[option.value].color, background: SECTOR_STYLE[option.value].bg }}>
                    <Icon name={SECTOR_STYLE[option.value].icon} size={20} />
                  </span>
                )}
                {label(option, lang)}
              </button>
            ))}
            {draft.value === "other" && (
              <input
                className={styles.input}
                type="text"
                autoFocus
                placeholder={t.otherPlaceholder}
                aria-label={t.otherPlaceholder}
                value={draft.other}
                onKeyDown={onEnter}
                onChange={(e) => setDraft({ ...draft, other: e.target.value })}
              />
            )}
          </div>
        )}

        {draft.kind === "multi" && (
          <div className={styles.options} role="group" aria-label={title}>
            {question.options.map((option) => {
              const on = draft.values.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  className={on ? `${styles.option} ${styles.optionOn}` : styles.option}
                  onClick={() => {
                    // "none" / "all" and the other options exclude each other
                    const alone = (value: string) => value === "none" || value === "all";
                    let values = on ? draft.values.filter((v) => v !== option.value) : [...draft.values, option.value];
                    if (!on) values = alone(option.value) ? [option.value] : values.filter((v) => !alone(v));
                    setDraft({ kind: "multi", values, other: draft.other });
                    setError(null);
                  }}
                >
                  <span className={styles.check} />
                  {label(option, lang)}
                </button>
              );
            })}
            {draft.values.includes("other") && (
              <input
                className={styles.input}
                type="text"
                autoFocus
                placeholder={question.key === "languages" ? t.otherLanguagesPlaceholder : t.otherPlaceholder}
                aria-label={question.key === "languages" ? t.otherLanguagesPlaceholder : t.otherPlaceholder}
                value={draft.other ?? ""}
                onKeyDown={onEnter}
                onChange={(e) => setDraft({ ...draft, other: e.target.value })}
              />
            )}
          </div>
        )}

        {draft.kind === "links" && (
          <div className={styles.options} role="group" aria-label={title}>
            {question.options.map((option) => {
              const on = option.value in draft.links;
              return (
                <div key={option.value} className={styles.linkRow}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    className={on ? `${styles.option} ${styles.optionOn}` : styles.option}
                    onClick={() => {
                      const links = { ...draft.links };
                      if (on) delete links[option.value];
                      else links[option.value] = "";
                      setDraft({ kind: "links", links });
                      setError(null);
                    }}
                  >
                    <span className={styles.check} />
                    {label(option, lang)}
                  </button>
                  {on && (
                    <input
                      className={styles.input}
                      type="url"
                      inputMode="url"
                      placeholder={t.linkPlaceholder}
                      aria-label={`${label(option, lang)}: link`}
                      value={draft.links[option.value]}
                      onChange={(e) => setDraft({ kind: "links", links: { ...draft.links, [option.value]: e.target.value } })}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {companions.map((c) => {
          const cTitle = lang === "es" ? c.title_es : c.title_en;
          const cExample = lang === "es" ? c.example_es : c.example_en;
          const long = c.type === "long_text";
          const common = {
            "aria-label": cTitle,
            placeholder: (long ? cExample : c.type === "url" ? "https://" : null) ?? t.typeHere,
            value: companionText[c.key] ?? "",
            onChange: (e: { target: { value: string } }) => {
              setCompanionText({ ...companionText, [c.key]: e.target.value });
              setError(null);
            },
          };
          return (
            <div key={c.key} className={styles.companion}>
              <h3 className={styles.companionTitle}>{cTitle}</h3>
              {long ? (
                <textarea className={styles.textarea} rows={4} {...common} />
              ) : (
                <input className={styles.input} type={c.type === "url" ? "url" : "text"} inputMode={c.type === "url" ? "url" : "text"} disabled={!!companionNone[c.key]} {...common} />
              )}
              {c.allow_none && (
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={!!companionNone[c.key]}
                  className={companionNone[c.key] ? `${styles.option} ${styles.optionOn} ${styles.noneOption}` : `${styles.option} ${styles.noneOption}`}
                  onClick={() => {
                    setCompanionNone({ ...companionNone, [c.key]: !companionNone[c.key] });
                    setCompanionText({ ...companionText, [c.key]: "" });
                    setError(null);
                  }}
                >
                  <span className={styles.check} />
                  {c.key === "website" ? t.noWebsite : t.dontHave}
                </button>
              )}
            </div>
          );
        })}
        {draft.kind === "fields" && (
          <div className={styles.fieldsGrid}>
            {question.options.map((o) => {
              const isPhone = o.value === "phone" || o.value === "whatsapp";
              const split = splitDial(draft.values[o.value] ?? "");
              const dial = dials[o.value] ?? split.dial ?? DEFAULT_DIAL;
              // Phones are saved with their code ("+52 33 1234 5678"); empty when no number was typed
              const setPhone = (d: string, number: string) =>
                setDraft({ kind: "fields", values: { ...draft.values, [o.value]: number.trim() ? `${d} ${number.trim()}` : "" } });
              return (
                <label key={o.value} className={styles.fieldBox}>
                  <span className={styles.fieldLabel}>{label(o, lang)}</span>
                  {isPhone ? (
                    <span className={styles.phoneRow}>
                      <DialPicker
                        label={lang === "es" ? "Lada del país" : "Country code"}
                        value={dial}
                        onChange={(code) => {
                          setDials({ ...dials, [o.value]: code });
                          setPhone(code, split.number);
                        }}
                      />
                      <input
                        className={styles.input}
                        type="text"
                        inputMode="tel"
                        value={split.number}
                        onChange={(e) => {
                          setPhone(dial, e.target.value);
                          setError(null);
                        }}
                      />
                    </span>
                  ) : (
                    <input
                      className={styles.input}
                      type={o.value === "email" ? "email" : "text"}
                      inputMode={o.value === "email" ? "email" : "text"}
                      value={draft.values[o.value] ?? ""}
                      onChange={(e) => {
                        setDraft({ kind: "fields", values: { ...draft.values, [o.value]: e.target.value } });
                        setError(null);
                      }}
                    />
                  )}
                </label>
              );
            })}
          </div>
        )}

        {draft.kind === "faq" && (
          <div className={styles.faqs}>
            {draft.items.map((item, i) => (
              <div key={i} className={styles.faq}>
                <div className={styles.faqTop}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder={t.faqQuestion}
                    aria-label={`${t.faqQuestion} ${i + 1}`}
                    value={item.question}
                    onChange={(e) => {
                      const items = draft.items.map((it, j) => (j === i ? { ...it, question: e.target.value } : it));
                      setDraft({ kind: "faq", items });
                      setError(null);
                    }}
                  />
                  {draft.items.length > 1 ? (
                    <button
                      type="button"
                      className={styles.itemRemove}
                      aria-label={`${t.remove} ${i + 1}`}
                      title={t.remove}
                      onClick={() => setDraft({ kind: "faq", items: draft.items.filter((_, j) => j !== i) })}
                    >
                      ×
                    </button>
                  ) : (
                    <span className={styles.itemRemove} />
                  )}
                </div>
                <textarea
                  className={styles.textarea}
                  rows={2}
                  placeholder={t.faqAnswer}
                  aria-label={`${t.faqAnswer} ${i + 1}`}
                  value={item.answer}
                  onChange={(e) => {
                    const items = draft.items.map((it, j) => (j === i ? { ...it, answer: e.target.value } : it));
                    setDraft({ kind: "faq", items });
                    setError(null);
                  }}
                />
              </div>
            ))}
            <button type="button" className={styles.addLink} onClick={() => setDraft({ kind: "faq", items: [...draft.items, { question: "", answer: "" }] })}>
              + {t.addFaq}
            </button>
          </div>
        )}

        {draft.kind === "items" && (
          <div className={styles.faqs}>
            {/* Whether the agent may tell customers the prices; when not, the price fields disappear */}
            <div className={styles.priceChoice}>
              <p className={styles.label}>{t.sharePrices}</p>
              <button
                type="button"
                role="switch"
                aria-checked={draft.sharePrices}
                aria-label={t.sharePrices}
                className={draft.sharePrices ? `${styles.toggle} ${styles.toggleOn}` : styles.toggle}
                onClick={() => setDraft({ ...draft, sharePrices: !draft.sharePrices })}
              >
                <span className={styles.toggleTrack}>
                  <i />
                </span>
                <span className={styles.toggleText}>{draft.sharePrices ? t.yes : t.no}</span>
              </button>
            </div>
            <p className={styles.listTitle}>{ITEM_LIST_TITLE[question.key]?.[lang] ?? t.itemN}</p>
            <div className={draft.sharePrices ? styles.itemsHead : `${styles.itemsHead} ${styles.itemsNoPrice}`} aria-hidden="true">
              <span>{t.itemName}</span>
              {draft.sharePrices && <span>{t.itemPrice}</span>}
              <span>{t.itemDetails}</span>
              <span />
            </div>
            {draft.items.map((item, i) => {
              const setItem = (patch: Partial<Item>) => {
                setDraft({ ...draft, items: draft.items.map((it, j) => (j === i ? { ...it, ...patch } : it)) });
                setError(null);
              };
              return (
                <div key={i} className={draft.sharePrices ? styles.itemRow : `${styles.itemRow} ${styles.itemsNoPrice}`}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder={t.itemName}
                    aria-label={`${t.itemName} ${i + 1}`}
                    value={item.name}
                    onChange={(e) => setItem({ name: e.target.value })}
                  />
                  {draft.sharePrices && (
                    <input
                      className={styles.input}
                      type="text"
                      inputMode="decimal"
                      placeholder={t.itemPrice}
                      aria-label={`${t.itemPrice} ${i + 1}`}
                      value={item.price}
                      onChange={(e) => setItem({ price: e.target.value })}
                    />
                  )}
                  <input
                    className={`${styles.input} ${styles.itemDetails}`}
                    type="text"
                    placeholder={t.itemDetails}
                    aria-label={`${t.itemDetails} ${i + 1}`}
                    value={item.details}
                    onChange={(e) => setItem({ details: e.target.value })}
                  />
                  {draft.items.length > 1 ? (
                    <button
                      type="button"
                      className={styles.itemRemove}
                      aria-label={`${t.remove} ${i + 1}`}
                      title={t.remove}
                      onClick={() => setDraft({ ...draft, items: draft.items.filter((_, j) => j !== i) })}
                    >
                      ×
                    </button>
                  ) : (
                    <span className={styles.itemRemove} />
                  )}
                </div>
              );
            })}
            <button type="button" className={styles.addLink} onClick={() => setDraft({ ...draft, items: [...draft.items, { name: "", details: "", price: "" }] })}>
              + {t.addItem}
            </button>
          </div>
        )}
      </fieldset>

      {question.allow_na && (
        <button
          type="button"
          role="checkbox"
          aria-checked={na}
          className={na ? `${styles.option} ${styles.optionOn} ${styles.naOption}` : `${styles.option} ${styles.naOption}`}
          onClick={() => {
            setNa(!na);
            setError(null);
          }}
        >
          <span className={styles.check} />
          {t.notApplicable}
        </button>
      )}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.secondary} disabled={index === 0 || saving} onClick={() => setIndex(index - 1)}>
          {t.back}
        </button>
        <button type="button" className={styles.primary} disabled={saving} onClick={save}>
          {saving ? t.saving : isLast ? t.finish : t.next}
          {!saving && !isLast && <Icon name="next" size={20} />}
        </button>
      </div>
    </section>
  );
}
