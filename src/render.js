import { DEFAULT_CALCULATORS } from './calculatorLogic.js';

import { firms, affiliateFirms, comparisonFirms, firmBySlug } from './data/firms.js';
import { publicCopy } from './pages.js';

function money(n){
  if(!Number.isFinite(n)) return '$0';
  const abs = Math.abs(n);
  return `${n < 0 ? '-' : ''}$${abs.toLocaleString(undefined,{maximumFractionDigits:0})}`;
}
function num(id){ return parseFloat(document.getElementById(id)?.value || 0); }
function riskClass(score){ return score >= 84 ? 'green' : score >= 78 ? 'amber' : ''; }
function verificationClass(f){ return f.verification === 'official' ? 'green' : f.verification === 'research-snapshot' ? 'amber' : ''; }
function verificationLabel(f){ return f.verification === 'official' ? 'Source reviewed' : f.verification === 'research-snapshot' ? 'Source review updated' : 'Source review needed'; }
function isRecommended(f){ return f.affiliate === true; }
function recommendationBadge(f){ return isRecommended(f) ? '<span class="pill green">Recommended</span>' : ''; }
function affiliatePrimaryLabel(f){ return f.affiliateUrl ? 'Check current offer' : 'Visit official site'; }
function affiliateHref(f){ return f.affiliateUrl || f.officialUrl; }
function couponText(f){ return f.couponCode ? `<span class="pill amber">Code to try: ${f.couponCode}</span>` : '<span class="pill">No public code listed</span>'; }
function affiliateActions(f, details=true){
  const rel=f.affiliateUrl ? 'sponsored noopener' : 'noopener';
  const source=f.affiliateUrl ? 'affiliate' : 'official-fallback';
  const btnClass=f.affiliateUrl ? 'btn affiliate small outbound' : 'btn small outbound';
  const detailsBtn=details ? `<a class="btn small" href="${f.affiliate ? `/review/${f.slug}/` : `/firms/${f.id}/`}">Compare rules</a>` : '';
  return `<div class="affiliate-actions"><a class="${btnClass}" href="${affiliateHref(f)}" target="_blank" rel="${rel}" data-outbound-firm="${f.id}" data-outbound-source="${source}">${affiliatePrimaryLabel(f)}</a>${detailsBtn}</div>`;
}
function affiliateCard(f){
  if(isRecommended(f)){
    return `<div class="article-card affiliate-card"><h2>Recommended offer</h2><p>${recommendationBadge(f)} ${couponText(f)}</p><p>Use the link below to check ${f.name}. Confirm the final checkout price, offer terms, and current rules before buying.</p>${affiliateActions(f,false)}</div>`;
  }
  if(f.affiliateUrl){
    return `<div class="article-card affiliate-card"><h2>Current offer</h2><p>${couponText(f)}</p><p>Use this link if you choose ${f.name}, then confirm current prices, rules, promos, and account availability before buying.</p>${affiliateActions(f,false)}</div>`;
  }
  return `<div class="article-card affiliate-card"><h2>Official source</h2><p>${couponText(f)}</p><p>Use the official firm site for current prices, rules, promos, and account availability.</p>${affiliateActions(f,false)}</div>`;
}
function firmTraits(f){
  const hay = `${f.name} ${f.category} ${f.best} ${f.price} ${f.drawdown} ${f.daily} ${f.payout} ${f.fit}`.toLowerCase();
  const tags = [];
  if(isRecommended(f)) tags.push('Recommended');
  if(hay.includes('eod')) tags.push('EOD drawdown');
  if(hay.includes('static')) tags.push('Static drawdown');
  if(hay.includes('no activation') || hay.includes('activation fee: free') || hay.includes('free activation')) tags.push('No activation fee');
  if(hay.includes('daily') || hay.includes('fast') || hay.includes('1 day') || hay.includes('one-day')) tags.push('Fast payout/pass');
  if(hay.includes('direct') || hay.includes('lightning')) tags.push('Direct funded option');
  if(hay.includes('overnight') || hay.includes('swing')) tags.push('Swing-friendly');
  return [...new Set(tags)].slice(0,4);
}
function firmMatches(f, filter){
  if(!filter || filter === 'all') return true;
  const hay = `${f.name} ${f.category} ${f.best} ${f.price} ${f.drawdown} ${f.daily} ${f.payout} ${f.fit}`.toLowerCase();
  if(filter === 'recommended') return isRecommended(f);
  if(filter === 'eod') return hay.includes('eod');
  if(filter === 'static') return hay.includes('static');
  if(filter === 'fast') return hay.includes('daily') || hay.includes('fast') || hay.includes('1 day') || hay.includes('one-day') || hay.includes('5 days');
  if(filter === 'noactivation') return hay.includes('no activation') || hay.includes('activation fee: free') || hay.includes('free activation') || hay.includes('$0 activation');
  return true;
}
function finderRecommendation(goal){
  const map={
    cheapest:'bulenox',
    fast:'lucidtraderfunding',
    eod:'lucidtraderfunding',
    static:'phidias',
    structured:'earn2trade',
    flexible:'daytraders'
  };
  return firms.find(f=>f.id===(map[goal]||'lucidtraderfunding')) || firms[0];
}

