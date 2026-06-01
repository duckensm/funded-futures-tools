import './styles.css';

const firms = [
  {id:'apex', name:'Apex Trader Funding', best:'High search demand + EOD option', price:'EOD: $177-$397 retail', target:'$1.5k-$9k EOD', drawdown:'EOD trailing + intraday trailing', daily:'EOD DLL: $500-$2k', payout:'6-step payout ladder', score:88, risk:'Medium', fit:'Best for NQ traders who want a heavily searched futures prop firm and prefer EOD drawdown over intraday trailing.'},
  {id:'myfundedfutures', name:'MyFundedFutures', best:'Popular modern futures option', price:'Varies', target:'Account dependent', drawdown:'Static/trailing varies', daily:'Varies', payout:'Modern rules', score:84, risk:'Medium', fit:'Best for traders comparing newer futures-specific alternatives with strong current market interest.'},
  {id:'takeprofittrader', name:'TakeProfitTrader', best:'Fast payout focus', price:'$150+', target:'Firm dependent', drawdown:'Trailing', daily:'Account dependent', payout:'Strong payout branding', score:82, risk:'Medium', fit:'Best for traders who value simple branding and direct payout messaging.'},
  {id:'tradeify', name:'Tradeify', best:'Modern trader funding option', price:'Varies', target:'Account dependent', drawdown:'Rules vary', daily:'Varies', payout:'Verify current rules', score:80, risk:'Medium', fit:'Best for traders comparing newer prop firm models and payout structures.'},
  {id:'bulenox', name:'Bulenox', best:'Budget promos', price:'Promo varies', target:'Account dependent', drawdown:'Trailing', daily:'Varies', payout:'Promo heavy', score:76, risk:'High', fit:'Best for deal seekers who read rules carefully.'},
  {id:'lucidtraderfunding', name:'Lucid Trader Funding', best:'Newer futures funding alternative', price:'Varies', target:'Account dependent', drawdown:'Rules vary', daily:'Varies', payout:'Verify current rules', score:74, risk:'Medium-High', fit:'Best for traders who want to compare newer futures funding options after checking the bigger names.'},
  {id:'earn2trade', name:'Earn2Trade', best:'Legacy structured evaluations', price:'$150+', target:'$6k on $50k', drawdown:'EOD trailing / rules vary', daily:'Varies', payout:'Published affiliate program', score:70, risk:'Medium', fit:'Best as a secondary/legacy comparison, not as the headline top prop firm.'}
];

const pages = {
  home: renderHome,
  compare: renderCompare,
  calculators: renderCalculators,
  firms: renderFirms,
  disclaimers: renderDisclaimers
};

function money(n){
  if(!Number.isFinite(n)) return '$0';
  const abs = Math.abs(n);
  return `${n < 0 ? '-' : ''}$${abs.toLocaleString(undefined,{maximumFractionDigits:0})}`;
}
function num(id){ return parseFloat(document.getElementById(id)?.value || 0); }
function riskClass(score){ return score >= 84 ? 'green' : score >= 78 ? 'amber' : ''; }

