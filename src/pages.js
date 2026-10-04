// Data-driven page templates: hub, review, discount/coupon, and alternatives
// pages. Every firm fact on these pages comes from src/data/firms.js.
import { affiliateFirms, firmBySlug, stripUnverified } from './data/firms.js';

// Month/year stamped at build time (prerender runs this in Node during `npm run build`).
export const MONTH_YEAR = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
export const YEAR = String(new Date().getFullYear());

// Unverified claims never reach visitors (see stripUnverified in firms.js).
export function publicCopy(text) {
  return stripUnverified(text);
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

export function affiliateCta(f, source, label = 'Check current offer') {
  return `<a class="btn affiliate outbound" href="${f.affiliateUrl}" target="_blank" rel="sponsored noopener" data-outbound-firm="${f.id}" data-outbound-source="${source}">${label}</a>`;
}

// ---------------------------------------------------------------------------
// Edge Awards: our own editorial picks, drawn as an engraved seal. Every page
// that shows the seal also carries the affiliate disclosure.
// ---------------------------------------------------------------------------
export const TOP_PICK_SLUG = 'legends-trading';

export function awardSeal(id, line = 'Best Overall') {
  const edge = [];
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const r = i % 2 ? 111 : 118;
    edge.push(`${(120 + r * Math.cos(a)).toFixed(1)},${(120 + r * Math.sin(a)).toFixed(1)}`);
  }
  return `<svg class="seal" viewBox="0 0 240 300" role="img" aria-label="Futures Prop Edge Awards ${YEAR}: ${line}">
    <path class="seal-ribbon" d="M84 196 L58 296 L86 280 L106 300 L124 210 Z"/>
    <path class="seal-ribbon seal-ribbon-b" d="M156 196 L182 296 L154 280 L134 300 L116 210 Z"/>
    <polygon class="seal-edge" points="${edge.join(' ')}"/>
    <circle class="seal-face" cx="120" cy="120" r="98"/>
    <circle class="seal-rule" cx="120" cy="120" r="70"/>
    <defs><path id="${id}-ring" d="M120,120 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0"/></defs>
    <g class="seal-spin"><text class="seal-ring"><textPath href="#${id}-ring" textLength="520" lengthAdjust="spacing">Futures Prop Edge Awards ✦ NQ &amp; MNQ ✦ Editor's pick ✦ </textPath></text></g>
    <text class="seal-year" x="120" y="128" text-anchor="middle">${YEAR}</text>
    <text class="seal-line" x="120" y="156" text-anchor="middle">${line}</text>
  </svg>`;
}

export function couponTicket(f, source) {
  return `<div class="ticket">
      <div class="ticket-main">
        <span class="ticket-label">${f.name} code</span>
        <button class="ticket-code" type="button" data-copy-code="${f.code}" data-copy-firm="${f.id}" aria-label="Copy code ${f.code}">${f.code}</button>
        <span class="ticket-offer">${f.offer}<small>${f.offerDetail}</small></span>
      </div>
      <div class="ticket-stub">${affiliateCta(f, source, 'Claim the offer')}<small>Tap the code to copy it</small></div>
    </div>`;
}

// The Best Overall spotlight: home hero (h1) and hub top pick (h2).
export function awardSpotlight({ heading = 'h2', source = 'spotlight', sealId = 'seal' } = {}) {
  const f = firmBySlug(TOP_PICK_SLUG);
  const name = heading === 'h1'
    ? `<h1 class="spotlight-title"><span class="spotlight-kicker">Best prop firm for NQ &amp; MNQ traders, ${YEAR}</span><span class="spotlight-name">${f.name}</span></h1>`
    : `<h2 class="spotlight-title"><span class="spotlight-kicker">#1 overall, ${YEAR}</span><span class="spotlight-name">${f.name}</span></h2>`;
  return `
  <div class="spotlight">
    <div class="spotlight-copy">
      ${name}
      <p class="spotlight-lede">${publicCopy(f.lane)}</p>
      <ul class="spotlight-reasons">${f.pros.slice(0, 4).map((p) => `<li>${publicCopy(p)}</li>`).join('')}</ul>
      <div class="spotlight-actions">${affiliateCta(f, `${source}-cta`, 'Claim 45% off')}<a class="btn ghost" href="/review/${f.slug}/">Why it won</a></div>
    </div>
    <div class="spotlight-art">
      ${awardSeal(sealId, 'Best Overall')}
      ${couponTicket(f, `${source}-ticket`)}
    </div>
  </div>`;
}

function codeChip(f) {
  if (!f.code) return '';
  return `<button class="code-chip" type="button" data-copy-code="${f.code}" data-copy-firm="${f.id}" aria-label="Copy code ${f.code}">Code <b>${f.code}</b></button>`;
}

