import type { Texts } from "./types";
import { API_URL } from "./constants";
import { useState } from "react";
import styles from "./ContactForm.module.css";

const DEPARTMENT_NAMES: Record<string, string> = {
  sales: "Sales",
  support: "Support",
  partnerships: "Partnerships",
};

// something@domain.ext, with no spaces
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Field = "name" | "email";
type Errors = Partial<Record<Field, string>>;

function validate(field: Field, value: string, t: Texts): string | undefined {
  if (field === "name" && !value.trim()) return t.formErrorName;
  if (field === "email" && !EMAIL_PATTERN.test(value.trim())) return t.formErrorEmail;
  return undefined;
}

export default function ContactForm({ t }: { t: Texts }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [department, setDepartment] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  // Check a field when the visitor leaves it
  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const field = e.target.name as Field;
    setErrors((prev) => ({ ...prev, [field]: validate(field, e.target.value, t) }));
  }

  // Once a field shows an error, clear it as soon as the value becomes valid
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const field = e.target.name as Field;
    if (errors[field] && !validate(field, e.target.value, t)) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    // Validate everything before sending; if something is wrong, focus the first bad field
    const found: Errors = {
      name: validate("name", String(form.get("name") ?? ""), t),
      email: validate("email", String(form.get("email") ?? ""), t),
    };
    setErrors(found);
    const firstBad = (["name", "email"] as Field[]).find((f) => found[f]);
    if (firstBad) {
      formEl.querySelector<HTMLInputElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }

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
        {/* noValidate: our own messages replace the browser's validation pop-ups */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="contact-name" className={styles.label}>{t.newsletterNameLabel}</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder={t.newsletterNamePlaceholder}
              onBlur={handleBlur}
              onChange={handleChange}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              className={`${styles.input} ${errors.name ? styles.inputInvalid : ""}`}
            />
            {errors.name && (
              <p id="contact-name-error" className={styles.errorText}>{errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="newsletter-email" className={styles.label}>{t.newsletterLabel}</label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              placeholder="you@business.com"
              onBlur={handleBlur}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "newsletter-email-error" : undefined}
              className={`${styles.input} ${errors.email ? styles.inputInvalid : ""}`}
            />
            {errors.email && (
              <p id="newsletter-email-error" className={styles.errorText}>{errors.email}</p>
            )}
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
