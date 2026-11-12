'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import '@n8n/chat/style.css';
import styles from './Chatbot.module.css';

type Lang = 'en' | 'es';
type Lead = { name: string; email: string; phone: string };

const WEBHOOK_URL =
  'https://n8n-n8n.z0hxwv.easypanel.host/webhook/06823948-c9ab-4503-85b2-aeda1c58acde/chat';

const COPY = {
  en: {
    open: 'Open chat',
    close: 'Close chat',
    title: 'ElevateBiz AI Assistant',
    intro: 'Before we start, tell us who you are so we can follow up with you.',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    consentBefore: 'I accept the ',
    consentLink: 'privacy notice',
    consentAfter: ' and agree to have my details stored.',
    submit: 'Start conversation',
    loading: 'Opening chat…',
    errors: {
      name: 'Enter your name.',
      email: 'Enter a valid email.',
      phone: 'Enter a valid phone number.',
      consent: 'You need to accept the privacy notice.',
    },
  },
  es: {
    open: 'Abrir chat',
    close: 'Cerrar chat',
    title: 'Asistente IA de ElevateBiz',
    intro: 'Antes de empezar, dinos quién eres para poder darte seguimiento.',
    name: 'Nombre',
    email: 'Email',
    phone: 'Teléfono',
    consentBefore: 'Acepto el ',
    consentLink: 'aviso de privacidad',
    consentAfter: ' y que se guarden mis datos.',
    submit: 'Iniciar conversación',
    loading: 'Abriendo chat…',
    errors: {
      name: 'Escribe tu nombre.',
      email: 'Escribe un email válido.',
      phone: 'Escribe un teléfono válido.',
      consent: 'Debes aceptar el aviso de privacidad.',
    },
  },
};

type ErrorKey = keyof (typeof COPY)['en']['errors'];

// The chat library is large (about 1.3 MB of JavaScript), so it is only downloaded once the visitor opens the form.
const loadChat = () => import('@n8n/chat');

export default function Chatbot({ lang = 'en' }: { lang?: Lang }) {
  const t = COPY[lang];
  const [open, setOpen] = useState(false);
  // The visitor's details. The n8n chat is only created once these exist, so every conversation starts with them.
  const [lead, setLead] = useState<Lead | null>(null);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<Lead>({ name: '', email: '', phone: '' });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<ErrorKey | null>(null);
  const langRef = useRef(lang);
  langRef.current = lang;

  useEffect(() => {
    if (open) loadChat();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Once the form is sent: create the n8n chat with the visitor's details as metadata (sent to the webhook with
  // every message) and open its window in place of the form.
  useEffect(() => {
    if (!lead) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    loadChat().then(({ createChat }) => {
      if (cancelled) return;

      const chat = createChat({
        webhookUrl: WEBHOOK_URL,
        mode: 'window',
        metadata: {
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          privacyAccepted: true,
          privacyAcceptedAt: new Date().toISOString(),
          lang: langRef.current,
        },
        initialMessages: [
          'Welcome to ElevateBiz! 👋 I can answer your questions about our AI automation and marketing services. How can I help you today?',
        ],

        i18n: {
            en: {
                title: 'ElevateBiz AI Assistant',
                subtitle: '',
                footer: '',
                getStarted: 'Start a conversation',
                inputPlaceholder: 'Write your message...',
                closeButtonTooltip: 'Close chat',
            },
        },
      });
      cleanup = () => chat.unmount();

      // Open the chat window, then remove the form
      let tries = 0;
      const openWindow = () => {
        if (cancelled) return;
        const toggle = document.querySelector<HTMLElement>('#n8n-chat .chat-window-toggle');
        if (toggle) {
          toggle.click();
          setReady(true);
        } else if (tries++ < 40) {
          setTimeout(openWindow, 50);
        } else {
          setReady(true);
        }
      };
      openWindow();
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [lead]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    if (!name) return setError('name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('email');
    if (phone.replace(/\D/g, '').length < 7) return setError('phone');
    if (!consent) return setError('consent');
    setError(null);
    setLead({ name, email, phone });
  };

  const field = (key: keyof Lead) => ({
    value: form[key],
    onChange: (event: { target: { value: string } }) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
      setError(null);
    },
  });

  const sending = lead !== null;

  return (
    <>
      <div id="n8n-chat" />
      {!ready && (
        <div className={styles.wrapper}>
          {open && (
            <div className={styles.panel} role="dialog" aria-label={t.title} data-lenis-prevent>
              <div className={styles.header}>
                <img src="/images/chatbot-avatar.webp" alt="" className={styles.avatar} />
                <h2 className={styles.title}>{t.title}</h2>
                <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label={t.close}>
                  ×
                </button>
              </div>
              <form className={styles.form} onSubmit={submit} noValidate>
                <p className={styles.intro}>{t.intro}</p>
                <label className={styles.label}>
                  {t.name}
                  <input className={styles.input} type="text" name="name" autoComplete="name" disabled={sending} {...field('name')} />
                </label>
                <label className={styles.label}>
                  {t.email}
                  <input className={styles.input} type="email" name="email" autoComplete="email" disabled={sending} {...field('email')} />
                </label>
                <label className={styles.label}>
                  {t.phone}
                  <input className={styles.input} type="tel" name="phone" autoComplete="tel" disabled={sending} {...field('phone')} />
                </label>
                <label className={styles.consent}>
                  <input
                    type="checkbox"
                    checked={consent}
                    disabled={sending}
                    onChange={(event) => {
                      setConsent(event.target.checked);
                      setError(null);
                    }}
                  />
                  <span>
                    {t.consentBefore}
                    <a href="/privacy/" target="_blank" rel="noopener noreferrer">
                      {t.consentLink}
                    </a>
                    {t.consentAfter}
                  </span>
                </label>
                {error && (
                  <p className={styles.error} role="alert">
                    {t.errors[error]}
                  </p>
                )}
                <button type="submit" className={styles.submit} disabled={sending}>
                  {sending ? t.loading : t.submit}
                </button>
              </form>
            </div>
          )}
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? t.close : t.open}
            aria-expanded={open}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {open ? (
                <path d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6z" />
              ) : (
                <path d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8" />
              )}
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
