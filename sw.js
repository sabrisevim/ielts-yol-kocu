// Offline service worker: fresh files when the network answers quickly, cached files in tunnels / without signal.
const CACHE = 'ielts-koc-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './content.js',
  './learn.js',
  './glossary.js',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first with a short timeout, so updates arrive immediately but a weak signal never blocks the app.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: true });
    const network = fetch(req).then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; });
    if (!cached) return network;
    const timeout = new Promise((resolve) => setTimeout(() => resolve(cached), 2500));
    return Promise.race([network.catch(() => cached), timeout]);
  })());
});
