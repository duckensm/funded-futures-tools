# Funded Futures Tools TODO

## Done

- Built Vite vanilla JS site at `C:\Users\ducke\funded-futures-tools`.
- Implemented homepage, comparison table, calculators, firm pages, and disclosures.
- Added premium dark design and responsive layout.
- Added help-dot tooltips for confusing calculator terms.
- Added trailing drawdown + consistency calculator.
- Added futures risk calculator with NQ, MNQ, ES, GC, and CL.
- Added challenge pass planner.
- Removed Topstep from shortlist.
- Added Lucid Trading and Tradeify.
- Added Phidias Propfirm and captured Phidias 2.0 rules.
- Reordered comparison around buyer-intent categories instead of fake numeric rankings.
- Removed visible risk badge/column from comparison UI because it caused layout issues.
- Added/then upgraded animated NQ hero chart into trading-cockpit style graphic.
- Added affiliate placeholder system with status fields, coupon placeholders, outbound buttons, and basic dataLayer click events.
- Officially verified firm rules for:
  - Apex Trader Funding
  - MyFundedFutures
  - TakeProfitTrader
  - Tradeify
  - Bulenox
  - Lucid Trading
  - Earn2Trade
  - Phidias Propfirm
- Created `firm-rules-verification.md` with verification notes.
- Build currently succeeds with `npm run build`.
- Latest local URL: `http://127.0.0.1:5173`.

## Public recommendation notes

- Lucid Trading: currently recommended partner link at https://lucidtrading.com/ref/dutrading with code `dutrading`; verify checkout before paid campaigns.
- Bulenox: currently recommended partner link at https://bulenox.com/member/aff/go/dutrading with code `dutrading`; verify checkout before paid campaigns.
- Phidias Propfirm: add partner URL/coupon when ready and checkout terms are confirmed.
- TakeProfitTrader: keep at bottom as brief reference only.
- Apex, Tradeify, MyFundedFutures, Earn2Trade: official-source references for now.

## Next recommended work

1. Add analytics.
   - Track calculator usage.
   - Track firm page views.
   - Track outbound firm clicks.
   - Track comparison table clicks.
   - Note: outbound firm clicks now push a basic `outbound_firm_click` event to `window.dataLayer`; next step is wiring a real analytics provider.

2. Add email capture.
   - Lead magnet idea: “Free NQ Prop Firm Risk Checklist”.
   - Add signup box to homepage and calculators section.
   - Wire to Formspree, ConvertKit, Beehiiv, or another email tool.

4. Deploy a free version.
   - Recommended: Vercel or Netlify.
   - Use temporary deployment URL first.
   - Buy domain after visual/content review.

5. Apply for remaining affiliate programs.
   - Apex
   - Tradeify
   - MyFundedFutures
   - Earn2Trade

6. Add first SEO articles.
   - Best Futures Prop Firms for NQ Traders
   - Apex EOD Drawdown Explained
   - NQ vs MNQ Risk Calculator
   - Trailing Drawdown vs Static Drawdown
   - Best Prop Firms With No Activation Fee

## Useful commands

```bash
cd /c/Users/ducke/funded-futures-tools
npm run dev -- --host 127.0.0.1
npm run build
```
