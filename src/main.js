import './styles.css';
import { inject, track as vercelTrack } from '@vercel/analytics';
import { DEFAULT_CALCULATORS, calculateDrawdownState, calculateFuturesRisk } from './calculatorLogic.js';

inject();

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID || '';

function injectScript(src, attrs = {}){
  if(!src || document.head.querySelector(`script[src="${src}"]`)) return;
  const script=document.createElement('script');
  script.src=src;
  script.async=true;
  Object.entries(attrs).forEach(([key,value])=>{ if(value !== undefined) script.setAttribute(key,value); });
  document.head.appendChild(script);
}

function initFreeAnalytics(){
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){ window.dataLayer.push(arguments); };

  if(GA_MEASUREMENT_ID){
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
  }

  if(CLARITY_PROJECT_ID){
    window.clarity=window.clarity||function(){ (window.clarity.q=window.clarity.q||[]).push(arguments); };
    injectScript(`https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`);
  }
}

initFreeAnalytics();

const firms = [
  {id:'apex', name:'Apex Trader Funding', category:'Best for Apex EOD drawdown research', best:'EOD rule page reviewed from official Apex sources', price:'Retail prices and discounts change at checkout', target:'$1.5k / $3k / $6k / $9k', drawdown:'EOD trailing + intraday trailing', daily:'EOD DLL: $500 / $1k / $1.5k / $2k', payout:'100% split; 5 qualifying days; 50% consistency; max 6 payouts', risk:'Medium', officialUrl:'https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/', lastVerified:'2026-05-31', verification:'official', affiliateUrl:'', couponCode:'', fit:'Best for NQ traders who want a heavily searched futures prop firm and prefer officially documented EOD drawdown over intraday trailing.'},
  {id:'phidias', name:'Phidias Propfirm', category:'Partner offer — fast E2L / swing-friendly Premium option', best:'Phidias 2.0 account types and rules summarized from official sources', price:'Starts at $55 one-time after listed PHIDIAS80 promo; try code DUTRADING and confirm final checkout price', target:'E2L $1.5k/$2.5k/$3.5k/$4.5k; Fundamental/Premium $4k/$6k/$9k', drawdown:'E2L static; Fundamental/Premium EOD trailing; no intraday trailing', daily:'No daily loss limit listed; Fundamental/Premium enforce EOD floor and funded 30% consistency', payout:'E2L first payout converts to LIVE path; Fundamental 80%; Premium 75→100%; daily uncapped LIVE payouts', risk:'Medium', officialUrl:'https://phidiaspropfirm.com/', lastVerified:'2026-06-01', verification:'official', affiliateUrl:'https://member.phidiaspropfirm.com/aff/go/duckensm', couponCode:'DUTRADING', fit:'Best for NQ traders who want Phidias 2.0 rules: Express to Live static drawdown, no minimum days, no consistency rule, plus Premium accounts for overnight/weekend holds and progressive profit split.'},
  {id:'lucidtraderfunding', name:'Lucid Trading', category:'Recommended — newer live-capital path', best:'LucidTrading.com account rules summarized from official sources', price:'Pro coupon from $94.50; Flex from $70; Direct from $238; try code dutrading and confirm final checkout price', target:'Pro/Flex $1.25k / $3k / $6k / $9k; Direct straight funded', drawdown:'EOD drawdown across Pro/Flex/Direct', daily:'Pro DLL none/$1.2k/$1.8k/$2.7k; Flex none; Direct DLL scales above initial trail', payout:'90/10 split; no payout windows; Pro 3 days funded payout; Direct 5 days; path to LucidLive', risk:'Medium-High', officialUrl:'https://lucidtrading.com/', lastVerified:'2026-05-31', verification:'official', affiliateUrl:'https://lucidtrading.com/ref/dutrading', couponCode:'dutrading', fit:'Best for NQ traders comparing newer EOD-drawdown futures funding with fast payouts, no activation fees, and a stated path from simulated funding to LucidLive.'},
  {id:'myfundedfutures', name:'MyFundedFutures', category:'Best modern futures-specific alternative', best:'Rules summarized from official help-center sources', price:'Flex $95/$153; Rapid $109/$157/$267/$347; Pro $227/$344/$477; Builder $153', target:'$1.5k / $3k / $6k / $9k', drawdown:'Max EOD trailing; locks at starting balance + $100', daily:'No daily loss limit listed for evals; payout page says none on Flex/Rapid/Pro', payout:'Rapid daily/90%; Flex after 5 winning days/80%; Pro every 14 days/80%', risk:'Medium', officialUrl:'https://help.myfundedfutures.com/en/articles/11802636-traders-evaluation-simplified', lastVerified:'2026-05-31', verification:'official', affiliateUrl:'', couponCode:'', fit:'Best for NQ traders comparing newer futures-specific plans with no activation fee, EOD drawdown, and plan-specific payout rules.'},
  {id:'tradeify', name:'Tradeify', category:'Best flexible payout-path option', best:'Homepage and help-center rules summarized from official sources', price:'Growth promo from $59; Select promo from $65; Lightning promo from $207; confirm current code at checkout', target:'$1.5k / $3k / $6k / $9k', drawdown:'EOD trailing on Growth, Select, and Lightning; funded drawdown locks at start + $100', daily:'Growth/Lightning DLL applies; Select eval none; Select Flex funded none; Select Daily funded $500/$1k/$1.25k/$1.75k', payout:'90% split; Growth 5 winning days + 35% funded consistency; Select Flex 5 winning days; Select Daily daily eligibility; Lightning 20% consistency', risk:'Medium', officialUrl:'https://tradeify.co/', lastVerified:'2026-05-31', verification:'official', affiliateUrl:'', couponCode:'', fit:'Best for NQ traders who want EOD drawdown, no activation fee, and a choice between Growth speed, Select payout flexibility, or Lightning instant simulated funding.'},
  {id:'bulenox', name:'Bulenox', category:'Recommended — budget account + EOD/trailing choice', best:'Homepage and help-center rules summarized from official sources', price:'$115/$145/$125 promo/$155 promo/$325/$535 monthly; reset $78; try code dutrading and confirm final checkout price', target:'$1k / $1.5k / $3k / $6k / $9k / $15k', drawdown:'Option 1 intraday trailing/no scaling; Option 2 EOD with scaling + DLL', daily:'EOD option DLL: $400/$500/$1.1k/$2.2k/$3.3k/$4.5k', payout:'First $10k 100%; then 90%; Master payouts weekly after 10 trading days; 40% consistency', risk:'High', officialUrl:'https://bulenox.com/', lastVerified:'2026-05-31', verification:'official', affiliateUrl:'https://bulenox.com/member/aff/go/dutrading', couponCode:'dutrading', fit:'Best for deal seekers who want low displayed subscription prices and are willing to read the two drawdown options, activation fees, and Master payout rules carefully.'},
  {id:'earn2trade', name:'Earn2Trade', category:'Legacy structured evaluation + live-account path', best:'Purchase and product-page rules summarized from official sources', price:'TCP $150/$190/$350 mo; Gauntlet Mini $170/$315/$375/$550 mo; promo banner says 60% off', target:'TCP $1.75k/$3k/$6k; Gauntlet $3k/$6k/$9k/$11k', drawdown:'Evaluation/LiveSim EOD drawdown; Live account trailing drawdown; TCP can scale to $400K path', daily:'$550/$1.1k/$2.2k/$3.3k/$4.4k depending size', payout:'80% profit split; weekly withdrawals from $100+; $139 activation deducted from first successful withdrawal', risk:'Medium', officialUrl:'https://www.earn2trade.com/', lastVerified:'2026-05-31', verification:'official', affiliateUrl:'', couponCode:'', fit:'Best as a legacy structured route for traders who value fixed progression, real/live-account optionality, education resources, and a clear 10-day minimum evaluation.'},
  {id:'takeprofittrader', name:'TakeProfitTrader', category:'Brief reference only', best:'Brief reference; kept for rule comparison only', price:'See official site', target:'50K target listed at $3,000; confirm other sizes on the official site', drawdown:'Test EOD; PRO intraday; PRO+ EOD', daily:'Rules vary by stage; verify official help center', payout:'Brief reference only; verify payout rules on official site', risk:'Medium-High', officialUrl:'https://takeprofittrader.com/', lastVerified:'2026-05-31', verification:'official', affiliateUrl:'', couponCode:'', fit:'Brief reference only. TakeProfitTrader is kept at the bottom for comparison context and is not a current recommendation.'}
];

const pages = {
  home: renderHome,
  compare: renderCompare,
  checklist: renderChecklist,
  calculators: renderCalculators,
  firms: renderFirms,
  disclaimers: renderDisclaimers,
  privacy: renderPrivacy,
  terms: renderTerms,
  'best-nq-prop-firms': renderBestNqArticle
};

function money(n){
  if(!Number.isFinite(n)) return '$0';
  const abs = Math.abs(n);
  return `${n < 0 ? '-' : ''}$${abs.toLocaleString(undefined,{maximumFractionDigits:0})}`;
}
function num(id){ return parseFloat(document.getElementById(id)?.value || 0); }
function riskClass(score){ return score >= 84 ? 'green' : score >= 78 ? 'amber' : ''; }
function verificationClass(f){ return f.verification === 'official' ? 'green' : f.verification === 'research-snapshot' ? 'amber' : ''; }
function verificationLabel(f){ return f.verification === 'official' ? `Official sources reviewed ${f.lastVerified}` : f.verification === 'research-snapshot' ? `Official-source snapshot updated ${f.lastVerified}` : 'Needs official-source review'; }
function isRecommended(f){ return ['phidias','lucidtraderfunding','bulenox'].includes(f.id); }
function recommendationBadge(f){ return isRecommended(f) ? '<span class="pill green">Recommended</span>' : ''; }
function affiliatePrimaryLabel(f){ return f.affiliateUrl ? 'Check partner offer' : (f.id === 'takeprofittrader' ? 'Official site only' : 'Visit official site'); }
function affiliateHref(f){ return f.affiliateUrl || f.officialUrl; }
function couponText(f){ return f.couponCode ? `<span class="pill amber">Code to try: ${f.couponCode}</span>` : '<span class="pill">No public code listed</span>'; }
function affiliateActions(f, details=true){
  const rel=f.affiliateUrl ? 'sponsored noreferrer' : 'noreferrer';
  const source=f.affiliateUrl ? 'affiliate' : 'official-fallback';
  const detailsBtn=details ? `<a class="btn small" href="#firms/${f.id}">Compare rules</a>` : '';
  return `<div class="affiliate-actions"><a class="btn primary small outbound" href="${affiliateHref(f)}" target="_blank" rel="${rel}" data-outbound-firm="${f.id}" data-outbound-source="${source}">${affiliatePrimaryLabel(f)}</a>${detailsBtn}</div>`;
}
function affiliateCard(f){
  if(isRecommended(f)){
    return `<div class="article-card affiliate-card"><h2>Recommended partner offer</h2><p>${recommendationBadge(f)} ${couponText(f)}</p><p>${f.name} has a partner offer listed here. Confirm the final checkout price, offer terms, and current rules before buying.</p>${affiliateActions(f,false)}</div>`;
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
    flexible:'tradeify'
  };
  return firms.find(f=>f.id===(map[goal]||'lucidtraderfunding')) || firms[0];
}
function trackEvent(name,payload={}){
  const cleanPayload={...payload};
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push({event:name,...cleanPayload});
  if(GA_MEASUREMENT_ID && window.gtag){
    if(name === 'route_view'){
      window.gtag('event', 'page_view', { page_title: document.title, page_location: window.location.href, page_path: window.location.pathname + window.location.hash });
    }
    window.gtag('event', name, cleanPayload);
  }
  if(CLARITY_PROJECT_ID && window.clarity){
    window.clarity('event', name);
  }
  try{ vercelTrack(name, cleanPayload); }catch(err){ console.warn('[analytics unavailable]', name, err); }
  console.info('[analytics]', name, cleanPayload);
}

