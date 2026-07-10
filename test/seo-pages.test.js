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
  assert.match(html, /preferred Lucid\/Apex rule fit/);
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
  assert.match(main, /OPEN GUIDES/);
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

test('homepage replaces the cockpit with current clickable affiliate offers and a top market tape', async () => {
  const main = await readFile(new URL('../src/render.js', import.meta.url), 'utf8');

  assert.doesNotMatch(main, /Nasdaq futures risk cockpit/);
  assert.match(main, /id:'alphafutures'[^\n]+code:'Duckens026406'/);
  assert.match(main, /id:'legendstrading'[^\n]+code:'DUTRADING'/);
  assert.match(main, /id:'daytraders'[^\n]+code:'DUTRADING'/);
  assert.doesNotMatch(main, /code:'(?:PREMIUM|LTG|TNTIQNUL)'/);
  assert.doesNotMatch(main, /nq-chart-card upgraded/);
  assert.match(main, /class="top-market-tape"/);
  assert.match(main, /FOREXCOM:SPXUSD,FOREXCOM:NSXUSD,CMCMARKETS:GOLD,TVC:USOIL/);
  assert.match(main, /function currentOffers\(\)/);
  assert.match(main, /Current code offer/);
  assert.doesNotMatch(main, /Valid through July 2 at 5 PM ET/);
  assert.match(main, /Up to 80% off/);
  assert.match(main, /One-time payment accounts/);
  assert.match(main, /25% off/);
  assert.match(main, /Premium plans/);
  assert.match(main, /80% \/ 45% off/);
  assert.match(main, /Apprentice \/ Elite plans/);
  assert.match(main, /Auto-applied offer/);
  assert.match(main, /Option 1 and Option 2 pricing/);
  assert.match(main, /Trader Career Path/);
  assert.doesNotMatch(main, /Current offers to check before you buy\./);

  const offerBanners = main.slice(
    main.indexOf('function currentOffers(){'),
    main.indexOf('function guidesSection(){')
  );
  assert.doesNotMatch(offerBanners, /Confirm final checkout price/);
});

test('comparison table uses a short source-review badge and preserves readable columns', async () => {
  const main = await readFile(new URL('../src/render.js', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.match(main, /f\.verification === 'official' \? 'Source reviewed'/);
  assert.doesNotMatch(main, /Official sources reviewed/);
  assert.match(styles, /\.table-details \.table-wrap\{overflow-x:auto\}/);
  assert.match(styles, /\.table-details table\{table-layout:fixed;width:100%;min-width:1180px\}/);
  assert.match(styles, /\.table-details td\{vertical-align:top;line-height:1\.4\}/);
  assert.match(styles, /\.table-details td>strong\{display:block;line-height:1\.15;margin-bottom:8px\}/);
});

// --- Affiliate data layer ----------------------------------------------------

const EXPECTED_PARTNERS = {
  'lucid-trading': { code: 'DUTRADING', url: 'https://lucidtrading.com/ref/dutrading' },
  phidias: { code: 'DUTRADING', url: 'https://member.phidiaspropfirm.com/aff/go/duckensm' },
  'alpha-futures': { code: 'Duckens026406', url: 'https://app.alpha-futures.com/signup/Duckens026406/' },
  daytraders: { code: 'DUTRADING', url: 'https://daytraders.com/go/dutrading?c=TNTIQNUL' },
  'legends-trading': { code: 'DUTRADING', url: 'https://thelegendstrading.com/?ref=dutrading' },
  bulenox: { code: 'dutrading', url: 'https://bulenox.com/member/aff/go/dutrading' },
  earn2trade: { code: 'dutrading', url: 'https://www.earn2trade.com/trader-career-path?a_pid=dutrading&a_bid=8d7b4b9e' },
};

test('the seven affiliate partners carry the verified partner links and codes', () => {
  assert.equal(affiliateFirms.length, 7);
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
  assert.deepEqual(foils, ['apex', 'topstep']);
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
  assert.match(render, /<b>9<\/b> firms reviewed/);
});
