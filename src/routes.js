import {
  firms, pageShell, renderHome, renderCompare, renderChecklist,
  renderCalculators, renderFirms, renderDisclaimers, renderPrivacy, renderTerms
} from './render.js';

export const SITE_ORIGIN = 'https://futurespropedge.com';
const BRAND = 'Futures Prop Edge';

function escAttr(text) {
  return String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

export function getRoutes() {
  const routes = [
    {
      path: '/',
      title: `${BRAND} | NQ/MNQ prop firm calculators`,
      description: 'Compare funded futures prop firms, calculate NQ/MNQ risk, review drawdown and payout rules, and check current offers before choosing an account.',
      render: renderHome,
    },
    {
      path: '/compare/',
      title: `Compare Futures Prop Firms | ${BRAND}`,
      description: 'Side-by-side comparison of funded futures prop firms for NQ/MNQ traders: drawdown type, daily loss limits, payout rules, pricing notes, and current offers.',
      render: renderCompare,
    },
    {
      path: '/checklist/',
      title: `Free NQ Prop Firm Risk Checklist | ${BRAND}`,
      description: 'Download the free NQ/MNQ prop firm risk checklist: drawdown traps, daily loss limits, consistency rules, payout buffers, and activation fees to verify before buying.',
      render: renderChecklist,
    },
    {
      path: '/calculators/',
      title: `Prop Firm Risk Calculators for NQ/MNQ | ${BRAND}`,
      description: 'Free calculators for funded futures traders: trailing drawdown and consistency simulator, NQ/MNQ/ES/GC/CL stop-risk calculator, and challenge pass planner.',
      render: renderCalculators,
    },
    {
      path: '/firms/',
      title: `Futures Prop Firm Rule Guides | ${BRAND}`,
      description: 'Plain-English rule guides for funded futures prop firms: drawdown mechanics, payout rules, pricing notes, and account fit for NQ/MNQ traders.',
      render: () => renderFirms(),
    },
    {
      path: '/disclaimers/',
      title: `Disclosures | ${BRAND}`,
      description: 'Affiliate disclosure, educational disclaimer, futures risk disclosure, and rule-change policy for Futures Prop Edge.',
      render: renderDisclaimers,
    },
    {
      path: '/privacy/',
      title: `Privacy Policy | ${BRAND}`,
      description: 'How Futures Prop Edge handles email signups, analytics, and affiliate link tracking.',
      render: renderPrivacy,
    },
    {
      path: '/terms/',
      title: `Terms of Use | ${BRAND}`,
      description: 'Terms of use for Futures Prop Edge: educational comparison content, risk responsibility, and affiliate compensation.',
      render: renderTerms,
    },
  ];

  for (const f of firms) {
    routes.push({
      path: `/firms/${f.id}/`,
      title: `${f.name} Rules for NQ/MNQ Traders | ${BRAND}`,
      description: f.fit,
      render: () => renderFirms(f.id),
    });
  }

  return routes;
}

export function findRoute(path) {
  return getRoutes().find((r) => r.path === path);
}

// Builds the final HTML document for a route from the index.html template.
// Replacement callbacks are used so `$` in page content is never treated as a
// regex replacement pattern.
export function renderDocument(route, template) {
  const canonical = SITE_ORIGIN + route.path;
  const title = escAttr(route.title);
  const description = escAttr(route.description);
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${title}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(" \/>)/, (m, a, b) => a + description + b);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(" \/>)/, (m, a, b) => a + canonical + b);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(" \/>)/, (m, a, b) => a + title + b);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(" \/>)/, (m, a, b) => a + description + b);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(" \/>)/, (m, a, b) => a + canonical + b);
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(" \/>)/, (m, a, b) => a + title + b);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(" \/>)/, (m, a, b) => a + description + b);
  html = html.replace('<div id="app"></div>', () => `<div id="app">${pageShell(route.render())}</div>`);
  return html;
}