function layout(content){
  document.querySelector('#app').innerHTML = `
    <header class="nav">
      <div class="wrap nav-inner">
        <a class="brand" href="#home" aria-label="Futures Prop Edge home"><span class="brand-mark"></span><span>Futures Prop Edge</span></a>
        <nav class="nav-links" aria-label="Primary">
          <a href="#compare">Compare Firms</a><a href="#checklist">Checklist</a><a href="#calculators">Calculators</a><a href="#firms">Firm Guides</a><a href="#disclaimers">Disclosures</a>
        </nav>
        <div class="nav-cta"><a class="btn" href="#checklist">Free checklist</a><a class="btn primary" href="#compare">Compare firms</a><button class="btn mobile-menu" id="menuBtn" aria-controls="mobileNav" aria-expanded="false">Menu</button></div>
      </div>
      <div class="wrap mobile-nav-drawer" id="mobileNav" hidden><a href="#compare">Compare firms</a><a href="#checklist">Checklist</a><a href="#calculators">Calculators</a><a href="#firms">Firm guides</a><a href="#disclaimers">Disclosures</a></div>
    </header>
    <main>${content}</main>
    <div class="sticky-tools"><a class="btn small" href="#calculators">Calculator</a><button class="btn small" id="copyLink">Copy link</button></div>
    <div class="tooltip-pop" id="tooltipPop" role="tooltip"></div>
    <div class="toast" id="toast">Link copied</div>
      <footer class="footer"><div class="wrap footer-grid"><div><div class="brand"><span class="brand-mark"></span><span>Futures Prop Edge</span></div><p class="disclaimer">Built for futures traders comparing funded account rules. We focus on NQ/MNQ risk, drawdown mechanics, and practical rule clarity.</p></div><div><b>Tools</b><p class="disclaimer"><a href="#compare">Comparison table</a><br><a href="#checklist">NQ checklist</a><br><a href="#calculators">Drawdown calculator</a><br><a href="/best-nq-prop-firms.html">Best NQ prop firms</a></p></div><div><b>Important</b><p class="disclaimer">Educational only. Not financial advice. Prop firm rules change; always verify on official websites before buying.<br><a href="#disclaimers">Disclosures</a> | <a href="#privacy">Privacy</a> | <a href="#terms">Terms</a></p></div></div></footer>
  `;
  bindGlobal();
}

function renderHome(){
  return `
  <section class="hero"><div class="wrap hero-grid">
    <div>
      <div class="eyebrow"><span class="dot"></span>Built for NQ / MNQ funded futures traders</div>
      <h1>Choose the right prop firm before the <span class="grad">drawdown trap</span> gets you.</h1>
      <p class="lead">Compare funded futures accounts, calculate trailing drawdown risk, size NQ trades correctly, and find partner links without digging through scattered rule pages.</p>
      <div class="hero-actions"><a class="btn primary" href="#calculators">Start with risk calculator</a><a class="btn" href="#compare">Compare firms</a><a class="btn" href="#checklist">Get checklist</a></div>
      <div class="mini-proof"><span><b>8</b> starter firms</span><span><b>3</b> calculators</span><span><b>NQ-first</b> examples</span><span><b>Partner offers</b> clearly labeled</span></div>
    </div>
    <div class="nq-chart-card upgraded" aria-label="Animated NQ futures trading dashboard preview">
      <div class="chart-top pro">
        <div><span class="ticker">NQ</span><strong>Nasdaq futures risk cockpit</strong><small>Simulated visual · rule/risk focused</small></div>
        <span class="live-pill"><i></i> Market replay</span>
      </div>
      <div class="chart-stage pro-stage">
        <div class="chart-hud top-left"><span>Account buffer</span><b>$1,900</b><em>above drawdown</em></div>
        <div class="chart-hud top-right"><span>Position risk</span><b>$500</b><em>2 NQ · 12.5 pts</em></div>
        <svg class="nq-chart pro-chart" viewBox="0 0 720 430" role="img" aria-label="Animated NQ trading dashboard with price, liquidity, risk zones, and drawdown floor">
          <defs>
            <linearGradient id="proFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#10b981" stop-opacity=".45"/><stop offset="42%" stop-color="#38bdf8" stop-opacity=".15"/><stop offset="100%" stop-color="#050608" stop-opacity="0"/></linearGradient>
            <linearGradient id="proStroke" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#38bdf8"/><stop offset=".42" stop-color="#a78bfa"/><stop offset=".72" stop-color="#f59e0b"/><stop offset="1" stop-color="#10b981"/></linearGradient>
            <radialGradient id="hotDot"><stop offset="0" stop-color="#fff"/><stop offset=".42" stop-color="#7ee7c7"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></radialGradient>
            <filter id="proGlow"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <clipPath id="chartClip"><rect x="44" y="40" width="560" height="308" rx="16"/></clipPath>
          </defs>
          <rect x="24" y="22" width="672" height="374" rx="26" class="screen-bg"/>
          <g class="depth-bars left-depth">
            <rect x="628" y="70" width="38" height="10"/><rect x="628" y="92" width="58" height="10"/><rect x="628" y="114" width="31" height="10"/><rect x="628" y="136" width="68" height="10"/><rect x="628" y="158" width="45" height="10"/>
          </g>
          <g class="depth-bars sell-depth">
            <rect x="628" y="214" width="52" height="10"/><rect x="628" y="236" width="34" height="10"/><rect x="628" y="258" width="72" height="10"/><rect x="628" y="280" width="46" height="10"/><rect x="628" y="302" width="60" height="10"/>
          </g>
          <text x="628" y="54" class="micro-label good">BUY DEPTH</text>
          <text x="628" y="198" class="micro-label danger">SELL DEPTH</text>
          <g clip-path="url(#chartClip)">
            <rect x="44" y="40" width="560" height="308" class="chart-pane"/>
            <path class="grid-lines pro-grid" d="M44 82H604 M44 124H604 M44 166H604 M44 208H604 M44 250H604 M44 292H604 M96 40V348 M168 40V348 M240 40V348 M312 40V348 M384 40V348 M456 40V348 M528 40V348"/>
            <path class="drawdown-zone pro-danger" d="M44 273 H604 V348 H44 Z"/>
            <path class="target-zone pro-target" d="M44 40 H604 V88 H44 Z"/>
            <path class="risk-channel" d="M64 255 C128 216 162 186 218 176 C282 164 315 118 368 132 C430 148 476 96 536 82"/>
            <path class="price-fill pro-fill" d="M44 272 C76 250 99 222 132 226 C164 230 178 177 214 186 C250 194 270 132 314 144 C350 156 371 196 410 154 C454 106 486 116 522 82 C554 52 575 94 604 70 V348 H44 Z"/>
            <g class="candle-pack">
              <path d="M92 247V204"/><rect x="82" y="216" width="20" height="22" rx="4"/>
              <path d="M146 230V182"/><rect x="136" y="194" width="20" height="27" rx="4"/>
              <path d="M200 206V166"/><rect x="190" y="176" width="20" height="22" rx="4"/>
              <path d="M254 188V132"/><rect x="244" y="144" width="20" height="35" rx="4"/>
              <path d="M308 167V112"/><rect x="298" y="124" width="20" height="31" rx="4"/>
              <path d="M362 174V126"/><rect x="352" y="136" width="20" height="28" rx="4"/>
              <path d="M416 156V104"/><rect x="406" y="116" width="20" height="30" rx="4"/>
              <path d="M470 126V82"/><rect x="460" y="92" width="20" height="24" rx="4"/>
              <path d="M524 106V58"/><rect x="514" y="70" width="20" height="26" rx="4"/>
            </g>
            <path class="price-line glow pro-glow" d="M44 272 C76 250 99 222 132 226 C164 230 178 177 214 186 C250 194 270 132 314 144 C350 156 371 196 410 154 C454 106 486 116 522 82 C554 52 575 94 604 70"/>
            <path class="price-line main pro-main" d="M44 272 C76 250 99 222 132 226 C164 230 178 177 214 186 C250 194 270 132 314 144 C350 156 371 196 410 154 C454 106 486 116 522 82 C554 52 575 94 604 70"/>
            <line class="stop-line pro-stop" x1="44" y1="226" x2="604" y2="226"/>
            <line class="scan-line" x1="128" y1="40" x2="128" y2="348"/>
            <circle class="price-dot pro-dot" r="7" cx="604" cy="70"/>
            <circle class="pulse-dot pro-pulse" r="12" cx="604" cy="70"/>
          </g>
          <text x="58" y="69" class="chart-label good">payout zone</text>
          <text x="58" y="302" class="chart-label danger">drawdown floor</text>
          <text x="456" y="218" class="chart-label amber">planned stop</text>
          <g class="price-tape">
            <rect x="502" y="42" width="102" height="34" rx="10"/>
            <text x="514" y="64">21,436.25</text>
          </g>
        </svg>
      </div>
      <div class="market-tape" aria-label="Market context tape for S&P 500, Nasdaq 100, gold, and crude oil">
        <div class="market-tape-head"><span>Market context</span><b>S&P / Nasdaq / gold / crude</b></div>
        <div class="market-tape-widget" id="marketTapeWidget">
          <tv-ticker-tape symbols="FOREXCOM:SPXUSD,FOREXCOM:NSXUSD,CMCMARKETS:GOLD,TVC:USOIL"></tv-ticker-tape>
          <div class="market-tape-loading">Loading market tape...</div>
        </div>
        <p>TradingView context tape only. It is not an executable futures quote feed; use your trading platform for ES, NQ, GC, and CL execution.</p>
      </div>
      <div class="chart-metrics pro-metrics">
        <div><span>Drawdown mode</span><b>EOD</b></div><div><span>Safe size</span><b>MNQ first</b></div><div><span>Rule focus</span><b>Consistency</b></div><div><span>Status</span><b class="green-text">Trade room</b></div>
      </div>
    </div>  </div></section>
  ${startPathSection()}
  <section class="section"><div class="wrap"><div class="section-head"><div><h2>Partner offers to check before you buy.</h2><p class="subhead">Use these after you have checked rule fit. Open the partner offer directly, try the code, and confirm the final checkout price before purchasing.</p></div><a class="btn" href="#firms">Read firm guides</a></div>${partnerOfferBanners()}</div></section>
  ${comparisonSection(false)}
  ${leadMagnetSection()}
  ${calculatorSection()}
  <section class="section"><div class="wrap cta-band"><div><div class="eyebrow"><span class="dot"></span>Built for futures traders</div><h2>Compare rules before you buy an account.</h2><p class="subhead">Use the finder, firm guides, and calculators to check drawdown, payout, daily-loss, and risk rules before choosing a funded futures account.</p></div><a class="btn primary" href="#disclaimers">Review disclosures</a></div></section>`;
}


function startPathSection(){
  const steps = [
    { href:'#calculators', label:'1', title:'Check account risk', text:'Convert NQ/MNQ stop size into dollars before choosing an account.' },
    { href:'#compare', label:'2', title:'Compare rule fit', text:'Filter by drawdown, payout path, activation fees, and NQ-friendly rules.' },
    { href:'#checklist', label:'3', title:'Use the checklist', text:'Download the pre-check before you click a partner offer or buy a challenge.' }
  ];
  return `<section class="start-path wrap" aria-label="Suggested first steps">${steps.map(step=>`<a href="${step.href}"><span>${step.label}</span><div><b>${step.title}</b><em>${step.text}</em></div></a>`).join('')}</section>`;
}

function partnerOfferBanners(){
  const offers = [
    { id:'phidias', headline:'Phidias Propfirm', kicker:'Static E2L + swing-friendly Premium', note:'Code to try: DUTRADING' },
    { id:'lucidtraderfunding', headline:'Lucid Trading', kicker:'EOD drawdown + direct-funded path', note:'Code to try: dutrading' },
    { id:'bulenox', headline:'Bulenox', kicker:'Budget accounts + EOD/trailing choice', note:'Code to try: dutrading' }
  ];
  return `<div class="promo-grid">${offers.map(offer=>{
    const firm = firms.find(f=>f.id === offer.id);
    return `<a class="promo-banner promo-${offer.id}" href="${affiliateHref(firm)}" target="_blank" rel="sponsored noreferrer" aria-label="${offer.headline} partner offer opens in a new tab" data-outbound-firm="${firm.id}" data-outbound-source="partner-banner"><span class="pill green">Partner offer</span><h3>${offer.headline}</h3><p>${offer.kicker}</p><div class="promo-banner-bottom"><span>${offer.note}</span><b>Confirm final checkout price</b></div></a>`;
  }).join('')}</div>`;
}

