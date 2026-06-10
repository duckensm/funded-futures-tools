# Verification checklist — confirm before promoting pages

Last generated: 2026-06-09. Anything below maps to a `TODO_VERIFY` marker in
`src/data/firms.js` (markers never render publicly — visitors see "verify on
the official site" wording — but the data should still be confirmed and the
markers removed/dated as you verify).

## Affiliate links & codes (confirm each resolves and attributes to you)

| Firm | Link | Code |
|---|---|---|
| Lucid Trading | https://lucidtrading.com/ref/dutrading | `DUTRADING` (repo previously used lowercase `dutrading` — confirm casing) |
| Phidias Propfirm | https://member.phidiaspropfirm.com/aff/go/duckensm | `DUTRADING` |
| Alpha Futures | https://app.alpha-futures.com/signup/Duckens026406/ | `Duckens026406` |
| DayTraders | https://daytraders.com/go/dutrading?c=DUTRADING | `DUTRADING` — **code changed from TNTIQNUL on 2026-06-09; confirm the `?c=DUTRADING` link parameter is correct and the old TNTIQNUL link is retired** |
| The Legends Trading | https://thelegendstrading.com/?ref=dutrading | `DUTRADING` |
| Bulenox | https://bulenox.com/member/aff/go/dutrading | `dutrading` |
| Earn2Trade | https://www.earn2trade.com/trader-career-path?a_pid=dutrading&a_bid=8d7b4b9e | `dutrading` |

## Per-firm facts to verify (TODO_VERIFY markers)

### Lucid Trading
- [ ] Current payout terms (Pro "3 funded trading days", Direct "5 days")
- [ ] Automation/algo policy (we position Lucid for NinjaTrader/algo traders)
- [ ] NinjaTrader and other supported platforms

### Phidias
- [ ] Current payout approval times ("fast payout approvals" claim)
- [ ] Maximum accounts per trader ("scales to many accounts" claim)
- [ ] Supported platforms

### Alpha Futures
- [ ] Current analytics/dashboard feature list ("best analytics & tools" lane)
- [ ] Drawdown rules per account type (Maximum Loss Limit vs EOD wording)
- [ ] Supported platforms

### DayTraders
- [ ] Current 100% profit-split conditions on Pro/S2F
- [ ] Supported platforms

### The Legends Trading
- [ ] Straight to Master trailing max loss: intraday or EOD?
- [ ] Supported platforms

### Bulenox
- [ ] Maximum accounts per trader (stacking lane)
- [ ] Current Master activation fee amounts per account size
- [ ] Supported platforms

### Earn2Trade
- [ ] Current course/education contents (education-included lane)
- [ ] Supported platforms

### Topstep (comparison foil — page intentionally avoids specifics)
- [ ] Current Trading Combine drawdown model
- [ ] Current pricing
- [ ] Current payout policy
- [ ] Set a real `lastVerified` date in `src/data/firms.js` once reviewed

### Apex (comparison foil)
- [ ] Platforms list
- [ ] Re-confirm payout rules cited on /apex-alternatives/ (5 qualifying days,
      50% consistency, max 6 payouts — last reviewed 2026-05-31)

## Promo copy that ages (offer banners on the homepage, render.js)
- [ ] Lucid "50% off all accounts / valid through July 2 at 5 PM ET"
- [ ] Phidias "80% off OTP accounts" (Memorial Boost promo wording in data)
- [ ] Alpha "25% off Premium accounts"
- [ ] DayTraders "80% off"
- [ ] Legends "50% / 30% off"
- [ ] Bulenox "89% off Option 1"
- [ ] Earn2Trade "60% off"

## Plumbing TODOs
- [ ] Eval tracker spreadsheet: create the actual spreadsheet and attach it to
      the welcome automation for the `eval_tracker_spreadsheet` source
      (MailerLite). Then update the success message in `bindInlineCapture()`
      (src/main.js) — search for `TODO(email-provider)`.
- [ ] Old hash URLs (`/#firms/...`) redirect client-side; if Search Console
      shows them indexed, they will fix themselves via the canonical tags.
