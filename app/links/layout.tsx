import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ElevateBiz — Links",
  description: "Find ElevateBiz on the web, Instagram and email, or book a call.",
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
