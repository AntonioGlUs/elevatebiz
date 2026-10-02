import type { Metadata } from "next";
import "./globals.css";
import Chatbot from './components/Chatbot';


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
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>{children}
        <Chatbot />
      </body>
    </html>
  );
}
