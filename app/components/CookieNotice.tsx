"use client";

import { useEffect, useState } from "react";
import type { Texts } from "./types";
import { loadAnalytics } from "./analytics";
import styles from "./CookieNotice.module.css";

const CONSENT_KEY = "eb-consent";

// True only if the visitor pressed "Accept". Analytics must be loaded only when this is true.
export function hasCookieConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

export default function CookieNotice({ t }: { t: Texts }) {
  const [open, setOpen] = useState(false);

  // Ask only if the visitor hasn't answered before; if they already accepted, analytics starts right away
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_KEY);
      if (saved === "accepted") loadAnalytics();
      else if (!saved) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  function answer(value: "accepted" | "declined") {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Storage blocked: the choice just lasts until the page is closed
    }
    if (value === "accepted") loadAnalytics();
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div role="region" aria-label="Cookies" className={styles.bar}>
      <p className={styles.text}>
        {t.cookieText}{" "}
        <a href="/privacy/" className={styles.link}>
          {t.footerPrivacy}
        </a>
      </p>
      <div className={styles.actions}>
        <button type="button" onClick={() => answer("declined")} className={styles.decline}>
          {t.cookieDecline}
        </button>
        <button type="button" onClick={() => answer("accepted")} className={styles.accept}>
          {t.cookieAccept}
        </button>
      </div>
    </div>
  );
}
