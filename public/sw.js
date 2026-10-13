/* FreeQR service worker — offline after first visit. QR logic needs no network anyway. */
const V = 'freeqr-v2';
const SHELL = ['/', '/css/styles.css', '/js/app.js', '/js/qr-payloads.js', '/js/batch.js', '/vendor/qrcode.min.js', '/vendor/jspdf.umd.min.js', '/vendor/jszip.min.js', '/manifest.webmanifest', '/icon-192.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(caches.match(e.request).then((hit) => {
    const net = fetch(e.request).then((res) => { if (res.ok) caches.open(V).then((c) => c.put(e.request, res.clone())); return res; }).catch(() => hit || caches.match('/'));
    return hit || net;
  }));
});
