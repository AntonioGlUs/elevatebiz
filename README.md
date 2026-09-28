# ElevateBiz — AI Automation & Marketing Landing Page

Bilingual (English / Spanish) marketing site for **ElevateBiz**, an agency that helps small and medium businesses automate customer service, lead handling, and marketing with AI.

**Live site:** _coming soon_

## Tech stack

- [Next.js 14](https://nextjs.org) (App Router) with static export
- React 18 + TypeScript
- Google Fonts (Fraunces, Karla)
- No UI framework: layout, styles, and animations are hand-built

## Features

- **EN / ES language toggle.** All copy lives in one typed content file (`lib/content.ts`), so each section renders in either language.
- **Animated WhatsApp demo.** A scripted conversation plays message by message with a typing indicator, showing how an AI assistant answers a customer.
- **Lead-routing diagram.** An animated diagram shows incoming leads being routed to the right team member by specialty.
- **Scroll-driven interactions:**
  - Navbar that shrinks on scroll
  - Hero entrance animation
  - Stats that count up when they come into view
  - Sections that reveal as you scroll (`IntersectionObserver`)
- **Services carousel and client logo marquee**, plus hover effects on service cards and pain points.
- **FAQ, team, and contact sections**, plus a call-to-action band with a click-to-call phone number.
- **Static export.** `next build` outputs plain HTML/CSS/JS to `out/`, so the site runs on any static or shared hosting (no Node.js server needed).

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
```

The static site is generated in `out/` and can be uploaded to any web host.

## Project structure

```
app/
  layout.tsx     — metadata, fonts, favicon
  page.tsx       — page sections and interactive logic (React hooks)
  globals.css    — base styles
lib/
  content.ts     — EN/ES copy, stats, FAQ, team, navigation, chat script
public/images/   — hero, service images, logo
```

## Roadmap

- Connect the contact form to an n8n webhook for lead qualification
- Embed an n8n-powered AI chat widget
- Replace placeholder client logos with real ones
