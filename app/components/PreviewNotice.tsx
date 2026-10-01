"use client";

import { useEffect, useState } from "react";
import type { Texts } from "./types";

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
    <div
      onClick={() => setShowPreviewNotice(false)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(20,39,32,.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-describedby="preview-notice-text"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff",
          borderRadius: 16,
          maxWidth: 420,
          width: "100%",
          padding: "28px 28px 24px",
          boxSizing: "border-box",
          boxShadow: "0 24px 60px rgba(20,39,32,.25)",
          textAlign: "center",
        }}
      >
        <p id="preview-notice-text" style={{ margin: "0 0 22px 0", fontSize: 16, lineHeight: 1.55, color: "#142720" }}>
          {t.previewNotice}
        </p>
        <button
          type="button"
          onClick={() => setShowPreviewNotice(false)}
          autoFocus
          style={{ background: "#007a73", color: "#ffffff", border: "none", borderRadius: 8, padding: "12px 28px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}
        >
          {t.previewNoticeButton}
        </button>
      </div>
    </div>
  );
}
