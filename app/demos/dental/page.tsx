import type { Metadata } from "next";
import styles from "./dental.module.css";
import { Header } from "./client";
import { BookingProvider } from "./booking";
import { Hero, Comfort, Portraits, Redefining, Reviews, Team, Footer } from "./components";

export const metadata: Metadata = {
  title: "Riverdale Dental Care",
  description: "Modern dental care: exams, cleanings, cosmetic and kids dentistry.",
  openGraph: {
    title: "Riverdale Dental Care",
    description: "Modern dental care: exams, cleanings, cosmetic and kids dentistry.",
    type: "website",
    images: [{ url: "/images/dental/team-banner.webp", width: 1536, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Riverdale Dental Care",
    description: "Modern dental care: exams, cleanings, cosmetic and kids dentistry.",
    images: ["/images/dental/team-banner.webp"],
  },
};

export default function DentalDemoPage() {
  return (
    <div className={styles.root}>
      <BookingProvider>
        <Header />
        <main>
          <Hero />
          <Comfort />
          <Portraits />
          <Redefining />
          <Reviews />
          <Team />
        </main>
        <Footer />
      </BookingProvider>
      {/* Plain link to the main ElevateBiz site; fixed so it is always within reach */}
      <a href="/" className={styles.backToSite}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
        Back to ElevateBiz
      </a>
    </div>
  );
}
