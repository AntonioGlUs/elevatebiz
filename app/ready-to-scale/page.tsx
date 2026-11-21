import type { Metadata } from "next";
import GetMoreClientsView from "./view";

export const metadata: Metadata = {
  title: "Get more clients working less | ElevateBiz",
  description: "Watch how ElevateBiz combines smart advertising, AI assistants and automation to bring you new clients and give you back your time.",
  openGraph: {
    title: "Get more clients working less | ElevateBiz",
    description: "Watch how ElevateBiz combines smart advertising, AI assistants and automation to bring you new clients and give you back your time.",
    type: "website",
  },
};

// Landing page opened by the main button of the home hero: one video and one button (book a call)
export default function Page() {
  return <GetMoreClientsView />;
}