function pageShell(content){
  return `
    <header class="nav">
      <div class="wrap nav-inner">
        <a class="brand" href="/" aria-label="Futures Prop Edge home"><span class="brand-mark"></span><span>Futures Prop Edge</span></a>
        <nav class="nav-links" aria-label="Primary">
          <a href="/best-futures-prop-firms/">Best Firms</a><a href="/compare/">Compare Firms</a><a href="/checklist/">Checklist</a><a href="/calculators/">Calculators</a><a href="/#guides">Guides</a><a href="/firms/">Firm Guides</a><a href="/disclaimers/">Disclosures</a>
        </nav>
        <div class="nav-cta"><a class="btn" href="/checklist/">Free checklist</a><a class="btn primary" href="/compare/">Compare firms</a><button class="btn mobile-menu" id="menuBtn" aria-controls="mobileNav" aria-expanded="false">Menu</button></div>
      </div>
      <div class="wrap mobile-nav-drawer" id="mobileNav" hidden><a href="/best-futures-prop-firms/">Best firms</a><a href="/compare/">Compare firms</a><a href="/checklist/">Checklist</a><a href="/calculators/">Calculators</a><a href="/#guides">Guides</a><a href="/firms/">Firm guides</a><a href="/disclaimers/">Disclosures</a></div>
    </header>
    <main>${content}</main>
    <div class="sticky-tools"><a class="btn small" href="/calculators/">Calculator</a><button class="btn small" id="copyLink">Copy link</button></div>
    <div class="tooltip-pop" id="tooltipPop" role="tooltip"></div>
    <div class="toast" id="toast">Link copied</div>
      <footer class="footer"><div class="wrap footer-grid"><div><div class="brand"><span class="brand-mark"></span><span>Futures Prop Edge</span></div><p class="disclaimer">Built for futures traders comparing funded account rules. We focus on NQ/MNQ risk, drawdown mechanics, and practical rule clarity.</p></div><div><b>Tools</b><p class="disclaimer"><a href="/compare/">Comparison table</a><br><a href="/checklist/">NQ checklist</a><br><a href="/calculators/">Drawdown calculator</a><br><a href="/best-nq-prop-firms.html">Best NQ prop firms</a><br><a href="/lucid-trading-vs-apex-nq-traders.html">Lucid vs Apex</a><br><a href="/best-eod-drawdown-prop-firms-nq-traders.html">Best EOD drawdown firms</a></p></div><div><b>Important</b><p class="disclaimer">Affiliate disclosure: Futures Prop Edge may earn commissions from affiliate links and discount codes on this site, at no extra cost to you.<br>Educational only. Not financial advice. Prop firm rules change; always verify on official websites before buying.<br><a href="/disclosure/">Affiliate disclosure</a> | <a href="/disclaimers/">Disclosures</a> | <a href="/privacy/">Privacy</a> | <a href="/terms/">Terms</a></p></div></div></footer>
  `;
}

function renderHome(){
  return `
  ${topMarketTape()}
  <section class="hero"><div class="wrap hero-grid">
    <div>
      <div class="eyebrow"><span class="dot"></span>Built for NQ / MNQ funded futures traders</div>
      <h1>Choose the right prop firm before the <span class="grad">drawdown trap</span> gets you.</h1>
      <p class="lead">Compare funded futures accounts, calculate trailing drawdown risk, size NQ trades correctly, and find current offers without digging through scattered rule pages.</p>
      <div class="hero-actions"><a class="btn primary" href="/calculators/">Start with risk calculator</a><a class="btn" href="/compare/">Compare firms</a><a class="btn" href="/checklist/">Get checklist</a></div>
      <div class="mini-proof"><span><b>9</b> covered firms</span><span><b>3</b> calculators</span><span><b>NQ-first</b> examples</span><span><b>Current offers</b> clearly labeled</span></div>
    </div>
    <div class="hero-offers" aria-label="Current prop firm discounts">
      <div class="hero-offers-head"><span>Current discounts</span><b>Click an offer to open it directly</b></div>
      ${offerBanners()}
    </div>
  </div></section>
  ${startPathSection()}
  ${guidesSection()}
  ${comparisonSection(false)}
  ${leadMagnetSection()}
  ${calculatorSection()}
  <section class="section"><div class="wrap cta-band"><div><div class="eyebrow"><span class="dot"></span>Built for futures traders</div><h2>Compare rules before you buy an account.</h2><p class="subhead">Use the finder, firm guides, and calculators to check drawdown, payout, daily-loss, and risk rules before choosing a funded futures account.</p></div><a class="btn primary" href="/disclaimers/">Review disclosures</a></div></section>`;
}

