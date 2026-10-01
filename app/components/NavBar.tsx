"use client";

import { useEffect, useState } from "react";
import { NAV_DATA, Lang } from "@/lib/content";
import { BRAND_NAME, BOOK_CALL_HREF, COMING_SOON_HREF } from "./constants";
import type { Texts } from "./types";

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
  const navWrapperSide = scrolled ? "0" : "80px";
  const navBarRadius = scrolled ? "0px" : "18px";
  const navBarPadding = scrolled ? "14px 80px" : "10px 26px";
  const navBarShadow = scrolled
    ? "0 6px 20px rgba(20,39,32,.12)"
    : "0 14px 32px rgba(20,39,32,.10),0 2px 6px rgba(20,39,32,.05)";
  const navBarBackground = scrolled ? "rgba(255,255,255,.72)" : "#ffffff";

  const openMenuIndex = openMenu;
  const navMenus = NAV_DATA.map((menu, i) => ({
    label: menu.label[lang],
    open: openMenuIndex === i,
    chevronRotate: openMenuIndex === i ? "rotate(180deg)" : "rotate(0deg)",
    items: menu.items.map((it) => it[lang]),
    toggle: () => setOpenMenu(openMenuIndex === i ? null : i),
  }));

  const langEnBg = lang === "en" ? "#007a73" : "transparent";
  const langEnColor = lang === "en" ? "#ffffff" : "#5e6d64";
  const langEsBg = lang === "es" ? "#007a73" : "transparent";
  const langEsColor = lang === "es" ? "#ffffff" : "#5e6d64";

  return (
    <div
      className={`eb-nav-wrap${scrolled ? "" : " eb-nav-float"}`}
      style={{
        position: "fixed",
        top: navWrapperTop,
        left: navWrapperSide,
        right: navWrapperSide,
        boxSizing: "border-box",
        zIndex: 1000,
        transition: "top 300ms ease, left 300ms ease, right 300ms ease",
      }}
    >
      <div
        className={`eb-nav-bar${scrolled ? " is-scrolled" : ""}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          background: navBarBackground,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(20,39,32,.06)",
          borderRadius: navBarRadius,
          padding: navBarPadding,
          boxShadow: navBarShadow,
          transition:
            "background 300ms ease, border-radius 300ms ease, box-shadow 300ms ease, padding 300ms ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <img src="/images/logo-icon.png" alt="" style={{ height: 34, width: "auto", display: "block" }} />
          <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 19, color: "#142720" }}>
            {BRAND_NAME}
          </span>
        </div>

        <div className="eb-nav-menus" style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "center" }}>
          {navMenus.map((menu, i) => (
            <div key={i} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={menu.toggle}
                aria-expanded={menu.open}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "transparent",
                  border: "none",
                  padding: "8px 12px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#142720",
                  cursor: "pointer",
                  borderRadius: 6,
                }}
              >
                <span>{menu.label}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5e6d64"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transform: menu.chevronRotate, transition: "transform 200ms ease" }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {menu.open && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    marginTop: 6,
                    background: "#ffffff",
                    border: "1px solid rgba(20,39,32,.12)",
                    borderRadius: 10,
                    boxShadow: "0 12px 32px rgba(20,39,32,.16)",
                    padding: 8,
                    minWidth: 210,
                    zIndex: 40,
                  }}
                >
                  {menu.items.map((text, j) => (
                    <a
                      key={j}
                      href={COMING_SOON_HREF}
                      style={{
                        display: "block",
                        padding: "9px 12px",
                        borderRadius: 6,
                        fontSize: 14.5,
                        color: "#142720",
                        textDecoration: "none",
                      }}
                    >
                      {text}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(20,39,32,.06)",
              borderRadius: 999,
              padding: 3,
              gap: 2,
            }}
          >
            <button
              type="button"
              onClick={() => setLang("en")}
              style={{
                padding: "5px 11px",
                borderRadius: 999,
                border: "none",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                background: langEnBg,
                color: langEnColor,
              }}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("es")}
              style={{
                padding: "5px 11px",
                borderRadius: 999,
                border: "none",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                background: langEsBg,
                color: langEsColor,
              }}
            >
              ES
            </button>
          </div>
          <a
            href="tel:+16508005771"
            className="eb-nav-phone"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#142720",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
              whiteSpace: "nowrap",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007a73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
            </svg>
            +1 650 800 5771
          </a>
          <a
            href={BOOK_CALL_HREF}
            className="eb-nav-book"
            style={{
              background: "#007a73",
              color: "#ffffff",
              padding: "9px 20px",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 10px rgba(0,122,115,.28)",
            }}
          >
            {t.navBookCall}
          </a>
          <button
            type="button"
            className="eb-nav-burger"
            onClick={() => setMobileNavOpen((open) => !open)}
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileNavOpen}
            style={{
              background: "transparent",
              border: "none",
              padding: 6,
              cursor: "pointer",
              color: "#142720",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileNavOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel (only shown on small screens, see globals.css) */}
      {mobileNavOpen && (
        <div
          className="eb-mobile-panel"
          style={{
            marginTop: 8,
            background: "#ffffff",
            border: "1px solid rgba(20,39,32,.12)",
            borderRadius: 14,
            boxShadow: "0 12px 32px rgba(20,39,32,.16)",
            padding: 12,
            maxHeight: "calc(100vh - 140px)",
            overflowY: "auto",
          }}
        >
          {navMenus.map((menu, i) => (
            <div key={i} style={{ borderBottom: "1px solid rgba(20,39,32,.08)" }}>
              <button
                type="button"
                onClick={menu.toggle}
                aria-expanded={menu.open}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "transparent",
                  border: "none",
                  padding: "12px 8px",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#142720",
                  cursor: "pointer",
                }}
              >
                <span>{menu.label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5e6d64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: menu.chevronRotate, transition: "transform 200ms ease" }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {menu.open && (
                <div style={{ padding: "0 0 8px 8px" }}>
                  {menu.items.map((text, j) => (
                    <a
                      key={j}
                      href={COMING_SOON_HREF}
                      onClick={() => setMobileNavOpen(false)}
                      style={{ display: "block", padding: "9px 8px", fontSize: 14.5, color: "#142720", textDecoration: "none" }}
                    >
                      {text}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a
            href="tel:+16508005771"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 8px", color: "#142720", textDecoration: "none", fontWeight: 600, fontSize: 15 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007a73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
            </svg>
            +1 650 800 5771
          </a>
          <a
            href={BOOK_CALL_HREF}
            style={{ display: "block", textAlign: "center", background: "#007a73", color: "#ffffff", padding: "12px 20px", borderRadius: 10, textDecoration: "none", fontWeight: 600, fontSize: 15 }}
          >
            {t.navBookCall}
          </a>
        </div>
      )}
    </div>
  );
}
