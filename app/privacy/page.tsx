"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/content";
import styles from "./privacy.module.css";

type Section = { title: string; body: string[] };

const COPY: Record<Lang, { back: string; title: string; updated: string; intro: string; sections: Section[] }> = {
  en: {
    back: "← Back to ElevateBiz",
    title: "Privacy Policy",
    updated: "Last updated: October 25, 2026",
    intro:
      "ElevateBiz respects your privacy. This page explains what information we collect on elevatebiz.ai, why we collect it, and the choices you have.",
    sections: [
      {
        title: "What we collect",
        body: [
          "Contact form: your name, your email address, your message, and whether you want to join our community. We only receive what you type into the form.",
          "Chat assistant: the messages you send to the chat widget so it can answer you.",
          "Usage data: with Google Analytics, we receive anonymous information about how the site is used, such as pages visited, approximate location, device and browser type.",
          "Language preference: we save your chosen language (English or Spanish) in your browser so the site remembers it. It never leaves your device.",
        ],
      },
      {
        title: "How we use it",
        body: [
          "To reply to your messages and requests.",
          "To send your request to the right team. We use AI to classify each message (for example sales or support) and to write a short summary for our team.",
          "To understand which parts of the site are useful and to improve them.",
          "We do not sell your personal information.",
        ],
      },
      {
        title: "Cookies and Google Analytics",
        body: [
          "We use Google Analytics, a service from Google LLC, to measure visits. It uses cookies and similar technologies to tell visits apart and collect usage statistics.",
          "You can block or delete cookies in your browser settings, or install the Google Analytics opt-out browser add-on at tools.google.com/dlpage/gaoptout.",
          "You can learn how Google uses information from sites that use its services at policies.google.com/technologies/partner-sites.",
        ],
      },
      {
        title: "Who we share it with",
        body: [
          "Only with the service providers that help us run the site: hosting, our API and database, AI processing of contact messages, the chat assistant, and Google Analytics. They process data on our behalf and only for those purposes.",
          "We may also share information if the law requires it.",
        ],
      },
      {
        title: "How long we keep it",
        body: [
          "We keep contact messages only as long as needed to handle your request and keep a record of our conversations. You can ask us to delete them at any time.",
        ],
      },
      {
        title: "Your rights",
        body: [
          "You can ask to see, correct or delete the personal information we hold about you, or object to how we use it. Depending on where you live, laws such as the GDPR or the CCPA give you these rights.",
          "To make a request, write to hello@elevatebiz.ai. We will answer as soon as we can.",
        ],
      },
      {
        title: "Children",
        body: ["Our site is meant for business owners. We do not knowingly collect information from children under 13."],
      },
      {
        title: "Demo sites",
        body: [
          "The demo pages (for example, the dental clinic) are fictional examples. Their booking forms do not save or send any information.",
        ],
      },
      {
        title: "Changes to this policy",
        body: ["If we change this policy, we will post the new version on this page and update the date at the top."],
      },
      {
        title: "Contact",
        body: ["Questions about your privacy? Write to hello@elevatebiz.ai."],
      },
    ],
  },
  es: {
    back: "← Volver a ElevateBiz",
    title: "Política de privacidad",
    updated: "Última actualización: 25 de octubre de 2026",
    intro:
      "En ElevateBiz respetamos tu privacidad. Esta página explica qué información recopilamos en elevatebiz.ai, para qué la usamos y qué opciones tienes.",
    sections: [
      {
        title: "Qué recopilamos",
        body: [
          "Formulario de contacto: tu nombre, tu correo electrónico, tu mensaje y si quieres unirte a nuestra comunidad. Solo recibimos lo que escribes en el formulario.",
          "Asistente de chat: los mensajes que envías al chat para que pueda responderte.",
          "Datos de uso: con Google Analytics recibimos información anónima sobre cómo se usa el sitio, como las páginas visitadas, la ubicación aproximada y el tipo de dispositivo y navegador.",
          "Preferencia de idioma: guardamos el idioma que elijas (inglés o español) en tu navegador para recordarlo. Nunca sale de tu dispositivo.",
        ],
      },
      {
        title: "Cómo la usamos",
        body: [
          "Para responder tus mensajes y solicitudes.",
          "Para enviar tu solicitud al equipo correcto. Usamos IA para clasificar cada mensaje (por ejemplo, ventas o soporte) y escribir un breve resumen para nuestro equipo.",
          "Para entender qué partes del sitio son útiles y mejorarlas.",
          "No vendemos tu información personal.",
        ],
      },
      {
        title: "Cookies y Google Analytics",
        body: [
          "Usamos Google Analytics, un servicio de Google LLC, para medir las visitas. Usa cookies y tecnologías similares para distinguir las visitas y reunir estadísticas de uso.",
          "Puedes bloquear o borrar las cookies en la configuración de tu navegador, o instalar el complemento de inhabilitación de Google Analytics en tools.google.com/dlpage/gaoptout.",
          "Puedes saber cómo usa Google la información de los sitios que utilizan sus servicios en policies.google.com/technologies/partner-sites.",
        ],
      },
      {
        title: "Con quién la compartimos",
        body: [
          "Solo con los proveedores que nos ayudan a operar el sitio: alojamiento, nuestra API y base de datos, el procesamiento con IA de los mensajes de contacto, el asistente de chat y Google Analytics. Tratan los datos por encargo nuestro y solo para esos fines.",
          "También podemos compartir información si la ley lo exige.",
        ],
      },
      {
        title: "Cuánto tiempo la conservamos",
        body: [
          "Conservamos los mensajes de contacto solo el tiempo necesario para atender tu solicitud y mantener un registro de nuestras conversaciones. Puedes pedirnos que los borremos cuando quieras.",
        ],
      },
      {
        title: "Tus derechos",
        body: [
          "Puedes pedir ver, corregir o eliminar la información personal que tenemos sobre ti, u oponerte a cómo la usamos. Según dónde vivas, leyes como el RGPD o la CCPA te dan estos derechos.",
          "Para hacer una solicitud, escribe a hello@elevatebiz.ai. Responderemos lo antes posible.",
        ],
      },
      {
        title: "Menores de edad",
        body: ["Nuestro sitio está pensado para dueños de negocios. No recopilamos a sabiendas información de menores de 13 años."],
      },
      {
        title: "Sitios de demostración",
        body: [
          "Las páginas de demostración (por ejemplo, la clínica dental) son ejemplos ficticios. Sus formularios de reserva no guardan ni envían información.",
        ],
      },
      {
        title: "Cambios a esta política",
        body: ["Si cambiamos esta política, publicaremos la nueva versión en esta página y actualizaremos la fecha de arriba."],
      },
      {
        title: "Contacto",
        body: ["¿Dudas sobre tu privacidad? Escribe a hello@elevatebiz.ai."],
      },
    ],
  },
};

export default function PrivacyPage() {
  const [lang, setLang] = useState<Lang>("en");
  const c = COPY[lang];

  // Same language rule as the home page: saved choice, else the browser's language
  useEffect(() => {
    const saved = localStorage.getItem("eb-lang");
    if (saved === "en" || saved === "es") setLang(saved);
    else if (navigator.language.toLowerCase().startsWith("es")) setLang("es");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `${c.title} — ElevateBiz`;
    localStorage.setItem("eb-lang", lang);
  }, [lang, c.title]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="/" className={styles.back}>
          {c.back}
        </a>
        <div className={styles.langs} role="group" aria-label="Language">
          {(["en", "es"] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              className={`${styles.lang} ${lang === l ? styles.langActive : ""}`}
              aria-pressed={lang === l}
              onClick={() => setLang(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>{c.title}</h1>
        <p className={styles.updated}>{c.updated}</p>
        <p className={styles.intro}>{c.intro}</p>
        {c.sections.map((s) => (
          <section key={s.title} className={styles.section}>
            <h2 className={styles.h2}>{s.title}</h2>
            {s.body.map((p) => (
              <p key={p} className={styles.p}>
                {p}
              </p>
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}