function topMarketTape(){
  return `<section class="top-market-tape" aria-label="Market context for S&P 500, Nasdaq 100, gold, and crude oil"><div class="wrap top-market-inner"><div class="top-market-label"><span class="dot"></span><b>Market context</b><small>ES / NQ / GC / CL</small></div><div class="market-tape-widget" id="marketTapeWidget"><tv-ticker-tape symbols="FOREXCOM:SPXUSD,FOREXCOM:NSXUSD,CMCMARKETS:GOLD,TVC:USOIL"></tv-ticker-tape><div class="market-tape-loading">Loading market tape...</div></div><span class="top-market-note">Indicative only</span></div></section>`;
}

function startPathSection(){
  const steps = [
    { href:'/calculators/', label:'1', title:'Check account risk', text:'Convert NQ/MNQ stop size into dollars before choosing an account.' },
    { href:'/compare/', label:'2', title:'Compare rule fit', text:'Filter by drawdown, payout path, activation fees, and NQ-friendly rules.' },
    { href:'/checklist/', label:'3', title:'Use the checklist', text:'Download the pre-check before you use an offer or buy a challenge.' }
  ];
  return `<section class="start-path wrap" aria-label="Suggested first steps">${steps.map(step=>`<a href="${step.href}"><span>${step.label}</span><div><b>${step.title}</b><em>${step.text}</em></div></a>`).join('')}</section>`;
}

function offerBanners(){
  const offers = [
    { id:'lucidtraderfunding', headline:'Lucid Trading', discount:'50% off all accounts', detail:'Includes LucidDirect', code:'DUTRADING', expires:'Valid through July 2 at 5 PM ET', featured:true },
    { id:'phidias', headline:'Phidias Propfirm', discount:'80% off', detail:'OTP accounts', code:'DUTRADING' },
    { id:'alphafutures', headline:'Alpha Futures', discount:'25% off', detail:'Premium accounts', code:'Duckens026406' },
    { id:'daytraders', headline:'DayTraders', discount:'90% off', detail:'Limited-time special — confirm eligible accounts at checkout', code:'DUTRADING' },
    { id:'legendstrading', headline:'The Legends Trading', discount:'50% / 30% off', detail:'Apprentice / Elite plans', code:'DUTRADING' },
    { id:'bulenox', headline:'Bulenox', discount:'89% off', detail:'Option 1 accounts', code:'dutrading' },
    { id:'earn2trade', headline:'Earn2Trade', discount:'60% off', detail:'Current Trader Career Path pricing', code:'dutrading' }
  ];
  return `<div class="promo-grid">${offers.map(offer=>{
    const firm = firms.find(f=>f.id === offer.id);
    return `<a class="promo-banner promo-${offer.id}${offer.featured ? ' featured' : ''}" href="${affiliateHref(firm)}" target="_blank" rel="sponsored noopener" aria-label="${offer.headline}: ${offer.discount}. Opens in a new tab" data-outbound-firm="${firm.id}" data-outbound-source="offer-banner"><div class="promo-banner-top"><span>${offer.headline}</span><b>Open offer</b></div><strong class="offer-discount">${offer.discount}</strong><p>${offer.detail}</p><div class="promo-banner-bottom"><span>Code to try: ${offer.code}</span>${offer.expires ? `<em>${offer.expires}</em>` : ''}</div></a>`;
  }).join('')}</div>`;
}

function guidesSection(){
  const guides = [
    { href:'/best-nq-prop-firms.html', label:'Best NQ Prop Firms', text:'A practical shortlist for NQ/MNQ traders comparing drawdown, payout, and rule fit.', cta:'Read guide' },
    { href:'/lucid-trading-vs-apex-nq-traders.html', label:'Lucid vs Apex', text:'A direct rule-fit comparison: Lucid for cleaner EOD rules, Apex for account-scale context.', cta:'Compare rules' },
    { href:'/best-eod-drawdown-prop-firms-nq-traders.html', label:'Best EOD Drawdown Firms', text:'Use this before buying if intraday trailing drawdown keeps catching normal NQ trades.', cta:'See EOD guide' }
  ];
  return `<section class="section guide-strip" id="guides"><div class="wrap"><div class="section-head"><div><span class="eyebrow"><span class="dot"></span>NQ Prop Firm Guides</span><h2>Rule guides that support the comparison.</h2><p class="subhead">These pages give visitors more context, then point them back to the calculators, comparison table, checklist, and current offers before they buy.</p></div><a class="btn primary" href="/compare/">Compare firms</a></div><div class="guide-grid">${guides.map(guide=>`<a class="guide-card" href="${guide.href}"><span class="pill">Guide</span><h3>${guide.label}</h3><p>${guide.text}</p><b>${guide.cta}</b></a>`).join('')}</div></div></section>`;
}

