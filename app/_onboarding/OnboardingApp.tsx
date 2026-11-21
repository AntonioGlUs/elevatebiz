"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import Extras, { EMPTY_EXTRAS, TEST_EXTRAS_KEY, type ExtraFile, type ExtraLink, type ExtrasData } from "./Extras";
import Dictate, { useLiveText } from "./Dictate";
import styles from "./onboarding.module.css";

type Lang = "en" | "es";
type Option = { value: string; en: string; es: string };
type QuestionType = "text" | "long_text" | "url" | "single_choice" | "multi_choice" | "links" | "faq_list" | "item_list";

type Question = {
  key: string;
  type: QuestionType;
  title_en: string;
  title_es: string;
  help_en: string | null;
  help_es: string | null;
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
  | { kind: "multi"; values: string[] }
  | { kind: "links"; links: Record<string, string> } // option value -> link; present = selected
  | { kind: "faq"; items: Faq[] }
  | { kind: "items"; items: Item[]; sharePrices: boolean }; // products / treatments / services with their prices

const COPY = {
  en: {
    brand: "ElevateBiz",
    eyebrow: "CLIENT ONBOARDING",
    loginTitle: "Let's set up your AI agents",
    loginText: "Enter your email and we'll send you a link to get in, no password needed. Use the same email to come back and continue later.",
    email: "Email address",
    sendLink: "Send me the link",
    sending: "Sending...",
    sentTitle: "Check your email",
    sentText: "We sent a sign-in link to {email}. Open it on this device to continue.",
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
    notApplicable: "Does not apply to my business",
    notApplicableShort: "Does not apply",
    otherPlaceholder: "Tell us which one",
    linkPlaceholder: "Paste the link (optional)",
    faqQuestion: "Question",
    faqAnswer: "Answer",
    addFaq: "Add another question",
    sharePrices: "Should your agent tell customers the prices?",
    sharePricesYes: "Yes, share prices",
    sharePricesNo: "No, keep prices private",
    itemName: "Name",
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
    sendLink: "Enviarme el enlace",
    sending: "Enviando...",
    sentTitle: "Revisa tu correo",
    sentText: "Enviamos un enlace de acceso a {email}. Ábrelo en este dispositivo para continuar.",
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
    notApplicable: "No aplica a mi negocio",
    notApplicableShort: "No aplica",
    otherPlaceholder: "Cuéntanos cuál",
    linkPlaceholder: "Pega el link (opcional)",
    faqQuestion: "Pregunta",
    faqAnswer: "Respuesta",
    addFaq: "Agregar otra pregunta",
    sharePrices: "¿Quieres que tu agente les diga los precios a los clientes?",
    sharePricesYes: "Sí, que dé precios",
    sharePricesNo: "No, sin precios",
    itemName: "Nombre",
    itemPrice: "Precio",
    itemDetails: "Detalles (opcional)",
    addItem: "Agregar otro",
    remove: "Quitar",
    doneTitle: "{name}: completo",
    doneText: "Tus respuestas están guardadas. Puedes volver y cambiarlas cuando quieras.",
    review: "Revisar mis respuestas",
    homeTitle: "Tu onboarding",
    homeText: "Contéstalos en el orden que quieras; tu avance se guarda conforme avanzas.",
    optionalTag: "Opcional",
    whyLabel: "¿Para qué sirve?",
    closeTips: "Cerrar",
    dontShow: "No volver a mostrar",
    seeTips: "Ver tips",
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

const label = (option: Option, lang: Lang) => option[lang] ?? option.en;

function emptyDraft(type: QuestionType): Draft {
  if (type === "single_choice") return { kind: "single", value: "", other: "" };
  if (type === "multi_choice") return { kind: "multi", values: [] };
  if (type === "links") return { kind: "links", links: {} };
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
      return { kind: "multi", values: saved.map((s: { value: string }) => s.value) };
    }
    if (draft.kind === "links" && Array.isArray(saved)) {
      const links: Record<string, string> = {};
      saved.forEach((s: { value: string; url?: string }) => (links[s.value] = s.url ?? ""));
      return { kind: "links", links };
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
    return draft.values.map((value) => ({ value, label: optionLabel(value) }));
  }
  if (draft.kind === "links") {
    const selected = Object.keys(draft.links);
    if (!selected.length) return null;
    return selected.map((value) => ({ value, label: optionLabel(value), url: draft.links[value].trim() }));
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

// A question can be in several questionnaires (the business name, for example). It is answered once:
// these are the ones a questionnaire leaves out because the client already answered them in another one.
function answeredElsewhere(catalog: Catalog, answers: Answers, questionnaire: string): string[] {
  const owner = new Map<string, string>(); // question -> first questionnaire, in order, that includes it
  for (const q of catalog.questionnaires.filter((row) => row.kind === "questions")) {
    for (const item of buildQuestions(catalog, answers, q.key)) if (!owner.has(item.key)) owner.set(item.key, q.key);
  }
  return buildQuestions(catalog, answers, questionnaire)
    .filter((item) => owner.get(item.key) !== questionnaire && item.key in answers)
    .map((item) => item.key);
}

export default function OnboardingApp() {
  const [lang, setLang] = useState<Lang>("en");
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [testing, setTesting] = useState(false); // questionnaire opened without signing in
  const t = COPY[lang];

  // Same saved language as the rest of the site
  useEffect(() => {
    try {
      const saved = localStorage.getItem("eb-lang");
      if (saved === "es" || (saved !== "en" && navigator.language.toLowerCase().startsWith("es"))) setLang("es");
    } catch {
      /* private mode: stays in English */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

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

function Login({ lang, onTry }: { lang: Lang; onTry?: () => void }) {
  const t = COPY[lang];
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
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
      options: { emailRedirectTo: `${window.location.origin}/onboarding/` },
    });
    if (failure) {
      setState("idle");
      setError(t.loginError);
      return;
    }
    setState("sent");
  };

  if (state === "sent") {
    return (
      <section className={styles.card}>
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
    <section className={styles.card}>
      <p className={styles.eyebrow}>{t.eyebrow}</p>
      <h1 className={styles.title}>{t.loginTitle}</h1>
      <p className={styles.text}>{t.loginText}</p>
      <form onSubmit={submit} noValidate className={styles.form}>
        <label className={styles.label} htmlFor="onb-email">
          {t.email}
        </label>
        <input
          id="onb-email"
          className={styles.input}
          type="email"
          autoComplete="email"
          inputMode="email"
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
        <button type="submit" className={styles.primary} disabled={state === "sending"}>
          {state === "sending" ? t.sending : t.sendLink}
        </button>
      </form>
      {onTry && (
        <button type="button" className={`${styles.link} ${styles.tryIt}`} onClick={onTry}>
          {t.tryIt}
        </button>
      )}
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
        supabase.from("onboarding_questions").select("key,type,title_en,title_es,help_en,help_es,options,required,allow_none,allow_na").eq("active", true),
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
    const kind = catalog.questionnaires.find((q) => q.key === key)?.kind;
    setActive({ key, skip: kind === "extras" ? [] : answeredElsewhere(catalog, answers, key) });
    window.scrollTo({ top: 0 });
  };

  // Progress of each questionnaire, for the list and to know what comes next
  const summary = catalog.questionnaires.map((q) => {
    if (q.kind === "extras") {
      // Optional page: it never blocks anything, so it only counts what the client added
      const added = extras.files.length + extras.colors.length + extras.links.length + (extras.notes.trim() ? 1 : 0);
      return { q, total: 0, answered: added, status: "done" } as const;
    }
    const skip = answeredElsewhere(catalog, answers, q.key);
    const list = buildQuestions(catalog, answers, q.key).filter((item) => !skip.includes(item.key));
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
      {!userId && <p className={styles.testBanner}>{t.testBanner}</p>}
      <p className={styles.eyebrow}>{t.eyebrow}</p>
      <h1 className={styles.title}>{t.homeTitle}</h1>
      <p className={styles.text}>{everythingDone ? t.allDone : t.homeText}</p>
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
    (source: Answers) => buildQuestions(catalog, source, questionnaire.key).filter((q) => !skip.includes(q.key)),
    [catalog, questionnaire.key, skip],
  );
  // The list depends on the industry answer, so it is rebuilt whenever the answers change
  const questions = useMemo(() => listFor(answers), [listFor, answers]);
  // Opens at the first question without an answer; if all have one, at the beginning to review
  const [index, setIndex] = useState(() => Math.max(questions.findIndex((q) => !(q.key in answers)), 0));
  const [done, setDone] = useState(questions.length === 0);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Intro pop-up: shown every time this questionnaire is opened, until the client presses "Don't show again"
  const introText = lang === "es" ? questionnaire.intro_text_es : questionnaire.intro_text_en;
  const introTitle = lang === "es" ? questionnaire.intro_title_es : questionnaire.intro_title_en;
  const introKey = `eb-onboarding-intro-${questionnaire.key}`;
  const [showIntro, setShowIntro] = useState(false);
  const [na, setNa] = useState(false); // "Does not apply" is ticked on the current question
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

  // Each screen starts from the saved answer, if there is one
  useEffect(() => {
    if (!question) return;
    const saved = answers[question.key];
    setNa(isNotApplicable(saved));
    setDraft(toDraft(question, isNotApplicable(saved) ? null : saved));
    setError(null);
    // answers is read on purpose only when the screen changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.key]);

  const total = questions.length;
  const isLast = index === total - 1;

  const save = useCallback(async () => {
    if (!question || !draft || saving) return;
    const answer = na ? { value: NOT_APPLICABLE, label: t.notApplicableShort } : toAnswer(question, draft, lang);
    if (answer === null && question.required) return setError(t.required);
    setError(null);
    setSaving(true);

    // The industry answer changes which questions follow, so the next one comes from the list as it is after this answer
    const updated = { ...answers };
    if (answer === null) delete updated[question.key];
    else updated[question.key] = answer;
    const updatedList = listFor(updated);
    const position = updatedList.findIndex((q) => q.key === question.key);
    const following = updatedList[position + 1];

    const saved = await persist(question, answer, updated, following ? following.key : null);
    setSaving(false);
    if (!saved) return setError(t.saveError);
    if (following) setIndex(position + 1);
    else setDone(true);
    window.scrollTo({ top: 0 });
  }, [question, draft, na, saving, lang, t, answers, listFor, persist]);

  const progress = useMemo(() => (total ? Math.round(((done ? total : index) / total) * 100) : 0), [done, index, total]);

  if (done) {
    return (
      <section className={styles.card}>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h1 className={styles.title}>{t.doneTitle.replace("{name}", name)}</h1>
        <p className={styles.text}>{t.doneText}</p>
        <div className={styles.actions}>
          {total > 0 && (
            <button
              type="button"
              className={styles.secondary}
              onClick={() => {
                setIndex(0);
                setDone(false);
              }}
            >
              {t.review}
            </button>
          )}
          {next ? (
            <button type="button" className={styles.primary} onClick={() => onOpen(next.key)}>
              {t.continueWith.replace("{name}", lang === "es" ? next.title_es : next.title_en)}
            </button>
          ) : (
            <button type="button" className={styles.primary} onClick={onExit}>
              {t.backToList}
            </button>
          )}
        </div>
      </section>
    );
  }

  if (!question || !draft) return <p className={styles.note}>{t.loading}</p>;

  const title = lang === "es" ? question.title_es : question.title_en;
  const help = lang === "es" ? question.help_es : question.help_en;
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
        <button type="button" className={`${styles.link} ${styles.backLink}`} onClick={onExit}>
          ← {t.backToList}
        </button>
        {introText && (
          <button type="button" className={`${styles.link} ${styles.backLink}`} onClick={() => setShowIntro(true)}>
            {t.seeTips}
          </button>
        )}
      </div>
      {testMode && <p className={styles.testBanner}>{t.testBanner}</p>}
      <div className={styles.progressRow}>
        <span>{t.progress.replace("{n}", String(index + 1)).replace("{total}", String(total))}</span>
        <span>
          {name} · {question.formTitle[lang]}
        </span>
      </div>
      <div className={styles.bar} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <i style={{ width: `${progress}%` }} />
      </div>

      <h1 className={styles.question}>{title}</h1>
      {!question.required && <p className={styles.optional}>{t.optional}</p>}
      {help && <p className={styles.help}>{help}</p>}

      <div className={styles.field} hidden={na}>
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
                    setDraft({ kind: "multi", values });
                    setError(null);
                  }}
                >
                  <span className={styles.check} />
                  {label(option, lang)}
                </button>
              );
            })}
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

        {draft.kind === "faq" && (
          <div className={styles.faqs}>
            {draft.items.map((item, i) => (
              <div key={i} className={styles.faq}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder={`${t.faqQuestion} ${i + 1}`}
                  aria-label={`${t.faqQuestion} ${i + 1}`}
                  value={item.question}
                  onChange={(e) => {
                    const items = draft.items.map((it, j) => (j === i ? { ...it, question: e.target.value } : it));
                    setDraft({ kind: "faq", items });
                    setError(null);
                  }}
                />
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder={t.faqAnswer}
                  aria-label={`${t.faqAnswer} ${i + 1}`}
                  value={item.answer}
                  onChange={(e) => {
                    const items = draft.items.map((it, j) => (j === i ? { ...it, answer: e.target.value } : it));
                    setDraft({ kind: "faq", items });
                    setError(null);
                  }}
                />
                {draft.items.length > 1 && (
                  <button type="button" className={styles.link} onClick={() => setDraft({ kind: "faq", items: draft.items.filter((_, j) => j !== i) })}>
                    {t.remove}
                  </button>
                )}
              </div>
            ))}
            <button type="button" className={styles.secondary} onClick={() => setDraft({ kind: "faq", items: [...draft.items, { question: "", answer: "" }] })}>
              + {t.addFaq}
            </button>
          </div>
        )}

        {draft.kind === "items" && (
          <div className={styles.faqs}>
            {/* Whether the agent may tell customers the prices; when not, the price fields disappear */}
            <div className={styles.priceChoice}>
              <p className={styles.label}>{t.sharePrices}</p>
              <div className={styles.priceButtons} role="radiogroup" aria-label={t.sharePrices}>
                {[true, false].map((choice) => (
                  <button
                    key={String(choice)}
                    type="button"
                    role="radio"
                    aria-checked={draft.sharePrices === choice}
                    className={draft.sharePrices === choice ? `${styles.option} ${styles.optionOn}` : styles.option}
                    onClick={() => setDraft({ ...draft, sharePrices: choice })}
                  >
                    <span className={styles.dot} />
                    {choice ? t.sharePricesYes : t.sharePricesNo}
                  </button>
                ))}
              </div>
            </div>
            {draft.items.map((item, i) => {
              const setItem = (patch: Partial<Item>) => {
                setDraft({ ...draft, items: draft.items.map((it, j) => (j === i ? { ...it, ...patch } : it)) });
                setError(null);
              };
              return (
                <div key={i} className={styles.itemRow}>
                  <div className={styles.itemMain}>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder={`${t.itemName} ${i + 1}`}
                      aria-label={`${t.itemName} ${i + 1}`}
                      value={item.name}
                      onChange={(e) => setItem({ name: e.target.value })}
                    />
                    {draft.sharePrices && (
                      <input
                        className={`${styles.input} ${styles.itemPrice}`}
                        type="text"
                        inputMode="decimal"
                        placeholder={t.itemPrice}
                        aria-label={`${t.itemPrice} ${i + 1}`}
                        value={item.price}
                        onChange={(e) => setItem({ price: e.target.value })}
                      />
                    )}
                  </div>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder={t.itemDetails}
                    aria-label={`${t.itemDetails} ${i + 1}`}
                    value={item.details}
                    onChange={(e) => setItem({ details: e.target.value })}
                  />
                  {draft.items.length > 1 && (
                    <button type="button" className={styles.link} onClick={() => setDraft({ ...draft, items: draft.items.filter((_, j) => j !== i) })}>
                      {t.remove}
                    </button>
                  )}
                </div>
              );
            })}
            <button type="button" className={styles.secondary} onClick={() => setDraft({ ...draft, items: [...draft.items, { name: "", details: "", price: "" }] })}>
              + {t.addItem}
            </button>
          </div>
        )}
      </div>

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
        </button>
      </div>
    </section>
  );
}
