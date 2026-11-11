import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ElevateBiz — AI Automation & Marketing",
  description:
    "AI automation and marketing for small and medium businesses.",
  metadataBase: new URL("https://elevatebiz.ai"),
  openGraph: {
    title: "ElevateBiz — AI Automation & Marketing",
    description: "AI automation and marketing for small and medium businesses.",
    url: "/",
    siteName: "ElevateBiz",
    type: "website",
    images: [{ url: "/images/hero-bg.webp", width: 1672, height: 941 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ElevateBiz — AI Automation & Marketing",
    description: "AI automation and marketing for small and medium businesses.",
    images: ["/images/hero-bg.webp"],
  },
};

const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Karla:wght@400;500;600;700&display=swap";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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
      <body>{children}</body>
    </html>
  );
}