function layout(content){
  document.querySelector('#app').innerHTML = `
    <header class="nav">
      <div class="wrap nav-inner">
        <a class="brand" href="#home" aria-label="Funded Futures Tools home"><span class="brand-mark"></span><span>Funded Futures Tools</span></a>
        <nav class="nav-links" aria-label="Primary">
          <a href="#compare">Compare Firms</a><a href="#calculators">Calculators</a><a href="#firms">Firm Pages</a><a href="#disclaimers">Disclosures</a>
        </nav>
        <div class="nav-cta"><a class="btn" href="#calculators">Use calculators</a><a class="btn primary" href="#compare">Find best firm</a><button class="btn mobile-menu" id="menuBtn">Menu</button></div>
      </div>
    </header>
    <main>${content}</main>
    <div class="sticky-tools"><a class="btn small" href="#calculators">Calculator</a><button class="btn small" id="copyLink">Copy link</button></div>
    <div class="tooltip-pop" id="tooltipPop" role="tooltip"></div>
    <div class="toast" id="toast">Link copied</div>
    <footer class="footer"><div class="wrap footer-grid"><div><div class="brand"><span class="brand-mark"></span><span>Funded Futures Tools</span></div><p class="disclaimer">Built for futures traders comparing funded account rules. We focus on NQ/MNQ risk, drawdown mechanics, and practical rule clarity.</p></div><div><b>Tools</b><p class="disclaimer"><a href="#compare">Comparison table</a><br><a href="#calculators">Drawdown calculator</a><br><a href="#calculators">NQ risk calculator</a></p></div><div><b>Important</b><p class="disclaimer">Educational only. Not financial advice. Prop firm rules change; always verify on official websites before buying.</p></div></div></footer>
  `;
  bindGlobal();
}

function renderHome(){
  return `
  <section class="hero"><div class="wrap hero-grid">
    <div>
      <div class="eyebrow"><span class="dot"></span>Built for NQ / MNQ funded futures traders</div>
      <h1>Choose the right prop firm before the <span class="grad">drawdown trap</span> gets you.</h1>
      <p class="lead">Compare funded futures accounts, calculate trailing drawdown risk, size NQ trades correctly, and find discount links without digging through scattered rule pages.</p>
      <div class="hero-actions"><a class="btn primary" href="#calculators">Run the free calculators</a><a class="btn" href="#compare">Compare prop firms</a></div>
      <div class="mini-proof"><span><b>7</b> starter firms</span><span><b>3</b> calculators</span><span><b>NQ-first</b> examples</span><span><b>No signals</b>, just rules + risk</span></div>
    </div>
    <div class="terminal-card" aria-label="Prop account risk preview">
      <div class="terminal-top"><div class="lights"><i></i><i></i><i></i></div><span>risk-check / nq-account</span></div>
      <div class="terminal-body">
        <div class="score-card"><div><strong>Trailing drawdown cushion</strong><br><span>$50k account · high-water mark $52,400 · $2,500 trail</span><div class="risk-bar"><i style="width:68%"></i></div></div><div class="score">$1.9k</div></div>
        <div class="score-card"><div><strong>NQ stop risk</strong><br><span>2 contracts · 12.5 point stop · $20/point</span><div class="risk-bar"><i style="width:42%"></i></div></div><div class="score">$500</div></div>
        <div class="score-card"><div><strong>Rule-risk score</strong><br><span>Best for micros, scalpers, and payout safety</span><div class="risk-bar"><i style="width:82%"></i></div></div><div class="score">82</div></div>
      </div>
    </div>
  </div></section>
  <section class="section"><div class="wrap"><div class="section-head"><div><h2>A futures prop firm shortlist built around buyer intent.</h2><p class="subhead">Most sites rank everything. This one starts with the names traders actually search, then explains the rules through NQ-focused calculators.</p></div><a class="btn" href="#firms">View firm pages</a></div><div class="grid3">
    <div class="card"><div class="icon">⚡</div><h3>NQ/MNQ specific</h3><p>Risk examples use futures point values, contract counts, trailing drawdown buffers, and daily loss limits.</p></div>
    <div class="card"><div class="icon">◷</div><h3>Rule clarity</h3><p>Plain-English explanations of trailing drawdown, consistency rules, payout rules, activation fees, and reset risk.</p></div>
    <div class="card"><div class="icon">↗</div><h3>Monetizable from day one</h3><p>Ready for affiliate links, discount codes, email capture, comparison pages, and YouTube traffic.</p></div>
  </div></div></section>
  ${comparisonSection(false)}
  ${calculatorSection()}
  <section class="section"><div class="wrap cta-band"><div><div class="eyebrow"><span class="dot"></span>MVP launch target</div><h2>Ship the useful version first. Polish after clicks.</h2><p class="subhead">The site is structured so affiliate links can be swapped in later without rebuilding the design.</p></div><a class="btn primary" href="#disclaimers">Review disclosures</a></div></section>`;
}

