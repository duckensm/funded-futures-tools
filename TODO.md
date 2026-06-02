# Funded Futures Tools TODO

Last updated: 2026-06-02

## Highest priority

1. Connect checklist lead capture to a real subscriber backend
   - Current form unlocks/downloads checklist locally and tracks events.
   - It does NOT yet save emails centrally.
   - Options: Beehiiv, ConvertKit, Mailchimp, Airtable, Google Sheets, or a Vercel serverless webhook.

2. Verify analytics events after real traffic
   - GA4 Measurement ID: G-FRYQ27CNJQ
   - Clarity project: x0jr3tz4l4
   - Confirm these events show up:
     - page_view / route_view
     - outbound_firm_click
     - lead_magnet_submit
     - lead_magnet_download

3. Add privacy policy and terms
   - Needed because the site has analytics and email capture.
   - Include affiliate disclosure, analytics disclosure, email capture/data use, and educational-only risk disclaimer.

## Traffic / monetization

4. Submit site to Google Search Console
   - Add property for https://funded-futures-tools.vercel.app
   - Verify ownership.
   - Submit homepage and key hash routes/pages if applicable.
   - Request indexing.

5. Add first SEO buyer-intent article
   Suggested first article:
   - Best Funded Futures Prop Firms for NQ Traders

   Other good follow-ups:
   - EOD Drawdown vs Intraday Trailing Drawdown Explained
   - How Much Should You Risk Per NQ/MNQ Trade in a Prop Firm Challenge?
   - Apex vs Lucid Trading vs Bulenox for NQ Traders


## Current status snapshot

- Live site: https://funded-futures-tools.vercel.app
- Project path: C:/Users/ducke/funded-futures-tools
- Checklist page live: https://funded-futures-tools.vercel.app/#checklist
- Latest checklist commit pushed: 0988ab4 Add NQ prop firm checklist lead capture
- Build command: npm run build
- Deploy command: vercel deploy --prod --yes
