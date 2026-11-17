import HomePage, { homeMetadata } from "./components/HomePage";

// English home page. The Spanish one is app/es/page.tsx.
export const metadata = homeMetadata("en");

export default function Page() {
  return <HomePage lang="en" />;
}
