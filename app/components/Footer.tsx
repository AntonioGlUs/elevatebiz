import { BRAND_NAME, BOOK_CALL_HREF, COMING_SOON_HREF } from "./constants";
import type { Texts } from "./types";
import styles from "./Footer.module.css";

export default function Footer({ t }: { t: Texts }) {
  return (
    <div className={`eb-footer ${styles.footer}`}>
      <div className={styles.top}>
        <div>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <img src="/images/logo-icon-v2.png" alt="" className={styles.logoImg} />
            </div>
            <span className={styles.brandName}>{BRAND_NAME}</span>
          </div>
          <div className={styles.tagline}>{t.footerTagline}</div>
        </div>
        <a href={BOOK_CALL_HREF} className={styles.bookCall}>
          {t.footerBookCall}
        </a>
      </div>
      <div className={styles.bottom}>
        <span className={styles.copyright}>{t.footerCopyright}</span>
        <div className={styles.contact}>
          <div className={styles.social}>
            <a href="https://www.instagram.com/elevatebiz.ai/" aria-label="Instagram" className={styles.socialLink}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" />
              </svg>
            </a>
            <a href={COMING_SOON_HREF} aria-label="Facebook" className={styles.socialLink}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 8h-2a2 2 0 0 0-2 2v3H9v3h2v6h3v-6h2.2l.8-3H14v-2a1 1 0 0 1 1-1h2V8Z" />
              </svg>
            </a>
            <a href={COMING_SOON_HREF} aria-label="LinkedIn" className={styles.socialLink}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M7 10v7M7 7v.01M11 17v-4.5a2.5 2.5 0 0 1 5 0V17M11 10v7" />
              </svg>
            </a>
            <a href={COMING_SOON_HREF} aria-label="X" className={styles.socialLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l16 16M20 4 4 20" />
              </svg>
            </a>
          </div>
          <a href="mailto:hello@elevatebiz.ai" className={styles.email}>
            hello@elevatebiz.ai
          </a>
        </div>
      </div>
      <div className={styles.demoNotice}>
        <span className={styles.demoNoticeText}>{t.footerDemoNotice}</span>
      </div>
    </div>
  );
}