function comparisonSection(full=true){
  const rows = firms.map(f=>`<tr><td><strong>${f.name}</strong><br><span class="pill ${riskClass(f.score)}">Score ${f.score}</span></td><td>${f.best}</td><td>${f.price}</td><td>${f.target}</td><td>${f.drawdown}</td><td>${f.daily}</td><td><span class="pill">${f.risk}</span></td><td><a class="btn small" href="#firms/${f.id}">Details</a></td></tr>`).join('');
  return `<section class="section" id="compare"><div class="wrap"><div class="section-head"><div><h2>Futures prop firm comparison.</h2><p class="subhead">Sorted as a practical buyer-intent shortlist, not a claim that every firm is the market leader. Values are intentionally marked “varies” where rules change often; final launch should verify each firm directly.</p></div>${full?'<a class="btn" href="#calculators">Check risk</a>':''}</div><div class="table-wrap"><table><thead><tr><th>Firm</th><th>Best for</th><th>Price</th><th>Profit target</th><th>Drawdown</th><th>Daily loss</th><th>Risk</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></div></section>`;
}

function renderCompare(){ return comparisonSection(true); }

function calculatorSection(){
  return `<section class="section" id="calculators"><div class="wrap"><div class="section-head"><div><h2>Free calculators that create trust.</h2><p class="subhead">These tools are the traffic hook: they make the site useful before affiliate links are even approved.</p></div></div><div class="calc-grid"><div class="tabs"><button class="tab active" data-calc="drawdown"><b>Trailing drawdown + consistency</b><br>Calculate liquidation cushion and 30/40/50% consistency rules.</button><button class="tab" data-calc="nq"><b>NQ / MNQ risk</b><br>Translate stops and contracts into dollars.</button><button class="tab" data-calc="planner"><b>Challenge pass planner</b><br>Estimate daily target and risk pace.</button></div><div class="calculator" id="calcPanel"></div></div></div></section>`;
}
function renderCalculators(){ return calculatorSection(); }

function drawdownCalc(){return `<h3>Trailing drawdown + consistency simulator</h3><p class="disclaimer">Enter the account state and the firm's consistency percentage. Many prop firms require your biggest winning day to be no more than 30%, 40%, or 50% of total profit before payout.</p><div class="form-grid"><div><label>Starting balance</label><input id="startBal" type="number" value="50000"></div><div><label>Current balance</label><input id="currentBal" type="number" value="51400"></div><div><label>High-water mark <button class="help-dot" type="button" data-help="High-water mark is the highest balance or equity your account has reached so far. For Apex-style EOD drawdown, use the highest end-of-day closing balance, not the highest intraday unrealized spike. Example: if the EOD high-water mark is $52,400 and the trail is $2,500, the liquidation level is $49,900." aria-label="What is high-water mark?">?</button></label><input id="highBal" type="number" value="52400"></div><div><label>Drawdown amount</label><input id="ddAmount" type="number" value="2500"></div><div><label>Drawdown type</label><select id="ddType"><option value="trailing">Intraday trailing</option><option value="eod">EOD trailing (Apex-style)</option><option value="static">Static from start</option></select></div><div><label>Consistency rule %</label><input id="consistencyPct" type="number" value="40" min="1" max="100" step="1"></div><div><label>Total profit so far</label><input id="totalProfit" type="number" value="3000"></div><div><label>Best winning day</label><input id="bestDay" type="number" value="1400"></div></div><div class="result-box" id="ddResults"></div><div class="note" id="ddNote"></div>`}
function nqCalc(){return `<h3>NQ / MNQ position risk calculator</h3><p class="disclaimer">NQ is $20 per point per contract. MNQ is $2 per point per contract.</p><div class="form-grid"><div><label>Market</label><select id="market"><option value="20">NQ</option><option value="2">MNQ</option></select></div><div><label>Contracts</label><input id="contracts" type="number" value="2"></div><div><label>Stop size in points</label><input id="stopPts" type="number" value="12.5" step="0.25"></div><div><label>Daily loss limit</label><input id="dailyLoss" type="number" value="1000"></div><div><label>Drawdown cushion</label><input id="cushion" type="number" value="1900"></div></div><div class="result-box" id="nqResults"></div><div class="note" id="nqNote"></div>`}
function plannerCalc(){return `<h3>Challenge pass planner</h3><p class="disclaimer">Plan a conservative pace instead of trying to pass in one overleveraged day.</p><div class="form-grid"><div><label>Profit target</label><input id="profitTarget" type="number" value="3000"></div><div><label>Days to pass</label><input id="days" type="number" value="10"></div><div><label>Max daily loss</label><input id="maxDailyLoss" type="number" value="1000"></div><div><label>Risk per trade</label><input id="riskTrade" type="number" value="250"></div></div><div class="result-box" id="planResults"></div><div class="note" id="planNote"></div>`}

