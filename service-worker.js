/* ============================================
   KAMERA BALES – Service Worker
   Offline caching & performance
   ============================================ */

const CACHE_NAME = 'kamera-bales-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/track.html',
  '/css/styles.css',
  '/js/script.js',
  '/assets/images/hero-mitumba.jpg',
  '/assets/images/womens-bales.jpg',
  '/assets/images/mens-bales.jpg',
  '/assets/images/children-bales.jpg',
  '/assets/images/premium-bales.jpg',
  '/assets/images/customer-grace.jpg',
  '/assets/images/customer-daniel.jpg',
  '/assets/images/customer-amina.jpg',
  '/assets/images/customer-sarah.jpg',
  '/assets/images/customer-joseph.jpg',
  '/assets/images/badge-kebs.png',
  '/assets/images/badge-mitumba-assoc.png',
  '/assets/images/badge-trade.png',
  '/assets/images/badge-verified.png',
  '/assets/images/badge-5star.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && (url.pathname.includes('/assets/') || url.pathname.includes('/css/') || url.pathname.includes('/js/'))) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});