import type { Metadata } from "next";
import OnboardingApp from "./OnboardingApp";

export const metadata: Metadata = {
  title: "Onboarding — ElevateBiz",
  description: "Client onboarding: tell us about your business so we can build your AI agents.",
  robots: { index: false, follow: false }, // private area for invited clients
};

export default function OnboardingPage() {
  return <OnboardingApp />;
}