function leadMagnetSection(){
  return `<section class="section lead-magnet" id="checklist"><div class="wrap lead-grid"><div class="lead-copy"><span class="eyebrow"><span class="dot"></span>Free NQ prop firm checklist</span><h2>Before you buy another challenge, run through the drawdown traps first.</h2><p class="subhead">Download a practical checklist for NQ/MNQ traders: EOD vs intraday drawdown, daily loss limits, consistency rules, payout buffers, activation fees, and account-size risk.</p><div class="checklist-preview"><div><b>1</b><span>Confirm the drawdown type before comparing prices.</span></div><div><b>2</b><span>Calculate NQ/MNQ stop risk against daily loss and cushion.</span></div><div><b>3</b><span>Check payout rules, consistency %, activation fees, and reset costs.</span></div><div><b>4</b><span>Use offers only after rechecking live checkout terms.</span></div></div></div><form class="lead-form" id="leadForm"><h3>Unlock the printable checklist</h3><p>Enter your email to join Futures Prop Edge and unlock the NQ Prop Firm Risk Checklist instantly. You can unsubscribe anytime.</p><label>Email address</label><input id="leadEmail" name="email" type="email" autocomplete="email" placeholder="you@example.com" required><label>Trading focus</label><select id="leadFocus" name="focus"><option value="NQ/MNQ prop firm challenges">NQ/MNQ prop firm challenges</option><option value="EOD drawdown accounts">EOD drawdown accounts</option><option value="Firm offers / comparison">Firm offers / comparison</option><option value="Risk sizing calculators">Risk sizing calculators</option></select><button class="btn primary" type="submit">Join list + unlock checklist</button><p class="lead-status" id="leadStatus">Instant checklist access plus occasional rule and promo updates. No spam; unsubscribe anytime. Educational only, not financial advice.</p><div class="download-card" id="checklistDownload" hidden><b>Checklist unlocked.</b><span>Open the printable checklist guide and keep comparing firms on the site.</span><a class="btn small" id="openChecklist" href="/nq-prop-firm-risk-checklist.html" target="_blank" rel="noopener">Open printable checklist</a></div></form></div></section>`;
}
function comparisonSection(full=true){
  const rows = firms.map(f=>`<tr data-firm-row data-tags="${firmTraits(f).join(' ').toLowerCase()}"><td><strong>${f.name}</strong><br><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span>${recommendationBadge(f)}</td><td><strong>${f.category}</strong><br><span class="muted-small">${f.best}</span></td><td>${publicCopy(f.price)}</td><td>${publicCopy(f.drawdown)}</td><td>${publicCopy(f.daily)}</td><td>${affiliateActions(f,true)}</td></tr>`).join('');
  const cards = firms.map(f=>`<article class="finder-card" data-firm-card data-firm-name="${f.name.toLowerCase()}" data-filter-match="all ${['recommended','eod','static','fast','noactivation'].filter(x=>firmMatches(f,x)).join(' ')}"><div class="finder-card-top"><div><h3>${f.name}</h3><p>${f.fit}</p></div>${recommendationBadge(f)}</div><div class="finder-tags">${firmTraits(f).map(t=>`<span>${t}</span>`).join('')}</div><div class="finder-stats"><div><small>Drawdown</small><b>${publicCopy(f.drawdown)}</b></div><div><small>Payout</small><b>${publicCopy(f.payout)}</b></div><div><small>Cost note</small><b>${publicCopy(f.price)}</b></div></div><div class="finder-actions">${affiliateActions(f,true)}</div></article>`).join('');
  return `<section class="section" id="compare"><div class="wrap"><div class="section-head"><div><h2>Find and compare futures prop firms.</h2><p class="subhead">Use the finder to narrow accounts by what matters: recommended firms, EOD/static drawdown, fast payout paths, activation fees, and NQ-friendly risk rules.</p></div>${full?'<a class="btn" href="/calculators/">Check risk</a>':''}</div><div class="finder-panel"><div class="finder-copy"><span class="eyebrow"><span class="dot"></span>Prop firm finder</span><h3>Pick your priority. Get a practical starting point.</h3><p>Not every trader needs the same firm. Choose your main goal and the finder highlights the closest match from the firms covered in this guide.</p><select id="finderGoal"><option value="fast">Fast payout / live-capital path</option><option value="cheapest">Lowest displayed starting cost</option><option value="eod">EOD drawdown preferred</option><option value="static">Static drawdown / no trailing</option><option value="structured">Structured legacy evaluation</option><option value="flexible">Flexible payout-policy choice</option></select></div><div class="finder-result" id="finderResult"></div></div><div class="compare-toolbar"><div class="filter-buttons" role="group" aria-label="Compare filters"><button class="filter-chip active" data-filter="all">All firms</button><button class="filter-chip" data-filter="recommended">Recommended</button><button class="filter-chip" data-filter="eod">EOD drawdown</button><button class="filter-chip" data-filter="static">Static</button><button class="filter-chip" data-filter="fast">Fast payout</button><button class="filter-chip" data-filter="noactivation">No activation fee</button></div><input id="firmSearch" class="firm-search" type="search" placeholder="Search firm, drawdown, payout..."></div><div class="finder-grid">${cards}</div><details class="table-details" ${full?'open':''}><summary>Open full comparison table</summary><div class="table-wrap"><table><thead><tr><th>Firm</th><th>Category</th><th>Price</th><th>Drawdown</th><th>Daily loss</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></details></div></section>`;
}

