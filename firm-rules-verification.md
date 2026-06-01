# Firm Rules Verification Queue

Use this sheet before publishing affiliate traffic. Only mark a firm as officially verified after checking the firm's own rules/help/pricing pages.

| Priority | Firm | Official URL | Status | Last verified | Fields to collect |
|---:|---|---|---|---|---|
| 1 | Apex Trader Funding | https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/ | Official EOD rules checked in user's Chrome; pricing/checkout still verify | 2026-05-31 | EOD evaluation rules, EOD drawdown, EOD PA, EOD payouts captured. Still verify live pricing/checkout discounts. |
| 2 | MyFundedFutures | https://help.myfundedfutures.com/en/articles/11802636-traders-evaluation-simplified | Official help-center rules checked; checkout discounts still verify | 2026-05-31 | Eval specs/prices, Max EOD trailing, 50% consistency, $0 activation fee, payout rules, news restrictions captured. Still verify live checkout discounts/coupons. |
| 3 | TakeProfitTrader | https://takeprofittrader.com/ | Official homepage/help rules checked in user's Chrome; remaining account cards/checkout still verify | 2026-05-31 | Homepage pricing, visible 50K specs, consistency, PRO withdrawal/buffer, PRO rules, resets, NOFEE30 promo captured. Still verify all account cards and live checkout. |
| 4 | Tradeify | https://tradeify.co/ | Official homepage/help rules checked in user's Chrome; live promo/checkout still verify | 2026-05-31 | Growth, Select, Lightning pricing snapshot; eval rules; EOD drawdown; DLL; Select payout policies; Growth payout policy; Lightning rules captured. |
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


## TakeProfitTrader official verification notes — checked 2026-05-31

Official pages captured under `research/takeprofittrader-official/` using the user's Chrome browser:

- Homepage/pricing: https://takeprofittrader.com/
- Consistency rule: https://takeprofittraderhelp.zendesk.com/hc/en-us/articles/15170316538013-Rule-5-Be-Consistent
- PRO profit split/withdrawals: https://takeprofittraderhelp.zendesk.com/hc/en-us/articles/15172219527581-PRO-Account-Profit-Split-Withdrawal-Rules
- PRO account rules: https://takeprofittraderhelp.zendesk.com/hc/en-us/articles/15171769361053-PRO-Account-Rules
- Test reset pricing: https://takeprofittraderhelp.zendesk.com/hc/en-us/articles/15140989806493-Resetting-Your-Test-Account
- NOFEE30 promo FAQ: https://takeprofittraderhelp.zendesk.com/hc/en-us/articles/36337706971677-NOFEE30-PROMO-FAQ

Key official values captured:

- Homepage prices shown: 25K $150/mo, 50K $170/mo, 75K $245/mo, 100K $330/mo, 150K $360/mo.
- Visible 50K card: profit target $3,000; max position 6 contracts / 60 micros; Daily Loss Limit $1,100 marked Removed; EOD trailing drawdown $2,000.
- Homepage journey table: Test is SIM, PRO is SIM, PRO+ is LIVE; PRO split 80/20, PRO+ split 90/10; PRO has buffer requirement, PRO+ no buffer; Test and PRO+ drawdown EOD, PRO drawdown intraday; PRO accounts max 5; max withdrawal no max.
- Consistency/min days: 5 trading days minimum; no single trading day may exceed 50% of total net profits; if above 50%, account not failed, trader needs more profit.
- PRO withdrawals: 80/20 split; can withdraw day one after reaching buffer; buffer equals max drawdown. Buffer zones: 25K $26,500, 50K $52,000, 75K $77,500, 100K $103,000, 150K $154,500.
- Inside-buffer withdrawal after termination: 50% if ≤60 trading days, 80% if >60 trading days.
- PRO rules: no bots/algos; avoid limit up/down; at least one trading day per calendar week; no counter positions; PRO intraday trailing based on peak balance including unrealized gains; flat/no orders around prohibited news one minute before/during/after.
- Reset prices: 25K $79, 50K $99, 75K $139, 100K $169, 150K $199.
- NOFEE30 promo FAQ: 30% lifetime discount and $130 PRO activation fee waived for life on active account created with code; no additional fees to get funded during promo; monthly subscription stops after PRO. Verify live checkout/promo before publishing.
- Caveat: only 50K account card specs were visible in the captured homepage view; verify remaining account cards and checkout before final affiliate traffic.


