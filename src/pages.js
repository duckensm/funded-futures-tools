// Data-driven page templates: hub, review, discount/coupon, and alternatives
// pages. Every firm fact on these pages comes from src/data/firms.js.
import { affiliateFirms, firmBySlug } from './data/firms.js';

// Month/year stamped at build time (prerender runs this in Node during `npm run build`).
export const MONTH_YEAR = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
export const YEAR = String(new Date().getFullYear());

// Internal TODO_VERIFY markers must never reach visitors. Published copy gets
// a neutral "verify on the official site" phrasing instead.
export function publicCopy(text) {
  return String(text)
    .replace(/\s*\(TODO_VERIFY[^)]*\)/g, ' (verify current terms on the official site)')
    .replace(/TODO_VERIFY[^.;]*/g, 'verify current terms on the official site');
}

const DRAWDOWN_LABELS = {
  static: 'Static drawdown',
  eod_trailing: 'EOD trailing drawdown',
  intraday_trailing: 'Intraday trailing drawdown',
};

const DRAWDOWN_EXPLAINERS = {
  static: 'The liquidation threshold is fixed below your starting balance and never moves up behind you. A planned losing streak cannot be made worse by earlier winners.',
  eod_trailing: 'The liquidation threshold trails your highest end-of-day closing balance. Intraday unrealized spikes do not move it, which makes normal NQ/MNQ stop-outs much easier to plan around than intraday trailing.',
  intraday_trailing: 'The liquidation threshold follows your highest intraday unrealized profit in real time. A trade that spikes in your favor and reverses can raise the threshold against you — the model that catches NQ traders most often.',
};

export function drawdownLabel(type) { return DRAWDOWN_LABELS[type] || type; }

function disclosureLine() {
  return '<p class="page-disclosure">Affiliate disclosure: Futures Prop Edge may earn a commission if you buy through links or codes on this page, at no extra cost to you. Rules and prices change — always confirm the final terms at checkout. <a href="/disclosure/">Full disclosure</a>.</p>';
}

function affiliateCta(f, source, label = 'Check current offer') {
  return `<a class="btn affiliate outbound" href="${f.affiliateUrl}" target="_blank" rel="sponsored noopener" data-outbound-firm="${f.id}" data-outbound-source="${source}">${label} →</a>`;
}

function codeChip(f) {
  if (!f.code) return '';
  return `<button class="code-chip" type="button" data-copy-code="${f.code}" data-copy-firm="${f.id}" aria-label="Copy code ${f.code}">Code: <b>${f.code}</b> ⧉</button>`;
}

function reviewLinks(f) {
  return `<div class="firm-page-links"><a href="/review/${f.slug}/">Full ${f.name} review</a><a href="/discount/${f.slug}/">${f.name} discount code</a></div>`;
}

