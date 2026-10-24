"use client";

import { useEffect, useRef, useState } from "react";
import { TEXT, Lang } from "@/lib/content";
import AnnouncementBar from "./components/AnnouncementBar";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import LogoMarquee from "./components/LogoMarquee";
import StatsBand from "./components/StatsBand";
import WhatsAppDemo from "./components/WhatsAppDemo";
import PainPoints from "./components/PainPoints";
import WaveSection from "./components/WaveSection";
import ServicesCarousel from "./components/ServicesCarousel";
import HowItWorks from "./components/HowItWorks";
import LeadRoutingDiagram from "./components/LeadRoutingDiagram";
import Faq from "./components/Faq";
import Testimonial from "./components/Testimonial";
import ContactForm from "./components/ContactForm";
import CtaBand from "./components/CtaBand";
import Footer from "./components/Footer";
import PreviewNotice from "./components/PreviewNotice";
import Chatbot from "./components/Chatbot";
import styles from "./page.module.css";

export default function Page() {
  const [lang, setLang] = useState<Lang>("en");
  const t = TEXT[lang];

  // Initial language: saved choice, else the browser's language
  useEffect(() => {
    const saved = localStorage.getItem("eb-lang");
    if (saved === "en" || saved === "es") setLang(saved);
    else if (navigator.language.toLowerCase().startsWith("es")) setLang("es");
  }, []);

  // Keep <html lang> in sync and remember the choice
  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("eb-lang", lang);
  }, [lang]);

  // Announcement bar: it slides in 3 seconds after the page loads (unless it was closed) and the nav sits below it
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [annArrived, setAnnArrived] = useState(false);
  const annRef = useRef<HTMLDivElement>(null);
  const [annHeight, setAnnHeight] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnnArrived(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Bar height (it wraps to more lines on small screens)
  useEffect(() => {
    function measure() {
      if (annRef.current) setAnnHeight(annRef.current.getBoundingClientRect().height);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const annVisible = showAnnouncement && annArrived;
  // The bar floats over the hero, so the hero always keeps a gap at the top for it (34 is the usual bar
  // height, used until the real one is measured)
  const heroOffset = annHeight || 34;

  return (
    <>
    <div className={`eb-root ${styles.root}`}>
      {/* The bar always exists and sits over the top of the page (nothing is pushed down, so no gap can
          open up): it just slides in from above the screen and slides out again if it is closed. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          visibility: annVisible ? "visible" : "hidden",
          transition: annVisible ? "visibility 0s" : "visibility 0s linear 900ms",
        }}
      >
        <div
          style={{
            transform: annVisible ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <AnnouncementBar t={t} barRef={annRef} onClose={() => setShowAnnouncement(false)} />
        </div>
      </div>
      <NavBar t={t} lang={lang} setLang={setLang} showAnnouncement={annVisible} annHeight={annHeight} />
      <Hero t={t} heroOffset={heroOffset} />
      <LogoMarquee t={t} />
      <StatsBand lang={lang} />
      <PainPoints t={t} />
      <WaveSection>
        <WhatsAppDemo t={t} lang={lang} />
      </WaveSection>
      <ServicesCarousel t={t} />
      <HowItWorks t={t} />
      <LeadRoutingDiagram t={t} lang={lang} />
      <Faq t={t} lang={lang} />
      <Testimonial t={t} />
      <ContactForm t={t} />
      <CtaBand t={t} />
      <Footer t={t} />
      <PreviewNotice t={t} />
    </div>
    {/* The chatbot lives here (not in the root layout) so demo sites can have their own bot */}
    <Chatbot />
    </>
  );
}
