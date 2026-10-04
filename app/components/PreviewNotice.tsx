"use client";

import { useEffect, useState } from "react";
import type { Texts } from "./types";
import styles from "./PreviewNotice.module.css";

export default function PreviewNotice({ t }: { t: Texts }) {
  const [showPreviewNotice, setShowPreviewNotice] = useState(false);

  // Open on load, close with Escape
  useEffect(() => {
    setShowPreviewNotice(true);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowPreviewNotice(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!showPreviewNotice) return null;

  // Closes with the button or a click outside the box
  return (
    <div onClick={() => setShowPreviewNotice(false)} className={styles.overlay}>
      <div
        role="dialog"
        aria-modal="true"
        aria-describedby="preview-notice-text"
        onClick={(e) => e.stopPropagation()}
        className={styles.dialog}
      >
        <p id="preview-notice-text" className={styles.text}>
          {t.previewNotice}
        </p>
        {/* Additional note: smaller and softer than the main notice */}
        <div className={styles.note}>
          <p className={styles.noteTitle}>{t.previewNoteTitle}</p>
          <ul className={styles.noteList}>
            <li>
              <span aria-hidden="true">💬</span> <strong>{t.previewNoteChatBold}</strong> {t.previewNoteChat} <strong>{t.previewNoteMoreBold}</strong> {t.previewNoteMore}
            </li>
          </ul>
        </div>
        <button type="button" onClick={() => setShowPreviewNotice(false)} autoFocus className={styles.button}>
          {t.previewNoticeButton}
        </button>
      </div>
    </div>
  );
}
