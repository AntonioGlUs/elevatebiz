// Google Analytics measurement ID (it is public: it ends up in the page code)
const GA_ID = "G-0FC0MRX656";

// Loads Google Analytics. Call it only after the visitor accepted cookies.
export function loadAnalytics() {
  if (document.getElementById("ga-script")) return;
  const w = window as unknown as { dataLayer: unknown[] };
  w.dataLayer = w.dataLayer || [];
  function gtag(..._args: unknown[]) {
    // gtag.js reads the `arguments` object itself, so it has to be pushed as it is
    w.dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", GA_ID);

  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}