// ---------------------------------------------------------------------------
// Hub: /best-futures-prop-firms/
// ---------------------------------------------------------------------------
export function renderHub() {
  const lucid = firmBySlug('lucid-trading');
  const rest = affiliateFirms.filter((f) => f.slug !== 'lucid-trading');

  const firmCard = (f, rank) => `
    <article class="hub-card" id="${f.slug}">
      <div class="hub-card-head">
        <span class="hub-rank">#${rank}</span>
        <div>
          <span class="pill green">${f.badge}</span>
          <h3>${f.name}</h3>
          <p>${publicCopy(f.lane)}</p>
        </div>
      </div>
      <ul class="hub-points">${f.pros.slice(0, 3).map((p) => `<li>${publicCopy(p)}</li>`).join('')}</ul>
      <div class="hub-card-meta"><span class="pill">${drawdownLabel(f.drawdownType)}</span><span class="pill amber">Last reviewed ${f.lastVerified === 'TODO_VERIFY' ? 'pending' : f.lastVerified}</span></div>
      <div class="hub-card-cta">${codeChip(f)}${affiliateCta(f, 'hub-card')}</div>
      ${reviewLinks(f)}
    </article>`;

  const tableRows = affiliateFirms.map((f) => `
    <tr>
      <td><strong>${f.name}</strong><br><span class="muted-small">${f.badge}</span></td>
      <td>${drawdownLabel(f.drawdownType)}</td>
      <td>${publicCopy(f.payoutNote)}</td>
      <td>${f.code ? `<b class="code-inline">${f.code}</b>` : '—'}</td>
      <td>${affiliateCta(f, 'hub-table', 'Open offer')}</td>
    </tr>`).join('');

  return `
  <article class="article wrap">
    <nav class="crumbs"><a href="/">Home</a> › Best futures prop firms</nav>
    <h1>Best Futures Prop Firms ${YEAR}</h1>
    <p class="lead">The ${affiliateFirms.length} funded futures programs we recommend for NQ/MNQ traders — ranked by rule fit, not by headline discount. Updated ${MONTH_YEAR}.</p>
    ${disclosureLine()}

    <div class="article-card hub-top-pick">
      <span class="pill green">#1 overall</span><span class="pill">${lucid.badge}</span>
      <h2>${lucid.name}</h2>
      <p>${publicCopy(lucid.lane)}</p>
      <ul class="hub-points">${lucid.pros.slice(0, 4).map((p) => `<li>${publicCopy(p)}</li>`).join('')}</ul>
      <div class="hub-card-cta">${codeChip(lucid)}${affiliateCta(lucid, 'hub-top-pick')}</div>
      ${reviewLinks(lucid)}
    </div>

    <div class="article-card"><h2>Not sure which one fits you?</h2><p>Answer five questions and get matched to the right firm for your budget, drawdown preference, and goals.</p><div class="hub-card-cta"><a class="btn primary" href="/quiz/">Take the 60-second quiz</a><a class="btn" href="/calculators/">Run the risk calculator</a></div></div>

    <h2 class="hub-section-title">The rest of the field, by what they're best at</h2>
    <div class="hub-grid">${rest.map((f, i) => firmCard(f, i + 2)).join('')}</div>

    <div class="article-card">
      <h2>Quick comparison</h2>
      <div class="table-wrap"><table><thead><tr><th>Firm</th><th>Drawdown type</th><th>Payout notes</th><th>Code</th><th></th></tr></thead><tbody>${tableRows}</tbody></table></div>
      <p class="disclaimer">Payout and drawdown notes summarize official-source reviews on their listed review dates. Always confirm current rules and the final checkout price on the firm's site.</p>
    </div>

    <div class="article-card">
      <h2>Where are Apex and Topstep?</h2>
      <p>Both are well-known firms and we keep their rules in our comparisons, but neither is part of our recommended list. If you're coming from either one, start here:</p>
      <div class="firm-page-links"><a href="/apex-alternatives/">Best Apex alternatives</a><a href="/topstep-alternatives/">Best Topstep alternatives</a></div>
    </div>
  </article>`;
}

// ---------------------------------------------------------------------------
// Review pages: /review/<slug>/
// ---------------------------------------------------------------------------
export function renderReview(f) {
  const verdictCta = f.affiliate
    ? `<div class="verdict-box" id="verdict">
        <span class="pill green">${f.badge}</span>
        <h2>Verdict: ${f.name}</h2>
        <p>${publicCopy(f.fit)}</p>
        ${f.code ? `<div class="code-box"><small>Use code</small><button class="code-value" type="button" data-copy-code="${f.code}" data-copy-firm="${f.id}" aria-label="Copy code ${f.code}">${f.code}</button><small>tap / click to copy</small></div>` : ''}
        <div class="hub-card-cta">${affiliateCta(f, 'review-verdict', `Open the current ${f.name} offer`)}</div>
        <p class="disclaimer">Affiliate link — confirm the final checkout price and current rules before buying. <a href="/discount/${f.slug}/">More on the ${f.name} code →</a></p>
      </div>`
    : `<div class="verdict-box" id="verdict"><h2>Verdict: ${f.name}</h2><p>${publicCopy(f.fit)}</p><p class="disclaimer">Futures Prop Edge is not a ${f.name} affiliate; this page exists for rule comparison. Use the <a href="${f.officialUrl}" target="_blank" rel="noopener">official site</a> for current terms.</p></div>`;

  return `
  <article class="article wrap">
    <nav class="crumbs"><a href="/">Home</a> › <a href="/best-futures-prop-firms/">Best firms</a> › ${f.name} review</nav>
    <h1>${f.name} Review ${YEAR}: ${f.badge}</h1>
    <p class="lead">${publicCopy(f.lane)}</p>
    ${disclosureLine()}

    <div class="article-card">
      <h2>Rules at a glance</h2>
      <div class="table-wrap"><table><tbody>
        <tr><td><strong>Drawdown type</strong></td><td>${drawdownLabel(f.drawdownType)}</td></tr>
        <tr><td><strong>Drawdown details</strong></td><td>${publicCopy(f.drawdownNote)}</td></tr>
        <tr><td><strong>Pricing</strong></td><td>${publicCopy(f.pricingNote)}</td></tr>
        <tr><td><strong>Targets / accounts</strong></td><td>${publicCopy(f.target)}</td></tr>
        <tr><td><strong>Daily loss rules</strong></td><td>${publicCopy(f.daily)}</td></tr>
        <tr><td><strong>Payouts</strong></td><td>${publicCopy(f.payoutNote)}</td></tr>
        <tr><td><strong>Platforms</strong></td><td>${publicCopy(f.platforms.join(', '))}</td></tr>
        <tr><td><strong>Last reviewed</strong></td><td>${f.lastVerified === 'TODO_VERIFY' ? 'Official-source review pending' : `${f.lastVerified} against <a href="${f.officialUrl}" target="_blank" rel="noopener">official sources</a>`}</td></tr>
      </tbody></table></div>
    </div>

    <div class="article-card">
      <h2>How the drawdown actually behaves</h2>
      <p><b>${drawdownLabel(f.drawdownType)}:</b> ${DRAWDOWN_EXPLAINERS[f.drawdownType] || ''}</p>
      <p>${publicCopy(f.drawdownNote)}</p>
      <p><a class="btn small" href="/calculators/">See how many losing trades this account survives →</a></p>
    </div>

    <div class="article-card pros-cons">
      <div><h2>What we like</h2><ul>${f.pros.map((p) => `<li>${publicCopy(p)}</li>`).join('')}</ul></div>
      <div><h2>What to watch</h2><ul>${f.cons.map((c) => `<li>${publicCopy(c)}</li>`).join('')}</ul></div>
    </div>

    ${verdictCta}

    <div class="article-card">
      <h2>Keep comparing</h2>
      <div class="firm-page-links"><a href="/best-futures-prop-firms/">All recommended firms</a><a href="/quiz/">Find your match (quiz)</a><a href="/calculators/">Risk calculators</a>${f.affiliate ? `<a href="/discount/${f.slug}/">${f.name} discount code</a>` : ''}</div>
    </div>
  </article>`;
}

