import {
  firms, affiliateFirms, pageShell, renderHome, renderCompare, renderChecklist,
  renderCalculators, renderFirms, renderDisclaimers, renderPrivacy, renderTerms
} from './render.js';
import {
  renderHub, renderReview, renderDiscount, renderApexAlternatives,
  renderTopstepAlternatives, renderQuizPage, discountFaqs, publicCopy,
  MONTH_YEAR, YEAR
} from './pages.js';

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
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: BRAND,
        url: `${SITE_ORIGIN}/`,
        description: 'Comparison site and calculator hub for funded futures traders, focused on NQ/MNQ prop-firm rules: drawdown mechanics, payout policies, and current offers.',
      },
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

  routes.push(
    {
      path: '/best-futures-prop-firms/',
      title: `Best Futures Prop Firms ${YEAR} for NQ/MNQ Traders | ${BRAND}`,
      description: `The ${affiliateFirms.length} funded futures programs we recommend for NQ/MNQ traders, ranked by rule fit: drawdown type, payout rules, and pricing. Updated ${MONTH_YEAR}.`,
      render: renderHub,
    },
    {
      path: '/apex-alternatives/',
      title: `Best Apex Trader Funding Alternatives ${YEAR} | ${BRAND}`,
      description: 'Apex alternatives for NQ/MNQ traders organized by rule fit: EOD drawdown instead of intraday trailing, live-capital paths, and static-drawdown budget evaluations.',
      render: renderApexAlternatives,
    },
    {
      path: '/topstep-alternatives/',
      title: `Best Topstep Alternatives ${YEAR} | ${BRAND}`,
      description: 'Topstep alternatives for NQ/MNQ traders organized by what you want: best overall rules, education included, live capital paths, and budget evaluations.',
      render: renderTopstepAlternatives,
    },
    {
      path: '/quiz/',
      title: `Which Futures Prop Firm Fits You? 60-Second Quiz | ${BRAND}`,
      description: 'Answer five quick questions about your budget, funding goals, and NQ/MNQ trading style and get matched to the right futures prop firm — with its discount code.',
      render: renderQuizPage,
    },
    {
      path: '/disclosure/',
      title: `Affiliate Disclosure | ${BRAND}`,
      description: 'How Futures Prop Edge earns affiliate commissions, and why every rule still needs verifying on official firm sites.',
      render: renderDisclaimers,
    },
  );

  for (const f of affiliateFirms) {
    const reviewJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: { '@type': 'Organization', name: f.name, url: f.officialUrl },
      author: { '@type': 'Organization', name: BRAND, url: `${SITE_ORIGIN}/` },
      reviewBody: publicCopy(f.lane),
    };
    if (f.lastVerified && f.lastVerified !== 'TODO_VERIFY') reviewJsonLd.dateModified = f.lastVerified;
    routes.push(
      {
        path: `/review/${f.slug}/`,
        title: `${f.name} Review ${YEAR}: ${f.badge} | ${BRAND}`,
        description: `${f.name} review for NQ/MNQ traders: ${f.badge.toLowerCase()}. Drawdown mechanics, payout rules, pros and cons, and the current discount code.`,
        render: () => renderReview(f),
        jsonLd: reviewJsonLd,
      },
      {
        path: `/discount/${f.slug}/`,
        title: `${f.name} Discount Code ${f.code} — ${MONTH_YEAR}`,
        description: `Working ${f.name} discount code for ${MONTH_YEAR}: use code ${f.code} at checkout. Copy the code, see what it applies to, and confirm the final price before buying.`,
        render: () => renderDiscount(f),
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: discountFaqs(f).map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        },
      },
    );
  }

  for (const f of firms) {
    const isPartner = f.affiliate;
    routes.push({
      path: `/firms/${f.id}/`,
      title: `${f.name} Rules for NQ/MNQ Traders | ${BRAND}`,
      description: f.fit,
      // Partner rule pages now render the data-driven review and point their
      // canonical at /review/<slug>/ so legacy URLs keep working without
      // splitting search equity.
      canonical: isPartner ? `${SITE_ORIGIN}/review/${f.slug}/` : undefined,
      render: () => (isPartner ? renderReview(f) : renderFirms(f.id)),
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
  const canonical = route.canonical || SITE_ORIGIN + route.path;
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
  if (route.jsonLd) {
    const json = JSON.stringify(route.jsonLd).replace(/</g, '\\u003c');
    html = html.replace('</head>', () => `  <script type="application/ld+json">${json}</script>\n  </head>`);
  }
  html = html.replace('<div id="app"></div>', () => `<div id="app">${pageShell(route.render())}</div>`);
  return html;
}

// Hand-written SEO pages that live in public/ and are served as-is.
export const LEGACY_PUBLIC_PAGES = [
  'best-nq-prop-firms.html',
  'lucid-trading-vs-apex-nq-traders.html',
  'best-eod-drawdown-prop-firms-nq-traders.html',
  'nq-prop-firm-risk-checklist.html',
];

// sitemap.xml / robots.txt are generated at build time by scripts/prerender.mjs.
// Alias routes whose canonical points elsewhere (legacy /firms/<id>/ partner
// pages) are excluded so the sitemap only lists canonical URLs.
export function buildSitemap(buildDate = new Date()) {
  const lastmod = buildDate.toISOString().slice(0, 10);
  const locs = [];
  for (const r of getRoutes()) {
    if (r.canonical && r.canonical !== SITE_ORIGIN + r.path) continue;
    locs.push(SITE_ORIGIN + r.path);
  }
  for (const p of LEGACY_PUBLIC_PAGES) locs.push(`${SITE_ORIGIN}/${p}`);
  const entries = locs.map((loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

export function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`;
}
