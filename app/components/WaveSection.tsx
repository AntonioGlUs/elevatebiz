import type { ReactNode } from "react";
import styles from "./WaveSection.module.css";

// Background wrapper: navy with a wave on top and a subtle grain.
export default function WaveSection({ children }: { children: ReactNode }) {
  return (
    <div className={styles.section}>
      <div className={styles.grain} aria-hidden="true" />
      {/* Wave: white (the section above) curving into the navy background */}
      <svg viewBox="0 0 1440 70" width="100%" height="70" preserveAspectRatio="none" className={styles.wave}>
        <path d="M0,0 L1440,0 L1440,35 C 1080,-10 360,80 0,35 Z" fill="#ffffff" />
      </svg>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
