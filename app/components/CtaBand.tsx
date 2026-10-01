import { BOOK_CALL_HREF } from "./constants";
import type { Texts } from "./types";
import styles from "./CtaBand.module.css";

export default function CtaBand({ t }: { t: Texts }) {
  return (
    <div className={`eb-section ${styles.band}`}>
      <div className={styles.copy}>
        <h2 className={`eb-h2 ${styles.title}`}>{t.ctaTitle}</h2>
        <p className={styles.subtitle}>{t.ctaSubtitle}</p>
      </div>
      <a href={BOOK_CALL_HREF} className={styles.button}>
        {t.ctaButton}
      </a>
    </div>
  );
}