function setCalc(which='drawdown'){
  const panel=document.getElementById('calcPanel'); if(!panel) return;
  panel.innerHTML = which==='nq'?nqCalc():which==='planner'?plannerCalc():drawdownCalc();
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.calc===which));
  panel.querySelectorAll('input,select').forEach(el=>el.addEventListener('input',()=>updateCalc(which)));
  bindHelpDots();
  updateCalc(which);
}
function updateCalc(which){
  if(which==='drawdown'){
    const start=num('startBal'), current=num('currentBal'), high=num('highBal'), dd=num('ddAmount'), type=document.getElementById('ddType').value;
    const consistencyPct=Math.max(1, Math.min(100, num('consistencyPct')));
    const totalProfit=Math.max(0, num('totalProfit'));
    const bestDay=Math.max(0, num('bestDay'));
    const threshold = type==='static' ? start-dd : high-dd;
    const cushion=current-threshold;
    const used=Math.max(0,Math.min(100,(1-(cushion/dd))*100));
    const maxBestDayAllowed=totalProfit*(consistencyPct/100);
    const currentBestDayPct=totalProfit>0 ? (bestDay/totalProfit)*100 : 0;
    const extraProfitNeeded=Math.max(0, (bestDay/(consistencyPct/100))-totalProfit);
    const consistencyPass=bestDay<=maxBestDayAllowed && totalProfit>0;
    document.getElementById('ddResults').innerHTML=`<div class="metric"><span>Liquidation threshold</span><strong>${money(threshold)}</strong></div><div class="metric"><span>Remaining cushion</span><strong>${money(cushion)}</strong></div><div class="metric"><span>Drawdown used</span><strong>${used.toFixed(0)}%</strong></div><div class="metric"><span>Best day allowed</span><strong>${money(maxBestDayAllowed)}</strong></div><div class="metric"><span>Current best day %</span><strong>${currentBestDayPct.toFixed(0)}%</strong></div><div class="metric"><span>Profit needed to pass</span><strong>${money(extraProfitNeeded)}</strong></div>`;
    const typeMsg = type==='eod' ? 'Apex-style EOD mode: use the highest closing balance; intraday unrealized spikes should not move the threshold.' : type==='trailing' ? 'Intraday trailing mode: high-water mark may move with unrealized intraday profits, depending on firm rules.' : 'Static mode: threshold stays fixed from starting balance.';
    const drawdownMsg = cushion <= 0 ? 'This account would be at or below the failure threshold.' : cushion < dd*.25 ? 'Danger zone: one normal NQ loss could put this account near failure.' : 'Drawdown cushion looks workable.';
    const consistencyMsg = consistencyPass ? `Consistency passes: best day is under the ${consistencyPct}% limit.` : `Consistency fails: your best day is too large. Add about ${money(extraProfitNeeded)} more profit without increasing the best day, or wait until the rule is satisfied.`;
    document.getElementById('ddNote').textContent = `${typeMsg} ${drawdownMsg} ${consistencyMsg}`;
  }
  if(which==='nq'){
    const risk=num('market')*num('contracts')*num('stopPts'), pctDaily=risk/num('dailyLoss')*100, pctCush=risk/num('cushion')*100;
    document.getElementById('nqResults').innerHTML=`<div class="metric"><span>Dollar risk</span><strong>${money(risk)}</strong></div><div class="metric"><span>Daily loss used</span><strong>${pctDaily.toFixed(0)}%</strong></div><div class="metric"><span>Cushion used</span><strong>${pctCush.toFixed(0)}%</strong></div>`;
    document.getElementById('nqNote').textContent = pctDaily>50 || pctCush>35 ? 'Aggressive: this position size can damage the account quickly.' : 'Reasonable starting point if the setup quality is strong and rules allow it.';
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
    return `<article class="article wrap"><a class="btn" href="#firms">← All firms</a><h1>${f.name} for futures traders</h1><p class="lead">${f.fit}</p><div class="article-card"><h2>Rules in plain English</h2><p>This page is a launch-ready draft. Before going live with affiliate traffic, verify current evaluation prices, profit targets, drawdown mechanics, payout rules, activation fees, and prohibited strategies on the official ${f.name} website.</p><ul><li>Best use case: ${f.best}</li><li>Typical risk level: ${f.risk}</li><li>Drawdown note: ${f.drawdown}</li><li>Payout note: ${f.payout}</li></ul></div><div class="article-card"><h2>How NQ traders usually fail</h2><p>The common failure pattern is oversizing NQ contracts while the trailing drawdown is still close to the current balance. Use MNQ until the cushion is large enough, then scale only after the account has room.</p><a class="btn primary" href="#calculators">Run calculator for this account</a></div></article>`;
  }
  return `<section class="section"><div class="wrap"><div class="section-head"><div><h2>Starter firm pages.</h2><p class="subhead">Each page is structured for SEO, rule clarity, and future affiliate CTAs.</p></div></div><div class="firm-grid">${firms.map(f=>`<a class="firm" href="#firms/${f.id}"><div class="firm-top"><div><h3>${f.name}</h3><p>${f.fit}</p></div><span class="score">${f.score}</span></div><div class="firm-meta"><span class="pill ${riskClass(f.score)}">${f.best}</span><span class="pill">${f.risk} risk</span><span class="pill">${f.price}</span></div></a>`).join('')}</div></div></section>`;
}