## Tradeify official verification notes — checked 2026-05-31

Official pages captured under `research/tradeify-official/` using the user's Chrome browser:

- Homepage/pricing: https://tradeify.co/
- Select evaluation accounts: https://help.tradeify.co/en/articles/12853921-select-evaluation-accounts
- Growth evaluation accounts: https://help.tradeify.co/en/articles/10495915-growth-evaluation-accounts
- Trailing max drawdowns: https://help.tradeify.co/en/articles/10495897-rules-trailing-max-drawdowns
- Daily loss limit: https://help.tradeify.co/en/articles/10468321-rules-daily-loss-limit
- Select Flex/Daily payout policies: https://help.tradeify.co/en/articles/12853966-select-flex-and-select-daily-payout-policies
- Growth funded payout policy: https://help.tradeify.co/en/articles/11083796-growth-funded-account-payout-policy
- Lightning funded accounts: https://help.tradeify.co/en/articles/10495938-lightning-funded-accounts

Key official values captured:

- Homepage promo captured: 40% off all accounts with code MAY ending 2026-05-31; verify live checkout before publishing coupons or permanent pricing.
- Promo prices shown: Growth 25K $59, 50K $87, 100K $153, 150K $221; Select 25K $65, 50K $99, 100K $159, 150K $221; Lightning 25K $207, 50K $295, 100K $396, 150K $478.
- Select evaluation: targets $1,500/$3,000/$6,000/$9,000; EOD max drawdown $1,000/$2,000/$3,000/$4,500; no Daily Loss Limit during evaluation; 40% consistency; max contracts 1/4/8/12 minis; minimum 3 trading days due to consistency; no activation fee.
- Growth evaluation: targets $1,500/$3,000/$6,000/$9,000; DLL $600/$1,250/$2,500/$3,750; EOD max drawdown $1,000/$2,000/$3,500/$5,000; max contracts 1/4/8/12 minis; no evaluation consistency; can pass in 1 trading day; no activation fee.
- EOD drawdown: all Growth, Select, and Lightning accounts use End-of-Day trailing drawdown; it updates at EOD but is enforced in real time. On simulated funded accounts, it locks at starting balance + $100 once profit exceeds drawdown amount by $100.
- DLL: soft breach that pauses trading until next session. Applies to Growth, Lightning, and Select Daily funded accounts; Select Flex has no DLL. Initial DLLs captured: Growth/Lightning $600/$1,250/$2,500/$3,000 for 25K/50K/100K/150K, with 25K Lightning note showing no DLL protection; Select Daily $500/$1,000/$1,250/$1,750.
- Growth funded payout: 90% trader split; 35% consistency; 5+ profitable trading days with minimum day profit $100/$150/$200/$250; min payout $250/$500/$1,000/$1,500; account balance thresholds $26,500/$53,000/$104,500/$156,500.
- Select Flex: 90/10 split; every 5 winning days; no DLL; no funded consistency; payout up to 50% of total profits capped at $1,250/$3,000/$4,000/$5,000; no minimum balance requirement.
- Select Daily: 90/10 split; daily eligibility; buffers $1,100/$2,100/$2,600/$3,600; payout caps $600/$1,000/$1,500/$2,500; $250 minimum payout; positive cycle profit required.
- Lightning: no evaluation; current drawdown $1,000/$2,000/$4,000/$5,250; max contracts 1/4/8/12 minis; homepage says 20% consistency and tooltip says 25% for payout 2 and 30% for payout 3+.
- Caveat: pricing was captured during a limited-time promo and should be rechecked in live checkout before paid traffic.