// "Our pick instead" card for benchmark (non-affiliate) firm pages.
export function topPickInstead() {
  const f = firmBySlug(TOP_PICK_SLUG);
  return `
    <div class="article-card pick-instead">
      <span class="pill brass">Our pick instead</span>
      <h2>${f.name}, Best Overall ${YEAR}</h2>
      <p>${publicCopy(f.fit)}</p>
      <div class="hub-card-cta">${codeChip(f)}${affiliateCta(f, 'benchmark-pick-instead', 'Claim the Legends offer')}</div>
      <div class="firm-page-links"><a href="/review/${f.slug}/">Why it won Best Overall</a><a href="/best-futures-prop-firms/">Full ranked list</a></div>
    </div>`;
}

function reviewLinks(f) {
  return `<div class="firm-page-links"><a href="/review/${f.slug}/">Full ${f.name} review</a><a href="/discount/${f.slug}/">${f.name} discount code</a></div>`;
}

// ---------------------------------------------------------------------------
// Inline email capture: "free prop firm eval tracker spreadsheet"
// Posts to the existing /api/subscribe Vercel function (MailerLite).
// TODO(email-provider): the tracker spreadsheet itself is not delivered yet.
// Once you pick the final provider/automation, attach the spreadsheet link to
// the welcome email for the `eval_tracker_spreadsheet` source (or a dedicated
// MailerLite group) and update the success message in bindInlineCapture().
// ---------------------------------------------------------------------------
export function renderEmailCapture(context) {
  return `
  <div class="inline-capture" data-capture-context="${context}">
    <div class="inline-capture-copy">
      <h3>Get my free prop firm eval tracker spreadsheet</h3>
      <p>Track every evaluation, reset, payout, and rule violation in one sheet — so you know your real cost per funded account.</p>
    </div>
    <form class="inline-capture-form" data-inline-capture>
      <input type="email" name="email" autocomplete="email" placeholder="you@example.com" aria-label="Email address" required>
      <button class="btn primary" type="submit">Send me the tracker</button>
    </form>
    <p class="inline-capture-status" data-capture-status>No spam — unsubscribe anytime. Educational only, not financial advice.</p>
  </div>`;
}

// ---------------------------------------------------------------------------
// Hub: /best-futures-prop-firms/
// ---------------------------------------------------------------------------
export function renderHub() {
  const rest = affiliateFirms.filter((f) => f.slug !== TOP_PICK_SLUG);

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
    <p class="lead">The ${affiliateFirms.length} funded futures programs we recommend for NQ/MNQ traders, ranked by rule fit rather than headline discount. Updated ${MONTH_YEAR}.</p>
    ${disclosureLine()}
  </article>

  <section class="spotlight-band"><div class="wrap">${awardSpotlight({ heading: 'h2', source: 'hub-top-pick', sealId: 'hubSeal' })}</div></section>

  <article class="article wrap">
    ${renderQuizSection()}

    <h2 class="hub-section-title">The rest of the field, by what they're best at</h2>
    <div class="hub-grid">${rest.map((f, i) => firmCard(f, i + 2)).join('')}</div>

    <div class="article-card">
      <h2>Quick comparison</h2>
      <div class="table-wrap"><table><thead><tr><th>Firm</th><th>Drawdown type</th><th>Payout notes</th><th>Code</th><th></th></tr></thead><tbody>${tableRows}</tbody></table></div>
      <p class="disclaimer">Payout and drawdown notes summarize official-source reviews on their listed review dates. Always confirm current rules and the final checkout price on the firm's site.</p>
    </div>

    <div class="article-card">
      <h2>Where are Apex, Topstep, and Lucid?</h2>
      <p>All three are well-known firms and we keep their rules in our comparisons as benchmarks, but none is part of our recommended list. If you're coming from one of them, start here:</p>
      <div class="firm-page-links"><a href="/apex-alternatives/">Best Apex alternatives</a><a href="/topstep-alternatives/">Best Topstep alternatives</a><a href="/firms/lucidtraderfunding/">Lucid Trading rules summary</a></div>
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
        <tr><td><strong>Platforms</strong></td><td>${f.platforms.length ? publicCopy(f.platforms.join(', ')) : 'Not yet verified'}</td></tr>
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

    ${f.affiliate ? renderEmailCapture(`review-${f.slug}`) : ''}

    <div class="article-card">
      <h2>Keep comparing</h2>
      <div class="firm-page-links"><a href="/best-futures-prop-firms/">All recommended firms</a><a href="/quiz/">Find your match (quiz)</a><a href="/calculators/">Risk calculators</a>${f.affiliate ? `<a href="/discount/${f.slug}/">${f.name} discount code</a>` : ''}</div>
    </div>
  </article>`;
}

// ---------------------------------------------------------------------------
// Coupon pages: /discount/<slug>/
// ---------------------------------------------------------------------------
// FAQ entries are shared between the rendered page and its FAQPage JSON-LD.
export function discountFaqs(f) {
  return [
    {
      q: `Is the ${f.code} code still active in ${MONTH_YEAR}?`,
      a: `It was active when this page was last built. Codes can be paused or changed by the firm at any time, so always confirm the discount is applied on the checkout screen before paying.`,
    },
    {
      q: 'Does the code stack with sale prices?',
      a: `Usually a code applies to the listed price at checkout, but stacking rules are set by ${f.name}. If checkout shows a better sitewide promo, use whichever final price is lower.`,
    },
    {
      q: 'Do I pay more by using an affiliate code?',
      a: 'No — the price is the same or lower. Futures Prop Edge may earn a commission from the firm, which is how the site stays free.',
    },
  ];
}

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
      ${discountFaqs(f).map((faq) => `<details><summary>${faq.q}</summary><p>${faq.a}</p></details>`).join('\n      ')}
    </div>
  </article>`;
}

