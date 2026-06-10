// Compliance audit over built output: every affiliate anchor must carry
// rel="sponsored noopener" and target="_blank", and the reserved green
// .btn.affiliate style may only appear on real affiliate URLs.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const AFFILIATE_URL_MARKERS = [
  'lucidtrading.com/ref/',
  'phidiaspropfirm.com/aff/',
  'alpha-futures.com/signup/',
  'daytraders.com/go/',
  'thelegendstrading.com/?ref=',
  'bulenox.com/member/aff/',
  'earn2trade.com/trader-career-path',
];

let total = 0;
let green = 0;
let greenOnNonAffiliate = 0;
const bad = [];

function check(file) {
  const html = readFileSync(file, 'utf8');
  const anchors = html.match(/<a [^>]*>/g) || [];
  for (const a of anchors) {
    const isAffiliate = AFFILIATE_URL_MARKERS.some((u) => a.includes(u));
    if (isAffiliate) {
      total += 1;
      if (!a.includes('rel="sponsored noopener"') || !a.includes('target="_blank"')) {
        bad.push(`${file} :: ${a.slice(0, 110)}`);
      }
    }
    if (a.includes('btn affiliate')) {
      green += 1;
      if (!isAffiliate) greenOnNonAffiliate += 1;
    }
  }
}

function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) check(p);
  }
}

walk('dist');
console.log(`affiliate anchors: ${total} | missing rel/target: ${bad.length} | green CTAs: ${green} | green on non-affiliate: ${greenOnNonAffiliate}`);
for (const b of bad.slice(0, 10)) console.log(b);
process.exit(bad.length || greenOnNonAffiliate ? 1 : 0);
