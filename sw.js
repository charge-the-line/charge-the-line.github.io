// Preconnect home page. Bump CACHE when you upload a new version so phones pick it up.
const CACHE = 'preconnect-v1.0.0';
const CORE = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  // Only clear Preconnect's own old caches — every module on this domain keeps its own.
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('preconnect-v') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // Only handle the home page's own files at the site root. Each module lives in its own folder
  // (/charge-the-line/, /patient-contact/, /bleed-control/, /bls-ready/, …) and manages itself.
  const url = new URL(req.url);
  const ownFile = url.pathname === '/' || /^\/[^/]+\.[a-z0-9]+$/i.test(url.pathname);
  if (url.origin === self.location.origin && !ownFile) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); return r; })
      .catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === 'opaque') { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  })));
});
