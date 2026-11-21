import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

// What the company does, for search engines and AI assistants (also used in the social cards)
const SITE_DESCRIPTION =
  "ElevateBiz builds AI agents that answer your customers 24/7, automates internal processes and develops custom software for small businesses and enterprises. Plans from $300 USD.";

export const metadata: Metadata = {
  title: "ElevateBiz — AI Automation & Marketing",
  description: SITE_DESCRIPTION,
  metadataBase: new URL("https://elevatebiz.ai"),
  openGraph: {
    title: "ElevateBiz — AI Automation & Marketing",
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "ElevateBiz",
    type: "website",
    images: [{ url: "/images/og-card.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ElevateBiz — AI Automation & Marketing",
    description: SITE_DESCRIPTION,
    images: ["/images/og-card.jpg"],
  },
};

const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Karla:wght@400;500;600;700&family=Caveat:wght@600;700&family=Manrope:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Home page only: visitors who chose Spanish before, or whose browser is in Spanish and have not chosen
            yet, are sent to /es/ before the page paints. Search engines have no saved choice and browse in
            English, so they still read "/" in English. The address keeps its ?query and #section. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(location.pathname!=='/')return;var s=localStorage.getItem('eb-lang');if(s==='es'||(s!=='en'&&(navigator.language||'').toLowerCase().indexOf('es')===0)){location.replace('/es/'+location.search+location.hash)}}catch(e){}})()",
          }}
        />
        {/* First hero photo: start downloading it right away (it is the largest thing on screen) */}
        <link rel="preload" as="image" href="/images/hero-building.webp" fetchPriority="high" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Fonts load without blocking the first paint: media=print until the sheet arrives, then all */}
        <link id="google-fonts" rel="stylesheet" href={FONTS_URL} media="print" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var l=document.getElementById('google-fonts');if(!l)return;function on(){l.media='all'}if(l.sheet){on()}else{l.addEventListener('load',on)}})()",
          }}
        />
        <noscript>
          <link rel="stylesheet" href={FONTS_URL} />
        </noscript>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        {children}
        {/* Microsoft Clarity (session recordings and heatmaps); loads after the page is interactive */}
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","zfu9h5hqhu");`}
        </Script>
      </body>
    </html>
  );
}
