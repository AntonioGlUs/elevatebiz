import type { Texts } from "./types";
import { API_URL } from "./constants";
import { useState } from "react";
import styles from "./ContactForm.module.css";

const DEPARTMENT_NAMES: Record<string, string> = {
  sales: "Sales",
  support: "Support",
  partnerships: "Partnerships",
};

export default function ContactForm({ t }: { t: Texts }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [department, setDepartment] = useState("");

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
      const data = await res.json();
      setDepartment(data.department);
      setStatus("sent");
      formEl.reset();
      // Back to the normal button text after 20 seconds
      setTimeout(() => setStatus("idle"), 20000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={`eb-section ${styles.section}`}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t.newsletterTitle}</h2>
          <p className={styles.subtitle}>{t.newsletterSubtitle}</p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="contact-name" className={styles.label}>{t.newsletterNameLabel}</label>
            <input id="contact-name" name="name" type="text" placeholder={t.newsletterNamePlaceholder} className={styles.input} />
          </div>
          <div>
            <label htmlFor="newsletter-email" className={styles.label}>{t.newsletterLabel}</label>
            <input id="newsletter-email" name="email" type="email" placeholder="you@business.com" className={styles.input} />
          </div>
          <label className={styles.checkboxRow}>
            <input type="checkbox" name="is_community" className={styles.checkbox} />
            <span className={styles.checkboxText}>{t.newsletterCheckboxLabel}</span>
          </label>
          <div>
            <label htmlFor="contact-comments" className={styles.label}>{t.newsletterCommentsLabel}</label>
            <textarea id="contact-comments" name="comments" rows={4} placeholder={t.newsletterCommentsPlaceholder} className={`${styles.input} ${styles.textarea}`} />
          </div>
          <button
            type="submit"
            disabled={status === "sending" || status === "sent"}
            className={`${styles.button} ${status === "sending" ? styles.buttonSending : ""} ${status === "sent" ? styles.buttonSent : ""}`}
          >
            {status === "sending" ? "Sending..." : status === "sent" ? "✓ Sent!" : status === "error" ? "Try again" : t.newsletterButton}
          </button>
                    {status === "sent" && (
            <p className={styles.successMessage} role="status">
              {DEPARTMENT_NAMES[department]
                ? `Your message was assigned to the ${DEPARTMENT_NAMES[department]} department. An advisor will contact you soon.`
                : "Thanks! An advisor will contact you soon."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
