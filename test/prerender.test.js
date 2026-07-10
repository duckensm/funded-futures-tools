import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { buildRobots, buildSitemap, getRoutes, renderDocument, SITE_ORIGIN } from '../src/routes.js';
import { affiliateFirms } from '../src/data/firms.js';

test('every route prerenders full body content for crawlers, not an empty shell', async () => {
  const template = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const routes = getRoutes();
  assert.ok(routes.length >= 8, 'expected the full route table');

  for (const route of routes) {
    const html = renderDocument(route, template);
    assert.ok(!html.includes('<div id="app"></div>'), `${route.path} ships an empty app shell`);
    assert.match(html, /<main>[\s\S]*<\/main>/, `${route.path} is missing rendered main content`);
    const canonical = route.canonical || `${SITE_ORIGIN}${route.path}`;
    assert.ok(html.includes(`<link rel="canonical" href="${canonical}" />`), `${route.path} canonical URL not set`);
    assert.ok(html.includes('<footer class="footer">'), `${route.path} is missing the footer`);
  }
});

test('home page static HTML contains visible hero text and affiliate offers', async () => {
  const template = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const home = renderDocument(getRoutes()[0], template);
  assert.match(home, /Know the rule/);
  assert.match(home, /Open risk calculator/);
  assert.match(home, /lucidtrading\.com\/ref\/dutrading/);
  assert.match(home, /member\.phidiaspropfirm\.com\/aff\/go\/duckensm/);
});

test('routes have unique titles and descriptions', () => {
  const routes = getRoutes();
  const titles = new Set(routes.map((r) => r.title));
  const descriptions = new Set(routes.map((r) => r.description));
  assert.equal(titles.size, routes.length, 'duplicate page titles');
  assert.equal(descriptions.size, routes.length, 'duplicate meta descriptions');
});

test('JSON-LD: Organization on home, Review on reviews, FAQPage on coupons', async () => {
  const template = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const routes = getRoutes();
  const html = (path) => renderDocument(routes.find((r) => r.path === path), template);

  assert.match(html('/'), /"@type":"Organization"/);
  for (const f of affiliateFirms) {
    const review = html(`/review/${f.slug}/`);
    assert.match(review, /"@type":"Review"/, `${f.slug} review JSON-LD`);
    assert.ok(review.includes(`"name":"${f.name}"`), `${f.slug} itemReviewed name`);
    const discount = html(`/discount/${f.slug}/`);
    assert.match(discount, /"@type":"FAQPage"/, `${f.slug} discount JSON-LD`);
  }
});

test('generated sitemap lists only canonical URLs and robots points at it', () => {
  const sitemap = buildSitemap(new Date('2026-06-09'));
  assert.match(sitemap, /<lastmod>2026-06-09<\/lastmod>/);
  assert.ok(sitemap.includes(`${SITE_ORIGIN}/best-futures-prop-firms/`));
  assert.ok(sitemap.includes(`${SITE_ORIGIN}/quiz/`));
  for (const f of affiliateFirms) {
    assert.ok(sitemap.includes(`${SITE_ORIGIN}/review/${f.slug}/`), `${f.slug} review in sitemap`);
    assert.ok(sitemap.includes(`${SITE_ORIGIN}/discount/${f.slug}/`), `${f.slug} discount in sitemap`);
    assert.ok(!sitemap.includes(`${SITE_ORIGIN}/firms/${f.legacyId}/`), `${f.slug} legacy alias must stay out of the sitemap`);
  }
  assert.match(buildRobots(), /Sitemap: https:\/\/futurespropedge\.com\/sitemap\.xml/);
});

test('every review page links to its coupon page, the hub, the quiz, and the calculator', async () => {
  const template = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const routes = getRoutes();
  for (const f of affiliateFirms) {
    const html = renderDocument(routes.find((r) => r.path === `/review/${f.slug}/`), template);
    assert.ok(html.includes(`href="/discount/${f.slug}/"`), `${f.slug} review → coupon`);
    assert.ok(html.includes('href="/best-futures-prop-firms/"'), `${f.slug} review → hub`);
    assert.ok(html.includes('href="/quiz/"'), `${f.slug} review → quiz`);
    assert.ok(html.includes('href="/calculators/"'), `${f.slug} review → calculator`);
  }
});
