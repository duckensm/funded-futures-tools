# Funded Futures Tools

A static comparison and calculator hub for funded futures traders, focused on NQ/MNQ-style prop-firm decisions.

## What is included

- Premium dark landing page for futures prop-firm comparison
- Comparison table with official-source verification status
- Firm detail pages for Apex Trader Funding, Phidias Propfirm, Lucid Trading, MyFundedFutures, Tradeify, Bulenox, Earn2Trade, and TakeProfitTrader
- Trailing drawdown and consistency calculator
- Futures risk calculator for NQ, MNQ, ES, GC, and CL
- Challenge pass planner
- Affiliate disclosure and educational disclaimer
- Recommended partner links/codes for Lucid Trading and Bulenox
- Vercel Analytics page-view tracking
- Optional free Google Analytics 4 + Microsoft Clarity support for custom events, heatmaps, and session recordings

## Current recommended links

- Lucid Trading: recommended partner link with code `dutrading`
- Bulenox: recommended partner link with code `dutrading`
- Other firm pages remain official-source rule references until they are ready to feature.

Rules, pricing, payout terms, and discounts can change. Users should always verify the official firm site before purchasing.

## Run locally

```bash
npm install
npm run dev -- --port 5173
```

Open:

```text
http://127.0.0.1:5173
```

## Build for production

```bash
npm run build
```

The production output goes to `dist/`.

## Vercel deployment settings

Use these settings when importing the GitHub repo into Vercel:

- Framework preset: `Vite`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

## Optional GA4 / Clarity analytics

The site supports two optional environment variables for free custom analytics beyond Vercel Hobby page views:

```text
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_CLARITY_PROJECT_ID=xxxxxxxxxx
```

When set in Vercel and redeployed, the shared analytics helper sends route views, outbound firm clicks, calculator tab changes, calculator resets, finder changes, and filter clicks to GA4. Clarity receives page/session tracking and named custom events.

## Optional Beehiiv checklist capture

The checklist form posts to `api/subscribe.js`, a Vercel serverless function that keeps the Beehiiv API key server-side.

Set these Vercel environment variables before production email capture:

```text
BEEHIIV_API_KEY=
BEEHIIV_PUBLICATION_ID=
```

Use the API V2 `pub_...` publication ID. If Beehiiv is not configured, the checklist still unlocks locally but the email is not saved centrally.

## Compliance note

This site is educational and rule-comparison focused. It is not financial advice and does not promise that users will pass evaluations, receive payouts, or make money. Affiliate links may earn a commission.
