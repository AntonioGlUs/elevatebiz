import HomePage, { homeMetadata } from "../components/HomePage";

// Spanish home page, at /es/. The English one is app/page.tsx.
export const metadata = homeMetadata("es");

export default function Page() {
  return <HomePage lang="es" />;
}