// ---------------------------------------------------------------------------
// Coupon pages: /discount/<slug>/
// ---------------------------------------------------------------------------
export function renderDiscount(f) {
  return `
  <article class="article wrap">
    <nav class="crumbs"><a href="/">Home</a> › <a href="/best-futures-prop-firms/">Best firms</a> › ${f.name} discount code</nav>
    <h1>${f.name} Discount Code ${f.code} — ${MONTH_YEAR}</h1>
    ${disclosureLine()}

    <div class="code-box code-box-hero">
      <small>Current ${f.name} code</small>
      <button class="code-value" type="button" data-copy-code="${f.code}" data-copy-firm="${f.id}" aria-label="Copy code ${f.code}">${f.code}</button>
      <small>tap / click to copy</small>
      ${affiliateCta(f, 'discount-hero', `Apply it at ${f.name}`)}
    </div>

    <div class="article-card">
      <h2>What the code gets you right now</h2>
      <p>${publicCopy(f.pricingNote)}.</p>
      <p class="disclaimer">Promotions rotate frequently. The checkout page is the only source of truth for the final price — if the code shows a different discount than you expected, what checkout displays is what applies.</p>
    </div>

    <div class="article-card">
      <h2>How to use it</h2>
      <ol class="steps">
        <li>Open ${f.name} through the button above (it links our partner page).</li>
        <li>Pick your account size and plan.</li>
        <li>Paste <b class="code-inline">${f.code}</b> in the promo/referral field at checkout and confirm the discounted price before paying.</li>
      </ol>
    </div>

    <div class="article-card">
      <h2>Why ${f.name}?</h2>
      <p><span class="pill green">${f.badge}</span></p>
      <p>${publicCopy(f.lane)}</p>
      <ul>${f.pros.slice(0, 3).map((p) => `<li>${publicCopy(p)}</li>`).join('')}</ul>
      <div class="firm-page-links"><a href="/review/${f.slug}/">Read the full ${f.name} review</a><a href="/quiz/">Not sure? Take the quiz</a></div>
    </div>

    <div class="article-card" id="faq">
      <h2>FAQ</h2>
      <details><summary>Is the ${f.code} code still active in ${MONTH_YEAR}?</summary><p>It was active when this page was last built. Codes can be paused or changed by the firm at any time, so always confirm the discount is applied on the checkout screen before paying.</p></details>
      <details><summary>Does the code stack with sale prices?</summary><p>Usually a code applies to the listed price at checkout, but stacking rules are set by ${f.name}. If checkout shows a better sitewide promo, use whichever final price is lower.</p></details>
      <details><summary>Do I pay more by using an affiliate code?</summary><p>No — the price is the same or lower. Futures Prop Edge may earn a commission from the firm, which is how the site stays free.</p></details>
    </div>
  </article>`;
}

// ---------------------------------------------------------------------------
// Alternatives pages: /apex-alternatives/ and /topstep-alternatives/
// ---------------------------------------------------------------------------
function laneCard(slug, why) {
  const f = firmBySlug(slug);
  return `
    <article class="hub-card">
      <div class="hub-card-head"><div>
        <span class="pill green">${f.badge}</span>
        <h3>${f.name}</h3>
        <p>${why}</p>
      </div></div>
      <div class="hub-card-meta"><span class="pill">${drawdownLabel(f.drawdownType)}</span></div>
      <div class="hub-card-cta">${codeChip(f)}${affiliateCta(f, 'alternatives-card')}</div>
      ${reviewLinks(f)}
    </article>`;
}

