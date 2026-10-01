"use client";

import { useEffect, useState } from "react";
import { CHAT_SCRIPT, Lang } from "@/lib/content";
import type { Texts } from "./types";
import styles from "./WhatsAppDemo.module.css";

export default function WhatsAppDemo({ t, lang }: { t: Texts; lang: Lang }) {
  const [chatSmoothY, setChatSmoothY] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);

  // Chat sequence loop
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function playNext(index: number) {
      if (index >= CHAT_SCRIPT.length) {
        timer = setTimeout(() => {
          setVisibleCount(0);
          setTyping(false);
          timer = setTimeout(() => playNext(0), 700);
        }, 2600);
        return;
      }
      const msg = CHAT_SCRIPT[index];
      if (msg.from === "bot") {
        setTyping(true);
        timer = setTimeout(() => {
          setTyping(false);
          setVisibleCount(index + 1);
          timer = setTimeout(() => playNext(index + 1), 500);
        }, 900);
      } else {
        timer = setTimeout(() => {
          setVisibleCount(index + 1);
          playNext(index + 1);
        }, 700);
      }
    }
    timer = setTimeout(() => playNext(0), 500);
    return () => clearTimeout(timer);
  }, []);

  // Chat card inertia/lag effect
  useEffect(() => {
    const timer = setInterval(() => {
      setChatSmoothY((prev) => prev + (window.scrollY - prev) * 0.09);
    }, 16);
    return () => clearInterval(timer);
  }, []);

  // Small, temporary lag while scrolling (settles back to 0), capped so the card never leaves its section
  const chatLagRaw = ((typeof window !== "undefined" ? window.scrollY : 0) - chatSmoothY) * -0.15;
  const chatLagOffset = Math.max(-40, Math.min(40, chatLagRaw));
  const chatLagTransform = `translateY(${chatLagOffset.toFixed(1)}px)`;

  const messages = CHAT_SCRIPT.slice(0, visibleCount).map((m) => ({
    text: m.text[lang],
    time: m.time,
    outgoing: m.from === "bot",
  }));

  return (
    <div id="see-it-in-action" className={`eb-section eb-seeit ${styles.section}`}>
      <div className={`eb-col ${styles.copy}`}>
        <h2 className={`eb-h2 ${styles.title}`}>{t.seeItTitle}</h2>
        <p className={styles.subtitle}>{t.seeItSubtitle}</p>
        <div className={styles.checks}>
          {[t.seeItCheck1, t.seeItCheck2, t.seeItCheck3].map((check, i) => (
            <div key={i} className={styles.check}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#01c3cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}>
                <path d="M5 12l4 4 10-10" />
              </svg>
              <span className={styles.checkText}>{check}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`eb-col ${styles.demo}`}>
        {/* Robot + card move together; on smaller screens the robot sits on the card's bottom-left corner */}
        <div className={`eb-seeit-stage ${styles.stage}`}>
          <div className={`eb-seeit-robot ${styles.robot}`} aria-hidden="true">
            {/* Floor shadow under the feet */}
            <div className={styles.robotShadow} />
            <img src="/images/robot-pointing.png" alt="" width={412} height={440} className={styles.robotImg} />
          </div>
          <div className={`eb-chat-card ${styles.card}`} style={{ transform: chatLagTransform }}>
            <div className={styles.header}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 19l-7-7 7-7" />
              </svg>
              <div className={styles.avatar}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="8" width="16" height="12" rx="2" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2M9 13h.01M15 13h.01" />
                </svg>
              </div>
              <div className={styles.contact}>
                <div className={styles.contactName}>{t.waName}</div>
                <div className={styles.contactStatus}>{t.waOnline}</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 7l-7 5 7 5V7Z" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={styles.callIcon}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
              </svg>
            </div>

            <div className={styles.messages}>
              {messages.map((msg, i) => (
                <div key={i} className={`${styles.row} ${msg.outgoing ? styles.rowOut : ""}`}>
                  <div className={`${styles.bubble} ${msg.outgoing ? styles.bubbleOut : ""}`}>
                    <div className={styles.bubbleText}>{msg.text}</div>
                    <div className={styles.meta}>
                      <span className={styles.time}>{msg.time}</span>
                      {msg.outgoing && (
                        <svg width="15" height="10" viewBox="0 0 16 11" fill="none">
                          <path d="M1 5.5L5 9.5L11 1.5" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M5.5 5.5L9.5 9.5L15.5 1.5" stroke="#53bdeb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {typing && (
                <div className={`${styles.row} ${styles.rowOut}`}>
                  <div className={styles.typing}>
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                  </div>
                </div>
              )}
            </div>

            <div className={styles.inputBar}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
              </svg>
              <div className={styles.inputField}>{t.waMessagePlaceholder}</div>
              <div className={styles.mic}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
