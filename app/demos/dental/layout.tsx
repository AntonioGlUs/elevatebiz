import { Work_Sans } from "next/font/google";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-work",
});

export default function DentalLayout({ children }: { children: React.ReactNode }) {
  return <div className={workSans.variable}>{children}</div>;
}
