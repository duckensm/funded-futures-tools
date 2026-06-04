# Futures Prop Edge TODO

Last updated: 2026-06-03

## Highest priority

1. Finish custom domain setup
   - Domain connected: `futurespropedge.com`
   - SSL verified for `futurespropedge.com` and `www.futurespropedge.com`.
   - Email forwarding active through ImprovMX for `hello@futurespropedge.com`.
   - MailerLite sending domain authenticated for `futurespropedge.com`.
   - MailerLite sender branding updated to `Futures Prop Edge <hello@futurespropedge.com>`.

2. Verify analytics events after real traffic
   - GA4 Measurement ID: G-FRYQ27CNJQ
   - Clarity project: x0jr3tz4l4
   - Confirm these events show up:
     - page_view / route_view
     - outbound_firm_click
     - lead_magnet_submit
     - lead_magnet_checklist_open

3. Monitor Google Search Console indexing
   - Domain property verified for `futurespropedge.com`.
   - Sitemap submitted: https://futurespropedge.com/sitemap.xml
   - Request indexing for the homepage and strongest SEO pages after deployment.

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

- Live site: https://futurespropedge.com
- Project path: C:/Users/ducke/funded-futures-tools
- Checklist page live: https://futurespropedge.com/nq-prop-firm-risk-checklist.html
- Email capture: MailerLite group `NQ Checklist Leads`
- Welcome automation: `NQ Checklist Welcome Email`
- Build command: npm run build
- Deploy command: npm exec -- vercel deploy --prod --yes
