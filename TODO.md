# Funded Futures Tools TODO

Last updated: 2026-06-02

## Highest priority

1. Finish Beehiiv production subscriber QA
   - Vercel API route and frontend submit flow are wired.
   - Vercel production env vars are set for `BEEHIIV_API_KEY` and API V2 `BEEHIIV_PUBLICATION_ID`.
   - Submit one real test email after deploy and confirm it appears in Beehiiv.

2. Verify analytics events after real traffic
   - GA4 Measurement ID: G-FRYQ27CNJQ
   - Clarity project: x0jr3tz4l4
   - Confirm these events show up:
     - page_view / route_view
     - outbound_firm_click
     - lead_magnet_submit
     - lead_magnet_download

## Traffic / monetization

3. Submit site to Google Search Console
   - Add property for https://funded-futures-tools.vercel.app
   - Verify ownership.
   - Submit homepage and key hash routes/pages if applicable.
   - Request indexing.

4. Add more SEO buyer-intent articles
   Good follow-ups:
   - EOD Drawdown vs Intraday Trailing Drawdown Explained
   - How Much Should You Risk Per NQ/MNQ Trade in a Prop Firm Challenge?
   - Apex vs Lucid Trading vs Bulenox for NQ Traders


## Current status snapshot

- Live site: https://funded-futures-tools.vercel.app
- Project path: C:/Users/ducke/funded-futures-tools
- Checklist page live: https://funded-futures-tools.vercel.app/#checklist
- Build command: npm run build
- Deploy command: npm exec -- vercel deploy --prod --yes
