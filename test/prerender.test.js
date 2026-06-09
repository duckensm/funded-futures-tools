import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { getRoutes, renderDocument, SITE_ORIGIN } from '../src/routes.js';

test('every route prerenders full body content for crawlers, not an empty shell', async () => {
  const template = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const routes = getRoutes();
  assert.ok(routes.length >= 8, 'expected the full route table');

  for (const route of routes) {
    const html = renderDocument(route, template);
    assert.ok(!html.includes('<div id="app"></div>'), `${route.path} ships an empty app shell`);
    assert.match(html, /<main>[\s\S]*<\/main>/, `${route.path} is missing rendered main content`);
    assert.ok(html.includes(`<link rel="canonical" href="${SITE_ORIGIN}${route.path}" />`), `${route.path} canonical URL not set`);
    assert.ok(html.includes('<footer class="footer">'), `${route.path} is missing the footer`);
  }
});

test('home page static HTML contains visible hero text and affiliate offers', async () => {
  const template = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const home = renderDocument(getRoutes()[0], template);
  assert.match(home, /drawdown trap/);
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
