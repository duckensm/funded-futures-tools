// Single source of truth for every firm shown on Futures Prop Edge.
//
// Schema per firm:
//   slug              URL slug used by /review/<slug>/ and /discount/<slug>/
//   legacyId          old SPA firm id, kept so existing /firms/<id>/ URLs keep working
//   name              display name
//   affiliate         true = partner (CTA + code allowed); false = comparison foil only,
//                     never rendered with a referral CTA
//   code              discount/referral code shown to visitors ('' when none)
//   affiliateUrl      partner link ('' for non-affiliate firms)
//   officialUrl       official site / rules page (fallback link target)
//   lane              one-line positioning that drives copy on hub/review/quiz pages
//   badge             short "Best for X" label used on cards and the hub page
//   drawdownType      'static' | 'eod_trailing' | 'intraday_trailing' (dominant model)
//   drawdownNote      nuance when a firm offers more than one drawdown model
//   pros / cons       bullet lists for review pages
//   offer/offerDetail headline promo shown on offer plaques (partners only)
//   pricingNote       price guidance (never a guaranteed checkout price)
//   platforms         trading platforms (TODO_VERIFY until checked on the firm's site)
//   payoutNote        payout rules summary
//   lastVerified      date the rules were last checked against official sources
//   verification      'official' | 'research-snapshot' | 'unverified'
//   category/best/target/daily/risk/fit  legacy display fields used by the
//                     comparison table, finder, and firm guide pages
//
// Anything marked TODO_VERIFY must be confirmed against the firm's official
// site before it is presented as fact. Do not invent prices, drawdown amounts,
// or profit splits here.