function leadMagnetSection(){
  return `<section class="section lead-magnet" id="checklist"><div class="wrap lead-grid"><div class="lead-copy"><span class="eyebrow"><span class="dot"></span>Free NQ prop firm checklist</span><h2>Before you buy another challenge, run through the drawdown traps first.</h2><p class="subhead">Download a practical checklist for NQ/MNQ traders: EOD vs intraday drawdown, daily loss limits, consistency rules, payout buffers, activation fees, and account-size risk.</p><div class="checklist-preview"><div><b>1</b><span>Confirm the drawdown type before comparing prices.</span></div><div><b>2</b><span>Calculate NQ/MNQ stop risk against daily loss and cushion.</span></div><div><b>3</b><span>Check payout rules, consistency %, activation fees, and reset costs.</span></div><div><b>4</b><span>Use partner offers only after rechecking live checkout terms.</span></div></div></div><form class="lead-form" id="leadForm"><h3>Unlock the printable checklist</h3><p>Enter your email to join Futures Prop Edge and unlock the NQ Prop Firm Risk Checklist instantly. You can unsubscribe anytime.</p><label>Email address</label><input id="leadEmail" name="email" type="email" autocomplete="email" placeholder="you@example.com" required><label>Trading focus</label><select id="leadFocus" name="focus"><option value="NQ/MNQ prop firm challenges">NQ/MNQ prop firm challenges</option><option value="EOD drawdown accounts">EOD drawdown accounts</option><option value="Partner offers / firm comparison">Partner offers / firm comparison</option><option value="Risk sizing calculators">Risk sizing calculators</option></select><button class="btn primary" type="submit">Join list + unlock checklist</button><p class="lead-status" id="leadStatus">Instant checklist access plus occasional rule and promo updates. No spam; unsubscribe anytime. Educational only, not financial advice.</p><div class="download-card" id="checklistDownload" hidden><b>Checklist unlocked.</b><span>Open the printable checklist guide and keep comparing firms on the site.</span><a class="btn small" id="openChecklist" href="/nq-prop-firm-risk-checklist.html" target="_blank" rel="noopener">Open printable checklist</a></div></form></div></section>`;
}
function comparisonSection(full=true){
  const rows = firms.map(f=>`<tr data-firm-row data-tags="${firmTraits(f).join(' ').toLowerCase()}"><td><strong>${f.name}</strong><br><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span>${recommendationBadge(f)}</td><td><strong>${f.category}</strong><br><span class="muted-small">${f.best}</span></td><td>${f.price}</td><td>${f.drawdown}</td><td>${f.daily}</td><td>${affiliateActions(f,true)}</td></tr>`).join('');
  const cards = firms.map(f=>`<article class="finder-card" data-firm-card data-firm-name="${f.name.toLowerCase()}" data-filter-match="all ${['recommended','eod','static','fast','noactivation'].filter(x=>firmMatches(f,x)).join(' ')}"><div class="finder-card-top"><div><h3>${f.name}</h3><p>${f.fit}</p></div>${recommendationBadge(f)}</div><div class="finder-tags">${firmTraits(f).map(t=>`<span>${t}</span>`).join('')}</div><div class="finder-stats"><div><small>Drawdown</small><b>${f.drawdown}</b></div><div><small>Payout</small><b>${f.payout}</b></div><div><small>Cost note</small><b>${f.price}</b></div></div><div class="finder-actions">${affiliateActions(f,true)}</div></article>`).join('');
  return `<section class="section" id="compare"><div class="wrap"><div class="section-head"><div><h2>Find and compare futures prop firms.</h2><p class="subhead">Use the finder to narrow accounts by what matters: recommended partners, EOD/static drawdown, fast payout paths, activation fees, and NQ-friendly risk rules.</p></div>${full?'<a class="btn" href="#calculators">Check risk</a>':''}</div><div class="finder-panel"><div class="finder-copy"><span class="eyebrow"><span class="dot"></span>Prop firm finder</span><h3>Pick your priority. Get a practical starting point.</h3><p>Not every trader needs the same firm. Choose your main goal and the finder highlights the closest match from the firms covered in this guide.</p><select id="finderGoal"><option value="fast">Fast payout / live-capital path</option><option value="cheapest">Lowest displayed starting cost</option><option value="eod">EOD drawdown preferred</option><option value="static">Static drawdown / no trailing</option><option value="structured">Structured legacy evaluation</option><option value="flexible">Flexible payout-policy choice</option></select></div><div class="finder-result" id="finderResult"></div></div><div class="compare-toolbar"><div class="filter-buttons" role="group" aria-label="Compare filters"><button class="filter-chip active" data-filter="all">All firms</button><button class="filter-chip" data-filter="recommended">Recommended</button><button class="filter-chip" data-filter="eod">EOD drawdown</button><button class="filter-chip" data-filter="static">Static</button><button class="filter-chip" data-filter="fast">Fast payout</button><button class="filter-chip" data-filter="noactivation">No activation fee</button></div><input id="firmSearch" class="firm-search" type="search" placeholder="Search firm, drawdown, payout..."></div><div class="finder-grid">${cards}</div><details class="table-details" ${full?'open':''}><summary>Open full comparison table</summary><div class="table-wrap"><table><thead><tr><th>Firm</th><th>Category</th><th>Price</th><th>Drawdown</th><th>Daily loss</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></details></div></section>`;
}

function renderCompare(){ return comparisonSection(true); }
function renderChecklist(){ return `${leadMagnetSection()}${calculatorSection()}`; }

function calculatorSection(){
  return `<section class="section" id="calculators"><div class="wrap"><div class="section-head"><div><h2>Free calculators for prop firm risk.</h2><p class="subhead">Pressure-test drawdown, consistency rules, futures stop risk, and challenge pace before choosing an account.</p></div></div><div class="calc-grid"><div class="tabs"><button class="tab active" data-calc="drawdown"><b>Trailing drawdown + consistency</b><br>Calculate liquidation cushion and 30/40/50% consistency rules.</button><button class="tab" data-calc="nq"><b>Futures risk</b><br>NQ, MNQ, ES, GC, and CL stop-risk calculator.</button><button class="tab" data-calc="planner"><b>Challenge pass planner</b><br>Estimate daily target and risk pace.</button></div><div class="calculator" id="calcPanel"></div></div></div></section>`;
}
function renderCalculators(){ return calculatorSection(); }

function drawdownCalc(){const d=DEFAULT_CALCULATORS.drawdown;return `<h3>Trailing drawdown + consistency simulator</h3><p class="disclaimer">Enter the account state and the firm's consistency percentage. Many prop firms require your biggest winning day to be no more than 30%, 40%, or 50% of total profit before payout.</p><div class="form-grid"><div><label>Starting balance</label><input id="startBal" type="number" value="${d.startBal}"></div><div><label>Current balance</label><input id="currentBal" type="number" value="${d.currentBal}"></div><div><label>High-water mark <button class="help-dot" type="button" data-help="High-water mark is the highest balance or equity your account has reached so far. For Apex-style EOD drawdown, use the highest end-of-day closing balance, not the highest intraday unrealized spike. Example: if the EOD high-water mark is $52,400 and the trail is $2,500, the liquidation level is $49,900." aria-label="What is high-water mark?">?</button></label><input id="highBal" type="number" value="${d.highBal}"></div><div><label>Drawdown amount</label><input id="ddAmount" type="number" value="${d.ddAmount}"></div><div><label>Drawdown type</label><select id="ddType"><option value="trailing">Intraday trailing</option><option value="eod">EOD trailing (Apex-style)</option><option value="static">Static from start</option></select></div><div><label>Consistency rule %</label><input id="consistencyPct" type="number" value="${d.consistencyPct}" min="1" max="100" step="1"></div><div><label>Total profit so far</label><input id="totalProfit" type="number" value="${d.totalProfit}"></div><div><label>Best winning day</label><input id="bestDay" type="number" value="${d.bestDay}"></div></div><div class="calc-actions"><button class="btn small" type="button" data-reset-calc="drawdown">Reset calculator</button></div><div class="result-box" id="ddResults"></div><div class="note" id="ddNote"></div>`}
function nqCalc(){const d=DEFAULT_CALCULATORS.nq;return `<h3>Futures position risk calculator</h3><p class="disclaimer">Choose the futures contract and enter your stop size. Point values used: NQ $20, MNQ $2, ES $50, GC $100, and CL $1,000 per point per contract.</p><div class="form-grid"><div><label>Market</label><select id="market"><option value="20" data-symbol="NQ" data-step="0.25">NQ - Nasdaq 100</option><option value="2" data-symbol="MNQ" data-step="0.25">MNQ - Micro Nasdaq</option><option value="50" data-symbol="ES" data-step="0.25">ES - S&P 500</option><option value="100" data-symbol="GC" data-step="0.1">GC - Gold</option><option value="1000" data-symbol="CL" data-step="0.01">CL - Crude Oil</option></select></div><div><label>Contracts</label><input id="contracts" type="number" value="${d.contracts}"></div><div><label>Stop size in points</label><input id="stopPts" type="number" value="${d.stopPts}" step="0.25"></div><div><label>Daily loss limit</label><input id="dailyLoss" type="number" value="${d.dailyLoss}"></div><div><label>Drawdown cushion</label><input id="cushion" type="number" value="${d.cushion}"></div><div><label>Profit target</label><input id="target" type="number" value="${d.target}"></div></div><div class="calc-actions"><button class="btn small" type="button" data-reset-calc="nq">Reset calculator</button></div><div class="result-box" id="nqResults"></div><div class="note" id="nqNote"></div>`}
function plannerCalc(){const d=DEFAULT_CALCULATORS.planner;return `<h3>Challenge pass planner</h3><p class="disclaimer">Plan a conservative pace instead of trying to pass in one overleveraged day.</p><div class="form-grid"><div><label>Profit target</label><input id="profitTarget" type="number" value="${d.profitTarget}"></div><div><label>Days to pass</label><input id="days" type="number" value="${d.days}"></div><div><label>Max daily loss</label><input id="maxDailyLoss" type="number" value="${d.maxDailyLoss}"></div><div><label>Risk per trade</label><input id="riskTrade" type="number" value="${d.riskTrade}"></div></div><div class="calc-actions"><button class="btn small" type="button" data-reset-calc="planner">Reset calculator</button></div><div class="result-box" id="planResults"></div><div class="note" id="planNote"></div>`}

function setCalc(which='drawdown'){
  const panel=document.getElementById('calcPanel'); if(!panel) return;
  panel.innerHTML = which==='nq'?nqCalc():which==='planner'?plannerCalc():drawdownCalc();
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.calc===which));
  panel.querySelectorAll('input,select').forEach(el=>el.addEventListener('input',()=>updateCalc(which)));
  panel.querySelector('[data-reset-calc]')?.addEventListener('click',()=>resetCalc(which));
  bindHelpDots();
  updateCalc(which);
}
function resetCalc(which){
  const defaults=DEFAULT_CALCULATORS[which] || {};
  Object.entries(defaults).forEach(([id,value])=>{const el=document.getElementById(id); if(el) el.value=value;});
  updateCalc(which);
  trackEvent('calculator_reset',{calculator:which,path:location.hash||'#calculators'});
}
function updateCalc(which){
  if(which==='drawdown'){
    const start=num('startBal'), current=num('currentBal'), high=num('highBal'), dd=num('ddAmount'), type=document.getElementById('ddType').value;
    const {threshold,cushion,used,maxBestDayAllowed,currentBestDayPct,extraProfitNeeded,consistencyPass,consistencyPct}=calculateDrawdownState({
      startBal:start,
      currentBal:current,
      highBal:high,
      ddAmount:dd,
      ddType:type,
      consistencyPct:num('consistencyPct'),
      totalProfit:num('totalProfit'),
      bestDay:num('bestDay'),
    });
    document.getElementById('ddResults').innerHTML=`<div class="metric"><span>Liquidation threshold</span><strong>${money(threshold)}</strong></div><div class="metric"><span>Remaining cushion</span><strong>${money(cushion)}</strong></div><div class="metric"><span>Drawdown used</span><strong>${used.toFixed(0)}%</strong></div><div class="metric"><span>Best day allowed</span><strong>${money(maxBestDayAllowed)}</strong></div><div class="metric"><span>Current best day %</span><strong>${currentBestDayPct.toFixed(0)}%</strong></div><div class="metric"><span>Profit needed to pass</span><strong>${money(extraProfitNeeded)}</strong></div>`;
    const typeMsg = type==='eod' ? 'Apex-style EOD mode: use the highest closing balance; intraday unrealized spikes should not move the threshold.' : type==='trailing' ? 'Intraday trailing mode: high-water mark may move with unrealized intraday profits, depending on firm rules.' : 'Static mode: threshold stays fixed from starting balance.';
    const drawdownMsg = cushion <= 0 ? 'This account would be at or below the failure threshold.' : cushion < dd*.25 ? 'Danger zone: one normal NQ loss could put this account near failure.' : 'Drawdown cushion looks workable.';
    const consistencyMsg = consistencyPass ? `Consistency passes: best day is under the ${consistencyPct}% limit.` : `Consistency fails: your best day is too large. Add about ${money(extraProfitNeeded)} more profit without increasing the best day, or wait until the rule is satisfied.`;
    document.getElementById('ddNote').textContent = `${typeMsg} ${drawdownMsg} ${consistencyMsg}`;
  }
  if(which==='nq'){
    const market=document.getElementById('market');
    const selected=market.selectedOptions[0];
    const symbol=selected?.dataset.symbol || market.options[market.selectedIndex]?.text || 'Market';
    const pointValue=num('market');
    const contracts=num('contracts');
    const stopPts=num('stopPts');
    const {risk,pctDaily,pctCushion,pctTarget}=calculateFuturesRisk({
      pointValue,
      contracts,
      stopPts,
      dailyLoss:num('dailyLoss'),
      cushion:num('cushion'),
      target:num('target'),
    });
    const stopInput=document.getElementById('stopPts');
    if(stopInput && selected?.dataset.step) stopInput.step=selected.dataset.step;
    document.getElementById('nqResults').innerHTML=`<div class="metric"><span>${symbol} dollar risk</span><strong>${money(risk)}</strong></div><div class="metric"><span>Daily loss used</span><strong>${pctDaily.toFixed(0)}%</strong></div><div class="metric"><span>Cushion used</span><strong>${pctCushion.toFixed(0)}%</strong></div><div class="metric"><span>Target at risk</span><strong>${pctTarget.toFixed(0)}%</strong></div>`;
    document.getElementById('nqNote').textContent = pctDaily>50 || pctCushion>35 ? `Aggressive: ${contracts} ${symbol} contract(s) with a ${stopPts}-point stop can damage the account quickly.` : `Reasonable starting point for ${symbol} if the setup quality is strong and firm rules allow it.`;
  }
  if(which==='planner'){
    const daily=num('profitTarget')/Math.max(1,num('days')), lossesToFail=num('maxDailyLoss')/Math.max(1,num('riskTrade')), rr=daily/Math.max(1,num('riskTrade'));
    document.getElementById('planResults').innerHTML=`<div class="metric"><span>Daily target</span><strong>${money(daily)}</strong></div><div class="metric"><span>Trades to daily max loss</span><strong>${lossesToFail.toFixed(1)}</strong></div><div class="metric"><span>R needed / day</span><strong>${rr.toFixed(1)}R</strong></div>`;
    document.getElementById('planNote').textContent = rr>3 ? 'Very aggressive. Consider more days or lower daily expectations.' : 'More realistic pace. Avoid passing in one day if payout consistency rules matter.';
  }
}

