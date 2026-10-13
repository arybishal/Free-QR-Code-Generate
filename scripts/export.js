/* Static export: renders every route to dist/ for Cloudflare Pages / Netlify. */
'use strict';
const fs = require('fs'), path = require('path');
const { TYPES } = require('../content/types');
process.env.PORT = '3419'; process.env.SITE_URL = process.env.SITE_URL || 'https://[DOMAIN]'; process.env.USE_MIN = '1'; // static export always serves minified assets
const app = require('../server');
const routes = ['/', '/website-qr-code-generator', ...TYPES.slice(1).map((t) => '/' + t.slug),
  '/batch-qr-code-generator', '/how-it-works', '/faq', '/about', '/privacy', '/terms', '/contact'];
const srv = app.listen(3419, async () => {
  const dist = path.join(__dirname, '..', 'dist');
  fs.rmSync(dist, { recursive: true, force: true }); fs.mkdirSync(dist, { recursive: true });
  for (const r of routes) {
    const res = await fetch('http://localhost:3419' + r);
    const html = await res.text();
    const out = r === '/' ? 'index.html' : r.slice(1) + '.html';
    fs.writeFileSync(path.join(dist, out), html); console.log(res.status, r, '→', out);
  }
  for (const f of ['/sitemap.xml', '/robots.txt']) {
    const res = await fetch('http://localhost:3419' + f);
    fs.writeFileSync(path.join(dist, f.slice(1)), await res.text()); console.log(200, f);
  }
  for (const d of ['css', 'js', 'vendor']) fs.cpSync(path.join(__dirname, '..', 'public', d), path.join(dist, d), { recursive: true });
  for (const f of ['manifest.webmanifest', 'sw.js', 'icons.svg', 'icon-192.png', 'icon-512.png', 'cover.png', 'og-cover.png']) {
    const p = path.join(__dirname, '..', 'public', f);
    if (fs.existsSync(p)) fs.copyFileSync(p, path.join(dist, f));
  }
  console.log('dist/ ready — deploy to any static host.');
  srv.close();
});