function renderCompare(){ return comparisonSection(true); }
function renderChecklist(){ return `${leadMagnetSection()}${calculatorSection()}`; }

function calculatorSection(){
  return `<section class="section" id="calculators"><div class="wrap"><div class="section-head"><div><h2>Free calculators for prop firm risk.</h2><p class="subhead">Pressure-test drawdown, consistency rules, futures stop risk, and challenge pace before choosing an account.</p></div></div><div class="calc-grid"><div class="tabs"><button class="tab active" data-calc="drawdown"><b>Trailing drawdown + consistency</b><br>Calculate liquidation cushion and 30/40/50% consistency rules.</button><button class="tab" data-calc="nq"><b>Futures risk</b><br>NQ, MNQ, ES, GC, and CL stop-risk calculator.</button><button class="tab" data-calc="planner"><b>Challenge pass planner</b><br>Estimate daily target and risk pace.</button></div><div class="calculator" id="calcPanel"></div></div></div></section>`;
}
function renderCalculators(){ return calculatorSection(); }

function drawdownCalc(){const d=DEFAULT_CALCULATORS.drawdown;return `<h3>Trailing drawdown + consistency simulator</h3><p class="disclaimer">Enter the account state and the firm's consistency percentage. Many prop firms require your biggest winning day to be no more than 30%, 40%, or 50% of total profit before payout.</p><div class="form-grid"><div><label>Starting balance</label><input id="startBal" type="number" value="${d.startBal}"></div><div><label>Current balance</label><input id="currentBal" type="number" value="${d.currentBal}"></div><div><label>High-water mark <button class="help-dot" type="button" data-help="High-water mark is the highest balance or equity your account has reached so far. For Apex-style EOD drawdown, use the highest end-of-day closing balance, not the highest intraday unrealized spike. Example: if the EOD high-water mark is $52,400 and the trail is $2,500, the liquidation level is $49,900." aria-label="What is high-water mark?">?</button></label><input id="highBal" type="number" value="${d.highBal}"></div><div><label>Drawdown amount</label><input id="ddAmount" type="number" value="${d.ddAmount}"></div><div><label>Drawdown type</label><select id="ddType"><option value="trailing">Intraday trailing</option><option value="eod">EOD trailing (Apex-style)</option><option value="static">Static from start</option></select></div><div><label>Consistency rule %</label><input id="consistencyPct" type="number" value="${d.consistencyPct}" min="1" max="100" step="1"></div><div><label>Total profit so far</label><input id="totalProfit" type="number" value="${d.totalProfit}"></div><div><label>Best winning day</label><input id="bestDay" type="number" value="${d.bestDay}"></div></div><div class="calc-actions"><button class="btn small" type="button" data-reset-calc="drawdown">Reset calculator</button></div><div class="result-box" id="ddResults"></div><div class="note" id="ddNote"></div>`}
function nqCalc(){const d=DEFAULT_CALCULATORS.nq;return `<h3>Futures position risk calculator</h3><p class="disclaimer">Choose the futures contract and enter your stop size. Point values used: NQ $20, MNQ $2, ES $50, GC $100, and CL $1,000 per point per contract.</p><div class="form-grid"><div><label>Market</label><select id="market"><option value="20" data-symbol="NQ" data-step="0.25">NQ - Nasdaq 100</option><option value="2" data-symbol="MNQ" data-step="0.25">MNQ - Micro Nasdaq</option><option value="50" data-symbol="ES" data-step="0.25">ES - S&P 500</option><option value="100" data-symbol="GC" data-step="0.1">GC - Gold</option><option value="1000" data-symbol="CL" data-step="0.01">CL - Crude Oil</option></select></div><div><label>Contracts</label><input id="contracts" type="number" value="${d.contracts}"></div><div><label>Stop size in points</label><input id="stopPts" type="number" value="${d.stopPts}" step="0.25"></div><div><label>Daily loss limit</label><input id="dailyLoss" type="number" value="${d.dailyLoss}"></div><div><label>Drawdown cushion</label><input id="cushion" type="number" value="${d.cushion}"></div><div><label>Profit target</label><input id="target" type="number" value="${d.target}"></div><div><label>Open-profit spike that reverses <button class="help-dot" type="button" data-help="Only matters for intraday trailing drawdown. If a trade runs this many points in your favor and then comes back, an intraday trailing threshold has already moved up by that amount - cushion you lose without ever realizing the profit. Static and EOD models ignore intraday spikes." aria-label="What is an open-profit spike?">?</button></label><input id="spikePts" type="number" value="${d.spikePts}" step="0.25"></div></div><div class="calc-actions"><button class="btn small" type="button" data-reset-calc="nq">Reset calculator</button></div><div class="result-box" id="nqResults"></div><div class="survival-box" id="nqSurvival"></div><div class="note" id="nqNote"></div>`}
function plannerCalc(){const d=DEFAULT_CALCULATORS.planner;return `<h3>Challenge pass planner</h3><p class="disclaimer">Plan a conservative pace instead of trying to pass in one overleveraged day.</p><div class="form-grid"><div><label>Profit target</label><input id="profitTarget" type="number" value="${d.profitTarget}"></div><div><label>Days to pass</label><input id="days" type="number" value="${d.days}"></div><div><label>Max daily loss</label><input id="maxDailyLoss" type="number" value="${d.maxDailyLoss}"></div><div><label>Risk per trade</label><input id="riskTrade" type="number" value="${d.riskTrade}"></div></div><div class="calc-actions"><button class="btn small" type="button" data-reset-calc="planner">Reset calculator</button></div><div class="result-box" id="planResults"></div><div class="note" id="planNote"></div>`}

