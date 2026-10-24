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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600;9..144,700&family=Karla:wght@400;500;600;700&display=swap"
        />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
