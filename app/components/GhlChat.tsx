'use client';

import { useEffect, useRef } from 'react';

type Lang = 'en' | 'es';

// GoHighLevel chat widget "ElevateBiz Web Chat" (answered by the Conversation AI agent Bizzy)
const WIDGET_ID = '6af6bb508a274b7ef61b90fc';
const LOADER_SRC = 'https://widgets.leadconnectorhq.com/loader.js';
const RESOURCES_URL = 'https://widgets.leadconnectorhq.com/chat-widget/loader.js';

const PLACEHOLDER: Record<Lang, string> = {
  en: 'Write your message...',
  es: 'Escribe tu mensaje...',
};

// ElevateBiz skin for the widget. The widget renders inside nested shadow roots, so page CSS cannot reach it: this
// stylesheet is added to every shadow root of the widget. It relies on GoHighLevel's internal class names; if they
// change, the widget simply falls back to its default look.
const SKIN_CSS = `
  /* ---- Window ---- */
  .lc_text-widget--box {
    width: 380px !important;
    max-width: calc(100vw - 24px) !important;
    height: 600px !important;
    max-height: calc(100vh - 110px) !important;
    border-radius: 18px !important;
    overflow: hidden !important;
    background: #ffffff !important;
    box-shadow: 0 16px 48px rgba(20, 39, 32, 0.18) !important;
  }

  /* ---- Header: aqua bar with the robot + title on the left, no close arrow ---- */
  .lc_text-widget--header-wrapper,
  .lc_text-widget--header-wrapper > div,
  .lc_text-widget_heading--root {
    background: linear-gradient(135deg, #01c3cc, #01a9b4 55%, #01858e) !important;
    border-radius: 0 !important;
  }
  .lc_text-widget_heading--root {
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    gap: 12px !important;
    padding: 16px 20px !important;
    height: auto !important;
    box-sizing: border-box !important;
  }
  .header-circular-image-container {
    display: none !important;
  }
  img.header-circular-image {
    position: static !important;
    flex-shrink: 0 !important;
    width: 34px !important;
    height: 48px !important;
    margin: 0 !important;
    object-fit: contain !important;
    background: transparent !important;
    border: none !important;
    outline: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    filter: drop-shadow(0 3px 6px rgba(0, 60, 64, 0.35)) !important;
  }
  .lc_text-widget_heading--content {
    margin: 0 auto 0 0 !important;
    padding: 0 !important;
    text-align: left !important;
  }
  .lc_text-widget_heading--content,
  .lc_text-widget_heading--content * {
    color: #ffffff !important;
    font-size: 17px !important;
    font-weight: 700 !important;
    line-height: 1.3 !important;
  }
  .lc_text-widget_heading_close--btn {
    display: none !important;
  }

  /* ---- Floating button: turquoise circle with a soft light glow and a solid white speech bubble ---- */
  .lc_text-widget--bubble {
    width: 62px !important;
    height: 62px !important;
    background: #01a9b4 !important;
    box-shadow: 0 0 18px 6px rgba(120, 220, 230, 0.55) !important;
  }
  .lc_text-widget--bubble .widget-open-icon svg {
    display: none !important;
  }
  .lc_text-widget--bubble .widget-open-icon {
    width: 32px !important;
    height: 32px !important;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8'/%3E%3C/svg%3E") center / contain no-repeat !important;
  }

  /* ---- Messages: no avatar, no timestamp, rounded bubbles with a small tail ---- */
  .thumbnail-img,
  .bubble .footer {
    display: none !important;
  }
  .bubble {
    min-width: 0 !important;
    padding: 12px 16px !important;
    border-radius: 18px !important;
  }
  .bubble.incoming,
  .bubble.outgoing {
    font-size: 15px !important;
    line-height: 1.5 !important;
  }
  .bubble.incoming {
    background: #f1f3f5 !important;
    color: #1f2d27 !important;
    border-bottom-left-radius: 6px !important;
  }
  .bubble.outgoing {
    background: #01a9b4 !important;
    color: #ffffff !important;
    border-bottom-right-radius: 6px !important;
  }

  /* ---- Input: light divider, no border, no mic / attach icons, round send button ---- */
  .input-container {
    border-top: 1px solid #e8ecef !important;
  }
  .input-row {
    padding: 8px 12px !important;
  }
  .input-container-textarea {
    border: none !important;
  }
  .input-icons {
    display: none !important;
  }
  .live-chat-send-button {
    width: 38px !important;
    height: 38px !important;
    border-radius: 999px !important;
    background-color: #01a9b4 !important;
  }
  .live-chat-send-button:disabled {
    opacity: 0.5 !important;
  }
`;