const FIRMS = [
  {
    slug: 'legends-trading',
    legacyId: 'legendstrading',
    name: 'The Legends Trading',
    affiliate: true,
    code: 'DUTRADING',
    affiliateUrl: 'https://thelegendstrading.com/?ref=dutrading',
    officialUrl: 'https://thelegendstrading.com/',
    lane: 'Our Best Overall pick for NQ/MNQ traders in 2026: EOD trailing drawdown on its evaluations, a 90/10 split, and an instant-funding route for traders who are done taking evaluations.',
    badge: 'Best Overall for NQ/MNQ',
    drawdownType: 'eod_trailing',
    drawdownNote: 'EOD trailing on Apprentice and Elite; Straight to Master lists a trailing max loss (TODO_VERIFY whether intraday or EOD).',
    pros: [
      'EOD trailing drawdown on Apprentice and Elite evaluations, so intraday unrealized spikes do not move the liquidation threshold',
      '90/10 profit split',
      'Straight to Master instant funding: skip the evaluation and start on a funded account',
      'Elite evaluation lists no daily loss limit, so one red morning does not end the account',
      '45% off every account with code DUTRADING (confirm the final price at checkout)',
      'Choice between monthly Apprentice pricing and one-time Elite pricing',
    ],
    cons: [
      'Payouts run up to twice monthly, with trading-day and balance requirements to meet first',
      'Straight to Master accounts cost more upfront than evaluations',
      'Rules differ by plan, so read the plan you actually buy',
    ],
    offer: '45% off',
    offerDetail: 'Every account with code DUTRADING',
    pricingNote: 'Current site offer: 45% off every account with affiliate code DUTRADING (checked 2026-10-04); confirm the final price at checkout',
    platforms: ['TODO_VERIFY'],
    payoutNote: '90/10 split; official payout policy lists up to twice monthly with trading-day and balance requirements',
    lastVerified: '2026-07-09',
    verification: 'official',
    category: 'Recommended: Best Overall 2026 and best instant funding',
    best: 'The Legends Trading plans and payout rules summarized from official sources',
    target: 'Apprentice $1.5k/$3k/$6k/$9k; Elite $1.5k/$2.7k/$6k/$9k; Straight to Master varies by size',
    daily: 'Elite evaluation lists no daily loss limit; funded and other plan rules vary',
    risk: 'Medium',
    fit: 'Our 2026 Best Overall: EOD trailing evaluations that leave room for NQ volatility, a 90/10 split, no daily loss limit on Elite, and Straight to Master instant funding when you want to skip the evaluation.',
  },
  {
    slug: 'phidias',
    legacyId: 'phidias',
    name: 'Phidias Propfirm',
    affiliate: true,
    code: 'DUTRADING',
    affiliateUrl: 'https://member.phidiaspropfirm.com/aff/go/duckensm',
    officialUrl: 'https://phidiaspropfirm.com/',
    lane: 'Best path to real LIVE capital (not simulated): fast payout approvals and room to scale across many accounts.',
    badge: 'Best Path to Live Capital',
    drawdownType: 'eod_trailing',
    drawdownNote: 'Express to Live accounts use static drawdown; Fundamental/Premium use EOD trailing. No intraday trailing on any account type.',
    pros: [
      'Express to Live path converts to LIVE capital at the first payout instead of staying simulated',
      'Static drawdown on Express to Live accounts: no trailing threshold to manage',
      'No minimum trading days and no consistency rule on the Express to Live evaluation',
      'Premium accounts allow overnight and weekend holds with a progressive profit split (75% scaling to 100%)',
      'Fast payout approvals and daily uncapped LIVE payouts once live (TODO_VERIFY current approval times)',
      'Scales to multiple accounts (TODO_VERIFY current maximum accounts per trader)',
    ],
    cons: [
      'Fundamental/Premium funded accounts enforce an EOD floor and a 30% consistency rule',
      'Rules differ significantly between account types, so the wrong pick is easy',
      'Promo pricing changes often; final checkout price must be confirmed',
    ],
    offer: 'Up to 80% off',
    offerDetail: 'One-time payment accounts',
    pricingNote: 'Up to 80% off one-time payment accounts; use the tracked link and try code DUTRADING',
    platforms: ['TODO_VERIFY'],
    payoutNote: 'E2L first payout converts to LIVE path; Fundamental 80%; Premium 75→100%; daily uncapped LIVE payouts',
    lastVerified: '2026-07-09',
    verification: 'official',
    category: 'Recommended — best path to live capital',
    best: 'Phidias 2.0 account types and rules summarized from official sources',
    target: 'E2L $1.5k/$2.5k/$3.5k/$4.5k; Fundamental/Premium $4k/$6k/$9k',
    daily: 'No daily loss limit listed; Fundamental/Premium enforce EOD floor and funded 30% consistency',
    risk: 'Medium',
    fit: 'Best for traders who want a route to real live capital instead of staying simulated: Express to Live static drawdown with no minimum days, plus swing-capable Premium accounts.',
  },
  {
    slug: 'alpha-futures',
    legacyId: 'alphafutures',
    name: 'Alpha Futures',
    affiliate: true,
    code: 'Duckens026406',
    affiliateUrl: 'https://app.alpha-futures.com/signup/Duckens026406/',
    officialUrl: 'https://www.alpha-futures.com/',
    lane: 'Best analytics and tools for serious traders who want data on their own performance, not just an account.',
    badge: 'Best Analytics & Tools',
    drawdownType: 'eod_trailing',
    drawdownNote: 'Maximum Loss Limit / EOD-style drawdown language; rules vary by account type and size (TODO_VERIFY per account type).',
    pros: [
      'Strong trader analytics and tooling for reviewing your own performance (TODO_VERIFY current dashboard feature list)',
      'One-step evaluations: no multi-phase challenge',
      'Payout requests open after 5 winning days of at least $200 each',
      'Multiple account types (Zero/Standard) trade off subscription cost against rules flexibility',
    ],
    cons: [
      'Payout requests go through manual review',
      'Daily Loss Guard and drawdown rules vary by account type and size, so rule-reading is required',
      'Monthly subscription pricing adds up during long evaluations',
    ],
    offer: '25% off',
    offerDetail: 'Premium plans',
    pricingNote: 'Current site offer: 25% off Premium plans; use affiliate code Duckens026406',
    platforms: ['TODO_VERIFY'],
    payoutNote: 'Performance fee requests after 5 winning days; winning day at least $200; manual review',
    lastVerified: '2026-07-09',
    verification: 'official',
    category: 'Recommended — best analytics & tools',
    best: 'Alpha Futures account types and rules summarized from official sources',
    target: 'One-step evaluations up to $750K simulated funds; 50K examples show $3,000 targets',
    daily: 'Daily Loss Guard varies by account type and size; some account types list none',
    risk: 'Medium',
    fit: 'Best for serious traders who want premium analytics and tooling around a one-step futures evaluation, with account-type flexibility worth reading before checkout.',
  },
  {
    slug: 'daytraders',
    legacyId: 'daytraders',
    name: 'DayTraders',
    affiliate: true,
    code: 'DUTRADING',
    affiliateUrl: 'https://daytraders.com/go/dutrading?c=TNTIQNUL',
    officialUrl: 'https://daytraders.com/',
    lane: 'Best budget entry: cheap one-time-price evaluations with a static drawdown option.',
    badge: 'Best Budget Entry',
    drawdownType: 'static',
    drawdownNote: 'Static drawdown products from $150 are the budget lane; Trailing, EOD, S2F, and S2L models are also offered, so behavior depends on the product you pick.',
    pros: [
      'Cheapest entry on this list: static-drawdown evaluations listed from $150 with one-time pricing instead of monthly subscriptions',
      'Static drawdown option means the liquidation level never moves up behind you',
      'Standard evaluations list only 2 qualifying days',
      'Pro/S2F pages advertise a 100% profit split (TODO_VERIFY current split and conditions)',
      'Separate S2F (straight to funded) and S2L (straight to live) paths if you outgrow evaluations',
    ],
    cons: [
      'Five different product models (Trailing, EOD, Static, S2F, S2L) make rule-reading mandatory',
      'S2L live path uses an 80/20 split',
      'Daily Loss Limit behavior differs per program',
    ],
    offer: 'Auto-applied offer',
    offerDetail: 'Tracked link applies available promotion',
    pricingNote: 'Available promotion is applied by the tracked link; use affiliate code DUTRADING',
    platforms: ['TODO_VERIFY'],
    payoutNote: 'Pro/S2F pages advertise 100% split; S2L live path uses 80/20 split; verify current payout requirements',
    lastVerified: '2026-07-09',
    verification: 'official',
    category: 'Recommended — best budget entry',
    best: 'DayTraders account types and drawdown models summarized from official sources',
    target: 'Standard evaluations list 2 qualifying days; S2F/S2L have separate payout and live-account requirements',
    daily: 'Daily Loss Limits vary by program; EOD uses DLL as intraday cushion',
    risk: 'Medium',
    fit: 'Best budget entry: one-time pricing with static-drawdown evaluations from $150, plus S2F and S2L paths once the cheap eval has done its job.',
  },
  {
    slug: 'bulenox',
    legacyId: 'bulenox',
    name: 'Bulenox',
    affiliate: true,
    code: 'dutrading',
    affiliateUrl: 'https://bulenox.com/member/aff/go/dutrading',
    officialUrl: 'https://bulenox.com/',
    lane: 'Best for stacking multiple accounts cheaply: frequent deep discounts and 100% of the first $10K in payouts.',
    badge: 'Best for Stacking Accounts',
    drawdownType: 'intraday_trailing',
    drawdownNote: 'Option 1 accounts use intraday trailing with no scaling; Option 2 accounts use EOD drawdown with scaling plus a daily loss limit.',
    pros: [
      'Frequent deep discounts make multiple accounts cheap to stack (TODO_VERIFY current max accounts per trader)',
      'You keep 100% of the first $10K in payouts, then 90%',
      'Option 2 accounts offer EOD drawdown for traders who avoid intraday trailing',
      'Weekly Master payouts once eligible',
    ],
    cons: [
      'Option 1 accounts use intraday trailing drawdown — the model that catches normal NQ trades most often',
      '40% consistency rule on Master payouts',
      'Master payouts start only after 10 trading days',
      'Master activation fees apply (TODO_VERIFY current amounts per account size)',
    ],
    offer: 'Current code offer',
    offerDetail: 'Option 1 and Option 2 pricing',
    pricingNote: 'Current signup pricing varies by size and option; use the tracked link and try code dutrading',
    platforms: ['TODO_VERIFY'],
    payoutNote: 'First $10k 100%; then 90%; Master payouts weekly after 10 trading days; 40% consistency',
    lastVerified: '2026-07-09',
    verification: 'official',
    category: 'Recommended — best for stacking accounts',
    best: 'Homepage and help-center rules summarized from official sources',
    target: '$1k / $1.5k / $3k / $6k / $9k / $15k',
    daily: 'EOD option DLL: $400/$500/$1.1k/$2.2k/$3.3k/$4.5k',
    risk: 'High',
    fit: 'Best for deal seekers who stack several discounted accounts and are willing to read the two drawdown options, activation fees, and Master payout rules carefully.',
  },
  {
    slug: 'earn2trade',
    legacyId: 'earn2trade',
    name: 'Earn2Trade',
    affiliate: true,
    code: 'dutrading',
    affiliateUrl: 'https://www.earn2trade.com/trader-career-path?a_pid=dutrading&a_bid=8d7b4b9e',
    officialUrl: 'https://www.earn2trade.com/',
    lane: 'Best for complete beginners: education included and the longest-established firm on this list.',
    badge: 'Best for Beginners',
    drawdownType: 'eod_trailing',
    drawdownNote: 'Evaluation/LiveSim accounts use EOD drawdown; the live account uses trailing drawdown.',
    pros: [
      'Education is part of the product, not an upsell — built for traders still learning (TODO_VERIFY current course contents)',
      'Longest-established firm on this list with a structured, predictable progression',
      'Weekly withdrawals from $100+ once funded',
      'Trader Career Path can scale toward a $400K path',
      'Real live-account optionality instead of staying simulated forever',
    ],
    cons: [
      '80% profit split is lower than most firms on this list',
      'Monthly subscription pricing while you stay in the evaluation',
      '$139 activation fee, deducted from the first successful withdrawal',
      '10-day minimum evaluation: no fast passes',
    ],
    offer: 'Current code offer',
    offerDetail: 'Trader Career Path',
    pricingNote: 'Current Trader Career Path pricing varies by account; use the tracked link and try code dutrading',
    platforms: ['TODO_VERIFY'],
    payoutNote: '80% profit split; weekly withdrawals from $100+; $139 activation deducted from first successful withdrawal',
    lastVerified: '2026-07-09',
    verification: 'official',
    category: 'Recommended — best for beginners',
    best: 'Purchase and product-page rules summarized from official sources',
    target: 'TCP $1.75k/$3k/$6k; Gauntlet $3k/$6k/$9k/$11k',
    daily: '$550/$1.1k/$2.2k/$3.3k/$4.4k depending size',
    risk: 'Medium',
    fit: 'Best for complete beginners: education included, a fixed 10-day structure that discourages overleveraging, and the longest track record on this list.',
  },
  // --- Comparison foils: never rendered with a referral CTA ----------------
  {
    slug: 'lucid-trading',
    legacyId: 'lucidtraderfunding',
    name: 'Lucid Trading',
    affiliate: false,
    code: '',
    affiliateUrl: '',
    officialUrl: 'https://lucidtrading.com/',
    lane: 'Benchmark firm included for rule comparison only. Futures Prop Edge is not a Lucid Trading affiliate.',
    badge: 'Comparison Benchmark',
    drawdownType: 'eod_trailing',
    drawdownNote: 'Official pages describe EOD drawdown across Pro, Flex, and Direct account types.',
    pros: [
      'Official pages describe EOD trailing drawdown across account types',
      'LucidDirect option for traders who want straight funded access',
    ],
    cons: [
      'Newer firm with a shorter public track record than legacy competitors',
      'Direct (straight-funded) accounts cost meaningfully more upfront than evaluations',
    ],
    pricingNote: 'Retail prices and discounts change at checkout',
    platforms: ['NinjaTrader (TODO_VERIFY)', 'TODO_VERIFY other platforms'],
    payoutNote: '90/10 split; no payout windows; Pro 3 days funded payout; Direct 5 days; path to LucidLive',
    lastVerified: '2026-07-09',
    verification: 'official',
    category: 'Comparison benchmark (not an affiliate)',
    best: 'LucidTrading.com account rules summarized from official sources',
    target: 'Pro/Flex $1.25k / $3k / $6k / $9k; Direct straight funded',
    daily: 'Pro DLL none/$1.2k/$1.8k/$2.7k; Flex none; Direct DLL scales above initial trail',
    risk: 'Medium-High',
    fit: 'Included as a benchmark because many NQ traders compare against it. Futures Prop Edge is not a Lucid Trading affiliate; verify every rule on the official site before buying.',
  },
  {
    slug: 'apex',
    legacyId: 'apex',
    name: 'Apex Trader Funding',
    affiliate: false,
    code: '',
    affiliateUrl: '',
    officialUrl: 'https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/',
    lane: 'Heavily searched benchmark firm; included for rule comparison only — Futures Prop Edge is not an Apex affiliate.',
    badge: 'Comparison Benchmark',
    drawdownType: 'eod_trailing',
    drawdownNote: 'Offers both EOD trailing and intraday trailing account families; the intraday trailing model is a common pain point for NQ traders.',
    pros: [
      'Officially documented EOD drawdown account family',
      'Large, well-known firm that many NQ traders already compare against',
    ],
    cons: [
      'Intraday trailing accounts follow unrealized profit in real time — a frequent NQ account-killer',
      'Payout structure includes qualifying days, a 50% consistency rule, and a max of 6 payouts (per official help pages)',
    ],
    pricingNote: 'Retail prices and discounts change at checkout',
    platforms: ['TODO_VERIFY'],
    payoutNote: '100% split; 5 qualifying days; 50% consistency; max 6 payouts',
    lastVerified: '2026-05-31',
    verification: 'official',
    category: 'Comparison benchmark (not an affiliate)',
    best: 'EOD rule page reviewed from official Apex sources',
    target: '$1.5k / $3k / $6k / $9k',
    daily: 'EOD DLL: $500 / $1k / $1.5k / $2k',
    risk: 'Medium',
    fit: 'Included as an official-source benchmark because many NQ traders compare against it. Verify EOD versus intraday trailing rules on the official site before purchasing.',
  },
  {
    slug: 'topstep',
    legacyId: 'topstep',
    name: 'Topstep',
    affiliate: false,
    code: '',
    affiliateUrl: '',
    officialUrl: 'https://www.topstep.com/',
    lane: 'Long-established benchmark firm; included for rule comparison only — Futures Prop Edge is not a Topstep affiliate.',
    badge: 'Comparison Benchmark',
    drawdownType: 'eod_trailing',
    drawdownNote: 'TODO_VERIFY current Trading Combine drawdown model and funded-account rules on topstep.com.',
    pros: [
      'One of the longest-established futures funding firms (TODO_VERIFY current program details)',
    ],
    cons: [
      'TODO_VERIFY current payout policy, consistency rules, and fees before citing specifics',
    ],
    pricingNote: 'TODO_VERIFY current Trading Combine pricing on topstep.com',
    platforms: ['TODO_VERIFY'],
    payoutNote: 'TODO_VERIFY current payout policy',
    lastVerified: 'TODO_VERIFY',
    verification: 'unverified',
    category: 'Comparison benchmark (not an affiliate)',
    best: 'Official-source review pending; rule details must be verified on topstep.com',
    target: 'TODO_VERIFY',
    daily: 'TODO_VERIFY',
    risk: 'Medium',
    fit: 'Included as a benchmark because many traders start their search with Topstep. Verify every rule on the official site; this page intentionally avoids unverified specifics.',
  },
];

