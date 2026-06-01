import './styles.css';

const firms = [
  {id:'apex', name:'Apex Trader Funding', category:'Best high-search Apex/EOD option', best:'Official EOD rules checked in Chrome', price:'Retail prices still verify at checkout', target:'$1.5k / $3k / $6k / $9k', drawdown:'EOD trailing + intraday trailing', daily:'EOD DLL: $500 / $1k / $1.5k / $2k', payout:'100% split; 5 qualifying days; 50% consistency; max 6 payouts', risk:'Medium', officialUrl:'https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/', lastVerified:'2026-05-31', verification:'official', fit:'Best for NQ traders who want a heavily searched futures prop firm and prefer officially documented EOD drawdown over intraday trailing.'},
  {id:'myfundedfutures', name:'MyFundedFutures', category:'Best modern futures-specific alternative', best:'Official help-center rules checked', price:'Flex $95/$153; Rapid $109/$157/$267/$347; Pro $227/$344/$477; Builder $153', target:'$1.5k / $3k / $6k / $9k', drawdown:'Max EOD trailing; locks at starting balance + $100', daily:'No daily loss limit listed for evals; payout page says none on Flex/Rapid/Pro', payout:'Rapid daily/90%; Flex after 5 winning days/80%; Pro every 14 days/80%', risk:'Medium', officialUrl:'https://help.myfundedfutures.com/en/articles/11802636-traders-evaluation-simplified', lastVerified:'2026-05-31', verification:'official', fit:'Best for NQ traders comparing newer futures-specific plans with no activation fee, EOD drawdown, and plan-specific payout rules.'},
  {id:'takeprofittrader', name:'TakeProfitTrader', category:'Best day-one payout candidate', best:'Official homepage/help rules checked', price:'$150 / $170 / $245 / $330 / $360 monthly; NOFEE30 promo checked', target:'50K verified at $3,000; other sizes verify in checkout/card view', drawdown:'Test EOD trailing; PRO intraday trailing; PRO+ EOD', daily:'50K page shows DLL $1,100 removed; PRO daily loss rule none', payout:'PRO 80/20 day-one after buffer; PRO+ 90/10 no buffer', risk:'Medium-High', officialUrl:'https://takeprofittrader.com/', lastVerified:'2026-05-31', verification:'official', fit:'Best for traders who prioritize day-one PRO withdrawals and are willing to manage buffer and intraday PRO drawdown rules.'},
  {id:'tradeify', name:'Tradeify', category:'Best newer model to investigate', best:'Modern trader funding option', price:'Needs official verification', target:'Needs official verification', drawdown:'Needs official verification', daily:'Needs official verification', payout:'Needs official verification', risk:'Medium', officialUrl:'https://tradeify.co/', lastVerified:'Not yet verified', verification:'unverified', fit:'Best for traders comparing newer prop firm models and payout structures.'},
  {id:'bulenox', name:'Bulenox', category:'Best budget/promo candidate', best:'Budget promos', price:'Needs official verification', target:'Needs official verification', drawdown:'Needs official verification', daily:'Needs official verification', payout:'Needs official verification', risk:'High', officialUrl:'https://bulenox.com/', lastVerified:'Not yet verified', verification:'unverified', fit:'Best for deal seekers who read rules carefully.'},
  {id:'lucidtraderfunding', name:'Lucid Trader Funding', category:'Newer alternative to verify', best:'Newer futures funding alternative', price:'Needs official verification', target:'Needs official verification', drawdown:'Needs official verification', daily:'Needs official verification', payout:'Needs official verification', risk:'Medium-High', officialUrl:'https://lucidfunding.com/', lastVerified:'Not yet verified', verification:'unverified', fit:'Best for traders who want to compare newer futures funding options after checking the bigger names.'},
  {id:'earn2trade', name:'Earn2Trade', category:'Legacy structured evaluation', best:'Legacy structured evaluations', price:'Needs official verification', target:'Needs official verification', drawdown:'Needs official verification', daily:'Needs official verification', payout:'Needs official verification', risk:'Medium', officialUrl:'https://www.earn2trade.com/', lastVerified:'Not yet verified', verification:'unverified', fit:'Best as a secondary/legacy comparison, not as the headline top prop firm.'}
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
function verificationClass(f){ return f.verification === 'official' ? 'green' : f.verification === 'research-snapshot' ? 'amber' : ''; }
function verificationLabel(f){ return f.verification === 'official' ? `Officially checked ${f.lastVerified}` : f.verification === 'research-snapshot' ? `Research snapshot — ${f.lastVerified}` : 'Needs official verification'; }

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
  const rows = firms.map(f=>`<tr><td><strong>${f.name}</strong><br><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span></td><td><strong>${f.category}</strong><br><span class="muted-small">${f.best}</span></td><td>${f.price}</td><td>${f.target}</td><td>${f.drawdown}</td><td>${f.daily}</td><td><span class="pill">${f.risk}</span></td><td><a class="btn small" href="#firms/${f.id}">Details</a></td></tr>`).join('');
  return `<section class="section" id="compare"><div class="wrap"><div class="section-head"><div><h2>Futures prop firm comparison.</h2><p class="subhead">This is now a verification-first buyer-intent shortlist, not a fake numeric ranking. Unverified firms stay visibly marked until their official rules are checked.</p></div>${full?'<a class="btn" href="#calculators">Check risk</a>':''}</div><div class="table-wrap"><table><thead><tr><th>Firm</th><th>Category</th><th>Price</th><th>Profit target</th><th>Drawdown</th><th>Daily loss</th><th>Risk</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></div></section>`;
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
    if(f.id==='myfundedfutures') return renderMyFundedFuturesArticle(f);
    if(f.id==='takeprofittrader') return renderTakeProfitTraderArticle(f);
    return `<article class="article wrap"><a class="btn" href="#firms">← All firms</a><h1>${f.name} for futures traders</h1><p class="lead">${f.fit}</p><div class="article-card verify-card"><h2>Verification status</h2><p><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span></p><p>Official source to check: <a href="${f.officialUrl}" target="_blank" rel="noreferrer">${f.officialUrl}</a></p><p class="disclaimer">This firm is not ready for affiliate traffic until the official rules are checked and this page has a real last-verified date.</p></div><div class="article-card"><h2>Rules in plain English</h2><p>This page is a verification template. Before going live with affiliate traffic, verify current evaluation prices, profit targets, drawdown mechanics, payout rules, activation fees, reset fees, consistency rules, contract limits, and prohibited strategies on the official ${f.name} website.</p><ul><li>Category: ${f.category}</li><li>Typical risk level: ${f.risk}</li><li>Price: ${f.price}</li><li>Profit target: ${f.target}</li><li>Drawdown note: ${f.drawdown}</li><li>Daily loss: ${f.daily}</li><li>Payout note: ${f.payout}</li></ul></div><div class="article-card"><h2>How NQ traders usually fail</h2><p>The common failure pattern is oversizing NQ contracts while the trailing drawdown is still close to the current balance. Use MNQ until the cushion is large enough, then scale only after the account has room.</p><a class="btn primary" href="#calculators">Run calculator for this account</a></div></article>`;
  }
  return `<section class="section"><div class="wrap"><div class="section-head"><div><h2>Firm verification queue.</h2><p class="subhead">These pages are now organized by buyer-intent category and visibly marked until official rules are checked.</p></div></div><div class="firm-grid">${firms.map(f=>`<a class="firm" href="#firms/${f.id}"><div class="firm-top"><div><h3>${f.name}</h3><p>${f.fit}</p></div><span class="status-dot ${verificationClass(f)}"></span></div><div class="firm-meta"><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span><span class="pill">${f.risk} risk</span><span class="pill">${f.category}</span></div></a>`).join('')}</div></div></section>`;
}