function renderApexArticle(f){
  return `<article class="article wrap"><a class="btn" href="#firms">← All firms</a><h1>Apex Trader Funding: EOD vs Intraday drawdown</h1><p class="lead">Apex changed materially in 2026. Treat it as two different products: EOD trailing drawdown accounts and intraday trailing drawdown accounts.</p>
  <div class="article-card"><h2>Latest Apex rule picture</h2><ul><li><b>EOD drawdown:</b> recalculates once per day around the 4:59 PM ET market close, based on closing balance, then applies next session.</li><li><b>Intraday trailing:</b> can trail in real time from unrealized intraday highs, which is harsher for NQ traders who catch runners that pull back.</li><li><b>Daily Loss Limit:</b> EOD accounts include a DLL; intraday accounts are commonly described as not having the same DLL protection.</li><li><b>Important:</b> Apex pages are Cloudflare-protected and rules change often. Final launch should manually verify every number on Apex official help pages before sending paid traffic.</li></ul></div>
  <div class="article-card"><h2>EOD account specs found in 2026 research</h2><div class="table-wrap"><table><thead><tr><th>Size</th><th>Profit target</th><th>Max drawdown</th><th>Daily loss limit</th><th>Eval contracts</th><th>Retail EOD price</th></tr></thead><tbody><tr><td><strong>$25K EOD</strong></td><td>$1,500</td><td>$1,000</td><td>$500</td><td>4</td><td>$177</td></tr><tr><td><strong>$50K EOD</strong></td><td>$3,000</td><td>$2,000</td><td>$1,000</td><td>6</td><td>$197</td></tr><tr><td><strong>$100K EOD</strong></td><td>$6,000</td><td>$3,000</td><td>$1,500</td><td>8</td><td>$297</td></tr><tr><td><strong>$150K EOD</strong></td><td>$9,000</td><td>$4,000</td><td>$2,000</td><td>12</td><td>$397</td></tr></tbody></table></div><p class="disclaimer">Research snapshot: April/May 2026 third-party summaries plus Yahoo-indexed Apex help snippets. Verify official Apex pages before publishing final affiliate copy.</p></div>
  <div class="article-card"><h2>Why this matters for NQ traders</h2><p>On an intraday trailing account, an unrealized NQ runner can push the high-water mark up before you close the trade. If price reverses, your floor may already be higher. On Apex-style EOD drawdown, intraday spikes should not move the threshold; the account checks the closing balance instead.</p><p>For most NQ traders who hold trades for more than a few seconds, EOD is usually easier to manage. Pure tick scalpers may still compare intraday accounts if they are flat quickly.</p><a class="btn primary" href="#calculators">Run EOD drawdown calculator</a></div>
  <div class="article-card"><h2>Source notes to cite later</h2><ul><li>Yahoo-indexed official Apex result: “EOD Drawdown Explained - Apex Trader Funding” says it covers end-of-day threshold calculations, next-session enforcement, automatic liquidation, and when the threshold stops trailing.</li><li>PropTradingVibes 2026 EOD breakdown: EOD recalculates at 4:59 PM ET; intraday unrealized peaks are invisible to EOD; EOD accounts include DLLs by tier.</li><li>TheTradeBlog 2026 guide: EOD calculates once daily at market close, is enforced intraday next session, trails upward only, and distinguishes DLL from EOD failure threshold.</li></ul></div></article>`;
}

