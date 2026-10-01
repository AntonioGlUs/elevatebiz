import { BRAND_NAME, BOOK_CALL_HREF, COMING_SOON_HREF } from "./constants";
import type { Texts } from "./types";

export default function Footer({ t }: { t: Texts }) {
  return (
    <div className="eb-footer" style={{ background: "#1e3a5f", padding: "64px 80px 48px", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24, paddingBottom: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: "#eef1f3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <img src="/images/logo-icon-v2.png" alt="" style={{ height: 20, width: "auto", display: "block" }} />
            </div>
            <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 19, color: "#ffffff" }}>{BRAND_NAME}</span>
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,.65)", maxWidth: 280 }}>{t.footerTagline}</div>
        </div>
        <a href={BOOK_CALL_HREF} style={{ background: "#01c3cc", color: "#0b2027", padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 15 }}>
          {t.footerBookCall}
        </a>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.15)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontSize: 14, color: "rgba(255,255,255,.6)" }}>{t.footerCopyright}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <a href="https://www.instagram.com/elevatebiz.ai/" aria-label="Instagram" style={{ display: "flex", color: "rgba(255,255,255,.6)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" />
              </svg>
            </a>
            <a href={COMING_SOON_HREF} aria-label="Facebook" style={{ display: "flex", color: "rgba(255,255,255,.6)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 8h-2a2 2 0 0 0-2 2v3H9v3h2v6h3v-6h2.2l.8-3H14v-2a1 1 0 0 1 1-1h2V8Z" />
              </svg>
            </a>
            <a href={COMING_SOON_HREF} aria-label="LinkedIn" style={{ display: "flex", color: "rgba(255,255,255,.6)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M7 10v7M7 7v.01M11 17v-4.5a2.5 2.5 0 0 1 5 0V17M11 10v7" />
              </svg>
            </a>
            <a href={COMING_SOON_HREF} aria-label="X" style={{ display: "flex", color: "rgba(255,255,255,.6)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l16 16M20 4 4 20" />
              </svg>
            </a>
          </div>
          <a href="mailto:hello@elevatebiz.ai" style={{ fontSize: 14, color: "#01c3cc" }}>
            hello@elevatebiz.ai
          </a>
        </div>
      </div>
      <div style={{ textAlign: "center", paddingTop: 18 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#f5c518" }}>{t.footerDemoNotice}</span>
      </div>
    </div>
  );
}
