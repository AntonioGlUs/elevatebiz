"use client";

import { useEffect, useState } from "react";
import { CHAT_SCRIPT, Lang } from "@/lib/content";
import type { Texts } from "./types";

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
    justify: m.from === "bot" ? "flex-end" : "flex-start",
    bg: m.from === "bot" ? "#d9fdd3" : "#ffffff",
    radius: m.from === "bot" ? "8px 2px 8px 8px" : "2px 8px 8px 8px",
  }));

  return (
    <div id="see-it-in-action" className="eb-section eb-seeit" style={{ background: "#ffffff", padding: "100px 80px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 72, flexWrap: "wrap" }}>
      <div className="eb-col" style={{ flex: 1, minWidth: 320, maxWidth: 460 }}>
        <h2 className="eb-h2" style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 34, margin: "0 0 16px 0", color: "#142720" }}>{t.seeItTitle}</h2>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: "#5e6d64", margin: "0 0 28px 0" }}>{t.seeItSubtitle}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[t.seeItCheck1, t.seeItCheck2, t.seeItCheck3].map((check, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#01c3cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M5 12l4 4 10-10" />
              </svg>
              <span style={{ fontSize: 16, color: "#142720" }}>{check}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="eb-col" style={{ flex: 1, minWidth: 320, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
        {/* Robot + card move together; on smaller screens the robot sits on the card's bottom-left corner */}
        <div className="eb-seeit-stage" style={{ position: "relative", display: "flex", alignItems: "flex-end", maxWidth: "100%" }}>
          <div className="eb-seeit-robot" aria-hidden="true" style={{ width: 207, flexShrink: 0, marginRight: -1, marginBottom: 24, position: "relative", zIndex: 1 }}>
            {/* Floor shadow under the feet */}
            <div style={{ position: "absolute", left: "8%", width: "64%", bottom: -10, height: 22, borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(20,39,32,.38) 0%, rgba(20,39,32,.16) 45%, rgba(20,39,32,0) 72%)", filter: "blur(2px)" }} />
            <img
              src="/images/robot-pointing.png"
              alt=""
              width={412}
              height={440}
              style={{ display: "block", width: "100%", height: "auto", position: "relative", filter: "drop-shadow(0 3px 3px rgba(20,39,32,.18)) drop-shadow(10px 16px 20px rgba(20,39,32,.2))" }}
            />
          </div>
          <div className="eb-chat-card" style={{ width: 380, maxWidth: "100%", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 60px rgba(20,39,32,.18)", background: "#e5ddd5", transform: chatLagTransform }}>
            <div style={{ background: "#008069", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 19l-7-7 7-7" />
              </svg>
              <div style={{ width: 38, height: 38, borderRadius: 999, background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="8" width="16" height="12" rx="2" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2M9 13h.01M15 13h.01" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#ffffff", fontWeight: 600, fontSize: 16 }}>{t.waName}</div>
                <div style={{ color: "rgba(255,255,255,.8)", fontSize: 12.5 }}>{t.waOnline}</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 7l-7 5 7 5V7Z" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 16 }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
              </svg>
            </div>

            <div
              style={{
                backgroundColor: "#e5ddd5",
                backgroundImage: "radial-gradient(rgba(20,39,32,.06) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
                padding: 16,
                // Tall enough for the full conversation, so the card doesn't grow (and the page jump) as bubbles appear
                minHeight: 401,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                boxSizing: "border-box",
              }}
            >
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.justify as any, marginBottom: 8 }}>
                  <div style={{ background: msg.bg, padding: "7px 9px 6px", borderRadius: msg.radius, maxWidth: "78%", boxShadow: "0 1px 1px rgba(20,39,32,.12)" }}>
                    <div style={{ fontSize: 14.5, lineHeight: 1.35, color: "#111b21" }}>{msg.text}</div>
                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4, marginTop: 2 }}>
                      <span style={{ fontSize: 11, color: "#667781" }}>{msg.time}</span>
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
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                  <div style={{ background: "#d9fdd3", padding: "10px 14px", borderRadius: "8px 2px 8px 8px", boxShadow: "0 1px 1px rgba(20,39,32,.12)", display: "flex", gap: 4, alignItems: "center" }}>
                    <div style={{ width: 6, height: 6, borderRadius: 999, background: "#667781" }} />
                    <div style={{ width: 6, height: 6, borderRadius: 999, background: "#667781" }} />
                    <div style={{ width: 6, height: 6, borderRadius: 999, background: "#667781" }} />
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: "#f0f0f0", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, boxSizing: "border-box" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
              </svg>
              <div style={{ flex: 1, background: "#ffffff", borderRadius: 20, padding: "9px 14px", fontSize: 14, color: "#8696a0" }}>{t.waMessagePlaceholder}</div>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: "#008069", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