function renderFirms(){
  const hash = location.hash.split('/')[1];
  if(hash){
    const f=firms.find(x=>x.id===hash) || firms[0];
    if(f.id==='apex') return renderApexArticle(f);
    if(f.id==='myfundedfutures') return renderMyFundedFuturesArticle(f);
    if(f.id==='phidias') return renderPhidiasArticle(f);
    if(f.id==='takeprofittrader') return renderTakeProfitTraderArticle(f);
    if(f.id==='tradeify') return renderTradeifyArticle(f);
    if(f.id==='bulenox') return renderBulenoxArticle(f);
    if(f.id==='lucidtraderfunding') return renderLucidArticle(f);
    if(f.id==='earn2trade') return renderEarn2TradeArticle(f);
    return `<article class="article wrap"><a class="btn" href="#firms">← All firms</a><h1>${f.name} for futures traders</h1><p class="lead">${f.fit}</p><div class="article-card verify-card"><h2>Source review</h2><p><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span></p><p>Official source: <a href="${f.officialUrl}" target="_blank" rel="noreferrer">${f.officialUrl}</a></p><p class="disclaimer">Use this firm page as a quick rule overview, then confirm current pricing, restrictions, and payout terms on the official website.</p></div><div class="article-card"><h2>Rules in plain English</h2><p>Before choosing ${f.name}, confirm current evaluation prices, profit targets, drawdown mechanics, payout rules, activation fees, reset fees, consistency rules, contract limits, and prohibited strategies on the official website.</p><ul><li>Category: ${f.category}</li><li>Typical risk level: ${f.risk}</li><li>Price: ${f.price}</li><li>Profit target: ${f.target}</li><li>Drawdown note: ${f.drawdown}</li><li>Daily loss: ${f.daily}</li><li>Payout note: ${f.payout}</li></ul></div><div class="article-card"><h2>How NQ traders usually fail</h2><p>The common failure pattern is oversizing NQ contracts while the trailing drawdown is still close to the current balance. Use MNQ until the cushion is large enough, then scale only after the account has room.</p><a class="btn primary" href="#calculators">Run calculator for this account</a></div></article>`;
  }
  return `<section class="section"><div class="wrap"><div class="section-head"><div><h2>Futures prop firm rule guides.</h2><p class="subhead">Use these firm guides to compare drawdown, payout, pricing, and account-fit details before choosing where to spend money.</p></div></div><div class="firm-grid">${firms.map(f=>`<a class="firm" href="#firms/${f.id}"><div class="firm-top"><div><h3>${f.name}</h3><p>${f.fit}</p></div><span class="status-dot ${verificationClass(f)}"></span></div><div class="firm-meta"><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span>${recommendationBadge(f)}<span class="pill">${f.category}</span></div></a>`).join('')}</div></div></section>`;
}


function renderPhidiasArticle(f){
  return `<article class="article wrap"><a class="btn" href="#firms">← All firms</a><h1>Phidias Propfirm: Phidias 2.0 rules for futures traders</h1><p class="lead">Phidias recently relaunched its program as Phidias 2.0: Express to Live static-drawdown accounts, Fundamental EOD accounts, and Premium swing-capable accounts with overnight/weekend holds and a progressive profit split.</p>
  <div class="article-card verify-card"><h2>Source review</h2><p><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span></p><p>Official sources: <a href="https://phidiaspropfirm.com/phidias-2-0" target="_blank" rel="noreferrer">Phidias 2.0 page</a>, <a href="https://phidiaspropfirm.com/accounts" target="_blank" rel="noreferrer">accounts</a>, <a href="https://phidiaspropfirm.com/rules" target="_blank" rel="noreferrer">rules</a>, and <a href="https://phidiaspropfirm.com/affiliate-program" target="_blank" rel="noreferrer">affiliate program</a>.</p><p class="disclaimer">Phidias rules and offers can change. Try code DUTRADING if you use the partner link, then confirm the final checkout price and current account rules before buying.</p></div>
  ${affiliateCard(f)}
  <div class="article-card"><h2>What changed in Phidias 2.0</h2><ul><li>Three main account families: Express to Live, Fundamental, and Premium.</li><li>New platform lineup: Tradovate, NinjaTrader, and TradingView execution were added alongside Rithmic and DeepCharts.</li><li>Express to Live is now the flagship fast path: static drawdown, 0 minimum trading days, no consistency rule, and first payout can convert the account toward LIVE.</li><li>Premium replaces the old swing-style path with overnight/weekend holding, 1-day evaluation minimum, 5-day funded payout cadence, progressive 75% to 100% profit split, and one Cash Account Reset option.</li><li>Phidias states $15M+ paid to traders, zero denied payouts, and 90% of payouts processed under 30 minutes; treat these as official marketing claims to verify over time.</li></ul></div>
  <div class="article-card"><h2>Express to Live account grid</h2><p class="disclaimer">E2L is the most interesting Phidias product for fast NQ traders because the drawdown is static and never trails.</p><div class="table-wrap"><table><thead><tr><th>Size</th><th>Profit target</th><th>Static drawdown</th><th>Bonus payout</th><th>LIVE credit</th><th>Max minis / micros</th></tr></thead><tbody><tr><td>25K E2L</td><td>$1,500</td><td>$500</td><td>$1,000</td><td>$500</td><td>2 / 20</td></tr><tr><td>50K E2L</td><td>$2,500</td><td>$650</td><td>$2,000</td><td>$1,000</td><td>5 / 50</td></tr><tr><td>100K E2L</td><td>$3,500</td><td>$800</td><td>$3,000</td><td>$1,500</td><td>7 / 70</td></tr><tr><td>150K E2L</td><td>$4,500</td><td>$1,000</td><td>$4,500</td><td>$2,000</td><td>9 / 90</td></tr></tbody></table></div><ul><li>Common E2L rules: static drawdown, 0 minimum trading days, no consistency rule, no daily loss limit, news trading authorized, and up to 5 E2L accounts per trader.</li><li>Overnight/weekend positions are not permitted on E2L.</li><li>Liquidation threshold equals initial capital minus static drawdown.</li></ul></div>
  <div class="article-card"><h2>Fundamental vs Premium</h2><div class="table-wrap"><table><thead><tr><th>Feature</th><th>Fundamental</th><th>Premium</th></tr></thead><tbody><tr><td>Sizes</td><td>50K / 100K / 150K</td><td>50K / 100K / 150K</td></tr><tr><td>Drawdown</td><td>EOD trailing</td><td>EOD trailing</td></tr><tr><td>Profit target</td><td>$4,000 / $6,000 / $9,000</td><td>$4,000 / $6,000 / $9,000</td></tr><tr><td>Evaluation minimum days</td><td>3</td><td>1</td></tr><tr><td>Funded payout cadence</td><td>10 qualifying days between payouts</td><td>5 qualifying days between payouts</td></tr><tr><td>Profit split</td><td>80% trader / 20% Phidias</td><td>75%, 80%, 85%, 90%, then 100% from payout 5 onward</td></tr><tr><td>Overnight/weekend</td><td>Not permitted</td><td>Authorized</td></tr><tr><td>Funded consistency</td><td>30% max per day</td><td>30% max per day</td></tr></tbody></table></div><p>Both Fundamental and Premium use EOD trailing drawdown. Phidias says the liquidation level is calculated at the end of the trading day and does not chase intraday unrealized profits, but the current liquidation price is still enforced if the balance reaches the limit.</p></div>
  <div class="article-card"><h2>Fundamental/Premium size rules</h2><div class="table-wrap"><table><thead><tr><th>Size</th><th>EOD drawdown</th><th>Target</th><th>Max minis / micros</th><th>Activation fee</th><th>Payout cap</th><th>Withdrawal threshold</th></tr></thead><tbody><tr><td>50K</td><td>$2,500</td><td>$4,000</td><td>10 / 100</td><td>$149</td><td>$2,000</td><td>$52,600</td></tr><tr><td>100K</td><td>$3,000</td><td>$6,000</td><td>14 / 140</td><td>$149</td><td>$2,500</td><td>$103,700</td></tr><tr><td>150K</td><td>$4,500</td><td>$9,000</td><td>17 / 170</td><td>$169</td><td>$2,750</td><td>$154,500</td></tr></tbody></table></div><p class="disclaimer">One-time payment accounts show no activation fee when switching to CASH. Monthly subscription accounts list the activation fees above. Premium also lists a one-time Cash Account Reset option: 50K $399, 100K $499, 150K $599.</p></div>
  <div class="article-card"><h2>Payouts, LIVE path, and trading freedom</h2><ul><li>Minimum withdrawal: $500.</li><li>Fundamental profit split: fixed 80% trader / 20% Phidias.</li><li>Premium split: 75% on payout 1, 80% on payout 2, 85% on payout 3, 90% on payout 4, and 100% from payout 5 onward.</li><li>Express to Live: after passing evaluation, the trader targets a funded CASH payout; the first payout can include bonus payout plus LIVE credit and convert toward a LIVE funded account.</li><li>Fundamental/Premium LIVE transition: discretionary risk-team review after 5 successful payouts or $100,000 cumulative profits across accounts; not guaranteed.</li><li>News trading is authorized on all account types.</li><li>Fundamental and E2L must close before end of day; Premium may hold overnight and over the weekend.</li><li>Phidias allows up to 15 funded accounts at the same time across account families, according to the official accounts FAQ.</li></ul></div>
  <div class="article-card"><h2>NQ trader take</h2><p>For an NQ/MNQ trader, Phidias is worth comparing because E2L removes two common prop-firm traps: intraday trailing drawdown and consistency/minimum-day friction. The tradeoff is tight static drawdown, especially on the 25K and 50K E2L accounts, so MNQ sizing still matters. Premium is the flexible path for swing traders because overnight/weekend holds are allowed, but the funded 30% consistency rule and EOD floor still need to be managed.</p><a class="btn primary" href="#calculators">Run NQ risk calculator</a></div>
  </article>`;
}

