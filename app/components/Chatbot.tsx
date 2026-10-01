'use client';

import { useEffect } from 'react';
import '@n8n/chat/style.css';

export default function Chatbot() {
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    import('@n8n/chat').then(({ createChat }) => {
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
      cleanup?.();
    };
  }, []);

  return <div id="n8n-chat" />;
}