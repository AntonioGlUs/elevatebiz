'use client';

import { useEffect } from 'react';
import '@n8n/chat/style.css';

export default function Chatbot() {
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let started = false;

    // The chat library is large (about 1.3 MB of JavaScript), so it is loaded only once the visitor interacts with the
    // page or after a few seconds, never in the way of the first paint.
    const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;
    const load = () => {
      if (started) return;
      started = true;
      events.forEach((name) => window.removeEventListener(name, load));
      clearTimeout(timer);
      start();
    };
    const timer = setTimeout(load, 5000);
    events.forEach((name) => window.addEventListener(name, load, { passive: true, once: true }));

    const start = () => import('@n8n/chat').then(({ createChat }) => {
      if (cancelled) return;

      const chat = createChat({
        webhookUrl:
          'https://n8n-n8n.z0hxwv.easypanel.host/webhook/06823948-c9ab-4503-85b2-aeda1c58acde/chat',
        mode: 'window',
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
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      events.forEach((name) => window.removeEventListener(name, load));
      cleanup?.();
    };
  }, []);

  return <div id="n8n-chat" />;
}