function renderTakeProfitTraderArticle(f){
  return `<article class="article wrap"><a class="btn" href="#firms">← All firms</a><h1>TakeProfitTrader: day-one PRO payouts, buffer rules, and PRO vs PRO+ drawdown</h1><p class="lead">TakeProfitTrader's official homepage and help center emphasize a one-step test, day-one PRO withdrawals after buffer, and a later PRO+ upgrade with EOD drawdown and 90/10 split.</p>
  <div class="article-card verify-card"><h2>Verification status</h2><p><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span></p><p>Official source checked: <a href="${f.officialUrl}" target="_blank" rel="noreferrer">${f.officialUrl}</a></p><p class="disclaimer">Official homepage and Help Center pages were checked in the user's Chrome browser on 2026-05-31. The 50K card was visible and captured; other account cards/prices should still be rechecked in checkout before paid traffic.</p></div>
  <div class="article-card"><h2>Homepage pricing and 50K test card captured</h2><div class="table-wrap"><table><thead><tr><th>Size</th><th>Monthly price shown</th><th>Captured specs</th></tr></thead><tbody><tr><td><strong>25K</strong></td><td>$150/month</td><td>Full card needs checkout/card verification</td></tr><tr><td><strong>50K</strong></td><td>$170/month</td><td>Profit target $3,000; max position 6 contracts / 60 micros; EOD trailing drawdown $2,000; Daily Loss Limit $1,100 marked “Removed”</td></tr><tr><td><strong>75K</strong></td><td>$245/month</td><td>Full card needs checkout/card verification</td></tr><tr><td><strong>100K</strong></td><td>$330/month</td><td>Full card needs checkout/card verification</td></tr><tr><td><strong>150K</strong></td><td>$360/month</td><td>Full card needs checkout/card verification</td></tr></tbody></table></div></div>
  <div class="article-card"><h2>Test rules checked</h2><ul><li><b>Minimum trading days:</b> Help Center Rule 5 says traders must trade a minimum of 5 trading days; a trading day requires at least one trade.</li><li><b>Consistency:</b> no single trading day may exceed 50% of total net profits. If above 50%, the test is not failed; the trader needs more total profit until consistency is below 50%.</li><li><b>Test drawdown:</b> homepage comparison lists Test drawdown as End Of Day. The visible 50K card shows EOD trailing drawdown of $2,000.</li><li><b>Prohibited basics:</b> homepage and rules mention be consistent, no trading bots, and no counter positions.</li><li><b>Reset pricing:</b> official reset page lists 25K $79, 50K $99, 75K $139, 100K $169, 150K $199.</li></ul></div>
  <div class="article-card"><h2>PRO and PRO+ payout rules checked</h2><ul><li><b>PRO split:</b> official withdrawal article says PRO accounts use an 80/20 split; trader keeps 80%.</li><li><b>Day-one withdrawals:</b> homepage says PRO withdrawals can begin day one, with no payout window, once profits above buffer are available.</li><li><b>Buffer:</b> PRO withdrawal article says the buffer equals max drawdown. Buffer-zone balances listed: 25K $26,500; 50K $52,000; 75K $77,500; 100K $103,000; 150K $154,500.</li><li><b>Inside-buffer withdrawal:</b> possible only after account termination; 50% of buffer if ≤60 trading days since account opening, 80% if >60 trading days.</li><li><b>PRO+:</b> homepage/promo FAQ says PRO+ has EOD drawdown, 90/10 profit split, and no buffer requirement.</li><li><b>Funded accounts:</b> official FAQ says up to five funded accounts total across PRO and PRO+.</li></ul></div>
  <div class="article-card"><h2>PRO account risk rules checked</h2><ul><li>No automated/bot trading; trades must be manually executed.</li><li>Must exit before limit-up/limit-down price limits; if a price limit is hit without exiting, the PRO account is lost.</li><li>Must trade at least one day per calendar week Sunday-Friday to keep the PRO account active.</li><li>No counter positions in opposite directions within the same or closely related products.</li><li>PRO uses intraday trailing drawdown based on peak balance including unrealized gains; it stops once it reaches starting balance.</li><li>All PRO accounts must have no open positions/orders one minute before, during, and one minute after prohibited news events such as FOMC, NFP, and CPI.</li></ul></div>
  <div class="article-card"><h2>Promo checked</h2><p>The NOFEE30 Help Center page says the limited-time promo gives 30% lifetime discount off any account and waives the $130 PRO activation fee for life on that account. The same page says monthly subscription stops after moving to PRO and mentions no funded consistency rule, no scaling plan, and no maximum withdrawal amount. Treat this as promo-specific and verify current checkout before publishing coupons.</p></div>
  <div class="article-card"><h2>Official TakeProfitTrader pages checked</h2><ul><li>https://takeprofittrader.com/</li><li>https://takeprofittraderhelp.zendesk.com/hc/en-us/articles/15170316538013-Rule-5-Be-Consistent</li><li>https://takeprofittraderhelp.zendesk.com/hc/en-us/articles/15172219527581-PRO-Account-Profit-Split-Withdrawal-Rules</li><li>https://takeprofittraderhelp.zendesk.com/hc/en-us/articles/15171769361053-PRO-Account-Rules</li><li>https://takeprofittraderhelp.zendesk.com/hc/en-us/articles/15140989806493-Resetting-Your-Test-Account</li><li>https://takeprofittraderhelp.zendesk.com/hc/en-us/articles/36337706971677-NOFEE30-PROMO-FAQ</li></ul></div>
  <div class="article-card"><h2>Why this matters for NQ traders</h2><p>TakeProfitTrader looks attractive for traders who want fast access to payouts, but the PRO-stage intraday trailing drawdown can punish oversized NQ runners. The PRO+ upgrade improves the drawdown/payout profile, but the test and PRO buffer rules still matter. Use MNQ while building buffer, and do not treat “day-one payout” as permission to overleverage.</p><a class="btn primary" href="#calculators">Run drawdown calculator</a></div></article>`;
}