// Legacy aliases used by the existing comparison table, finder, and firm
// guide renderers. New code should prefer the canonical field names.
// Unverified claims never reach visitors: list items marked TODO_VERIFY are
// dropped, and marked clauses are cut out of text fields.
const UNVERIFIED = /TODO_VERIFY/;
export function stripUnverified(text) {
  return String(text)
    .split(/(?<=[.;])\s+/)
    .filter((part) => !UNVERIFIED.test(part))
    .join(' ')
    .trim()
    .replace(/;$/, '.');
}
const TEXT_FIELDS = ['lane', 'drawdownNote', 'pricingNote', 'payoutNote', 'category', 'best', 'target', 'daily', 'fit'];
const LIST_FIELDS = ['pros', 'cons', 'platforms'];

export const firms = FIRMS.map((raw) => {
  const f = { ...raw };
  for (const k of TEXT_FIELDS) f[k] = stripUnverified(raw[k]) || 'Not yet verified';
  for (const k of LIST_FIELDS) f[k] = raw[k].filter((t) => !UNVERIFIED.test(t));
  return {
    ...f,
    id: f.legacyId,
    couponCode: f.code,
    price: f.pricingNote,
    drawdown: f.drawdownNote,
    payout: f.payoutNote,
  };
});

export const affiliateFirms = firms.filter((f) => f.affiliate);
export const comparisonFirms = firms.filter((f) => !f.affiliate);

export function firmBySlug(slug) {
  return firms.find((f) => f.slug === slug);
}
