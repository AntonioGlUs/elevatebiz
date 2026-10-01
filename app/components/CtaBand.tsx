import { BOOK_CALL_HREF } from "./constants";
import type { Texts } from "./types";

export default function CtaBand({ t }: { t: Texts }) {
  return (
    <div className="eb-section" style={{ background: "#01c3cc", padding: "100px 80px", boxSizing: "border-box", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32 }}>
      <div style={{ maxWidth: 520 }}>
        <h2 className="eb-h2" style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 34, margin: "0 0 12px 0", color: "#0b2027" }}>{t.ctaTitle}</h2>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "#0b2027", opacity: 0.85, margin: 0, maxWidth: 480 }}>{t.ctaSubtitle}</p>
      </div>
      <a href={BOOK_CALL_HREF} style={{ background: "#007a73", color: "#ffffff", padding: "16px 32px", borderRadius: 8, fontWeight: 600, fontSize: 17, textDecoration: "none", display: "inline-block", whiteSpace: "nowrap" }}>
        {t.ctaButton}
      </a>
    </div>
  );
}
