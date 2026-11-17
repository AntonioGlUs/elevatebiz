import type { Metadata } from "next";
import Site from "./site/Site";
import { TEXT, FAQ_DATA, type Lang } from "@/lib/content";

const SITE_URL = "https://elevatebiz.ai";

// The home page exists once per language, each at its own URL, so search engines index both
const HOME_PATH: Record<Lang, string> = { en: "/", es: "/es/" };

// Title and description shown in search results and social cards, per language
const SEO: Record<Lang, { title: string; description: string; locale: string; services: string; price: string }> = {
  en: {
    title: "ElevateBiz — AI Automation & Marketing",
    description:
      "ElevateBiz builds AI agents that answer your customers 24/7, automates internal processes and develops custom software for small businesses and enterprises. Plans from $300 USD.",
    locale: "en_US",
    services: "Services",
    price: "From $300 USD",
  },
  es: {
    title: "ElevateBiz — Automatización con IA y Marketing",
    description:
      "ElevateBiz crea agentes de IA que atienden a tus clientes 24/7, automatiza procesos internos y desarrolla software a la medida para pequeños negocios y empresas. Planes desde $300 USD.",
    locale: "es_MX",
    services: "Servicios",
    price: "Desde $300 USD",
  },
};

// Page metadata for one language. `alternates` tells search engines that "/" and "/es/" are the same page in
// two languages (hreflang), so each visitor gets the right one in the results.
export function homeMetadata(lang: Lang): Metadata {
  const { title, description, locale } = SEO[lang];
  return {
    title,
    description,
    alternates: {
      canonical: HOME_PATH[lang],
      languages: { en: HOME_PATH.en, es: HOME_PATH.es, "x-default": HOME_PATH.en },
    },
    openGraph: {
      title,
      description,
      url: HOME_PATH[lang],
      siteName: "ElevateBiz",
      type: "website",
      locale,
      images: [{ url: "/images/og-card.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-card.jpg"],
    },
  };
}

// Structured data (JSON-LD) for search engines and AI assistants: who the company is, what it offers and the
// questions it answers. It is built from the same texts the page shows, so it never drifts from them.
function structuredData(lang: Lang) {
  const t = TEXT[lang];
  const seo = SEO[lang];

  const organization = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: "ElevateBiz",
    url: `${SITE_URL}${HOME_PATH[lang]}`,
    logo: `${SITE_URL}/images/logo-icon-v2.webp`,
    image: `${SITE_URL}/images/og-card.jpg`,
    description: seo.description,
    telephone: "+1-650-690-8587",
    priceRange: seo.price,
    knowsLanguage: ["en", "es"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: seo.services,
      itemListElement: [1, 2, 3, 4].map((n) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: t[`svc${n}Title` as "svc1Title"],
          description: t[`svc${n}Desc` as "svc1Desc"],
          provider: { "@id": `${SITE_URL}/#organization` },
        },
      })),
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: FAQ_DATA.map((q) => ({
      "@type": "Question",
      name: q.title[lang],
      acceptedAnswer: {
        "@type": "Answer",
        // Short answer, the steps, then the closing line
        text: [q.subtitle[lang], q.steps[lang].map((step) => `${step}.`).join(" "), q.actionLabel[lang]].join(" "),
      },
    })),
  };

  return { organization, faq };
}

export default function HomePage({ lang }: { lang: Lang }) {
  const { organization, faq } = structuredData(lang);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <Site lang={lang} />
    </>
  );
}
