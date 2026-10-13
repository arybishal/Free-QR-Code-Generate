/* QRNova server — serves pages + static assets only. Never receives QR content. */
'use strict';
require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { TYPES, SITE, HOME, pageBySlug } = require('./content/types');

const PORT = process.env.PORT || 3000;
const SITE_URL = (process.env.SITE_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const BRAND = process.env.BRAND_NAME || 'QRNova';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || '[CONTACT EMAIL]';
const COUNTRY = process.env.COUNTRY || '[COUNTRY]';
const ANALYTICS_SRC = process.env.ANALYTICS_SRC || '';
const MIN = process.env.USE_MIN === '1' ? '.min' : ''; // `npm run build` writes minified assets

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'blob:'],
      workerSrc: ["'self'", 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'"], // dynamic theme values
      imgSrc: ["'self'", 'data:', 'blob:'], // QR canvas, logo upload
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false, // blob: workers for jszip/jspdf
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 600, standardHeaders: true, legacyHeaders: false }));

// Static: vendor immutable 1y, rest 1h. SW + manifest never cached stale.
app.use('/vendor', express.static(path.join(__dirname, 'public/vendor'), { maxAge: '1y', immutable: true }));
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  setHeaders(res, file) {
    if (file.endsWith('sw.js') || file.endsWith('.webmanifest')) res.setHeader('Cache-Control', 'no-cache');
  },
}));
app.use(express.urlencoded({ extended: false })); // contact form only

const navTypes = TYPES.map(t => ({ slug: t.slug, label: t.label, icon: t.icon }));
const related = (id) => TYPES.filter(t => t.id !== id).slice(0, 4).map(t => ({ slug: t.slug, label: t.label, icon: t.icon }));
const fill = (s) => String(s || '').replace('{brand}', BRAND).replace('[CONTACT EMAIL]', CONTACT_EMAIL).replace('[COUNTRY]', COUNTRY).replace('[DOMAIN]', SITE_URL.replace(/^https?:\/\//, ''));
const ctx = (page, extra = {}) => ({
  brand: BRAND, siteUrl: SITE_URL, analyticsSrc: ANALYTICS_SRC, contactEmail: CONTACT_EMAIL, country: COUNTRY, min: MIN,
  navTypes, fieldDefs: Object.fromEntries(TYPES.map(t => [t.id, t.fields])),
  page: {
    ...page,
    title: fill(page.title),
    desc: fill(page.desc),
    h1: fill(page.h1),
    canonical: page.canonical && page.canonical.startsWith('http') ? page.canonical : SITE_URL + (page.canonical && page.canonical !== '' ? (page.canonical.startsWith('/') ? page.canonical : '/' + page.canonical) : '/'),
  }, ...extra,
});

// Home: hero tool + marketing sections (copy from HOME)
const core9 = ['url', 'text', 'wifi', 'contact', 'email', 'phone', 'sms', 'whatsapp', 'location'];
const coreLinks = core9.map(id => { const t = TYPES.find(x => x.id === id); return { slug: id === 'url' ? 'website-qr-code-generator' : t.slug, label: t.label, icon: t.icon }; });
app.get('/', (req, res) => {
  res.render('home', ctx({ ...HOME.meta, type: 'url', batch: false }, { home: fillCopy(HOME), type: TYPES[0], related: coreLinks }));
});
function fillCopy(o) { // deep-fill placeholders in copy blocks
  if (typeof o === 'string') return fill(o);
  if (Array.isArray(o)) return o.map(fillCopy);
  if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, fillCopy(v)]));
  return o;
}

// Website landing page (own URL; home is the marketing page)
app.get('/website-qr-code-generator', (req, res) => {
  const t = TYPES[0];
  res.render('type', ctx({ ...seo(t, 'website-qr-code-generator'), type: t.id, batch: false }, { type: t, related: related(t.id) }));
});

// One landing page per QR type
for (const t of TYPES.slice(1)) {
  app.get('/' + t.slug, (req, res) => res.render('type', ctx({ ...seo(t), type: t.id, batch: false }, { type: t, related: related(t.id) })));
}

// Batch mode
app.get('/batch-qr-code-generator', (req, res) => res.render('type', ctx({
  title: `Batch QR Generator — CSV to ZIP | ${BRAND}`,
  desc: 'Generate hundreds of QR codes at once from a list or CSV. Zipped PNGs, made 100% in your browser. Free, no sign-up.',
  canonical: `${SITE_URL}/batch-qr-code-generator`, type: 'batch', batch: true,
}, { type: null, related: navTypes.slice(0, 4) })));

// Static content pages
for (const [route, key] of [['/how-it-works', 'how'], ['/faq', 'faq'], ['/about', 'about'], ['/privacy', 'privacy'], ['/terms', 'terms'], ['/contact', 'contact']]) {
  app.get(route, (req, res) => {
    const site = fillCopy(SITE[key]);
    const extra = key === 'faq' ? { SITE_FAQS: site.faqs } : {};
    if (key === 'contact' && req.query.sent) return res.render('simple', ctx({ ...site, key }, { sent: true, ...extra }));
    res.render('simple', ctx({ ...site, key }, extra));
  });
}
app.post('/contact', rateLimit({ windowMs: 60 * 60 * 1000, max: 20 }), (req, res) => {
  // No storage: just acknowledge. Wire to your own inbox/endpoint if needed.
  res.redirect('/contact?sent=1');
});

// SEO files
app.get('/sitemap.xml', (req, res) => {
  const urls = ['', '/website-qr-code-generator', ...TYPES.slice(1).map(t => '/' + t.slug),
    '/batch-qr-code-generator', '/how-it-works', '/faq', '/about', '/privacy', '/terms', '/contact'];
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
    urls.map(u => `  <url><loc>${SITE_URL}${u || '/'}</loc><changefreq>weekly</changefreq></url>`).join('\n')
  }\n</urlset>`);
});
app.get('/robots.txt', (req, res) => res.type('text/plain')
  .send(`User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`));

// Offline fallback + 404
app.use((req, res) => res.status(404).render('404', ctx({ title: `Page not found | ${BRAND}`, desc: 'That page does not exist.', canonical: SITE_URL, key: '404' }, {})));

function seo(t, slug) {
  return { title: t.title.replace('{brand}', BRAND), desc: t.desc, canonical: `${SITE_URL}/${slug || t.slug}`, h1: t.h1 };
}

if (require.main === module) app.listen(PORT, () => console.log(`${BRAND} on http://localhost:${PORT}`));
module.exports = app;