// ---------------------------------------------------------------------------
// Decision quiz: embedded on the hub and standalone at /quiz/
// ---------------------------------------------------------------------------
// Every outcome maps to one of the 7 partners. Scores are summed per answer;
// ties and weak signals fall back to The Legends Trading (our Best Overall 2026).
export const QUIZ = {
  defaultSlug: TOP_PICK_SLUG,
  questions: [
    {
      q: 'What is your budget for the first evaluation?',
      answers: [
        { label: 'As low as possible — under ~$100 if I can', scores: { daytraders: 3 }, reason: 'You want the cheapest entry: DayTraders has the lowest-priced evaluations on our list, with one-time pricing and a static-drawdown option.' },
        { label: 'Normal eval pricing is fine ($100–$300)', scores: { 'legends-trading': 1 } },
        { label: 'Budget is not the constraint — rules and tools are', scores: { 'alpha-futures': 1, phidias: 1 } },
      ],
    },
    {
      q: 'How do you want to get funded?',
      answers: [
        { label: 'Skip the evaluation, fund me from day one', scores: { 'legends-trading': 4 }, reason: 'You want instant funding: The Legends Trading’s Straight to Master route skips the evaluation entirely.' },
        { label: 'Pass an eval, but end up with real LIVE capital, not sim', scores: { phidias: 4 }, reason: 'You want real live capital: Phidias’ Express to Live path converts to LIVE capital at the first payout instead of staying simulated.' },
        { label: 'A standard evaluation is fine', scores: { 'legends-trading': 1 } },
      ],
    },
    {
      q: 'Where are you in your trading journey?',
      answers: [
        { label: 'Complete beginner — I want education included', scores: { earn2trade: 4 }, reason: 'You are still learning: Earn2Trade bundles education with the evaluation and is the longest-established firm on our list.' },
        { label: 'I have traded NQ/MNQ but not been funded yet', scores: { 'legends-trading': 1 } },
        { label: 'Experienced — I have held funded accounts before', scores: { 'alpha-futures': 1, bulenox: 1 } },
      ],
    },
    {
      q: 'How do you actually trade NQ/MNQ?',
      answers: [
        { label: 'Automated strategies / NinjaTrader algos', scores: { 'legends-trading': 1, 'alpha-futures': 1 } },
        { label: 'Discretionary intraday', scores: { 'legends-trading': 2 }, reason: 'You trade intraday: The Legends Trading’s Apprentice and Elite evaluations use EOD trailing drawdown, so a spike that reverses mid-session does not move your floor.' },
        { label: 'I hold swing / overnight positions', scores: { phidias: 2 }, reason: 'You hold overnight: Phidias Premium accounts allow overnight and weekend holds.' },
      ],
    },
    {
      q: 'Which perk matters most to you?',
      answers: [
        { label: 'Stacking many accounts as cheaply as possible', scores: { bulenox: 4 }, reason: 'You want to stack accounts: Bulenox runs frequent deep discounts and pays 100% of your first $10K.' },
        { label: 'Premium analytics and tools on my trading', scores: { 'alpha-futures': 4 }, reason: 'You want serious tooling: Alpha Futures is our pick for analytics and tools around a one-step evaluation.' },
        { label: 'Just the best all-round rules for NQ/MNQ', scores: { 'legends-trading': 3 }, reason: 'You want the best all-rounder: The Legends Trading is our Best Overall for 2026, with EOD trailing evaluations, a 90/10 split, and no daily loss limit on Elite.' },
      ],
    },
  ],
};

