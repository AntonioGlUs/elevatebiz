"use client";

import type { RefObject } from "react";
import type { Texts } from "./types";
import styles from "./AnnouncementBar.module.css";

type Props = {
  t: Texts;
  barRef: RefObject<HTMLDivElement>;
  onClose: () => void;
};

export default function AnnouncementBar({ t, barRef, onClose }: Props) {
  return (
    <div ref={barRef} className={`eb-ann ${styles.bar}`}>
      <span className={styles.text}>
        <a href="mailto:hello@elevatebiz.ai?subject=Special%20programs%20inquiry" className={styles.link}>
          {t.annBold}
        </a>
        {t.annRest}
      </span>
      <button type="button" onClick={() => onClose()} aria-label={t.annClose} className={styles.close}>
        <span className={`eb-ann-close-text ${styles.closeText}`}>{t.annClose}</span>
        <span className={styles.closeX}>×</span>
      </button>
    </div>
  );
}