export function renderApexAlternatives() {
  return `
  <article class="article wrap">
    <nav class="crumbs"><a href="/">Home</a> › Apex alternatives</nav>
    <h1>Best Apex Trader Funding Alternatives for NQ/MNQ Traders (${YEAR})</h1>
    <p class="lead">Apex is one of the most-searched futures prop firms, and its officially documented EOD account family is genuinely useful. Traders usually start looking at alternatives for two mechanical reasons: the intraday trailing drawdown on part of the lineup, and the payout structure.</p>
    ${disclosureLine()}

    <div class="article-card">
      <h2>Why traders look beyond Apex</h2>
      <ul>
        <li><b>Intraday trailing drawdown</b> on Apex's trailing account family follows unrealized profit in real time. A trade that spikes in your favor and reverses raises the liquidation threshold against you — with NQ's velocity, this catches normal trades, not just reckless ones.</li>
        <li><b>Payout structure:</b> Apex's official help pages (reviewed 2026-05-31) list 5 qualifying days, a 50% consistency rule, and a maximum of 6 payouts on the standard path. Verify the current policy on the official site — these rules change.</li>
        <li>None of this makes Apex a bad firm. It means the rule fit matters more than the brand. If either mechanic above has cost you an account, the lanes below are built around avoiding it.</li>
      </ul>
    </div>

    <h2 class="hub-section-title">Pick the alternative by what hurt you at Apex</h2>
    <div class="hub-grid">
      ${laneCard('lucid-trading', 'EOD drawdown on every account type — no intraday trailing anywhere in the lineup — plus payouts without payout windows.')}
      ${laneCard('phidias', 'A route to real live capital instead of staying simulated, with static drawdown on the Express to Live path.')}
      ${laneCard('daytraders', 'Static drawdown evaluations from $150 with one-time pricing — the threshold never moves up behind you.')}
      ${laneCard('bulenox', 'Budget stacking with an EOD drawdown option (Option 2 accounts) and 100% of your first $10K in payouts.')}
    </div>

    <div class="article-card"><h2>Still comparing?</h2><div class="firm-page-links"><a href="/best-futures-prop-firms/">Full ranked list</a><a href="/quiz/">60-second matching quiz</a><a href="/calculators/">Drawdown survival calculator</a><a href="/firms/apex/">Apex rules summary</a></div></div>
  </article>`;
}

export function renderTopstepAlternatives() {
  return `
  <article class="article wrap">
    <nav class="crumbs"><a href="/">Home</a> › Topstep alternatives</nav>
    <h1>Best Topstep Alternatives for NQ/MNQ Traders (${YEAR})</h1>
    <p class="lead">Topstep is the firm most new futures traders hear about first, and its longevity is a real point in its favor. Traders typically compare alternatives when they want different payout mechanics, drawdown handling, or pricing — or after one of Topstep's periodic program changes.</p>
    ${disclosureLine()}

    <div class="article-card">
      <h2>Why traders compare alternatives</h2>
      <ul>
        <li><b>Program changes:</b> Topstep has adjusted its rules, pricing, and partner programs multiple times over the years. Whatever you read about it — including this page — verify against <a href="https://www.topstep.com/" target="_blank" rel="noopener">topstep.com</a> before deciding.</li>
        <li><b>Rule fit:</b> drawdown handling, consistency requirements, and payout cadence differ meaningfully between firms. We avoid quoting Topstep specifics here until our official-source review of its current rules is complete.</li>
        <li>The lanes below are organized by the most common reasons traders tell us they switched.</li>
      </ul>
    </div>

    <h2 class="hub-section-title">Pick the alternative by what you actually want</h2>
    <div class="hub-grid">
      ${laneCard('lucid-trading', 'Our #1 overall for NQ/MNQ: EOD trailing drawdown, fast payouts with no windows, and a strong fit for NinjaTrader/algo traders.')}
      ${laneCard('earn2trade', 'The closest fit for traders who picked Topstep for structure: education included and the longest-established firm on our list.')}
      ${laneCard('phidias', 'A path to real live capital rather than staying simulated, with fast payout approvals.')}
      ${laneCard('daytraders', 'The budget lane: static-drawdown evaluations from $150 with one-time pricing instead of subscriptions.')}
    </div>

    <div class="article-card"><h2>Still comparing?</h2><div class="firm-page-links"><a href="/best-futures-prop-firms/">Full ranked list</a><a href="/quiz/">60-second matching quiz</a><a href="/calculators/">Drawdown survival calculator</a><a href="/firms/topstep/">Topstep rules summary</a></div></div>
  </article>`;
}