function renderMyFundedFuturesArticle(f){
  return `<article class="article wrap"><a class="btn" href="#firms">← All firms</a><h1>MyFundedFutures: EOD drawdown, no activation fee, and plan-specific payouts</h1><p class="lead">MyFundedFutures is a newer futures-specific prop firm with multiple plan types. The official help center shows a common evaluation structure, Max EOD trailing drawdown, no activation fee, and different payout rules for Rapid, Flex, and Pro plans.</p>
  <div class="article-card verify-card"><h2>Verification status</h2><p><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span></p><p>Official source checked: <a href="${f.officialUrl}" target="_blank" rel="noreferrer">${f.officialUrl}</a></p><p class="disclaimer">Official MyFundedFutures help-center pages were checked on 2026-05-31. Public help articles list plan prices/resets, but live checkout discounts and coupons should still be verified before promotion.</p></div>
  <div class="article-card"><h2>Evaluation account specs checked</h2><div class="table-wrap"><table><thead><tr><th>Plan / Size</th><th>Profit target</th><th>Max loss / drawdown</th><th>Daily loss</th><th>Contracts</th><th>Price / reset</th></tr></thead><tbody><tr><td><strong>Flex 25K</strong></td><td>$1,500</td><td>$1,000 EOD</td><td>None</td><td>3 mini / 30 micro</td><td>$95</td></tr><tr><td><strong>Flex 50K</strong></td><td>$3,000</td><td>$2,000 EOD</td><td>None</td><td>5 mini / 50 micro</td><td>$153</td></tr><tr><td><strong>Rapid 25K</strong></td><td>$1,500</td><td>$1,000 EOD</td><td>None</td><td>3 mini / 30 micro</td><td>$109</td></tr><tr><td><strong>Rapid 50K</strong></td><td>$3,000</td><td>$2,000 EOD</td><td>None</td><td>5 mini / 50 micro</td><td>$157</td></tr><tr><td><strong>Rapid 100K</strong></td><td>$6,000</td><td>$3,000 EOD</td><td>None</td><td>10 mini / 100 micro</td><td>$267</td></tr><tr><td><strong>Rapid 150K</strong></td><td>$9,000</td><td>$4,500 EOD</td><td>None</td><td>15 mini / 150 micro</td><td>$347</td></tr><tr><td><strong>Pro 50K</strong></td><td>$3,000*</td><td>$2,000 EOD</td><td>None</td><td>6 mini / 60 micro</td><td>$227</td></tr><tr><td><strong>Pro 100K</strong></td><td>$6,000</td><td>$3,000 EOD</td><td>None</td><td>9 mini / 90 micro</td><td>$344</td></tr><tr><td><strong>Pro 150K</strong></td><td>$9,000</td><td>$4,500 EOD</td><td>None</td><td>15 mini / 150 micro</td><td>$477</td></tr></tbody></table></div><p class="disclaimer">*The official evaluation article notes the Pro Plan One Day Add-On has a $4,000 evaluation profit target. Builder 100K is listed at $153 in the same price table, but builder-plan details should be checked separately before featuring it.</p></div>
  <div class="article-card"><h2>Drawdown and consistency rules</h2><ul><li><b>Max EOD trailing:</b> MyFundedFutures says its Max EOD drawdown is calculated as an end-of-day drawdown and “locks in at $100 plus the initial starting balance.”</li><li><b>Open equity risk:</b> the help article warns that open equity losses are considered when determining whether the account failed the Max EOD rule.</li><li><b>No daily loss limit:</b> the evaluation article lists Daily Loss Limit as “None” for Flex, Rapid, and Pro evaluation rows; the payout overview also says no daily loss limits on Flex, Rapid, or Pro plans.</li><li><b>50% evaluation consistency:</b> official help says all Rapid, Flex, and Pro evaluations use a 50% consistency rule, except the Pro One Day pass add-on.</li><li><b>Minimum trading days:</b> evaluation table lists 2 minimum trading days.</li><li><b>T1 news trading:</b> listed as allowed during evaluations; news restrictions apply later to Rapid Sim Funded and Pro Sim Funded.</li></ul></div>
  <div class="article-card"><h2>Payout rules checked</h2><ul><li><b>Rapid:</b> daily payout frequency; first payout eligible 24 hours after first trade if buffer and minimum profit are met; $500 minimum withdrawal; 90% split for Rapid sim funded plans as of January 12, 2026.</li><li><b>Rapid buffers:</b> 50K $2,100, 100K $3,100, 150K $4,600. The payout article says Rapid has no consistency rules.</li><li><b>Flex:</b> payout after 5 winning days; minimum daily profit $100 on 25K Flex or $150 on 50K Flex; $250 minimum withdrawal; max request is 50% of net profits up to $3,000 on 25K or $5,000 on 50K; 80% split.</li><li><b>Pro:</b> payout every 14 calendar days from first trade; buffer target required; $1,000 minimum withdrawal; up to $100,000 max request in sim-funded stage; 80% split.</li><li><b>Activation fee:</b> official help article says all MFFU plans come with a $0 activation fee.</li></ul></div>
  <div class="article-card"><h2>Official MyFundedFutures pages checked</h2><ul><li>https://help.myfundedfutures.com/en/articles/11802636-traders-evaluation-simplified</li><li>https://help.myfundedfutures.com/en/articles/8348565-max-eod-trailing</li><li>https://help.myfundedfutures.com/en/articles/11994562-consistency-rule-at-my-funded-futures</li><li>https://help.myfundedfutures.com/en/articles/12398151-does-myfunded-futures-charge-activation-fee</li><li>https://help.myfundedfutures.com/en/articles/13745661-payout-policy-overview-best-and-fastest-prop-firm-payouts</li><li>https://help.myfundedfutures.com/en/articles/8230009-news-trading-policy</li></ul></div>
  <div class="article-card"><h2>Why this matters for NQ traders</h2><p>For NQ traders, the main attraction is the combination of EOD-style drawdown and no daily loss limit, but that does not mean unlimited risk. A single oversized NQ trade can still push open equity below the allowed level. Use MNQ while the Max EOD cushion is small, and check whether Rapid, Flex, or Pro payout rules fit your trading pace.</p><a class="btn primary" href="#calculators">Run drawdown calculator</a></div></article>`;
}

