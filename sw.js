// Service Worker — Anusree Othayorath Poetry (PWA Agent)
const CACHE = 'ao-poetry-v1';
const ASSETS = [
  '/anusree-othayorath-poetry/',
  '/anusree-othayorath-poetry/index.html',
  '/anusree-othayorath-poetry/poems.js',
  '/anusree-othayorath-poetry/profile.png',
  '/anusree-othayorath-poetry/logo.png',
  '/anusree-othayorath-poetry/manifest.json',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+Malayalam:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Cache-first for local assets, network-first for API calls
  if (e.request.url.includes('generativelanguage') || e.request.url.includes('jsonbin')) {
    e.respondWith(fetch(e.request).catch(() => new Response('{"error":"offline"}', { headers: { 'Content-Type': 'application/json' } })));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res.ok && e.request.method === 'GET') {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => caches.match('/anusree-othayorath-poetry/')))
  );
});