// Shown in the input while it is locked, waiting for the agent's reply
const WAITING: Record<Lang, string> = {
  en: 'Bizzy is typing...',
  es: 'Bizzy está escribiendo...',
};

// If no reply arrives in this time (for example after a handover to a person), the input is unlocked anyway
const LOCK_TIMEOUT_MS = 30000;

type IonTextarea = HTMLElement & { placeholder?: string; disabled?: boolean; value?: string | null; setFocus?: () => void };

// Counts the elements matching a selector, looking inside nested shadow roots
function countDeep(root: ParentNode, selector: string): number {
  let count = root.querySelectorAll(selector).length;
  root.querySelectorAll<HTMLElement>('*').forEach((el) => {
    if (el.shadowRoot) count += countDeep(el.shadowRoot, selector);
  });
  return count;
}

// Finds the first element with the given tag name, looking inside nested shadow roots
function findDeep(root: ParentNode, tagName: string): HTMLElement | null {
  const all = root.querySelectorAll<HTMLElement>('*');
  for (let i = 0; i < all.length; i++) {
    if (all[i].tagName === tagName) return all[i];
    const shadow = all[i].shadowRoot;
    if (shadow) {
      const found = findDeep(shadow, tagName);
      if (found) return found;
    }
  }
  return null;
}