function renderTradeifyArticle(f){
  return `<article class="article wrap"><a class="btn" href="#firms">← All firms</a><h1>Tradeify: Growth, Select, and Lightning rules for NQ traders</h1><p class="lead">Tradeify's official homepage and help center show an EOD-drawdown futures funding model with no activation fees, a fast Growth path, a Select path with payout-policy choice, and a Lightning path that skips the evaluation.</p>
  <div class="article-card verify-card"><h2>Source review</h2><p><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span></p><p>Official source: <a href="${f.officialUrl}" target="_blank" rel="noreferrer">${f.officialUrl}</a></p><p class="disclaimer">Tradeify pricing and promo codes can change. Confirm current checkout pricing, discount terms, and funded-account rules before buying.</p></div>
  ${affiliateCard(f)}
  <div class="article-card"><h2>Tradeify account pricing</h2><p class="disclaimer">Tradeify has shown limited-time account discounts in the past. Treat the prices below as reference points and confirm the current promo, code, and final checkout price before buying.</p><div class="table-wrap"><table><thead><tr><th>Plan</th><th>25K</th><th>50K</th><th>100K</th><th>150K</th><th>Notes</th></tr></thead><tbody><tr><td><strong>Growth</strong></td><td>$59</td><td>$87</td><td>$153</td><td>$221</td><td>One-time evaluation purchase; funding in 1 day; no activation fee</td></tr><tr><td><strong>Select</strong></td><td>$65</td><td>$99</td><td>$159</td><td>$221</td><td>Evaluation purchase; funding in 3 days; choose Daily or Flex after passing</td></tr><tr><td><strong>Lightning</strong></td><td>$207</td><td>$295</td><td>$396</td><td>$478</td><td>No evaluation; simulated funded immediately</td></tr></tbody></table></div></div>
  <div class="article-card"><h2>Select evaluation rules</h2><div class="table-wrap"><table><thead><tr><th>Size</th><th>Target</th><th>Max drawdown</th><th>DLL</th><th>Consistency</th><th>Max contracts</th></tr></thead><tbody><tr><td>25K</td><td>$1,500</td><td>$1,000 EOD</td><td>None</td><td>40%</td><td>1 mini / 10 micros</td></tr><tr><td>50K</td><td>$3,000</td><td>$2,000 EOD</td><td>None</td><td>40%</td><td>4 mini / 40 micros</td></tr><tr><td>100K</td><td>$6,000</td><td>$3,000 EOD</td><td>None</td><td>40%</td><td>8 mini / 80 micros</td></tr><tr><td>150K</td><td>$9,000</td><td>$4,500 EOD</td><td>None</td><td>40%</td><td>12 mini / 120 micros</td></tr></tbody></table></div><ul><li>Select requires at least 3 trading days because no single day can be more than 40% of total profit.</li><li>Select has no daily loss limit during evaluation and no activation fee after passing.</li><li>After passing, the trader permanently chooses Select Flex or Select Daily for that funded account.</li></ul></div>
  <div class="article-card"><h2>Growth evaluation rules</h2><div class="table-wrap"><table><thead><tr><th>Size</th><th>Target</th><th>Daily loss limit</th><th>Max drawdown</th><th>Max contracts</th></tr></thead><tbody><tr><td>25K</td><td>$1,500</td><td>$600</td><td>$1,000 EOD</td><td>1 mini / 10 micros</td></tr><tr><td>50K</td><td>$3,000</td><td>$1,250</td><td>$2,000 EOD</td><td>4 mini / 40 micros</td></tr><tr><td>100K</td><td>$6,000</td><td>$2,500</td><td>$3,500 EOD</td><td>8 mini / 80 micros</td></tr><tr><td>150K</td><td>$9,000</td><td>$3,750</td><td>$5,000 EOD</td><td>12 mini / 120 micros</td></tr></tbody></table></div><ul><li>Growth can be passed in as little as 1 trading day because it has no evaluation consistency rule.</li><li>Growth has a soft-breach daily loss limit, an EOD trailing max drawdown, and no activation fee for the simulated funded account.</li><li>Growth funded payout requirements include 35% consistency, 5 profitable trading days, and a 90% trader split.</li></ul></div>
  <div class="article-card"><h2>Drawdown and daily loss rules</h2><ul><li>Tradeify's help center says all Growth, Select, and Lightning accounts use End-of-Day trailing max drawdown.</li><li>The max trailing drawdown only updates at end of day, but it is enforced in real time; touching the drawdown limit is a hard breach.</li><li>On simulated funded accounts, drawdown locks once profit exceeds the drawdown amount by $100; the floor locks at starting balance + $100.</li><li>Daily Loss Limit is a soft breach that pauses trading until the next session; it applies to Growth, Lightning, and Select Daily funded accounts. Select Flex accounts do not have a DLL.</li><li>Initial DLLs listed: Growth/Lightning $600/$1,250/$2,500/$3,000 for 25K/50K/100K/150K, with note that 25K Lightning has no DLL protection; Select Daily $500/$1,000/$1,250/$1,750.</li></ul></div>
  <div class="article-card"><h2>Select funded payout policies</h2><ul><li><b>Select Flex:</b> 90/10 split, payout every 5 winning days, no daily loss limit, no funded consistency rule, no minimum balance requirement; payout cap is up to 50% of total profits, capped at $1,250/$3,000/$4,000/$5,000.</li><li><b>Select Daily:</b> 90/10 split, daily eligibility, no funded consistency rule, has Daily Loss Limit and buffer system; buffers are $1,100/$2,100/$2,600/$3,600 and payout caps are $600/$1,000/$1,500/$2,500.</li><li>Both Select policies require positive net profit in the current payout cycle after the first payout.</li><li>Funded Select accounts use contract scaling: start at 1/2/3/3 minis for 25K/50K/100K/150K and scale up to 2/4/8/12 minis.</li></ul></div>
  <div class="article-card"><h2>Lightning rules</h2><ul><li>Lightning skips the evaluation and starts as a simulated funded account.</li><li>Current Lightning limits listed: EOD trailing max drawdown $1,000/$2,000/$4,000/$5,250 and max contracts 1/4/8/12 minis for 25K/50K/100K/150K.</li><li>The homepage shows Lightning funded consistency at 20%, with tooltip noting it moves to 25% for payout 2 and 30% for payout 3+.</li><li>The 25K Lightning help table shows no DLL protection; 50K/100K/150K show DLLs $1,250/$2,500/$3,000.</li></ul></div>
  <div class="article-card"><h2>Official Tradeify pages</h2><ul><li>https://tradeify.co/</li><li>https://help.tradeify.co/en/articles/12853921-select-evaluation-accounts</li><li>https://help.tradeify.co/en/articles/10495915-growth-evaluation-accounts</li><li>https://help.tradeify.co/en/articles/10495897-rules-trailing-max-drawdowns</li><li>https://help.tradeify.co/en/articles/10468321-rules-daily-loss-limit</li><li>https://help.tradeify.co/en/articles/12853966-select-flex-and-select-daily-payout-policies</li><li>https://help.tradeify.co/en/articles/11083796-growth-funded-account-payout-policy</li><li>https://help.tradeify.co/en/articles/10495938-lightning-funded-accounts</li></ul></div>
  <div class="article-card"><h2>Why this matters for NQ traders</h2><p>Tradeify's EOD drawdown gives NQ traders more room than intraday trailing, but it is still enforced in real time once the floor is set. Growth is fastest but includes DLL pressure and 35% funded consistency. Select is cleaner during evaluation and gives the best payout-policy choice after passing. Lightning is expensive but skips the evaluation, so NQ sizing must be conservative from the first trade.</p><a class="btn primary" href="#calculators">Run drawdown calculator</a></div></article>`;
}




function renderEarn2TradeArticle(f){
  return `<article class="article wrap"><a class="btn" href="#firms">← All firms</a><h1>Earn2Trade: Trader Career Path and Gauntlet Mini rules for futures traders</h1><p class="lead">Earn2Trade is a legacy futures evaluation firm with two main programs: Trader Career Path® for progression and The Gauntlet Mini™ for a direct target-size evaluation.</p>
  <div class="article-card verify-card"><h2>Source review</h2><p><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span></p><p>Official source: <a href="${f.officialUrl}" target="_blank" rel="noreferrer">${f.officialUrl}</a></p><p class="disclaimer">Earn2Trade frequently advertises limited-time discounts. Confirm the current monthly price, reset fee, activation terms, and withdrawal rules before buying.</p></div>
  ${affiliateCard(f)}
  <div class="article-card"><h2>Earn2Trade at a glance</h2><ul><li>Products covered: Trader Career Path® and The Gauntlet Mini™.</li><li>Minimum trading days: 10 days.</li><li>Rules shown on product pages: reach profit goal, maintain consistency, trade only during approved times, do not reach/dip below daily loss limit, do not reach/dip below EOD trailing drawdown, and follow progression ladder.</li><li>Supported platforms shown: Rithmic, NinjaTrader, Finamark, Tradovate, TradingView, and R Trader Pro.</li><li>Allowed instruments: futures products only on CME, COMEX, NYMEX, and CBOT.</li></ul></div>
  <div class="article-card"><h2>Trader Career Path® pricing and evaluation rules</h2><div class="table-wrap"><table><thead><tr><th>Plan</th><th>Price</th><th>Virtual capital</th><th>Profit goal</th><th>EOD drawdown</th><th>Daily loss</th><th>Max contracts</th><th>Reset</th></tr></thead><tbody><tr><td>TCP25</td><td>$150/mo</td><td>$25,000</td><td>$1,750</td><td>$1,500</td><td>$550</td><td>3</td><td>$100 shown</td></tr><tr><td>TCP50</td><td>$190/mo</td><td>$50,000</td><td>$3,000</td><td>$2,000</td><td>$1,100</td><td>6</td><td>$100 shown</td></tr><tr><td>TCP100</td><td>$350/mo</td><td>$100,000</td><td>$6,000</td><td>$3,500</td><td>$2,200</td><td>12</td><td>$100 fixed for TCP100</td></tr></tbody></table></div><ul><li>Each TCP subscription includes a free reset when rebilled.</li><li>TCP reset page text says TCP25/TCP50 reset pricing can be dynamic based on promotions and below the current new-subscription price.</li><li>No upfront activation fee; the one-time $139 activation fee is deducted only from first successful withdrawal.</li></ul></div>
  <div class="article-card"><h2>Trader Career Path® progression path</h2><p>Earn2Trade positions TCP as a step-up career path. The product progression is generally presented as:</p><div class="table-wrap"><table><thead><tr><th>Stage</th><th>Capital</th><th>Profit target</th><th>Drawdown</th><th>Daily loss</th><th>Max contracts</th></tr></thead><tbody><tr><td>Evaluation</td><td>$25K / $50K / $100K starting choice</td><td>Based on chosen plan</td><td>EOD</td><td>Based on chosen plan</td><td>3 / 6 / 12</td></tr><tr><td>LiveSim® or Live</td><td>Same as passed evaluation</td><td>Same as evaluation</td><td>LiveSim® EOD / Live trailing</td><td>Same as evaluation</td><td>Same as evaluation</td></tr><tr><td>Live upgrade</td><td>$50,000</td><td>$3,000</td><td>$2,000 trailing</td><td>$1,100</td><td>6</td></tr><tr><td>Live upgrade</td><td>$100,000</td><td>$6,000</td><td>$3,500 trailing</td><td>$2,200</td><td>12</td></tr><tr><td>Live upgrade</td><td>$200,000</td><td>$11,000</td><td>Drawdown fixed to $194,000</td><td>$4,400</td><td>16</td></tr></tbody></table></div><p class="disclaimer">Homepage copy says Trader Career Path can scale up to $400K with fixed drawdown, but the visible product progression table listed through the $200K stage and then says a custom offer may be made.</p></div>
  <div class="article-card"><h2>The Gauntlet Mini™ pricing and rules</h2><div class="table-wrap"><table><thead><tr><th>Plan</th><th>Price</th><th>Virtual capital</th><th>Profit goal</th><th>EOD drawdown</th><th>Daily loss</th><th>Max contracts</th><th>Reset</th></tr></thead><tbody><tr><td>GAU50</td><td>$170/mo</td><td>$50,000</td><td>$3,000</td><td>$2,000</td><td>$1,100</td><td>6</td><td>$100</td></tr><tr><td>GAU100</td><td>$315/mo</td><td>$100,000</td><td>$6,000</td><td>$3,500</td><td>$2,200</td><td>12</td><td>$100</td></tr><tr><td>GAU150</td><td>$375/mo</td><td>$150,000</td><td>$9,000</td><td>$4,500</td><td>$3,300</td><td>15</td><td>$130</td></tr><tr><td>GAU200</td><td>$550/mo</td><td>$200,000</td><td>$11,000</td><td>$6,000</td><td>$4,400</td><td>16</td><td>$155</td></tr></tbody></table></div><ul><li>Gauntlet Mini is described as a single-phase evaluation.</li><li>After passing, the funded account matches the selected evaluation size.</li><li>No upfront activation fee; free trading platforms and education library.</li></ul></div>
  <div class="article-card"><h2>Funded account, withdrawals, and fees</h2><ul><li>After passing, Earn2Trade says traders receive a certificate and can choose a LiveSim® or Live funded account with the same capital.</li><li>Profit split shown: 80%.</li><li>Homepage says withdrawals are weekly from $100+ with no additional performance target required to withdraw.</li><li>Activation fee: one-time $139 deducted only from the first successful withdrawal, not paid upfront.</li><li>Commissions vary by instrument and are provided upon account activation depending on Tradovate/Rithmic/provider/platform.</li></ul></div>
  <div class="article-card"><h2>NQ trader takeaways</h2><p>Earn2Trade is more structured than the newer “fast payout” firms. The 10-day minimum, daily loss limits, progression ladder, consistency rule, and EOD/trailing drawdown distinctions matter for NQ traders. Think of Earn2Trade as a legacy/structured alternative, not the cheapest or fastest route.</p><a class="btn primary" href="#calculators">Run NQ risk calculator</a></div></article>`;
}

