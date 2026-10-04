import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { firms, affiliateFirms, comparisonFirms } from '../src/data/firms.js';
import { buildSitemap } from '../src/routes.js';

const sitemap = buildSitemap();

test('best NQ prop firms page is a public SEO page with disclosures', async () => {
  const html = await readFile(new URL('../public/best-nq-prop-firms.html', import.meta.url), 'utf8');

  assert.match(html, /<title>Best NQ Prop Firms for NQ\/MNQ Traders \| Futures Prop Edge<\/title>/);
  assert.match(html, /<h1>Best NQ Prop Firms for NQ\/MNQ Traders<\/h1>/);
  assert.match(html, /Affiliate disclosure/);
  assert.match(html, /Apex Trader Funding/);
  assert.match(html, /Official source only/);
  assert.doesNotMatch(html, /Funded Futures Tools/);
});

test('sitemap includes the best NQ prop firms SEO page', () => {

  assert.match(sitemap, /https:\/\/futurespropedge\.com\/best-nq-prop-firms\.html/);
});

test('Lucid vs Apex page is a public SEO page with disclosures', async () => {
  const html = await readFile(new URL('../public/lucid-trading-vs-apex-nq-traders.html', import.meta.url), 'utf8');

  assert.match(html, /<title>Lucid Trading vs Apex for NQ Traders \| Futures Prop Edge<\/title>/);
  assert.match(html, /<h1>Lucid Trading vs Apex for NQ Traders<\/h1>/);
  assert.match(html, /Lucid Trading/);
  assert.match(html, /Apex Trader Funding/);
  assert.match(html, /Affiliate disclosure/);
  assert.match(html, /Recommended/);
  assert.match(html, /more-account capacity/);
  assert.match(html, /Futures Prop Edge is not an affiliate of either firm/);
  assert.match(html, /thelegendstrading\.com\/\?ref=dutrading/);
  assert.doesNotMatch(html, /lucidtrading\.com\/ref/);
  assert.doesNotMatch(html, /fastest growing/i);
  assert.doesNotMatch(html, /Funded Futures Tools/);
});

test('sitemap includes the Lucid vs Apex SEO page', () => {

  assert.match(sitemap, /https:\/\/futurespropedge\.com\/lucid-trading-vs-apex-nq-traders\.html/);
});

test('best EOD drawdown page is a public SEO page with disclosures', async () => {
  const html = await readFile(new URL('../public/best-eod-drawdown-prop-firms-nq-traders.html', import.meta.url), 'utf8');

  assert.match(html, /<title>Best EOD Drawdown Prop Firms for NQ Traders \| Futures Prop Edge<\/title>/);
  assert.match(html, /<h1>Best EOD Drawdown Prop Firms for NQ Traders<\/h1>/);
  assert.match(html, /Lucid Trading/);
  assert.match(html, /Apex Trader Funding/);
  assert.match(html, /Affiliate disclosure/);
  assert.match(html, /Recommended first look/);
  assert.doesNotMatch(html, /fastest growing/i);
  assert.doesNotMatch(html, /Funded Futures Tools/);
});

test('sitemap includes the best EOD drawdown SEO page', () => {

  assert.match(sitemap, /https:\/\/futurespropedge\.com\/best-eod-drawdown-prop-firms-nq-traders\.html/);
});

test('homepage exposes SEO guides after the decision tools and offers', async () => {
  const main = await readFile(new URL('../src/render.js', import.meta.url), 'utf8');

  assert.match(main, /href="\/#guides">Guides<\/a>/);
  assert.match(main, /id="guides"/);
  assert.match(main, /href="\/best-nq-prop-firms\.html"/);
  assert.match(main, /href="\/lucid-trading-vs-apex-nq-traders\.html"/);
  assert.match(main, /href="\/best-eod-drawdown-prop-firms-nq-traders\.html"/);

  const offersIndex = main.indexOf('${offersSection()}');
  const guidesIndex = main.indexOf('${guidesSection()}');
  const compareIndex = main.indexOf('${comparisonSection(false)}');

  assert.ok(offersIndex > -1, 'offer banners should stay on the homepage');
  assert.ok(guidesIndex > offersIndex, 'guides should appear after offers');
  assert.ok(compareIndex > offersIndex, 'comparison table should remain after offers');
  assert.ok(guidesIndex > compareIndex, 'guides should follow the comparison and checklist');
});

