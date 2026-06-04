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
