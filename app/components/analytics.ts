// Google Analytics measurement ID (it is public: it ends up in the page code)
const GA_ID = "G-0FC0MRX656";

import { BOOK_CALL_HREF } from "./constants";

type DataLayerWindow = { dataLayer: unknown[] };

// Sends a command to Google Analytics. gtag.js reads the `arguments` object itself, so it is pushed as it is.
function gtag(..._args: unknown[]) {
  const w = window as unknown as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer.push(arguments);
}

// True once the visitor accepted cookies and Google Analytics was loaded
const isLoaded = () => typeof document !== "undefined" && Boolean(document.getElementById("ga-script"));

// Records something the visitor did (opened the chat, played the video, clicked "Book a call").
// Nothing is recorded if the visitor did not accept cookies.
export function track(event: string, params: Record<string, string | number> = {}) {
  if (!isLoaded()) return;
  gtag("event", event, params);
}

// Clicks on any "Book a call" link of the page, wherever it is
function onBookCallClick(event: MouseEvent) {
  const link = (event.target as HTMLElement | null)?.closest?.("a[href]");
  if (link && link.getAttribute("href") === BOOK_CALL_HREF) {
    track("book_call_click", { label: (link.textContent || "").trim().slice(0, 60) });
  }
}

// Loads Google Analytics. Call it only after the visitor accepted cookies.
export function loadAnalytics() {
  if (document.getElementById("ga-script")) return;
  gtag("js", new Date());
  gtag("config", GA_ID);

  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  document.addEventListener("click", onBookCallClick);
}