function renderFirms(firmId){
  const hash = firmId;
  if(hash){
    const f=firms.find(x=>x.id===hash) || firms[0];
    if(f.id==='apex') return renderApexArticle(f);
    return `<article class="article wrap"><a class="btn" href="/firms/">â† All firms</a><h1>${f.name} for futures traders</h1><p class="lead">${f.fit}</p><div class="article-card verify-card"><h2>Source review</h2><p><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span></p><p>Official source: <a href="${f.officialUrl}" target="_blank" rel="noreferrer">${f.officialUrl}</a></p><p class="disclaimer">Use this firm page as a quick rule overview, then confirm current pricing, restrictions, and payout terms on the official website.</p></div><div class="article-card"><h2>Rules in plain English</h2><p>Before choosing ${f.name}, confirm current evaluation prices, profit targets, drawdown mechanics, payout rules, activation fees, reset fees, consistency rules, contract limits, and prohibited strategies on the official website.</p><ul><li>Category: ${f.category}</li><li>Typical risk level: ${f.risk}</li><li>Price: ${publicCopy(f.price)}</li><li>Profit target: ${publicCopy(f.target)}</li><li>Drawdown note: ${publicCopy(f.drawdown)}</li><li>Daily loss: ${publicCopy(f.daily)}</li><li>Payout note: ${publicCopy(f.payout)}</li></ul></div><div class="article-card"><h2>How NQ traders usually fail</h2><p>The common failure pattern is oversizing NQ contracts while the trailing drawdown is still close to the current balance. Use MNQ until the cushion is large enough, then scale only after the account has room.</p><a class="btn primary" href="/calculators/">Run calculator for this account</a></div></article>`;
  }
  return `<section class="section"><div class="wrap"><div class="section-head"><div><h2>Futures prop firm rule guides.</h2><p class="subhead">Use these firm guides to compare drawdown, payout, pricing, and account-fit details before choosing where to spend money.</p></div></div><div class="firm-grid">${firms.map(f=>`<a class="firm" href="${f.affiliate ? `/review/${f.slug}/` : `/firms/${f.id}/`}"><div class="firm-top"><div><h3>${f.name}</h3><p>${f.fit}</p></div><span class="status-dot ${verificationClass(f)}"></span></div><div class="firm-meta"><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span>${recommendationBadge(f)}<span class="pill">${f.category}</span></div></a>`).join('')}</div></div></section>`;
}


