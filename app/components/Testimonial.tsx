import type { Texts } from "./types";
import styles from "./Testimonial.module.css";

export default function Testimonial({ t }: { t: Texts }) {
  return (
    <div className={`eb-section ${styles.section}`}>
      <div className={`eb-testimonial ${styles.inner}`}>
        <div className={styles.avatar}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#007a73" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <p className={`eb-testimonial-quote ${styles.quote}`}>{t.testimonialQuote}</p>
          <p className={styles.name}>{t.testimonialName}</p>
        </div>
      </div>
    </div>
  );
}
