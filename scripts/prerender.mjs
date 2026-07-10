// Post-build static generation: writes one fully rendered HTML document per
// route into dist/, using the Vite-built dist/index.html (with hashed asset
// tags) as the template. Run via `npm run build`.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRobots, buildSitemap, getRoutes, renderDocument } from '../src/routes.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const template = readFileSync(path.join(dist, 'index.html'), 'utf8');

const written = [];
for (const route of getRoutes()) {
  const html = renderDocument(route, template);
  const outDir = route.path === '/' ? dist : path.join(dist, ...route.path.split('/').filter(Boolean));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, 'index.html'), html);
  written.push(route.path);
}

// Sitemap and robots.txt are generated from the route table at build time so
// new pages can never be forgotten.
writeFileSync(path.join(dist, 'sitemap.xml'), buildSitemap());
writeFileSync(path.join(dist, 'robots.txt'), buildRobots());

// Sanity check: crawlers must receive visible body content, not an empty shell.
const home = readFileSync(path.join(dist, 'index.html'), 'utf8');
if (home.includes('<div id="app"></div>') || !home.includes('Know the rule.')) {
  console.error('[prerender] FAILED: homepage body content missing from static HTML');
  process.exit(1);
}

console.log(`[prerender] wrote ${written.length} static pages:`);
for (const p of written) console.log(`  ${p}`);
