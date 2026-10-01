import type { Texts } from "./types";
import { API_URL } from "./constants";
import { useState } from "react";


export default function ContactForm({ t }: { t: Texts }) {

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    setStatus("sending");

    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          is_community: form.get("is_community") === "on",
          comments: form.get("comments"),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      formEl.reset();
      // Back to the normal button text after 20 seconds
      setTimeout(() => setStatus("idle"), 20000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="eb-section" style={{ padding: "100px 80px", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ textAlign: "center", margin: "0 0 40px 0" }}>
          <h2 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 28, margin: "0 0 12px 0", color: "#142720" }}>{t.newsletterTitle}</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#5e6d64", margin: 0 }}>{t.newsletterSubtitle}</p>
        </div>
        <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="contact-name" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#142720", marginBottom: 6 }}>{t.newsletterNameLabel}</label>
            <input id="contact-name" name="name" type="text" placeholder={t.newsletterNamePlaceholder} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="newsletter-email" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#142720", marginBottom: 6 }}>{t.newsletterLabel}</label>
            <input id="newsletter-email" name="email" type="email" placeholder="you@business.com" style={inputStyle} />
          </div>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
            <input type="checkbox" name="is_community" style={{ width: 18, height: 18, marginTop: 1, flexShrink: 0, accentColor: "#007a73" }} />
            <span style={{ fontSize: 14.5, lineHeight: 1.5, color: "#5e6d64" }}>{t.newsletterCheckboxLabel}</span>
          </label>
          <div>
            <label htmlFor="contact-comments" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#142720", marginBottom: 6 }}>{t.newsletterCommentsLabel}</label>
            <textarea id="contact-comments" name="comments" rows={4} placeholder={t.newsletterCommentsPlaceholder} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <button
            type="submit"
            disabled={status === "sending" || status === "sent"}
            // opacity 1 keeps "Sent" fully visible (globals.css fades disabled buttons)
            style={{ background: status === "sent" ? "#01c3cc" : "#007a73", color: "#ffffff", padding: "14px 26px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 15, opacity: status === "sent" ? 1 : undefined, cursor: status === "sending" ? "wait" : "pointer" }}
          >
            {status === "sending" ? "Sending..." : status === "sent" ? "✓ Sent!" : status === "error" ? "Try again" : t.newsletterButton}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  border: "1px solid rgba(20,39,32,.25)",
  borderRadius: 8,
  fontSize: 15,
  color: "#142720",
  boxSizing: "border-box",
};