function renderLucidArticle(f){
  return `<article class="article wrap"><a class="btn" href="#firms">← All firms</a><h1>Lucid Trading: Pro, Flex, Direct, and LucidLive path for futures traders</h1><p class="lead">Use LucidTrading.com for Lucid's current futures prop firm offer. Older LucidFunding.com references may point to a parked-domain page instead.</p>
  <div class="article-card verify-card"><h2>Source review</h2><p><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span></p><p>Official source: <a href="${f.officialUrl}" target="_blank" rel="noreferrer">${f.officialUrl}</a></p><p class="disclaimer">Lucid Trading prices, coupon codes, and live-capital terms can change. Confirm the final checkout price and current funded-account rules before buying.</p></div>
  ${affiliateCard(f)}
  <div class="article-card"><h2>Important domain note</h2><p>LucidTrading.com is the site used in this guide. Be careful with old references to “Lucid Trader Funding” or “LucidFunding.com,” because those may not point to the current Lucid Trading offer.</p></div>
  <div class="article-card"><h2>LucidPro evaluation pricing and rules</h2><div class="table-wrap"><table><thead><tr><th>Size</th><th>Price shown</th><th>Coupon price</th><th>Reset</th><th>Target</th><th>Max loss</th><th>DLL</th><th>Max size</th></tr></thead><tbody><tr><td>25K Pro</td><td>$135</td><td>$94.50</td><td>$90</td><td>$1,250</td><td>$1,000 EOD</td><td>None</td><td>2 mini / 20 micro</td></tr><tr><td>50K Pro</td><td>$185</td><td>$129.50</td><td>$120</td><td>$3,000</td><td>$2,000 EOD</td><td>$1,200</td><td>4 mini / 40 micro</td></tr><tr><td>100K Pro</td><td>$285</td><td>$199.50</td><td>$180</td><td>$6,000</td><td>$3,000 EOD</td><td>$1,800</td><td>6 mini / 60 micro</td></tr><tr><td>150K Pro</td><td>$370</td><td>$259.00</td><td>$245</td><td>$9,000</td><td>$4,500 EOD</td><td>$2,700</td><td>10 mini / 100 micro</td></tr></tbody></table></div><ul><li>Account activation fee: free.</li><li>Trader dashboard: realtime.</li><li>Homepage says Pro can pass in as little as one day.</li></ul></div>
  <div class="article-card"><h2>LucidFlex evaluation pricing and rules</h2><div class="table-wrap"><table><thead><tr><th>Size</th><th>Price shown</th><th>Coupon price</th><th>Reset</th><th>Target</th><th>Max loss</th><th>Consistency</th><th>Max size</th></tr></thead><tbody><tr><td>25K Flex</td><td>$100</td><td>$70.00</td><td>$60</td><td>$1,250</td><td>$1,000 EOD</td><td>50%</td><td>2 mini / 20 micro</td></tr><tr><td>50K Flex</td><td>$140</td><td>$98.00</td><td>$95</td><td>$3,000</td><td>$2,000 EOD</td><td>50%</td><td>4 mini / 40 micro</td></tr><tr><td>100K Flex</td><td>$225</td><td>$157.50</td><td>$140</td><td>$6,000</td><td>$3,000 EOD</td><td>50%</td><td>6 mini / 60 micro</td></tr><tr><td>150K Flex</td><td>$420</td><td>$294.00</td><td>$280</td><td>$9,000</td><td>$4,500 EOD</td><td>50%</td><td>10 mini / 100 micro</td></tr></tbody></table></div><ul><li>Flex shows no Daily Loss Limit.</li><li>Flex shows no consistency in funded.</li><li>Account activation fee: free.</li></ul></div>
  <div class="article-card"><h2>LucidDirect straight-to-funded pricing</h2><div class="table-wrap"><table><thead><tr><th>Size</th><th>Price shown</th><th>Coupon price</th><th>Max loss</th><th>DLL below trail</th><th>LucidScale DLL above trail</th><th>Consistency</th><th>Max size</th></tr></thead><tbody><tr><td>25K Direct</td><td>$340</td><td>$238.00</td><td>$1,000 EOD</td><td>—</td><td>—</td><td>20%</td><td>2 mini / 20 micro</td></tr><tr><td>50K Direct</td><td>$520</td><td>$364.00</td><td>$2,000 EOD</td><td>$1,200</td><td>60% of Peak EOD Balance</td><td>20%</td><td>4 mini / 40 micro</td></tr><tr><td>100K Direct</td><td>$700</td><td>$490.00</td><td>$3,500 EOD</td><td>$2,100</td><td>60% of Peak EOD Balance</td><td>20%</td><td>6 mini / 60 micro</td></tr><tr><td>150K Direct</td><td>$840</td><td>$588.00</td><td>$5,000 EOD</td><td>$3,000</td><td>60% of Peak EOD Balance</td><td>20%</td><td>10 mini / 100 micro</td></tr></tbody></table></div><ul><li>Direct is straight to funded.</li><li>Minimum days to payout: 5.</li><li>Maximum accounts: 5.</li><li>Trader dashboard: realtime.</li></ul></div>
  <div class="article-card"><h2>Funded rules and LucidLive path</h2><ul><li>Homepage says 90/10 profit split, no payout windows, clear/simple rules, and 15-minute average payout time.</li><li>About page says payouts and activations take minutes, there are no monthly billing charges, and Lucid offers platform freedom.</li><li>About page says LucidDirect skips the evaluation, uses End of Day drawdown, and has a DLL that scales as the trader earns.</li><li>Example listed from 25K Pro funded rules: payout profit target $250, max loss $1,000, 40% consistency, max size 2 mini / 20 micro, 3 days to payout, free activation, one-day pass eval, and 5 payouts to live.</li><li>LucidLive path: after a successful track record, trader can be moved to live brokerage, withdraw daily, swing trade, and work directly with risk team.</li></ul></div>
  <div class="article-card"><h2>Official Lucid pages</h2><ul><li>https://lucidtrading.com/</li><li>https://lucidtrading.com/about-us/</li><li>https://lucidtrading.com/affiliate/</li><li>https://lucidfunding.com/ has appeared as a parked-domain sale page, not the active prop firm site.</li></ul></div>
  <div class="article-card"><h2>Why this matters for NQ traders</h2><p>Lucid Trading is attractive because it combines EOD drawdown, no activation fees, fast payout messaging, and a direct-funded option. The biggest NQ-specific caution is that Pro and Direct still have daily loss limits on larger accounts, while Flex has a 50% evaluation consistency rule. For NQ traders, Flex may be simpler if you want no DLL in funded, while Pro may fit traders who want one-day evaluation potential.</p><a class="btn primary" href="#calculators">Run drawdown calculator</a></div></article>`;
}

function renderBulenoxArticle(f){
  return `<article class="article wrap"><a class="btn" href="#firms">← All firms</a><h1>Bulenox: Qualification, Master, and Funded Account rules for futures traders</h1><p class="lead">Bulenox's official homepage and help center show a monthly Qualification Account model with two drawdown choices: No Scaling trailing drawdown, or EOD drawdown with scaling and a daily loss limit.</p>
  <div class="article-card verify-card"><h2>Source review</h2><p><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span></p><p>Official source: <a href="${f.officialUrl}" target="_blank" rel="noreferrer">${f.officialUrl}</a></p><p class="disclaimer">Bulenox pricing, coupon codes, activation fees, and payout rules can change. Confirm the final checkout price and current rule page before buying.</p></div>
  ${affiliateCard(f)}
  <div class="article-card"><h2>Bulenox account tiers</h2><div class="table-wrap"><table><thead><tr><th>Account</th><th>Max contracts</th><th>Profit target</th><th>Drawdown</th><th>Monthly price shown</th></tr></thead><tbody><tr><td>10K</td><td>5 micros</td><td>$1,000</td><td>$1,000</td><td>$115/month</td></tr><tr><td>25K</td><td>3 contracts</td><td>$1,500</td><td>$1,500</td><td>$145/month</td></tr><tr><td>50K</td><td>7 contracts</td><td>$3,000</td><td>$2,500</td><td>$125/month with $50OFF coupon; $175 listed before coupon</td></tr><tr><td>100K</td><td>12 contracts</td><td>$6,000</td><td>$3,000</td><td>$155/month with $60OFF coupon; $215 listed before coupon</td></tr><tr><td>150K</td><td>15 contracts</td><td>$9,000</td><td>$4,500</td><td>$325/month</td></tr><tr><td>250K</td><td>25 contracts</td><td>$15,000</td><td>$5,500</td><td>$535/month</td></tr></tbody></table></div><p class="disclaimer">Each tier has been offered with two choices: “Opt 1: No Scaling Account” or “Opt 2: EOD Account.” Confirm the current option names before buying.</p></div>
  <div class="article-card"><h2>Qualification Account rules</h2><ul><li>No minimum trading days are required to get a Master Account; the trader must reach the profit target and have at least one completed trading day for review.</li><li>All open positions must be closed before 15:59 CT/CST.</li><li>NQ and MNQ are listed as permitted futures instruments.</li><li>One standard contract equals 10 micro contracts.</li><li>Using trade copiers, algorithms, strategies, or bots is not forbidden, but Bulenox says it is not responsible for third-party software issues.</li><li>Reset cost is $78 outside the free reset on billing date; reset does not change the subscription expiration date.</li></ul></div>
  <div class="article-card"><h2>Two drawdown options</h2><ul><li><b>Option 1 No Scaling:</b> trailing drawdown follows current balance, including realized and unrealized gains, records in real time, and includes commissions.</li><li><b>Option 2 EOD:</b> EOD drawdown updates when the account reaches a new high balance at the end of the trading day.</li><li>For Master Accounts, trailing/EOD drawdown stops moving when it reaches the initial starting balance + $100.</li><li>EOD Daily Loss Limits: 10K $400, 25K $500, 50K $1,100, 100K $2,200, 150K $3,300, 250K $4,500.</li><li>DLL is based on P&L including commissions and real-time/unrealized trades. Hitting it suspends the account for the rest of the trading day and is not counted as a rule violation.</li></ul></div>
  <div class="article-card"><h2>EOD scaling and Master fees</h2><ul><li>10K EOD has no scaling and max 5 micro contracts.</li><li>25K EOD scales from 2 contracts to 3 contracts after $1,501+ cash on hand.</li><li>50K EOD scales 2 → 4 → 7 contracts as cash on hand reaches $1,501 and $4,001+.</li><li>100K EOD scales 3 → 5 → 8 → 12 contracts as cash on hand reaches $2,001, $3,001, and $5,001+.</li><li>150K EOD scales 5 → 8 → 10 → 15 contracts as cash on hand reaches $4,001, $8,001, and $12,001+.</li><li>Master activation fees listed: 25K $143, 50K $148, 100K $248, 150K $498, 250K $898. The Qualification page also lists 10K at $98 for Option 2.</li></ul></div>
  <div class="article-card"><h2>Master and Funded payout rules</h2><ul><li>Master payouts: first $10,000 earned is paid 100% to the trader; after the first $10,000, trader receives 90% and Bulenox commission is 10%.</li><li>Master payout requests can be submitted any time during the calendar month, and payouts are processed weekly on Wednesdays.</li><li>Master payout processing requires at least 10 individual trading days.</li><li>Master minimum withdrawal is $1,000; first-three-payout maximums: 25K $1,000, 50K $1,500, 100K $1,750, 150K $2,000, 250K $2,500. After the third payout there is no maximum withdrawal limit.</li><li>Master payout consistency is 40%: the best single trading day must not exceed 40% of total profit balance at withdrawal request.</li><li>After three successful Master payouts, a trader may transition to a Funded Account at Risk Management's sole discretion. Funded Account reward request requires at least 5 trading days.</li></ul></div>
  <div class="article-card"><h2>Official Bulenox pages</h2><ul><li>https://bulenox.com/</li><li>https://bulenox.com/help/qualification-account/</li><li>https://bulenox.com/help/master-account/</li><li>https://bulenox.com/help/funded-account/</li><li>https://bulenox.com/help/subscription-and-payment/</li><li>https://bulenox.com/help/frequently-asked-questions/</li></ul></div>
  <div class="article-card"><h2>Why this matters for NQ traders</h2><p>Bulenox can look cheap, especially with homepage coupons, but the drawdown option matters more than the sticker price. The No Scaling option uses real-time trailing drawdown including unrealized gains, which is dangerous for NQ runners. The EOD option is usually easier to reason about, but it adds daily loss limits and scaling. NQ traders should treat the 50K/100K EOD accounts differently from No Scaling accounts.</p><a class="btn primary" href="#calculators">Run drawdown calculator</a></div></article>`;
}

