import type { Metadata } from "next";
import { getSolution } from "../data";
import SolutionView from "../view";

const solution = getSolution("gym")!;

export const metadata: Metadata = {
  title: `${solution.name.en} | ElevateBiz`,
  description: solution.subtitle.en,
  openGraph: { title: `${solution.name.en} | ElevateBiz`, description: solution.subtitle.en, type: "website" },
};

export default function Page() {
  return <SolutionView solution={solution} />;
}
