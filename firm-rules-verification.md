# Firm Rules Verification Queue

Use this sheet before publishing affiliate traffic. Only mark a firm as officially verified after checking the firm's own rules/help/pricing pages.

| Priority | Firm | Official URL | Status | Last verified | Fields to collect |
|---:|---|---|---|---|---|
| 1 | Apex Trader Funding | https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/ | Official EOD rules checked in user's Chrome; pricing/checkout still verify | 2026-05-31 | EOD evaluation rules, EOD drawdown, EOD PA, EOD payouts captured. Still verify live pricing/checkout discounts. |
| 2 | MyFundedFutures | https://help.myfundedfutures.com/en/articles/11802636-traders-evaluation-simplified | Official help-center rules checked; checkout discounts still verify | 2026-05-31 | Eval specs/prices, Max EOD trailing, 50% consistency, $0 activation fee, payout rules, news restrictions captured. Still verify live checkout discounts/coupons. |
| 3 | TakeProfitTrader | https://takeprofittrader.com/ | Needs official verification | Not yet verified | Account sizes, prices, targets, drawdown, DLL, contracts, activation fee, payouts, consistency, resets |
| 4 | Tradeify | https://tradeify.co/ | Needs official verification | Not yet verified | Account sizes, prices, targets, drawdown, DLL, contracts, activation fee, payouts, consistency, resets |
| 5 | Bulenox | https://bulenox.com/ | Needs official verification | Not yet verified | Account sizes, prices, targets, drawdown, DLL, contracts, activation fee, payouts, consistency, resets |
| 6 | Lucid Trader Funding | https://lucidfunding.com/ | Needs official verification | Not yet verified | Account sizes, prices, targets, drawdown, DLL, contracts, activation fee, payouts, consistency, resets |
| 7 | Earn2Trade | https://www.earn2trade.com/ | Needs official verification | Not yet verified | Account sizes, prices, targets, drawdown, DLL, contracts, activation fee, payouts, consistency, resets |

## Official source links discovered

- Apex Trader Funding: https://apextraderfunding.com/ returned HTTP 403 in automated fetch; requires browser/manual verification or indexed help snippets.
- MyFundedFutures: https://myfundedfutures.com/challenge, https://myfundedfutures.com/how-it-works, https://help.myfundedfutures.com/en/, https://myfundedfutures.com/affiliate
- TakeProfitTrader: https://takeprofittraderhelp.zendesk.com/hc/en-us
- Tradeify: https://tradeify.co/#pricing-section, https://help.tradeify.co/en, https://help.tradeify.co/article/18-trailing-drawdowns, https://tradeify.co/funded-trader-agreement
- Bulenox: https://bulenox.com/help/, https://bulenox.com/member/aff/signup
- Lucid Trader Funding: https://lucidtraderfunding.com/ did not resolve; https://lucidfunding.com/ resolved and should be checked as the likely current official domain before keeping this firm in the list.
- Earn2Trade: https://www.earn2trade.com/purchase, https://help.earn2trade.com/en/

## Verification standard

For every firm page, capture:

- Official rule URL(s)
- Official pricing URL(s)
- Account sizes
- Evaluation/monthly price
- Profit target
- Drawdown type: static, EOD trailing, intraday trailing, or other
- Daily loss limit
- Contract limits for NQ and MNQ
- Scaling rules
- Minimum trading days
- Consistency rule
- Activation/PA/funded account fees
- Reset fees
- Payout schedule and payout minimums
- News, overnight, weekend, copy-trading, and prohibited strategy rules
- Affiliate/referral program URL

## Publishing rule

Do not label a firm as recommended or place affiliate CTAs on its page until the official rules are checked and a real last-verified date is added.


## MyFundedFutures official verification notes — checked 2026-05-31

Official pages captured under `research/myfundedfutures-official/`:

- Evaluation specs/prices: https://help.myfundedfutures.com/en/articles/11802636-traders-evaluation-simplified
- Max EOD trailing: https://help.myfundedfutures.com/en/articles/8348565-max-eod-trailing
- Consistency: https://help.myfundedfutures.com/en/articles/11994562-consistency-rule-at-my-funded-futures
- Activation fee: https://help.myfundedfutures.com/en/articles/12398151-does-myfunded-futures-charge-activation-fee
- Payouts: https://help.myfundedfutures.com/en/articles/13745661-payout-policy-overview-best-and-fastest-prop-firm-payouts
- News trading: https://help.myfundedfutures.com/en/articles/8230009-news-trading-policy

Key official values captured:

- Evaluation consistency: 50% for Rapid, Flex, and Pro evaluations; Pro One Day pass add-on has no consistency rule.
- Minimum trading days: 2 days.
- Activation fee: $0 for all plans.
- Daily loss limit: evaluation table lists Daily Loss Limit as None; payout page says no daily loss limits on Flex, Rapid, or Pro plans.
- Max EOD trailing locks at starting balance + $100; open equity losses are considered for rule failure.
- Flex evals: 25K target $1,500 / max loss $1,000 / 3 mini or 30 micro / $95; 50K target $3,000 / max loss $2,000 / 5 mini or 50 micro / $153.
- Rapid evals: 25K $109, 50K $157, 100K $267, 150K $347; targets $1,500 / $3,000 / $6,000 / $9,000; max loss $1,000 / $2,000 / $3,000 / $4,500; contracts 3 / 5 / 10 / 15 mini (30 / 50 / 100 / 150 micro).
- Pro evals: 50K $227, 100K $344, 150K $477; targets $3,000 / $6,000 / $9,000, with Pro One Day add-on target $4,000 on 50K; max loss $2,000 / $3,000 / $4,500; contracts 6 / 9 / 15 mini (60 / 90 / 150 micro).
- Payouts: Rapid daily, $500 minimum, 90% split; Flex after 5 winning days, $250 minimum, 80% split; Pro every 14 calendar days, $1,000 minimum, 80% split.
- News: T1 news trading permitted for evaluations and 25K/50K Flex, prohibited for Rapid Sim Funded and Pro Sim Funded; no positions/orders 2 minutes before/after applicable releases.
- Pricing caveat: official help article prices captured; still verify live checkout discounts and coupon codes before affiliate traffic.