test('homepage award plaques carry every partner offer and a top market tape', async () => {
  const main = await readFile(new URL('../src/render.js', import.meta.url), 'utf8');

  assert.match(main, /class="top-market-tape"/);
  assert.match(main, /FOREXCOM:SPXUSD,FOREXCOM:NSXUSD,CMCMARKETS:GOLD,TVC:USOIL/);
  assert.match(main, /function offerBanners\(/);
  assert.doesNotMatch(main, /Valid through July 2 at 5 PM ET/);

  const offers = Object.fromEntries(affiliateFirms.map((f) => [f.slug, `${f.offer} | ${f.offerDetail}`]));
  assert.deepEqual(offers, {
    'legends-trading': 'Current code offer | Apprentice and Elite plans',
    phidias: 'Up to 80% off | One-time payment accounts',
    'alpha-futures': '25% off | Premium plans',
    daytraders: 'Auto-applied offer | Tracked link applies available promotion',
    bulenox: 'Current code offer | Option 1 and Option 2 pricing',
    earn2trade: 'Current code offer | Trader Career Path',
  });
});

test('comparison table uses a short source-review badge', async () => {
  const main = await readFile(new URL('../src/render.js', import.meta.url), 'utf8');
  assert.match(main, /f\.verification === 'official' \? 'Source reviewed'/);
  assert.doesNotMatch(main, /Official sources reviewed/);
});

// --- Affiliate data layer ----------------------------------------------------

const EXPECTED_PARTNERS = {
  phidias: { code: 'DUTRADING', url: 'https://member.phidiaspropfirm.com/aff/go/duckensm' },
  'alpha-futures': { code: 'Duckens026406', url: 'https://app.alpha-futures.com/signup/Duckens026406/' },
  daytraders: { code: 'DUTRADING', url: 'https://daytraders.com/go/dutrading?c=TNTIQNUL' },
  'legends-trading': { code: 'DUTRADING', url: 'https://thelegendstrading.com/?ref=dutrading' },
  bulenox: { code: 'dutrading', url: 'https://bulenox.com/member/aff/go/dutrading' },
  earn2trade: { code: 'dutrading', url: 'https://www.earn2trade.com/trader-career-path?a_pid=dutrading&a_bid=8d7b4b9e' },
};

test('the six affiliate partners carry the verified partner links and codes', () => {
  assert.equal(affiliateFirms.length, 6);
  assert.equal(affiliateFirms[0].slug, 'legends-trading', 'Best Overall pick leads the partner list');
  for (const [slug, expected] of Object.entries(EXPECTED_PARTNERS)) {
    const firm = firms.find((f) => f.slug === slug);
    assert.ok(firm, `missing partner firm: ${slug}`);
    assert.equal(firm.affiliate, true, `${slug} must be flagged affiliate`);
    assert.equal(firm.affiliateUrl, expected.url, `${slug} affiliate URL`);
    assert.equal(firm.code, expected.code, `${slug} code`);
    assert.ok(firm.badge && firm.lane, `${slug} needs badge and lane`);
    assert.ok(['static', 'eod_trailing', 'intraday_trailing'].includes(firm.drawdownType), `${slug} drawdownType`);
    assert.ok(Array.isArray(firm.pros) && firm.pros.length >= 3, `${slug} pros`);
    assert.ok(Array.isArray(firm.cons) && firm.cons.length >= 2, `${slug} cons`);
  }
});

test('comparison foils carry no referral CTA data', () => {
  const foils = comparisonFirms.map((f) => f.slug).sort();
  assert.deepEqual(foils, ['apex', 'lucid-trading', 'topstep']);
  for (const f of comparisonFirms) {
    assert.equal(f.affiliate, false);
    assert.equal(f.affiliateUrl, '', `${f.slug} must not have an affiliate URL`);
    assert.equal(f.code, '', `${f.slug} must not have a code`);
  }
});

test('dropped firms are gone from the data layer and renderers', async () => {
  const render = await readFile(new URL('../src/render.js', import.meta.url), 'utf8');
  const data = await readFile(new URL('../src/data/firms.js', import.meta.url), 'utf8');
  for (const gone of [/tradeify/i, /takeprofittrader/i, /myfundedfutures/i, /oneup/i]) {
    assert.doesNotMatch(render, gone);
    assert.doesNotMatch(data, gone);
  }
  assert.equal(firms.length, 9);
  assert.match(render, /<b>\$\{firms\.length\}<\/b> firms, checked against official sources/);
});

test('Lucid Trading is no longer a partner anywhere on the site', async () => {
  const files = ['../src/render.js', '../src/pages.js', '../src/main.js', '../src/data/firms.js',
    '../public/best-nq-prop-firms.html', '../public/best-eod-drawdown-prop-firms-nq-traders.html',
    '../public/lucid-trading-vs-apex-nq-traders.html'];
  for (const file of files) {
    const text = await readFile(new URL(file, import.meta.url), 'utf8');
    assert.doesNotMatch(text, /lucidtrading\.com\/ref/, `${file} still links the Lucid affiliate URL`);
    assert.doesNotMatch(text, /review\/lucid-trading|discount\/lucid-trading/, `${file} links a removed Lucid partner page`);
  }
});