function renderTakeProfitTraderArticle(f){
  return `<article class="article wrap"><a class="btn" href="#firms">← All firms</a><h1>TakeProfitTrader: brief rule reference</h1><p class="lead">TakeProfitTrader is kept as a short reference only. It is not a current recommendation on this site.</p>
  <div class="article-card verify-card"><h2>Source review</h2><p><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span></p><p>Official source: <a href="${f.officialUrl}" target="_blank" rel="noreferrer">${f.officialUrl}</a></p><p class="disclaimer">This page is intentionally minimal. Use the official site for current prices, rules, promos, and account availability.</p></div>
  ${affiliateCard(f)}
  <div class="article-card"><h2>Quick notes only</h2><ul><li>Known for day-one PRO payout messaging after buffer requirements are met.</li><li>Test drawdown is commonly described as EOD; PRO-stage drawdown can be intraday trailing; PRO+ uses EOD.</li><li>Consistency, buffer, reset, payout, and news rules should be confirmed directly before buying.</li></ul></div>
  <div class="article-card"><h2>Why it is at the bottom</h2><p>Lucid Trading and Bulenox are stronger fits for the current recommended list. Use TakeProfitTrader only as a quick comparison point if you already planned to research it.</p><a class="btn" href="#compare">Back to comparison</a></div></article>`;
}

function renderMyFundedFuturesArticle(f){
  return `<article class="article wrap"><a class="btn" href="#firms">← All firms</a><h1>MyFundedFutures: EOD drawdown, no activation fee, and plan-specific payouts</h1><p class="lead">MyFundedFutures is a newer futures-specific prop firm with multiple plan types. The official help center shows a common evaluation structure, Max EOD trailing drawdown, no activation fee, and different payout rules for Rapid, Flex, and Pro plans.</p>
  <div class="article-card verify-card"><h2>Source review</h2><p><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span></p><p>Official source: <a href="${f.officialUrl}" target="_blank" rel="noreferrer">${f.officialUrl}</a></p><p class="disclaimer">MyFundedFutures help articles list plan prices and resets, but discounts and coupons can change. Confirm the current checkout price before buying.</p></div>
  ${affiliateCard(f)}
  <div class="article-card"><h2>Evaluation account specs</h2><div class="table-wrap"><table><thead><tr><th>Plan / Size</th><th>Profit target</th><th>Max loss / drawdown</th><th>Daily loss</th><th>Contracts</th><th>Price / reset</th></tr></thead><tbody><tr><td><strong>Flex 25K</strong></td><td>$1,500</td><td>$1,000 EOD</td><td>None</td><td>3 mini / 30 micro</td><td>$95</td></tr><tr><td><strong>Flex 50K</strong></td><td>$3,000</td><td>$2,000 EOD</td><td>None</td><td>5 mini / 50 micro</td><td>$153</td></tr><tr><td><strong>Rapid 25K</strong></td><td>$1,500</td><td>$1,000 EOD</td><td>None</td><td>3 mini / 30 micro</td><td>$109</td></tr><tr><td><strong>Rapid 50K</strong></td><td>$3,000</td><td>$2,000 EOD</td><td>None</td><td>5 mini / 50 micro</td><td>$157</td></tr><tr><td><strong>Rapid 100K</strong></td><td>$6,000</td><td>$3,000 EOD</td><td>None</td><td>10 mini / 100 micro</td><td>$267</td></tr><tr><td><strong>Rapid 150K</strong></td><td>$9,000</td><td>$4,500 EOD</td><td>None</td><td>15 mini / 150 micro</td><td>$347</td></tr><tr><td><strong>Pro 50K</strong></td><td>$3,000*</td><td>$2,000 EOD</td><td>None</td><td>6 mini / 60 micro</td><td>$227</td></tr><tr><td><strong>Pro 100K</strong></td><td>$6,000</td><td>$3,000 EOD</td><td>None</td><td>9 mini / 90 micro</td><td>$344</td></tr><tr><td><strong>Pro 150K</strong></td><td>$9,000</td><td>$4,500 EOD</td><td>None</td><td>15 mini / 150 micro</td><td>$477</td></tr></tbody></table></div><p class="disclaimer">*The official evaluation article notes the Pro Plan One Day Add-On has a $4,000 evaluation profit target. Builder 100K is listed at $153 in the same price table, but builder-plan details should be reviewed separately before choosing that plan.</p></div>
  <div class="article-card"><h2>Drawdown and consistency rules</h2><ul><li><b>Max EOD trailing:</b> MyFundedFutures says its Max EOD drawdown is calculated as an end-of-day drawdown and “locks in at $100 plus the initial starting balance.”</li><li><b>Open equity risk:</b> the help article warns that open equity losses are considered when determining whether the account failed the Max EOD rule.</li><li><b>No daily loss limit:</b> the evaluation article lists Daily Loss Limit as “None” for Flex, Rapid, and Pro evaluation rows; the payout overview also says no daily loss limits on Flex, Rapid, or Pro plans.</li><li><b>50% evaluation consistency:</b> official help says all Rapid, Flex, and Pro evaluations use a 50% consistency rule, except the Pro One Day pass add-on.</li><li><b>Minimum trading days:</b> evaluation table lists 2 minimum trading days.</li><li><b>T1 news trading:</b> listed as allowed during evaluations; news restrictions apply later to Rapid Sim Funded and Pro Sim Funded.</li></ul></div>
  <div class="article-card"><h2>Payout rules</h2><ul><li><b>Rapid:</b> daily payout frequency; first payout eligible 24 hours after first trade if buffer and minimum profit are met; $500 minimum withdrawal; 90% split for Rapid sim funded plans as of January 12, 2026.</li><li><b>Rapid buffers:</b> 50K $2,100, 100K $3,100, 150K $4,600. The payout article says Rapid has no consistency rules.</li><li><b>Flex:</b> payout after 5 winning days; minimum daily profit $100 on 25K Flex or $150 on 50K Flex; $250 minimum withdrawal; max request is 50% of net profits up to $3,000 on 25K or $5,000 on 50K; 80% split.</li><li><b>Pro:</b> payout every 14 calendar days from first trade; buffer target required; $1,000 minimum withdrawal; up to $100,000 max request in sim-funded stage; 80% split.</li><li><b>Activation fee:</b> official help article says all MFFU plans come with a $0 activation fee.</li></ul></div>
  <div class="article-card"><h2>Official MyFundedFutures pages</h2><ul><li>https://help.myfundedfutures.com/en/articles/11802636-traders-evaluation-simplified</li><li>https://help.myfundedfutures.com/en/articles/8348565-max-eod-trailing</li><li>https://help.myfundedfutures.com/en/articles/11994562-consistency-rule-at-my-funded-futures</li><li>https://help.myfundedfutures.com/en/articles/12398151-does-myfunded-futures-charge-activation-fee</li><li>https://help.myfundedfutures.com/en/articles/13745661-payout-policy-overview-best-and-fastest-prop-firm-payouts</li><li>https://help.myfundedfutures.com/en/articles/8230009-news-trading-policy</li></ul></div>
  <div class="article-card"><h2>Why this matters for NQ traders</h2><p>For NQ traders, the main attraction is the combination of EOD-style drawdown and no daily loss limit, but that does not mean unlimited risk. A single oversized NQ trade can still push open equity below the allowed level. Use MNQ while the Max EOD cushion is small, and check whether Rapid, Flex, or Pro payout rules fit your trading pace.</p><a class="btn primary" href="#calculators">Run drawdown calculator</a></div></article>`;
}

function renderApexArticle(f){
  return `<article class="article wrap"><a class="btn" href="#firms">← All firms</a><h1>Apex Trader Funding: EOD vs Intraday drawdown</h1><p class="lead">Apex changed materially in 2026. Treat it as two different products: EOD trailing drawdown accounts and intraday trailing drawdown accounts.</p>
  <div class="article-card verify-card"><h2>Source review</h2><p><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span></p><p>Official source: <a href="${f.officialUrl}" target="_blank" rel="noreferrer">${f.officialUrl}</a></p><p class="disclaimer">Apex account rules, payout terms, and checkout discounts can change. Confirm current EOD rules and final pricing on the official Apex site before buying.</p></div>
  ${affiliateCard(f)}
  <div class="article-card"><h2>Apex EOD rule snapshot</h2><ul><li><b>EOD drawdown:</b> calculated once per trading day at 4:59:59 PM ET, based on the account's closing balance.</li><li><b>Enforcement:</b> once calculated, the EOD threshold is enforced during the next trading session; touching or falling below it fails the evaluation or closes the PA.</li><li><b>No intraday trailing drawdown:</b> Apex's EOD pages state there is no intraday trailing drawdown on EOD accounts.</li><li><b>Daily Loss Limit:</b> EOD evaluations and EOD PAs have DLLs enforced intraday by account size.</li><li><b>Evaluation pass:</b> no minimum trading days required; a trader may pass in one day if the profit target is reached and rules are respected.</li><li><b>PA activation window:</b> after passing, Apex says traders have 7 calendar days to activate the corresponding EOD Performance Account.</li></ul></div>
  <div class="article-card"><h2>Apex EOD account specs</h2><div class="table-wrap"><table><thead><tr><th>Size</th><th>Profit target</th><th>Max drawdown</th><th>Daily loss limit</th><th>Eval contracts</th><th>Retail EOD price</th></tr></thead><tbody><tr><td><strong>$25K EOD</strong></td><td>$1,500</td><td>$1,000</td><td>$500</td><td>4</td><td>$177</td></tr><tr><td><strong>$50K EOD</strong></td><td>$3,000</td><td>$2,000</td><td>$1,000</td><td>6</td><td>$197</td></tr><tr><td><strong>$100K EOD</strong></td><td>$6,000</td><td>$3,000</td><td>$1,500</td><td>8</td><td>$297</td></tr><tr><td><strong>$150K EOD</strong></td><td>$9,000</td><td>$4,000</td><td>$2,000</td><td>12</td><td>$397</td></tr></tbody></table></div><p class="disclaimer">Apex EOD specs can change. Confirm current pricing, coupons, and account rules on the official Apex site before buying.</p></div>
  <div class="article-card"><h2>Apex EOD payout rules</h2><ul><li>Approved EOD PA payouts are listed as a 100% payout split.</li><li>Minimum 5 qualifying trading days are required before payout request.</li><li>Minimum daily profit per qualifying day: $100 on 25K, $250 on 50K, $300 on 100K, $350 on 150K.</li><li>50% consistency rule applies: no single profitable day may be 50% or more of total profit since the last approved payout.</li><li>Minimum payout request is $500.</li><li>Each EOD Performance Account may receive a maximum of six payouts, then the PA is closed.</li></ul></div><div class="article-card"><h2>Why this matters for NQ traders</h2><p>On an intraday trailing account, an unrealized NQ runner can push the high-water mark up before you close the trade. If price reverses, your floor may already be higher. On Apex-style EOD drawdown, Apex's official EOD pages state there is no intraday trailing drawdown; the threshold is calculated from the end-of-day balance and enforced afterward.</p><p>For most NQ traders who hold trades for more than a few seconds, EOD is usually easier to manage. Pure tick scalpers may still compare intraday accounts if they are flat quickly.</p><a class="btn primary" href="#calculators">Run EOD drawdown calculator</a></div>
  <div class="article-card"><h2>Official Apex pages</h2><ul><li>https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/eod-evaluations/</li><li>https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/eod-drawdown-explained/</li><li>https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/eod-performance-accounts-pa/</li><li>https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/eod-payouts/</li></ul></div></article>`;
}