export default function GhlChat({ lang = 'en' }: { lang?: Lang }) {
  const langRef = useRef(lang);
  langRef.current = lang;
  // Lets the language effect below re-apply the input placeholder
  const runRef = useRef<() => void>(() => {});

  useEffect(() => {
    // Load the widget once; it adds a <chat-widget> element to the page
    if (!document.querySelector(`script[data-widget-id="${WIDGET_ID}"]`)) {
      const script = document.createElement('script');
      script.src = LOADER_SRC;
      script.async = true;
      script.setAttribute('data-resources-url', RESOURCES_URL);
      script.setAttribute('data-widget-id', WIDGET_ID);
      document.body.appendChild(script);
    }

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(SKIN_CSS);
    const observers: MutationObserver[] = [];
    const observed = new WeakSet<ShadowRoot>();
    const timers = new Set<number>();
    let frame = 0;
    let queued = false;
    let active = true;
    // Input lock: after the visitor sends a message, the input stays disabled until the agent replies
    let locked = false;
    let repliesAtLock = 0;
    let lockTimer = 0;

    // Adds the stylesheet to a shadow root and to every shadow root nested inside it
    const skin = (root: ShadowRoot) => {
      if (root.adoptedStyleSheets.indexOf(sheet) === -1) {
        root.adoptedStyleSheets = root.adoptedStyleSheets.concat(sheet);
      }
      if (!observed.has(root)) {
        observed.add(root);
        const observer = new MutationObserver(schedule);
        observer.observe(root, { childList: true, subtree: true });
        observers.push(observer);
      }
      const placeholder = (locked ? WAITING : PLACEHOLDER)[langRef.current];
      root.querySelectorAll<HTMLElement>('*').forEach((el) => {
        if (el.tagName === 'ION-TEXTAREA') {
          const input = el as IonTextarea;
          if (input.placeholder !== placeholder) input.placeholder = placeholder;
          if (Boolean(input.disabled) !== locked) input.disabled = locked;
        }
        if (el.shadowRoot) skin(el.shadowRoot);
      });
    };

    const widgetRoot = () => document.querySelector('chat-widget')?.shadowRoot ?? null;
    // Real replies carry a timestamp; the "typing" dots are also an incoming bubble but have none, so they are not counted
    const countReplies = () => {
      const root = widgetRoot();
      return root ? countDeep(root, '.bubble.incoming .footer-text') : 0;
    };

    const unlock = () => {
      if (!locked) return;
      locked = false;
      window.clearTimeout(lockTimer);
      run();
      focusSoon();
    };

    // The input needs a moment to become editable again before it can take the cursor
    const focusSoon = () => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (active && !locked) focusInput();
      }, 150);
      timers.add(id);
    };

    const lock = () => {
      if (locked || !active) return;
      locked = true;
      repliesAtLock = countReplies();
      window.clearTimeout(lockTimer);
      lockTimer = window.setTimeout(unlock, LOCK_TIMEOUT_MS);
      run();
    };

    const run = () => {
      queued = false;
      if (!active) return;
      const widget = document.querySelector<HTMLElement>('chat-widget');
      if (!widget) return;
      widget.style.display = '';
      // The site scrolls with Lenis: this lets the mouse wheel scroll the conversation instead of the page
      widget.setAttribute('data-lenis-prevent', '');
      // A new message from the agent has arrived: let the visitor write again
      if (locked && countReplies() > repliesAtLock) {
        locked = false;
        window.clearTimeout(lockTimer);
        if (widget.shadowRoot) skin(widget.shadowRoot);
        focusSoon();
        return;
      }
      if (widget.shadowRoot) skin(widget.shadowRoot);
    };
    runRef.current = run;

    const later = (ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        run();
      }, ms);
      timers.add(id);
    };

    // New elements get their shadow root a moment after they are added, so run again shortly after each change
    function schedule() {
      if (queued || !active) return;
      queued = true;
      frame = requestAnimationFrame(run);
      later(300);
      later(1500);
    }

    const bodyObserver = new MutationObserver(schedule);
    bodyObserver.observe(document.body, { childList: true });
    observers.push(bodyObserver);
    schedule();

    // Puts the cursor in the message input. Returns false while the input does not exist yet.
    function focusInput() {
      const widget = document.querySelector('chat-widget');
      const input = widget?.shadowRoot ? (findDeep(widget.shadowRoot, 'ION-TEXTAREA') as IonTextarea | null) : null;
      if (!input) return false;
      if (input.setFocus) input.setFocus();
      else input.focus();
      return true;
    }

    // The visitor sends a message with Enter or with the send button: lock the input right after the widget has
    // taken the text, and only if there was text to send.
    const getInput = () => {
      const root = widgetRoot();
      return root ? (findDeep(root, 'ION-TEXTAREA') as IonTextarea | null) : null;
    };
    const hasText = () => Boolean(String(getInput()?.value ?? '').trim());
    // The widget sometimes leaves the sent text in the input: remove it if it is still there
    const clearSent = (sent: string) => {
      const input = getInput();
      if (input && input.value === sent) input.value = '';
    };
    const lockSoon = () => {
      const sent = String(getInput()?.value ?? '');
      [50, 400, 1200].forEach((ms, index) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          if (!active) return;
          if (index === 0) lock();
          clearSent(sent);
        }, ms);
        timers.add(id);
      });
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' || event.shiftKey || event.isComposing || locked) return;
      const inInput = event.composedPath().some((target) => (target as HTMLElement).tagName === 'ION-TEXTAREA');
      if (inInput && hasText()) lockSoon();
    };
    const onSendClick = (event: MouseEvent) => {
      if (locked) return;
      const onSend = event
        .composedPath()
        .some((target) => (target as HTMLElement).classList?.contains('live-chat-send-button'));
      if (onSend && hasText()) lockSoon();
    };
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('click', onSendClick, true);

    // Opening the chat or clicking on the conversation moves the cursor to the message input.
    // Clicks on links and on buttons other than the floating one are left alone, and so is a text selection.
    const onClick = (event: MouseEvent) => {
      let inWidget = false;
      let opening = false;
      for (const target of event.composedPath()) {
        const el = target as HTMLElement;
        if (!el.tagName) continue;
        if (el.tagName === 'CHAT-WIDGET') inWidget = true;
        if (el.id === 'lc_text-widget--btn') opening = true;
        else if (el.tagName === 'A' || el.tagName === 'BUTTON') return;
      }
      if (!inWidget) return;
      if (!opening && String(window.getSelection() ?? '')) return;
      // The input appears a moment after the window opens, so retry for about two seconds
      let tries = 0;
      const attempt = () => {
        if (!active) return;
        if (!focusInput() && tries++ < 20) {
          const id = window.setTimeout(() => {
            timers.delete(id);
            attempt();
          }, 100);
          timers.add(id);
        }
      };
      attempt();
    };
    document.addEventListener('click', onClick);

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      timers.forEach((id) => window.clearTimeout(id));
      observers.forEach((observer) => observer.disconnect());
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('click', onSendClick, true);
      window.clearTimeout(lockTimer);
      // The widget cannot be unloaded, so it is hidden on pages that do not render this component
      const widget = document.querySelector<HTMLElement>('chat-widget');
      if (widget) widget.style.display = 'none';
    };
  }, []);

  // Language switch: update the input placeholder
  useEffect(() => {
    runRef.current();
  }, [lang]);

  return null;
}