function renderApexArticle(f){
  return `<article class="article wrap"><a class="btn" href="/firms/">â† All firms</a><h1>Apex Trader Funding: EOD vs Intraday drawdown</h1><p class="lead">Apex changed materially in 2026. Treat it as two different products: EOD trailing drawdown accounts and intraday trailing drawdown accounts.</p>
  <div class="article-card verify-card"><h2>Source review</h2><p><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span></p><p>Official source: <a href="${f.officialUrl}" target="_blank" rel="noreferrer">${f.officialUrl}</a></p><p class="disclaimer">Apex account rules, payout terms, and checkout discounts can change. Confirm current EOD rules and final pricing on the official Apex site before buying.</p></div>
  ${affiliateCard(f)}
  <div class="article-card"><h2>Apex EOD rule snapshot</h2><ul><li><b>EOD drawdown:</b> calculated once per trading day at 4:59:59 PM ET, based on the account's closing balance.</li><li><b>Enforcement:</b> once calculated, the EOD threshold is enforced during the next trading session; touching or falling below it fails the evaluation or closes the PA.</li><li><b>No intraday trailing drawdown:</b> Apex's EOD pages state there is no intraday trailing drawdown on EOD accounts.</li><li><b>Daily Loss Limit:</b> EOD evaluations and EOD PAs have DLLs enforced intraday by account size.</li><li><b>Evaluation pass:</b> no minimum trading days required; a trader may pass in one day if the profit target is reached and rules are respected.</li><li><b>PA activation window:</b> after passing, Apex says traders have 7 calendar days to activate the corresponding EOD Performance Account.</li></ul></div>
  <div class="article-card"><h2>Apex EOD account specs</h2><div class="table-wrap"><table><thead><tr><th>Size</th><th>Profit target</th><th>Max drawdown</th><th>Daily loss limit</th><th>Eval contracts</th><th>Retail EOD price</th></tr></thead><tbody><tr><td><strong>$25K EOD</strong></td><td>$1,500</td><td>$1,000</td><td>$500</td><td>4</td><td>$177</td></tr><tr><td><strong>$50K EOD</strong></td><td>$3,000</td><td>$2,000</td><td>$1,000</td><td>6</td><td>$197</td></tr><tr><td><strong>$100K EOD</strong></td><td>$6,000</td><td>$3,000</td><td>$1,500</td><td>8</td><td>$297</td></tr><tr><td><strong>$150K EOD</strong></td><td>$9,000</td><td>$4,000</td><td>$2,000</td><td>12</td><td>$397</td></tr></tbody></table></div><p class="disclaimer">Apex EOD specs can change. Confirm current pricing, coupons, and account rules on the official Apex site before buying.</p></div>
  <div class="article-card"><h2>Apex EOD payout rules</h2><ul><li>Approved EOD PA payouts are listed as a 100% payout split.</li><li>Minimum 5 qualifying trading days are required before payout request.</li><li>Minimum daily profit per qualifying day: $100 on 25K, $250 on 50K, $300 on 100K, $350 on 150K.</li><li>50% consistency rule applies: no single profitable day may be 50% or more of total profit since the last approved payout.</li><li>Minimum payout request is $500.</li><li>Each EOD Performance Account may receive a maximum of six payouts, then the PA is closed.</li></ul></div><div class="article-card"><h2>Why this matters for NQ traders</h2><p>On an intraday trailing account, an unrealized NQ runner can push the high-water mark up before you close the trade. If price reverses, your floor may already be higher. On Apex-style EOD drawdown, Apex's official EOD pages state there is no intraday trailing drawdown; the threshold is calculated from the end-of-day balance and enforced afterward.</p><p>For most NQ traders who hold trades for more than a few seconds, EOD is usually easier to manage. Pure tick scalpers may still compare intraday accounts if they are flat quickly.</p><a class="btn primary" href="/calculators/">Run EOD drawdown calculator</a></div>
  <div class="article-card"><h2>Official Apex pages</h2><ul><li>https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/eod-evaluations/</li><li>https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/eod-drawdown-explained/</li><li>https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/eod-performance-accounts-pa/</li><li>https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/eod-payouts/</li></ul></div></article>`;
}

function renderDisclaimers(){return `<article class="article wrap"><h1>Disclosures</h1><div class="article-card"><h2>Affiliate disclosure</h2><p>This site may earn commissions when visitors click affiliate links or use discount codes. Recommendations are based on rule fit, account structure, trader risk, and official-source review. Affiliate compensation may exist, but it should not replace your own rule review or final checkout confirmation.</p></div><div class="article-card"><h2>Educational only</h2><p>Futures Prop Edge is for education and comparison only. It is not financial advice, investment advice, tax advice, legal advice, or a promise that users will pass an evaluation, receive a payout, qualify for live capital, or make money.</p></div><div class="article-card"><h2>Futures and prop-firm risk</h2><p>Futures trading is risky, leveraged, and not suitable for every trader. Prop-firm evaluations and simulated funded accounts can involve fees, resets, activation costs, drawdown rules, payout restrictions, consistency rules, and account closures. Only trade capital and fees you can afford to lose.</p></div><div class="article-card"><h2>Rule-change policy</h2><p>Prop firm rules, prices, discounts, payout policies, platform access, country restrictions, and account availability can change frequently. Use the last-reviewed date and official-rule links as a starting point, then verify the latest terms directly with the firm before buying.</p></div><div class="article-card"><h2>Checklist and analytics</h2><p>The checklist unlock is instant. Submitting the form may add your email and trading focus to the site's email provider so future rule updates can be sent. The browser keeps only checklist status metadata, not the raw email. Form and download events may be measured without sending the raw email as an analytics event.</p></div><div class="article-card"><h2>Before you use this site</h2><ul><li>Verify each prop firm rule directly from official sources before buying.</li><li>Recheck every offer, coupon code, and official rule page before purchasing an account.</li><li>Read the affiliate disclosure, educational disclaimer, risk disclosure, and rule-change policy before relying on any comparison.</li><li>The checklist is provided as an educational planning aid, not a promise of account approval, payouts, live funding, or trading profits.</li></ul></div></article>`}

