"use client";

import type { RefObject } from "react";
import type { Texts } from "./types";

type Props = {
  t: Texts;
  barRef: RefObject<HTMLDivElement>;
  onClose: () => void;
};

export default function AnnouncementBar({ t, barRef, onClose }: Props) {
  return (
    <div
      ref={barRef}
      className="eb-ann"
      style={{
        background: "#01c3cc",
        padding: "10px 80px",
        textAlign: "center",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <span style={{ fontSize: 14, color: "#0b2027", fontWeight: 600 }}>
        <a
          href="mailto:hello@elevatebiz.ai?subject=Special%20programs%20inquiry"
          style={{ color: "#0b2027", textDecoration: "underline" }}
        >
          {t.annBold}
        </a>
        {t.annRest}
      </span>
      <button
        type="button"
        onClick={() => onClose()}
        aria-label={t.annClose}
        style={{
          position: "absolute",
          right: 24,
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          padding: "4px 6px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 5,
          color: "#5e6d64",
        }}
      >
        <span className="eb-ann-close-text" style={{ fontSize: 13, fontWeight: 600 }}>{t.annClose}</span>
        <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>×</span>
      </button>
    </div>
  );
}
