import type { Metadata } from "next";
import styles from "./dental.module.css";
import { Header } from "./client";
import { BookingProvider } from "./booking";
import { Hero, Comfort, Portraits, Redefining, Team, Footer } from "./components";

export const metadata: Metadata = {
  title: "Dental Clinic",
  description: "Modern dental care: exams, cleanings, cosmetic and kids dentistry.",
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
          <Team />
        </main>
        <Footer />
      </BookingProvider>
    </div>
  );
}