export function quizWinner(pickedAnswers) {
  const scores = {};
  for (const a of pickedAnswers) {
    for (const [slug, pts] of Object.entries(a.scores || {})) scores[slug] = (scores[slug] || 0) + pts;
  }
  let winner = QUIZ.defaultSlug;
  let best = scores[QUIZ.defaultSlug] || 0;
  for (const [slug, pts] of Object.entries(scores)) {
    if (pts > best) { winner = slug; best = pts; }
  }
  const reasons = pickedAnswers
    .filter((a) => a.reason && (a.scores || {})[winner])
    .map((a) => a.reason);
  return { slug: winner, reasons };
}

export function quizResultCard(slug, reasons) {
  const f = firmBySlug(slug) || firmBySlug(QUIZ.defaultSlug);
  const why = reasons.length
    ? `<ul class="hub-points">${reasons.map((r) => `<li>${r}</li>`).join('')}</ul>`
    : `<p>Based on your answers, the safest starting point is our overall #1 for NQ/MNQ traders.</p>`;
  return `
    <div class="verdict-box quiz-result">
      <span class="pill green">${f.badge}</span>
      <h3>Your match: ${f.name}</h3>
      <p>${publicCopy(f.lane)}</p>
      <h4>Why it matched your answers</h4>
      ${why}
      ${f.code ? `<div class="code-box"><small>Use code</small><button class="code-value" type="button" data-copy-code="${f.code}" data-copy-firm="${f.id}" aria-label="Copy code ${f.code}">${f.code}</button><small>tap / click to copy</small></div>` : ''}
      <div class="hub-card-cta">${affiliateCta(f, 'quiz-result', `Open the current ${f.name} offer`)}</div>
      <div class="firm-page-links"><a href="/review/${f.slug}/">Read the full ${f.name} review</a><a href="/discount/${f.slug}/">${f.name} discount code</a></div>
      <p class="disclaimer">Affiliate link — confirm rules and the final checkout price before buying.</p>
      ${renderEmailCapture('quiz-result')}
    </div>`;
}

export function renderQuizSection() {
  return `
  <section class="article-card quiz-card" id="quiz-widget">
    <span class="pill green">60-second quiz</span>
    <h2>Which futures prop firm actually fits you?</h2>
    <p>${QUIZ.questions.length} quick questions about your budget, funding goals, and trading style. Every result is one of the ${affiliateFirms.length} firms we recommend — no email required to see your match.</p>
    <div id="quizBox" data-quiz>
      <noscript><p>The quiz needs JavaScript. Browse <a href="/best-futures-prop-firms/">the full ranked list</a> instead.</p></noscript>
    </div>
  </section>`;
}

export function renderQuizPage() {
  return `
  <article class="article wrap">
    <nav class="crumbs"><a href="/">Home</a> › <a href="/best-futures-prop-firms/">Best firms</a> › Quiz</nav>
    <h1>Find Your Futures Prop Firm in 60 Seconds</h1>
    <p class="lead">Answer five questions and get matched to one of the ${affiliateFirms.length} funded futures programs we recommend for NQ/MNQ traders — with the discount code for it.</p>
    ${disclosureLine()}
    ${renderQuizSection()}
    <div class="article-card">
      <h2>All possible results</h2>
      <p>The quiz only ever recommends firms from our reviewed list:</p>
      <ul>${affiliateFirms.map((f) => `<li><a href="/review/${f.slug}/"><b>${f.name}</b></a> — ${f.badge}</li>`).join('')}</ul>
      <div class="firm-page-links"><a href="/best-futures-prop-firms/">See the full ranked list</a><a href="/calculators/">Run the risk calculators</a></div>
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
      ${laneCard('legends-trading', 'Our Best Overall for 2026: EOD trailing drawdown on Apprentice and Elite evaluations instead of intraday trailing, a 90/10 split, and Straight to Master instant funding.')}
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
      ${laneCard('legends-trading', 'Our Best Overall for 2026: EOD trailing evaluations, a 90/10 split, no daily loss limit on Elite, and an instant-funding route when you want to skip the evaluation.')}
      ${laneCard('earn2trade', 'The closest fit for traders who picked Topstep for structure: education included and the longest-established firm on our list.')}
      ${laneCard('phidias', 'A path to real live capital rather than staying simulated, with fast payout approvals.')}
      ${laneCard('daytraders', 'The budget lane: static-drawdown evaluations from $150 with one-time pricing instead of subscriptions.')}
    </div>

    <div class="article-card"><h2>Still comparing?</h2><div class="firm-page-links"><a href="/best-futures-prop-firms/">Full ranked list</a><a href="/quiz/">60-second matching quiz</a><a href="/calculators/">Drawdown survival calculator</a><a href="/firms/topstep/">Topstep rules summary</a></div></div>
  </article>`;
}
