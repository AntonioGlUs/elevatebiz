import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ElevateBiz — AI Automation & Marketing",
  description:
    "AI automation and marketing for small and medium businesses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600;9..144,700&family=Karla:wght@400;500;600;700&display=swap"
        />
        <link rel="icon" href="/images/logo-icon-v2.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