function renderPrivacy(){return `<article class="article wrap"><a class="btn" href="/">Home</a><h1>Privacy Policy</h1><p class="lead">Futures Prop Edge collects only the information needed to run the site, measure usage, and deliver the checklist/newsletter experience.</p><div class="article-card"><h2>Email and checklist signup</h2><p>When you submit the checklist form, your email address and selected trading focus may be sent to our email provider, currently MailerLite, so you can receive checklist access and future rule/risk updates. The site stores checklist status metadata in your browser, but it does not store your raw email in browser local storage.</p></div><div class="article-card"><h2>Analytics</h2><p>The site may use Vercel Analytics, Google Analytics, and Microsoft Clarity to understand page views, button clicks, calculator usage, and signup/download events. Analytics events should not include your raw email address.</p></div><div class="article-card"><h2>Affiliate links</h2><p>Outbound affiliate links may use tracking parameters or redirects. If you buy after clicking one of those links or using a listed code, this site may earn a commission.</p></div><div class="article-card"><h2>Your choices</h2><p>You can unsubscribe from emails using the unsubscribe link in any email. You can also clear browser storage or block analytics through your browser settings.</p></div></article>`}

function renderTerms(){return `<article class="article wrap"><a class="btn" href="/">Home</a><h1>Terms of Use</h1><p class="lead">Use this site as an educational comparison tool, not as financial advice or a guarantee that any prop firm account will be right for you.</p><div class="article-card"><h2>Educational content only</h2><p>Futures Prop Edge provides rule summaries, calculators, checklists, and comparison notes for funded futures traders. Nothing here is financial, investment, tax, or legal advice.</p></div><div class="article-card"><h2>Risk and responsibility</h2><p>Futures trading and prop-firm evaluations involve substantial risk. You are responsible for verifying current rules, prices, restrictions, payout policies, and checkout terms directly with each firm before purchasing.</p></div><div class="article-card"><h2>No guarantees</h2><p>The site does not guarantee evaluation passes, payouts, live funding, profits, discounts, or account approval. Rules and offers may change after a page was reviewed.</p></div><div class="article-card"><h2>Affiliate compensation</h2><p>Some links and codes are affiliate offers. Compensation may be earned, but you should still compare rule fit and confirm final checkout pricing before buying.</p></div></article>`}

function renderBestNqArticle(){
  const recommended = firms.filter(isRecommended);
  return `<article class="article wrap"><a class="btn" href="/">Home</a><h1>Best funded futures prop firms for NQ traders</h1><p class="lead">NQ and MNQ traders need more than a cheap challenge. The real question is whether the drawdown, daily loss, payout, and contract rules match the way you trade Nasdaq futures.</p><div class="article-card"><h2>Quick picks</h2><div class="finder-grid">${recommended.map(f=>`<article class="finder-card"><div class="finder-card-top"><div><h3>${f.name}</h3><p>${f.fit}</p></div>${recommendationBadge(f)}</div><div class="finder-tags">${firmTraits(f).map(t=>`<span>${t}</span>`).join('')}</div><p>${couponText(f)}</p>${affiliateActions(f,true)}</article>`).join('')}</div></div><div class="article-card"><h2>How to choose for NQ</h2><ul><li><b>Start with drawdown:</b> Static and EOD drawdown are easier to plan around than real-time intraday trailing when NQ moves fast.</li><li><b>Respect daily loss limits:</b> A normal NQ stop can consume a small DLL quickly. Use MNQ while your cushion is thin.</li><li><b>Read payout rules:</b> Fast payout language can still include consistency rules, buffers, minimum days, caps, or live-transition discretion.</li><li><b>Confirm checkout:</b> Codes and promos can change. Always verify the final price before buying.</li></ul></div><div class="article-card"><h2>Recommended starting point</h2><p>For most NQ traders, begin with the rule fit rather than the headline price. Phidias is worth checking for static/E2L and swing-friendly Premium rules, Lucid Trading for EOD drawdown and direct-funded paths, and Bulenox for budget-focused traders who are willing to read drawdown options carefully.</p><a class="btn primary" href="/checklist/">Download the NQ checklist</a></div></article>`;
}


export {
  firms, affiliateFirms, comparisonFirms, firmBySlug, money, num, riskClass, verificationClass, verificationLabel,
  isRecommended, recommendationBadge, affiliatePrimaryLabel, affiliateHref,
  couponText, affiliateActions, affiliateCard, firmTraits, firmMatches,
  finderRecommendation, pageShell, renderHome, topMarketTape, startPathSection,
  offerBanners, guidesSection, leadMagnetSection, comparisonSection, renderCompare,
  renderChecklist, calculatorSection, renderCalculators, drawdownCalc, nqCalc,
  plannerCalc, renderFirms, renderDisclaimers, renderPrivacy, renderTerms,
  renderBestNqArticle
};
