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
import styles from "./page.module.css";

export default function Page() {
  const [lang, setLang] = useState<Lang>("en");
  const t = TEXT[lang];

  // Announcement bar: the nav sits right below it, and the hero compensates when it is closed
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const annRef = useRef<HTMLDivElement>(null);
  const [annHeight, setAnnHeight] = useState(0);

  // Bar height (it wraps to more lines on small screens)
  useEffect(() => {
    function measure() {
      if (annRef.current) setAnnHeight(annRef.current.offsetHeight);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [showAnnouncement]);

  const heroOffset = showAnnouncement ? 0 : annHeight;

  return (
    <div className={`eb-root ${styles.root}`}>
      {showAnnouncement && (
        <AnnouncementBar t={t} barRef={annRef} onClose={() => setShowAnnouncement(false)} />
      )}
      <NavBar t={t} lang={lang} setLang={setLang} showAnnouncement={showAnnouncement} annHeight={annHeight} />
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
  );
}
