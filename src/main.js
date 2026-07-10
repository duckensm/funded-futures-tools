import './styles.css';
import { inject, track as vercelTrack } from '@vercel/analytics';
import { DEFAULT_CALCULATORS, calculateDrawdownState, calculateFuturesRisk, calculateLossStreakSurvival } from './calculatorLogic.js';

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

import { firms, money, num, finderRecommendation, firmTraits, affiliateActions, drawdownCalc, nqCalc, plannerCalc, pageShell } from './render.js';
import { QUIZ, quizWinner, quizResultCard } from './pages.js';
import { findRoute } from './routes.js';

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
  trackEvent('calculator_reset',{calculator:which,path:location.pathname});
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
    const {risk,pctDaily,pctCushion,rewardRisk}=calculateFuturesRisk({
      pointValue,
      contracts,
      stopPts,
      dailyLoss:num('dailyLoss'),
      cushion:num('cushion'),
      target:num('target'),
    });
    const stopInput=document.getElementById('stopPts');
    if(stopInput && selected?.dataset.step) stopInput.step=selected.dataset.step;
    const rewardRiskDisplay=rewardRisk>0 ? `${rewardRisk.toFixed(1)}R` : '--';
    document.getElementById('nqResults').innerHTML=`<div class="metric"><span>${symbol} dollar risk</span><strong>${money(risk)}</strong></div><div class="metric"><span>Daily loss used</span><strong>${pctDaily.toFixed(0)}%</strong></div><div class="metric"><span>Cushion used</span><strong>${pctCushion.toFixed(0)}%</strong></div><div class="metric"><span>Reward:risk</span><strong>${rewardRiskDisplay}</strong></div>`;
    document.getElementById('nqNote').textContent = pctDaily>50 || pctCushion>35 ? `Aggressive: ${contracts} ${symbol} contract(s) with a ${stopPts}-point stop can damage the account quickly.` : `Reasonable starting point for ${symbol} if the setup quality is strong and firm rules allow it.`;
    const spikePts=num('spikePts');
    const survival=calculateLossStreakSurvival({pointValue,contracts,stopPts,cushion:num('cushion'),spikePts});
    const survivalBox=document.getElementById('nqSurvival');
    if(survivalBox){
      survivalBox.innerHTML=`
        <h4>Consecutive losing trades you survive, by drawdown type</h4>
        <table class="survival-table">
          <thead><tr><th>Drawdown model</th><th>Losses survived</th><th>Where to get it</th></tr></thead>
          <tbody>
            <tr><td>Static</td><td><b>${survival.staticTrades}</b></td><td class="survival-cta">Static drawdown firms: <a href="/review/daytraders/">DayTraders →</a></td></tr>
            <tr><td>EOD trailing</td><td><b>${survival.eodTrades}</b></td><td class="survival-cta">Firms with EOD drawdown: <a href="/review/lucid-trading/">Lucid</a>, <a href="/review/phidias/">Phidias →</a></td></tr>
            <tr><td>Intraday trailing</td><td><b>${survival.intradayTrades}</b></td><td class="survival-cta">Assumes one ${spikePts}-point open-profit spike (${money(survival.spikeDollars)}) reverses and lifts the threshold first.</td></tr>
          </tbody>
        </table>
        <p class="survival-formula">The math: risk per trade = $${pointValue} × ${contracts} contract(s) × ${stopPts} pts = <b>${money(survival.riskPerTrade)}</b>. Static &amp; EOD: floor(cushion ÷ risk) = floor(${money(num('cushion'))} ÷ ${money(survival.riskPerTrade)}). Intraday trailing: floor((cushion − spike give-back) ÷ risk) = floor((${money(num('cushion'))} − ${money(survival.spikeDollars)}) ÷ ${money(survival.riskPerTrade)}). During a pure losing streak EOD matches static because no new end-of-day high is set; EOD thresholds rise on winning days instead.</p>`;
    }
  }
  if(which==='planner'){
    const daily=num('profitTarget')/Math.max(1,num('days')), lossesToFail=num('maxDailyLoss')/Math.max(1,num('riskTrade')), rr=daily/Math.max(1,num('riskTrade'));
    document.getElementById('planResults').innerHTML=`<div class="metric"><span>Daily target</span><strong>${money(daily)}</strong></div><div class="metric"><span>Trades to daily max loss</span><strong>${lossesToFail.toFixed(1)}</strong></div><div class="metric"><span>R needed / day</span><strong>${rr.toFixed(1)}R</strong></div>`;
    document.getElementById('planNote').textContent = rr>3 ? 'Very aggressive. Consider more days or lower daily expectations.' : 'More realistic pace. Avoid passing in one day if payout consistency rules matter.';
  }
}