function renderDisclaimers(){return `<article class="article wrap"><h1>Disclosures</h1><div class="article-card"><h2>Affiliate disclosure</h2><p>This site may earn commissions when visitors click partner links or use discount codes. Recommendations are based on rule fit, account structure, trader risk, and official-source review. Partner compensation may exist, but it should not replace your own rule review or final checkout confirmation.</p></div><div class="article-card"><h2>Educational only</h2><p>Futures Prop Edge is for education and comparison only. It is not financial advice, investment advice, tax advice, legal advice, or a promise that users will pass an evaluation, receive a payout, qualify for live capital, or make money.</p></div><div class="article-card"><h2>Futures and prop-firm risk</h2><p>Futures trading is risky, leveraged, and not suitable for every trader. Prop-firm evaluations and simulated funded accounts can involve fees, resets, activation costs, drawdown rules, payout restrictions, consistency rules, and account closures. Only trade capital and fees you can afford to lose.</p></div><div class="article-card"><h2>Rule-change policy</h2><p>Prop firm rules, prices, discounts, payout policies, platform access, country restrictions, and account availability can change frequently. Use the last-reviewed date and official-rule links as a starting point, then verify the latest terms directly with the firm before buying.</p></div><div class="article-card"><h2>Checklist and analytics</h2><p>The checklist unlock is instant. Submitting the form may add your email and trading focus to the site's email provider so future rule updates can be sent. The browser keeps only checklist status metadata, not the raw email. Form and download events may be measured without sending the raw email as an analytics event.</p></div><div class="article-card"><h2>Before you use this site</h2><ul><li>Verify each prop firm rule directly from official sources before buying.</li><li>Recheck every partner offer, coupon code, and official rule page before purchasing an account.</li><li>Read the affiliate disclosure, educational disclaimer, risk disclosure, and rule-change policy before relying on any comparison.</li><li>The checklist is provided as an educational planning aid, not a promise of account approval, payouts, live funding, or trading profits.</li></ul></div></article>`}

function renderPrivacy(){return `<article class="article wrap"><a class="btn" href="#home">Home</a><h1>Privacy Policy</h1><p class="lead">Futures Prop Edge collects only the information needed to run the site, measure usage, and deliver the checklist/newsletter experience.</p><div class="article-card"><h2>Email and checklist signup</h2><p>When you submit the checklist form, your email address and selected trading focus may be sent to our email provider, currently MailerLite, so you can receive checklist access and future rule/risk updates. The site stores checklist status metadata in your browser, but it does not store your raw email in browser local storage.</p></div><div class="article-card"><h2>Analytics</h2><p>The site may use Vercel Analytics, Google Analytics, and Microsoft Clarity to understand page views, button clicks, calculator usage, and signup/download events. Analytics events should not include your raw email address.</p></div><div class="article-card"><h2>Affiliate links</h2><p>Outbound partner links may use tracking parameters or affiliate redirects. If you buy after clicking one of those links or using a listed code, this site may earn a commission.</p></div><div class="article-card"><h2>Your choices</h2><p>You can unsubscribe from emails using the unsubscribe link in any email. You can also clear browser storage or block analytics through your browser settings.</p></div></article>`}

function renderTerms(){return `<article class="article wrap"><a class="btn" href="#home">Home</a><h1>Terms of Use</h1><p class="lead">Use this site as an educational comparison tool, not as financial advice or a guarantee that any prop firm account will be right for you.</p><div class="article-card"><h2>Educational content only</h2><p>Futures Prop Edge provides rule summaries, calculators, checklists, and comparison notes for funded futures traders. Nothing here is financial, investment, tax, or legal advice.</p></div><div class="article-card"><h2>Risk and responsibility</h2><p>Futures trading and prop-firm evaluations involve substantial risk. You are responsible for verifying current rules, prices, restrictions, payout policies, and checkout terms directly with each firm before purchasing.</p></div><div class="article-card"><h2>No guarantees</h2><p>The site does not guarantee evaluation passes, payouts, live funding, profits, discounts, or account approval. Rules and offers may change after a page was reviewed.</p></div><div class="article-card"><h2>Affiliate compensation</h2><p>Some links and codes are partner offers. Compensation may be earned, but you should still compare rule fit and confirm final checkout pricing before buying.</p></div></article>`}

function renderBestNqArticle(){
  const recommended = firms.filter(isRecommended);
  return `<article class="article wrap"><a class="btn" href="#home">Home</a><h1>Best funded futures prop firms for NQ traders</h1><p class="lead">NQ and MNQ traders need more than a cheap challenge. The real question is whether the drawdown, daily loss, payout, and contract rules match the way you trade Nasdaq futures.</p><div class="article-card"><h2>Quick picks</h2><div class="finder-grid">${recommended.map(f=>`<article class="finder-card"><div class="finder-card-top"><div><h3>${f.name}</h3><p>${f.fit}</p></div>${recommendationBadge(f)}</div><div class="finder-tags">${firmTraits(f).map(t=>`<span>${t}</span>`).join('')}</div><p>${couponText(f)}</p>${affiliateActions(f,true)}</article>`).join('')}</div></div><div class="article-card"><h2>How to choose for NQ</h2><ul><li><b>Start with drawdown:</b> Static and EOD drawdown are easier to plan around than real-time intraday trailing when NQ moves fast.</li><li><b>Respect daily loss limits:</b> A normal NQ stop can consume a small DLL quickly. Use MNQ while your cushion is thin.</li><li><b>Read payout rules:</b> Fast payout language can still include consistency rules, buffers, minimum days, caps, or live-transition discretion.</li><li><b>Confirm checkout:</b> Partner codes and promos can change. Always verify the final price before buying.</li></ul></div><div class="article-card"><h2>Recommended starting point</h2><p>For most NQ traders, begin with the rule fit rather than the headline price. Phidias is worth checking for static/E2L and swing-friendly Premium rules, Lucid Trading for EOD drawdown and direct-funded paths, and Bulenox for budget-focused traders who are willing to read drawdown options carefully.</p><a class="btn primary" href="#checklist">Download the NQ checklist</a></div></article>`;
}

function bindGlobal(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>setTimeout(router,0)));
  document.getElementById('copyLink')?.addEventListener('click', async()=>{try{await navigator.clipboard.writeText(location.href); showToast('Link copied');}catch{showToast('Copy unavailable');}});
  const menuBtn=document.getElementById('menuBtn');
  const mobileNav=document.getElementById('mobileNav');
  menuBtn?.addEventListener('click',()=>{
    if(!mobileNav) return;
    const isOpen=!mobileNav.hidden;
    mobileNav.hidden=isOpen;
    menuBtn.setAttribute('aria-expanded',String(!isOpen));
  });
  mobileNav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    mobileNav.hidden=true;
    menuBtn?.setAttribute('aria-expanded','false');
  }));
  bindHelpDots();
  document.querySelectorAll('[data-outbound-firm]').forEach(a=>a.addEventListener('click',()=>trackEvent('outbound_firm_click',{firm:a.dataset.outboundFirm,source:a.dataset.outboundSource,path:location.hash||'#home'})));
  initMarketTape();
  bindCompareFinder();
  bindLeadForm();
}
function initMarketTape(){
  const container=document.getElementById('marketTapeWidget');
  if(!container || document.getElementById('tradingViewTickerTapeScript')) return;
  container.dataset.loaded='true';
  const script=document.createElement('script');
  script.id='tradingViewTickerTapeScript';
  script.type='module';
  script.src='https://widgets.tradingview-widget.com/w/en/tv-ticker-tape.js';
  script.async=true;
  document.head.appendChild(script);
}
function bindCompareFinder(){
  const goal=document.getElementById('finderGoal');
  const result=document.getElementById('finderResult');
  const renderResult=()=>{
    if(!goal||!result) return;
    const f=finderRecommendation(goal.value);
    result.innerHTML=`<span class="pill green">Best starting point</span><h3>${f.name}</h3><p>${f.fit}</p><div class="finder-tags">${firmTraits(f).map(t=>`<span>${t}</span>`).join('')}</div>${affiliateActions(f,true)}`;
  };
  goal?.addEventListener('change',()=>{renderResult(); trackEvent('prop_firm_finder_change',{goal:goal.value,path:location.hash||'#compare'});});
  renderResult();
  const chips=[...document.querySelectorAll('.filter-chip')];
  const cards=[...document.querySelectorAll('[data-firm-card]')];
  const search=document.getElementById('firmSearch');
  const apply=()=>{
    const active=document.querySelector('.filter-chip.active')?.dataset.filter || 'all';
    const q=(search?.value||'').trim().toLowerCase();
    cards.forEach(card=>{
      const filterOk=(card.dataset.filterMatch||'').split(' ').includes(active);
      const searchOk=!q || card.textContent.toLowerCase().includes(q) || (card.dataset.firmName||'').includes(q);
      card.hidden=!(filterOk && searchOk);
    });
  };
  chips.forEach(btn=>btn.addEventListener('click',()=>{chips.forEach(b=>b.classList.remove('active')); btn.classList.add('active'); apply(); trackEvent('prop_firm_filter_click',{filter:btn.dataset.filter,path:location.hash||'#compare'});}));
  search?.addEventListener('input',apply);
  apply();
}
function bindLeadForm(){
  const form=document.getElementById('leadForm');
  if(!form) return;
  const email=document.getElementById('leadEmail');
  const focus=document.getElementById('leadFocus');
  const status=document.getElementById('leadStatus');
  const downloadBox=document.getElementById('checklistDownload');
  const openChecklist=document.getElementById('openChecklist');
  const submitBtn=form.querySelector('button[type="submit"]');
  const unlock=(message='Checklist unlocked. Open it now, then keep using the comparison and calculators before choosing a firm.')=>{
    downloadBox.hidden=false;
    status.textContent=message;
  };
  form.addEventListener('submit', async event=>{
    event.preventDefault();
    const value=(email.value||'').trim();
    if(!email.checkValidity() || !value){ email.focus(); return; }
    const payload={email:value,focus:focus.value,path:location.hash||'#checklist',source:'nq_prop_firm_checklist'};
    submitBtn.disabled=true;
    status.textContent='Saving your email and unlocking the checklist...';
    let saved=false;
    let error='';
    try{
      const response=await fetch('/api/subscribe', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload)
      });
      const data=await response.json().catch(()=>({}));
      saved=Boolean(response.ok && data.saved);
      error=data.error || '';
    }catch(err){
      error='network_unavailable';
      console.warn('[lead subscribe unavailable]', err);
    }finally{
      submitBtn.disabled=false;
    }
    localStorage.setItem('fftChecklistLead', JSON.stringify({focus:payload.focus,path:payload.path,source:payload.source,saved,createdAt:new Date().toISOString()}));
    trackEvent('lead_magnet_submit',{focus:payload.focus,source:payload.source,path:payload.path});
    trackEvent('lead_magnet_subscribe_status',{saved,error: error || 'none',source:payload.source,path:payload.path});
    unlock(saved ? 'Checklist unlocked and subscription saved. Open it now, then keep using the comparison and calculators before choosing a firm.' : 'Checklist unlocked. The email signup could not be completed, but the checklist is available now.');
  });
  openChecklist?.addEventListener('click',()=>{
    trackEvent('lead_magnet_checklist_open',{focus:focus.value,path:location.hash||'#checklist'});
  });
}

function showToast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function bindHelpDots(){
  const pop=document.getElementById('tooltipPop');
  if(!pop) return;
  document.querySelectorAll('.help-dot').forEach(btn=>{
    btn.onclick=(event)=>{
      event.preventDefault();
      event.stopPropagation();
      const open=pop.classList.contains('show') && pop.dataset.source===btn.getAttribute('aria-label');
      if(open){ pop.classList.remove('show'); return; }
      pop.textContent=btn.dataset.help || 'Quick definition unavailable.';
      pop.dataset.source=btn.getAttribute('aria-label') || '';
      const rect=btn.getBoundingClientRect();
      pop.classList.add('show');
      const popRect=pop.getBoundingClientRect();
      const left=Math.min(Math.max(12, rect.left + rect.width/2 - popRect.width/2), window.innerWidth - popRect.width - 12);
      const top=Math.max(12, rect.bottom + 10);
      pop.style.left=`${left}px`;
      pop.style.top=`${top}px`;
    };
  });
}
document.addEventListener('click',()=>document.getElementById('tooltipPop')?.classList.remove('show'));
function router(){
  const name=(location.hash.replace('#','').split('/')[0] || 'home');
  const render=pages[name] || pages.home;
  layout(render());
  trackEvent('route_view',{route:name,path:location.hash||'#home'});
  if(document.getElementById('calcPanel')) setCalc('drawdown');
  document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>{trackEvent('calculator_tab_click',{calculator:t.dataset.calc,path:location.hash||'#calculators'}); setCalc(t.dataset.calc);}));
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${name}`));
}
window.addEventListener('hashchange',router);
router();
