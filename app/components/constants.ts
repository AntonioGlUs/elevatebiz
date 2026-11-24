export const BRAND_NAME = "ElevateBiz";

// Preview mode: action buttons (Book a call, Send) lead to the coming-soon page until launch.
// Set to true to turn them back on.
export const ACTIONS_ENABLED = false;

// Placeholder page for links that aren't live yet (public/coming-soon).
export const COMING_SOON_HREF = "/coming-soon/index.html";

export const BOOK_CALL_HREF = ACTIONS_ENABLED
  ? "mailto:hello@elevatebiz.ai?subject=I%27d%20like%20to%20book%20a%20call"
  : COMING_SOON_HREF;

// GoHighLevel booking calendar "Screening Calls" (45-minute call), shown in the booking pop-up.
export const BOOKING_URL = "https://api.leadconnectorhq.com/widget/booking/Ybs2PwSoCq1Tl2VOw4fR";

// URL of the ElevateBiz API (use "http://localhost:8000" when testing the API locally)
export const API_URL = "https://api.elevatebiz.ai";

// GoHighLevel workflow "Website - Business Assessment" (Inbound Webhook): receives the answers of the "Book a demo" pop-up
export const ASSESSMENT_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/mr9wWTqxaQs94D58BtaT/webhook-trigger/SMcywWrc2EgMzp1mnMh5";
