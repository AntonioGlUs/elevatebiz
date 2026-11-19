"use client";

import { useCallback, useEffect, useState } from "react";
import type { Texts } from "./types";
import { loadAnalytics } from "./analytics";
import { OPEN_EVENT, currentPrefs, readPrefs, savePrefs, type CookiePrefs } from "./cookiePrefs";
import styles from "./CookieNotice.module.css";

type Category = "necessary" | "performance";

export default function CookieNotice({ t }: { t: Texts }) {
  const [bannerOpen, setBannerOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [draft, setDraft] = useState<CookiePrefs>(currentPrefs);
  const [expanded, setExpanded] = useState<Record<Category, boolean>>({ necessary: false, performance: false });

  // Ask only if the visitor hasn't chosen before; analytics starts right away if it was allowed
  useEffect(() => {
    const saved = readPrefs();
    if (saved?.performance) loadAnalytics();
    if (!saved) setBannerOpen(true);
  }, []);

  // The "Cookie settings" link of the footer opens the panel
  useEffect(() => {
    const open = () => {
      setDraft(currentPrefs());
      setPanelOpen(true);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  const closePanel = useCallback(() => setPanelOpen(false), []);

  // While the panel is up: the page behind does not scroll, and Escape closes it
  useEffect(() => {
    if (!panelOpen) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [panelOpen, closePanel]);

  function save(next: CookiePrefs) {
    // Analytics is running only if it was saved as allowed
    const wasOn = readPrefs()?.performance === true;
    savePrefs(next);
    if (next.performance) loadAnalytics();
    setBannerOpen(false);
    setPanelOpen(false);
    // A script that is already running cannot be unloaded, so the page reloads when analytics is turned off
    if (wasOn && !next.performance) window.location.reload();
  }

  function openPanel() {
    setDraft(currentPrefs());
    setPanelOpen(true);
  }

  const toggle = (key: Category) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const rows: { key: Category; title: string; desc: string }[] = [
    { key: "necessary", title: t.cookieNecessaryTitle, desc: t.cookieNecessaryDesc },
    { key: "performance", title: t.cookiePerformanceTitle, desc: t.cookiePerformanceDesc },
  ];

  return (
    <>
      {bannerOpen && !panelOpen && (
        <div role="region" aria-label="Cookies" className={styles.bar}>
          <p className={styles.text}>
            {t.cookieText}{" "}
            <a href="/privacy/" className={styles.link}>
              {t.footerPrivacy}
            </a>
          </p>
          <div className={styles.actions}>
            <button type="button" onClick={openPanel} className={styles.decline}>
              {t.cookieSettings}
            </button>
            <button type="button" onClick={() => save({ performance: true })} className={styles.accept}>
              {t.cookieAccept}
            </button>
          </div>
        </div>
      )}

      {panelOpen && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={t.cookieModalTitle} data-lenis-prevent onClick={closePanel}>
          <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>{t.cookieModalTitle}</h2>
              <button type="button" className={styles.close} onClick={closePanel} aria-label={t.cookieClose}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className={styles.panelBody}>
              <p className={styles.intro}>
                {t.cookieModalIntro}{" "}
                <a href="/privacy/" className={styles.link}>
                  {t.cookieMore}
                </a>
              </p>
              <h3 className={styles.manage}>{t.cookieManage}</h3>

              <ul className={styles.rows}>
                {rows.map((row) => {
                  const open = expanded[row.key];
                  const id = `cookie-${row.key}`;
                  return (
                    <li key={row.key} className={styles.row}>
                      <div className={styles.rowHead}>
                        <button type="button" className={styles.rowToggle} aria-expanded={open} aria-controls={id} onClick={() => toggle(row.key)}>
                          <span className={styles.plus} aria-hidden="true">
                            {open ? "−" : "+"}
                          </span>
                          <span className={styles.rowTitle}>{row.title}</span>
                        </button>
                        {row.key === "necessary" ? (
                          <span className={styles.always}>{t.cookieAlways}</span>
                        ) : (
                          <button
                            type="button"
                            role="switch"
                            aria-checked={draft[row.key]}
                            aria-label={row.title}
                            className={`${styles.switch} ${draft[row.key] ? styles.switchOn : ""}`}
                            onClick={() => setDraft((prev) => ({ ...prev, [row.key]: !prev[row.key] }))}
                          >
                            <span className={styles.knob} />
                          </button>
                        )}
                      </div>
                      {open && (
                        <p id={id} className={styles.rowDesc}>
                          {row.desc}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className={styles.panelFooter}>
              <button type="button" className={styles.decline} onClick={() => save({ performance: true })}>
                {t.cookieAccept}
              </button>
              <button type="button" className={styles.accept} onClick={() => save(draft)}>
                {t.cookieConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
