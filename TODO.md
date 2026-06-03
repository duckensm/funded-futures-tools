# Funded Futures Tools TODO

Last updated: 2026-06-02

## Highest priority

1. Connect a custom domain when ready
   - Buy or connect the final domain.
   - Update canonical, Open Graph URL, `robots.txt`, `sitemap.xml`, and MailerLite checklist links from the Vercel URL to the custom domain.
   - Authenticate the sending domain in MailerLite for better inbox placement.

2. Verify analytics events after real traffic
   - GA4 Measurement ID: G-FRYQ27CNJQ
   - Clarity project: x0jr3tz4l4
   - Confirm these events show up:
     - page_view / route_view
     - outbound_firm_click
     - lead_magnet_submit
     - lead_magnet_checklist_open

3. Submit site to Google Search Console
   - Add property for https://funded-futures-tools.vercel.app
   - Verify ownership.
   - Submit the homepage and sitemap.
   - Request indexing.

## Traffic / monetization

4. Add more SEO buyer-intent articles
   Good follow-ups:
   - EOD Drawdown vs Intraday Trailing Drawdown Explained
   - How Much Should You Risk Per NQ/MNQ Trade in a Prop Firm Challenge?
   - Apex vs Lucid Trading vs Bulenox for NQ Traders

5. Recheck partner offers before paid promotion
   - Phidias partner link/code
   - Lucid Trading partner link/code
   - Bulenox partner link/code
   - Confirm final checkout-price language remains visible.

## Current status snapshot

- Live site: https://funded-futures-tools.vercel.app
- Project path: C:/Users/ducke/funded-futures-tools
- Checklist page live: https://funded-futures-tools.vercel.app/nq-prop-firm-risk-checklist.html
- Email capture: MailerLite group `NQ Checklist Leads`
- Welcome automation: `NQ Checklist Welcome Email`
- Build command: npm run build
- Deploy command: npm exec -- vercel deploy --prod --yes
