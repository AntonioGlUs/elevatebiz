export const BRAND_NAME = "ElevateBiz";

// Preview mode: action buttons (Book a call, Send) lead to the coming-soon page until launch.
// Set to true to turn them back on.
export const ACTIONS_ENABLED = false;

// Placeholder page for links that aren't live yet (public/coming-soon).
export const COMING_SOON_HREF = "/coming-soon/index.html";

export const BOOK_CALL_HREF = ACTIONS_ENABLED
  ? "mailto:hello@elevatebiz.ai?subject=I%27d%20like%20to%20book%20a%20call"
  : COMING_SOON_HREF;

// URL of the ElevateBiz API (change to the real domain when deployed)
export const API_URL = "http://localhost:8000";
