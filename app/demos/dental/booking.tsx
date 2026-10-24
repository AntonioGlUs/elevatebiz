"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import styles from "./dental.module.css";
import {
  CLINICS,
  DOCTORS_BY_CLINIC,
  SATURDAY_SLOTS,
  SERVICES_BY_CLINIC,
  WEEKDAY_SLOTS,
  type ClinicId,
} from "./data";

const BookingContext = createContext<() => void>(() => {});

// Wraps the page; any <BookButton> inside opens the booking modal.
export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openBooking = useCallback(() => setOpen(true), []);
  return (
    <BookingContext.Provider value={openBooking}>
      {children}
      {open && <BookingModal onClose={() => setOpen(false)} />}
    </BookingContext.Provider>
  );
}

export function BookButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  const openBooking = useContext(BookingContext);
  return (
    <button type="button" className={`${styles.btnReset} ${className}`} onClick={openBooking}>
      {children}
    </button>
  );
}

type Step = "clinic" | "service" | "doctor" | "when" | "details" | "done";
const STEPS: Step[] = ["clinic", "service", "doctor", "when", "details"];

const TITLES: Record<Step, string> = {
  clinic: "Where would you like to book?",
  service: "What do you need?",
  doctor: "Choose your doctor",
  when: "Pick a day and time",
  details: "Your details",
  done: "You're all set!",
};

// Next 7 bookable days (Sundays are closed).
function nextDays(count = 7): Date[] {
  const days: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) days.push(new Date(d));
  }
  return days;
}

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const dayLabel = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

// Simulated availability: some slots look taken, deterministically.
function slotsFor(date: Date, seed: number) {
  const base = date.getDay() === 6 ? SATURDAY_SLOTS : WEEKDAY_SLOTS;
  return base.map((label, i) => ({ label, taken: (date.getDate() * 7 + i * 3 + seed) % 5 === 0 }));
}

function BookingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("clinic");
  const [clinic, setClinic] = useState<ClinicId | null>(null);
  const [service, setService] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", patientType: "new" });
  const [submitted, setSubmitted] = useState(false);

  const days = useMemo(() => nextDays(), []);

  // Close on Escape and lock page scroll while the modal is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const stepIndex = STEPS.indexOf(step);
  const goBack = () => step !== "clinic" && step !== "done" && setStep(STEPS[stepIndex - 1]);

  const errors = {
    name: form.name.trim().length < 2 ? "Please enter your name." : "",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "" : "Please enter a valid email.",
    phone: form.phone.replace(/\D/g, "").length < 7 ? "Please enter a valid phone number." : "",
  };

  function submit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!errors.name && !errors.email && !errors.phone) setStep("done");
  }

  const clinicName = CLINICS.find((c) => c.id === clinic)?.name;
  const doctorSeed = clinic ? DOCTORS_BY_CLINIC[clinic].indexOf(doctor) : 0;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Book an appointment"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Close">
          ×
        </button>

        {step !== "done" && (
          <div className={styles.progress} aria-hidden="true">
            {STEPS.map((s, i) => (
              <span key={s} className={i <= stepIndex ? styles.progressOn : ""} />
            ))}
          </div>
        )}

        <h2 className={styles.modalTitle}>{TITLES[step]}</h2>

        <div className={styles.modalBody} key={step}>
          {step === "clinic" && (
            <div className={styles.choiceGrid}>
              {CLINICS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={styles.choiceBig}
                  onClick={() => {
                    setClinic(c.id);
                    setService("");
                    setDoctor("");
                    setStep("service");
                  }}
                >
                  <strong>{c.name}</strong>
                  <span>{c.tagline}</span>
                </button>
              ))}
            </div>
          )}

          {step === "service" && clinic && (
            <div className={styles.choiceList}>
              {SERVICES_BY_CLINIC[clinic].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={styles.choice}
                  onClick={() => {
                    setService(s);
                    setStep("doctor");
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {step === "doctor" && clinic && (
            <div className={styles.choiceList}>
              {DOCTORS_BY_CLINIC[clinic].map((d) => (
                <button
                  key={d}
                  type="button"
                  className={styles.choice}
                  onClick={() => {
                    setDoctor(d);
                    setDate(null);
                    setTime("");
                    setStep("when");
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          )}

          {step === "when" && (
            <>
              <div className={styles.dayRow}>
                {days.map((d) => (
                  <button
                    key={dayKey(d)}
                    type="button"
                    className={`${styles.day} ${date && dayKey(date) === dayKey(d) ? styles.selected : ""}`}
                    onClick={() => {
                      setDate(d);
                      setTime("");
                    }}
                  >
                    {dayLabel(d)}
                  </button>
                ))}
              </div>
              {date ? (
                <div className={styles.slotGrid}>
                  {slotsFor(date, doctorSeed).map((slot) => (
                    <button
                      key={slot.label}
                      type="button"
                      disabled={slot.taken}
                      className={`${styles.slot} ${time === slot.label ? styles.selected : ""}`}
                      onClick={() => setTime(slot.label)}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              ) : (
                <p className={styles.hint}>Select a day to see available times.</p>
              )}
              <button type="button" className={styles.modalPrimary} disabled={!date || !time} onClick={() => setStep("details")}>
                Continue
              </button>
            </>
          )}

          {step === "details" && (
            <form onSubmit={submit} noValidate className={styles.form}>
              <label>
                Full name
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
                {submitted && errors.name && <em>{errors.name}</em>}
              </label>
              <label>
                Email
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
                {submitted && errors.email && <em>{errors.email}</em>}
              </label>
              <label>
                Phone
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
                {submitted && errors.phone && <em>{errors.phone}</em>}
              </label>
              <div className={styles.radios}>
                <label>
                  <input type="radio" name="patientType" checked={form.patientType === "new"} onChange={() => setForm({ ...form, patientType: "new" })} />
                  New patient
                </label>
                <label>
                  <input type="radio" name="patientType" checked={form.patientType === "returning"} onChange={() => setForm({ ...form, patientType: "returning" })} />
                  Returning patient
                </label>
              </div>
              <button type="submit" className={styles.modalPrimary}>
                Confirm appointment
              </button>
            </form>
          )}

          {step === "done" && date && (
            <div className={styles.summary}>
              <p className={styles.checkmark} aria-hidden="true">
                ✓
              </p>
              <dl>
                <dt>Clinic</dt>
                <dd>{clinicName}</dd>
                <dt>Service</dt>
                <dd>{service}</dd>
                <dt>Doctor</dt>
                <dd>{doctor}</dd>
                <dt>When</dt>
                <dd>
                  {dayLabel(date)} at {time}
                </dd>
                <dt>Patient</dt>
                <dd>{form.name}</dd>
              </dl>
              <p className={styles.hint}>
                This is a demo: no appointment was actually scheduled. A real confirmation would be sent to {form.email}.
              </p>
              <button type="button" className={styles.modalPrimary} onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>

        {step !== "clinic" && step !== "done" && (
          <button type="button" className={styles.modalBack} onClick={goBack}>
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
