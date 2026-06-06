import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('best NQ prop firms page is a public SEO page with disclosures', async () => {
  const html = await readFile(new URL('../public/best-nq-prop-firms.html', import.meta.url), 'utf8');

  assert.match(html, /<title>Best NQ Prop Firms for NQ\/MNQ Traders \| Futures Prop Edge<\/title>/);
  assert.match(html, /<h1>Best NQ Prop Firms for NQ\/MNQ Traders<\/h1>/);
  assert.match(html, /Affiliate disclosure/);
  assert.match(html, /Apex Trader Funding/);
  assert.match(html, /Official source only/);
  assert.doesNotMatch(html, /Funded Futures Tools/);
});

test('sitemap includes the best NQ prop firms SEO page', async () => {
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');

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

test('sitemap includes the Lucid vs Apex SEO page', async () => {
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');

  assert.match(sitemap, /https:\/\/futurespropedge\.com\/lucid-trading-vs-apex-nq-traders\.html/);
});

test('best EOD drawdown page is a public SEO page with disclosures', async () => {
  const html = await readFile(new URL('../public/best-eod-drawdown-prop-firms-nq-traders.html', import.meta.url), 'utf8');

  assert.match(html, /<title>Best EOD Drawdown Prop Firms for NQ Traders \| Futures Prop Edge<\/title>/);
  assert.match(html, /<h1>Best EOD Drawdown Prop Firms for NQ Traders<\/h1>/);
  assert.match(html, /Lucid Trading/);
  assert.match(html, /Apex Trader Funding/);
  assert.match(html, /Tradeify/);
  assert.match(html, /MyFundedFutures/);
  assert.match(html, /Affiliate disclosure/);
  assert.match(html, /Recommended first look/);
  assert.doesNotMatch(html, /fastest growing/i);
  assert.doesNotMatch(html, /Funded Futures Tools/);
});

test('sitemap includes the best EOD drawdown SEO page', async () => {
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');

  assert.match(sitemap, /https:\/\/futurespropedge\.com\/best-eod-drawdown-prop-firms-nq-traders\.html/);
});

test('homepage exposes SEO guides without hiding current offers', async () => {
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');

  assert.match(main, /href="#guides">Guides<\/a>/);
  assert.match(main, /id="guides"/);
  assert.match(main, /NQ Prop Firm Guides/);
  assert.match(main, /href="\/best-nq-prop-firms\.html"/);
  assert.match(main, /href="\/lucid-trading-vs-apex-nq-traders\.html"/);
  assert.match(main, /href="\/best-eod-drawdown-prop-firms-nq-traders\.html"/);

  const offersIndex = main.indexOf('Current offers to check before you buy.');
  const guidesIndex = main.indexOf('${guidesSection()}');
  const compareIndex = main.indexOf('${comparisonSection(false)}');

  assert.ok(offersIndex > -1, 'offer section should stay on the homepage');
  assert.ok(guidesIndex > offersIndex, 'guides should appear after offers');
  assert.ok(compareIndex > guidesIndex, 'comparison table should remain after guides');
});

test('comparison table uses a short source-review badge and preserves readable columns', async () => {
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.match(main, /f\.verification === 'official' \? 'Source reviewed'/);
  assert.doesNotMatch(main, /Official sources reviewed/);
  assert.match(styles, /\.table-details \.table-wrap\{overflow-x:auto\}/);
  assert.match(styles, /\.table-details table\{table-layout:fixed;width:100%;min-width:1180px\}/);
  assert.match(styles, /\.table-details td\{vertical-align:top;line-height:1\.4\}/);
  assert.match(styles, /\.table-details td>strong\{display:block;line-height:1\.15;margin-bottom:8px\}/);
});

test('Earn2Trade uses the provided partner link and code', async () => {
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');

  assert.match(main, /id:'earn2trade'/);
  assert.match(main, /category:'Legacy structured evaluation \+ live-account path'/);
  assert.match(main, /affiliateUrl:'https:\/\/www\.earn2trade\.com\/trader-career-path\?a_pid=dutrading&a_bid=8d7b4b9e'/);
  assert.match(main, /couponCode:'dutrading'/);
  assert.match(main, /try code dutrading and confirm final checkout price/);
});

test('Alpha Futures uses the provided partner link and code with official-source guidance', async () => {
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');

  assert.match(main, /id:'alphafutures'/);
  assert.match(main, /name:'Alpha Futures'/);
  assert.match(main, /affiliateUrl:'https:\/\/app\.alpha-futures\.com\/signup\/Duckens026406\/'/);
  assert.match(main, /couponCode:'Duckens026406'/);
  assert.match(main, /renderAlphaFuturesArticle/);
  assert.match(main, /Alpha Futures account types/);
  assert.match(main, /Zero, Premium, Advanced, and Standard/);
  assert.match(main, /Confirm current account type, MLL, payout cap, news rules, and final checkout price/);
});

test('DayTraders uses the provided partner link and code with current rule guidance', async () => {
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');

  assert.match(main, /id:'daytraders'/);
  assert.match(main, /name:'DayTraders'/);
  assert.match(main, /affiliateUrl:'https:\/\/daytraders\.com\/go\/dutrading\?c=TNTIQNUL'/);
  assert.match(main, /couponCode:'TNTIQNUL'/);
  assert.match(main, /renderDayTradersArticle/);
  assert.match(main, /Trailing, EOD, Static, S2F, and S2L/);
  assert.match(main, /Confirm current account type, drawdown model, payout terms, platform support, and final checkout price/);
});

test('OneUp Trader uses the provided partner link and code with current rule guidance', async () => {
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');

  assert.match(main, /id:'oneuptrader'/);
  assert.match(main, /name:'OneUp Trader'/);
  assert.match(main, /affiliateUrl:'https:\/\/www\.oneupapp\.io\/\?via=dutrading'/);
  assert.match(main, /couponCode:'dutrading'/);
  assert.match(main, /renderOneUpTraderArticle/);
  assert.match(main, /10 trading days or 5 days for Express/);
  assert.match(main, /Confirm current account size, trailing drawdown, consistency, funded rules, reset fees, and final checkout price/);
});

test('The Legends Trading uses the provided partner link, code, and current promotion', async () => {
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');

  assert.match(main, /id:'legendstrading'/);
  assert.match(main, /name:'The Legends Trading'/);
  assert.match(main, /affiliateUrl:'https:\/\/thelegendstrading\.com\/\?ref=dutrading'/);
  assert.match(main, /couponCode:'DUTRADING'/);
  assert.match(main, /50% OFF Apprentice Plans; 30% OFF Elite Plans/);
  assert.match(main, /renderLegendsTradingArticle/);
  assert.match(main, /Apprentice, Elite, and Straight to Master/);
  assert.match(main, /Confirm the DUTRADING discount, account rules, activation fee, payout terms, and final checkout price/);
});