function renderDisclaimers(){return `<article class="article wrap"><h1>Disclosures & launch notes</h1><div class="article-card"><h2>Affiliate disclosure</h2><p>This site may earn commissions when visitors click partner links or use discount codes. Rankings should be based on rules, fit, and trader risk — not only commission size.</p></div><div class="article-card"><h2>Educational only</h2><p>Funded Futures Tools is not financial advice, investment advice, or a promise that users will pass an evaluation or make money. Futures trading carries substantial risk.</p></div><div class="article-card"><h2>Rule-change policy</h2><p>Prop firm rules, prices, discounts, payout policies, and restrictions change frequently. Every firm page should include a visible “last updated” date and link to the official rules.</p></div><div class="article-card"><h2>Before launch checklist</h2><ul><li>Verify each prop firm rule directly from official sources.</li><li>Replace placeholder buttons with approved affiliate/discount links.</li><li>Add privacy policy, terms, and final brand/domain.</li><li>Add email capture for the funded account rule checklist.</li></ul></div></article>`}

function bindGlobal(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>setTimeout(router,0)));
  document.getElementById('copyLink')?.addEventListener('click', async()=>{try{await navigator.clipboard.writeText(location.href); showToast('Link copied');}catch{showToast('Copy unavailable');}});
  document.getElementById('menuBtn')?.addEventListener('click',()=>showToast('Mobile menu is condensed into the page links for MVP.'));
  bindHelpDots();
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
  if(document.getElementById('calcPanel')) setCalc('drawdown');
  document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>setCalc(t.dataset.calc)));
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${name}`));
}
window.addEventListener('hashchange',router);
router();
