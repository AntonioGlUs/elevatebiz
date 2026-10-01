import type { Texts } from "./types";

export default function Testimonial({ t }: { t: Texts }) {
  return (
    <div className="eb-section" style={{ background: "#f3f6f3", padding: "100px 80px", boxSizing: "border-box" }}>
      <div className="eb-testimonial" style={{ display: "flex", gap: 40, alignItems: "center", maxWidth: 760 }}>
        <div style={{ width: 72, height: 72, borderRadius: 999, background: "#01c3cc33", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#007a73" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <p className="eb-testimonial-quote" style={{ margin: "0 0 16px 0", fontFamily: "Fraunces, serif", fontSize: 22, fontStyle: "italic", lineHeight: 1.5, color: "#142720" }}>{t.testimonialQuote}</p>
          <p style={{ margin: 0, fontSize: 15, color: "#5e6d64" }}>{t.testimonialName}</p>
        </div>
      </div>
    </div>
  );
}