function bindGlobal(){
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
  document.querySelectorAll('[data-outbound-firm]').forEach(a=>a.addEventListener('click',()=>trackEvent('outbound_firm_click',{firm:a.dataset.outboundFirm,source:a.dataset.outboundSource,path:location.pathname})));
  document.querySelectorAll('[data-copy-code]').forEach(btn=>btn.addEventListener('click', async()=>{
    const code=btn.dataset.copyCode;
    try{ await navigator.clipboard.writeText(code); showToast(`Code ${code} copied`); }catch{ showToast('Copy unavailable'); }
    trackEvent('coupon_code_copy',{firm:btn.dataset.copyFirm||'',code,path:location.pathname});
  }));
  initMarketTape();
  bindCompareFinder();
  bindLeadForm();
  bindInlineCapture();
  bindQuiz();
}
// Inline "eval tracker spreadsheet" capture. Posts to the existing MailerLite
// serverless endpoint. TODO(email-provider): once the final provider/automation
// is chosen, deliver the tracker spreadsheet from the welcome email for the
// eval_tracker_spreadsheet source and adjust the success copy below.
function bindInlineCapture(root=document){
  root.querySelectorAll('[data-inline-capture]').forEach(form=>{
    if(form.dataset.bound) return;
    form.dataset.bound='true';
    const status=form.parentElement.querySelector('[data-capture-status]');
    const context=form.parentElement.dataset.captureContext||'inline';
    form.addEventListener('submit', async event=>{
      event.preventDefault();
      const email=form.querySelector('input[type="email"]');
      const value=(email?.value||'').trim();
      if(!email?.checkValidity() || !value){ email?.focus(); return; }
      const submitBtn=form.querySelector('button[type="submit"]');
      submitBtn.disabled=true;
      if(status) status.textContent='Saving your email…';
      let saved=false;
      try{
        const response=await fetch('/api/subscribe',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({email:value,focus:'Eval tracker spreadsheet',path:location.pathname,source:'eval_tracker_spreadsheet'})
        });
        const data=await response.json().catch(()=>({}));
        saved=Boolean(response.ok && data.saved);
      }catch(err){
        console.warn('[inline capture unavailable]', err);
      }finally{
        submitBtn.disabled=false;
      }
      if(status) status.textContent=saved
        ? 'You’re on the list — the eval tracker will arrive by email.'
        : 'Signup could not be completed right now. Please try again later.';
      trackEvent('lead_magnet_submit',{focus:'Eval tracker spreadsheet',source:'eval_tracker_spreadsheet',context,path:location.pathname});
      trackEvent('lead_magnet_subscribe_status',{saved,error:saved?'none':'subscribe_failed',source:'eval_tracker_spreadsheet',path:location.pathname});
    });
  });
}
function bindQuiz(){
  const box=document.getElementById('quizBox');
  if(!box) return;
  let step=0;
  const picks=[];
  const render=()=>{
    if(step < QUIZ.questions.length){
      const q=QUIZ.questions[step];
      box.innerHTML=`
        <div class="quiz-progress"><span>Question ${step+1} of ${QUIZ.questions.length}</span><div class="quiz-bar"><i style="width:${(step/QUIZ.questions.length)*100}%"></i></div></div>
        <h3 class="quiz-question">${q.q}</h3>
        <div class="quiz-answers">${q.answers.map((a,i)=>`<button class="quiz-answer" type="button" data-answer="${i}">${a.label}</button>`).join('')}</div>
        ${step>0?'<button class="btn small quiz-back" type="button">← Back</button>':''}`;
      box.querySelectorAll('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>{
        picks[step]=q.answers[Number(btn.dataset.answer)];
        step+=1;
        if(step===QUIZ.questions.length){
          const {slug}=quizWinner(picks.slice(0,QUIZ.questions.length));
          trackEvent('quiz_complete',{firm:slug,path:location.pathname});
        }
        render();
      }));
      box.querySelector('.quiz-back')?.addEventListener('click',()=>{step-=1;render();});
    } else {
      const {slug,reasons}=quizWinner(picks);
      box.innerHTML=`${quizResultCard(slug,reasons)}<button class="btn small quiz-back" type="button">↺ Retake the quiz</button>`;
      box.querySelector('.quiz-back')?.addEventListener('click',()=>{step=0;picks.length=0;render();});
      box.querySelectorAll('[data-outbound-firm]').forEach(a=>a.addEventListener('click',()=>trackEvent('outbound_firm_click',{firm:a.dataset.outboundFirm,source:a.dataset.outboundSource,path:location.pathname})));
      box.querySelectorAll('[data-copy-code]').forEach(btn=>btn.addEventListener('click', async()=>{
        const code=btn.dataset.copyCode;
        try{ await navigator.clipboard.writeText(code); showToast(`Code ${code} copied`); }catch{ showToast('Copy unavailable'); }
        trackEvent('coupon_code_copy',{firm:btn.dataset.copyFirm||'',code,path:location.pathname});
      }));
      bindInlineCapture(box);
    }
  };
  render();
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
    result.innerHTML=`<span class="finder-kicker">Recommended starting point</span><h3>${f.name}</h3><p>${f.fit}</p><div class="finder-tags">${firmTraits(f).map(t=>`<span>${t}</span>`).join('')}</div>${affiliateActions(f,true)}`;
  };
  goal?.addEventListener('change',()=>{renderResult(); trackEvent('prop_firm_finder_change',{goal:goal.value,path:location.pathname});});
  renderResult();
  const chips=[...document.querySelectorAll('.filter-chip')];
  const cards=[...document.querySelectorAll('[data-firm-card],[data-firm-row]')];
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
  chips.forEach(btn=>btn.addEventListener('click',()=>{chips.forEach(b=>b.classList.remove('active')); btn.classList.add('active'); apply(); trackEvent('prop_firm_filter_click',{filter:btn.dataset.filter,path:location.pathname});}));
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
    const payload={email:value,focus:focus.value,path:location.pathname,source:'nq_prop_firm_checklist'};
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
    trackEvent('lead_magnet_checklist_open',{focus:focus.value,path:location.pathname});
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