function renderApexArticle(f){
  return `<article class="article wrap"><a class="btn" href="#firms">← All firms</a><h1>Apex Trader Funding: EOD vs Intraday drawdown</h1><p class="lead">Apex changed materially in 2026. Treat it as two different products: EOD trailing drawdown accounts and intraday trailing drawdown accounts.</p>
  <div class="article-card verify-card"><h2>Verification status</h2><p><span class="pill ${verificationClass(f)}">${verificationLabel(f)}</span></p><p>Official source to manually check: <a href="${f.officialUrl}" target="_blank" rel="noreferrer">${f.officialUrl}</a></p><p class="disclaimer">Apex EOD rule pages were checked in the user's Chrome browser on 2026-05-31. Pricing and checkout discounts should still be verified at checkout before affiliate promotion.</p></div>
  <div class="article-card"><h2>Latest official Apex EOD rule picture</h2><ul><li><b>EOD drawdown:</b> calculated once per trading day at 4:59:59 PM ET, based on the account's closing balance.</li><li><b>Enforcement:</b> once calculated, the EOD threshold is enforced during the next trading session; touching or falling below it fails the evaluation or closes the PA.</li><li><b>No intraday trailing drawdown:</b> Apex's EOD pages state there is no intraday trailing drawdown on EOD accounts.</li><li><b>Daily Loss Limit:</b> EOD evaluations and EOD PAs have DLLs enforced intraday by account size.</li><li><b>Evaluation pass:</b> no minimum trading days required; a trader may pass in one day if the profit target is reached and rules are respected.</li><li><b>PA activation window:</b> after passing, Apex says traders have 7 calendar days to activate the corresponding EOD Performance Account.</li></ul></div>
  <div class="article-card"><h2>EOD account specs found in 2026 research</h2><div class="table-wrap"><table><thead><tr><th>Size</th><th>Profit target</th><th>Max drawdown</th><th>Daily loss limit</th><th>Eval contracts</th><th>Retail EOD price</th></tr></thead><tbody><tr><td><strong>$25K EOD</strong></td><td>$1,500</td><td>$1,000</td><td>$500</td><td>4</td><td>$177</td></tr><tr><td><strong>$50K EOD</strong></td><td>$3,000</td><td>$2,000</td><td>$1,000</td><td>6</td><td>$197</td></tr><tr><td><strong>$100K EOD</strong></td><td>$6,000</td><td>$3,000</td><td>$1,500</td><td>8</td><td>$297</td></tr><tr><td><strong>$150K EOD</strong></td><td>$9,000</td><td>$4,000</td><td>$2,000</td><td>12</td><td>$397</td></tr></tbody></table></div><p class="disclaimer">Official Apex source checked in Chrome: /help-center/eod-trailing-drawdown-accounts/eod-evaluations/ on 2026-05-31. Pricing/coupons should still be verified at checkout.</p></div>
  <div class="article-card"><h2>Apex EOD payout rules checked</h2><ul><li>Approved EOD PA payouts are listed as a 100% payout split.</li><li>Minimum 5 qualifying trading days are required before payout request.</li><li>Minimum daily profit per qualifying day: $100 on 25K, $250 on 50K, $300 on 100K, $350 on 150K.</li><li>50% consistency rule applies: no single profitable day may be 50% or more of total profit since the last approved payout.</li><li>Minimum payout request is $500.</li><li>Each EOD Performance Account may receive a maximum of six payouts, then the PA is closed.</li></ul></div><div class="article-card"><h2>Why this matters for NQ traders</h2><p>On an intraday trailing account, an unrealized NQ runner can push the high-water mark up before you close the trade. If price reverses, your floor may already be higher. On Apex-style EOD drawdown, Apex's official EOD pages state there is no intraday trailing drawdown; the threshold is calculated from the end-of-day balance and enforced afterward.</p><p>For most NQ traders who hold trades for more than a few seconds, EOD is usually easier to manage. Pure tick scalpers may still compare intraday accounts if they are flat quickly.</p><a class="btn primary" href="#calculators">Run EOD drawdown calculator</a></div>
  <div class="article-card"><h2>Official Apex pages checked</h2><ul><li>https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/eod-evaluations/</li><li>https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/eod-drawdown-explained/</li><li>https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/eod-performance-accounts-pa/</li><li>https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/eod-payouts/</li></ul></div></article>`;
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
