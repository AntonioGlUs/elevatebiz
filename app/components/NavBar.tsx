"use client";

import { useEffect, useState } from "react";
import { NAV_DATA, Lang } from "@/lib/content";
import { BRAND_NAME, BOOK_CALL_HREF, COMING_SOON_HREF } from "./constants";
import type { Texts } from "./types";
import styles from "./NavBar.module.css";

type Props = {
  t: Texts;
  lang: Lang;
  setLang: (lang: Lang) => void;
  showAnnouncement: boolean;
  annHeight: number;
};

export default function NavBar({ t, lang, setLang, showAnnouncement, annHeight }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Nav shrinks once the page is scrolled
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navWrapperTop = scrolled ? "0" : `${showAnnouncement ? Math.max(42, annHeight + 3) : 42}px`;

  const openMenuIndex = openMenu;
  const navMenus = NAV_DATA.map((menu, i) => ({
    label: menu.label[lang],
    open: openMenuIndex === i,
    items: menu.items.map((it) => it[lang]),
    toggle: () => setOpenMenu(openMenuIndex === i ? null : i),
  }));

  const chevronClass = (open: boolean) => `${styles.chevron} ${open ? styles.chevronOpen : ""}`;
  const langClass = (code: Lang) => `${styles.langButton} ${lang === code ? styles.langButtonActive : ""}`;

  return (
    <div
      className={`eb-nav-wrap${scrolled ? "" : " eb-nav-float"} ${styles.wrap} ${scrolled ? styles.wrapScrolled : ""}`}
      style={{ top: navWrapperTop }}
    >
      <div className={`eb-nav-bar${scrolled ? " is-scrolled" : ""} ${styles.bar} ${scrolled ? styles.barScrolled : ""}`}>
        <div className={styles.brand}>
          <img src="/images/logo-icon.png" alt="" className={styles.logo} />
          <span className={styles.brandName}>{BRAND_NAME}</span>
        </div>

        <div className={`eb-nav-menus ${styles.menus}`}>
          {navMenus.map((menu, i) => (
            <div key={i} className={styles.menu}>
              <button type="button" onClick={menu.toggle} aria-expanded={menu.open} className={styles.menuButton}>
                <span>{menu.label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5e6d64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={chevronClass(menu.open)}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {menu.open && (
                <div className={styles.dropdown}>
                  {menu.items.map((text, j) => (
                    <a key={j} href={COMING_SOON_HREF} className={styles.dropdownLink}>
                      {text}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <div className={styles.langToggle}>
            <button type="button" onClick={() => setLang("en")} className={langClass("en")}>
              EN
            </button>
            <button type="button" onClick={() => setLang("es")} className={langClass("es")}>
              ES
            </button>
          </div>
          <a href="tel:+16508005771" className={`eb-nav-phone ${styles.phone}`}>
            <PhoneIcon />
            +1 650 800 5771
          </a>
          <a href={BOOK_CALL_HREF} className={`eb-nav-book ${styles.book}`}>
            {t.navBookCall}
          </a>
          <button
            type="button"
            className={`eb-nav-burger ${styles.burger}`}
            onClick={() => setMobileNavOpen((open) => !open)}
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileNavOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileNavOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel (only shown on small screens, see globals.css) */}
      {mobileNavOpen && (
        <div className={`eb-mobile-panel ${styles.mobilePanel}`}>
          {navMenus.map((menu, i) => (
            <div key={i} className={styles.mobileMenu}>
              <button type="button" onClick={menu.toggle} aria-expanded={menu.open} className={styles.mobileMenuButton}>
                <span>{menu.label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5e6d64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={chevronClass(menu.open)}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {menu.open && (
                <div className={styles.mobileItems}>
                  {menu.items.map((text, j) => (
                    <a key={j} href={COMING_SOON_HREF} onClick={() => setMobileNavOpen(false)} className={styles.mobileLink}>
                      {text}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a href="tel:+16508005771" className={styles.mobilePhone}>
            <PhoneIcon />
            +1 650 800 5771
          </a>
          <a href={BOOK_CALL_HREF} className={styles.mobileBook}>
            {t.navBookCall}
          </a>
        </div>
      )}
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007a73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