// --- MPA bootstrap ---------------------------------------------------------
// Pages are pre-rendered into #app at build time (scripts/prerender.mjs) and
// served at real paths. This script only redirects legacy #hash URLs, fills
// #app as a fallback when the static HTML is missing (e.g. plain `vite dev`
// without the SSG middleware), and binds interactivity.

const LEGACY_HASH_ROUTES = {
  home: '/', compare: '/compare/', checklist: '/checklist/', calculators: '/calculators/',
  firms: '/firms/', disclaimers: '/disclaimers/', privacy: '/privacy/', terms: '/terms/',
  'best-nq-prop-firms': '/best-nq-prop-firms.html'
};

function redirectLegacyHash(){
  const hash = location.hash.replace('#','');
  if(!hash || location.pathname !== '/') return false;
  const [name, sub] = hash.split('/');
  if(!(name in LEGACY_HASH_ROUTES)) return false;
  const target = name === 'firms' && sub ? `/firms/${sub}/` : LEGACY_HASH_ROUTES[name];
  if(target === '/') return false; // already home; keep any in-page anchor behavior
  location.replace(target);
  return true;
}

function currentPath(){
  let p = location.pathname;
  if(!p.endsWith('/')) p += '/';
  return p;
}

function hydrate(){
  const app = document.getElementById('app');
  if(app && !app.innerHTML.trim()){
    const route = findRoute(currentPath()) || findRoute('/');
    document.title = route.title;
    app.innerHTML = pageShell(route.render());
  }
  bindGlobal();
  if(document.getElementById('calcPanel')) setCalc('drawdown');
  document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>{trackEvent('calculator_tab_click',{calculator:t.dataset.calc,path:location.pathname}); setCalc(t.dataset.calc);}));
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===currentPath()));
  trackEvent('route_view',{route:currentPath(),path:location.pathname});
}

if(!redirectLegacyHash()) hydrate();
