const CACHE_NAME = 'hamusata-v11.00.00';

const urlsToCache = [
  '/',
  '/404.html',
  '/BingSiteAuth.xml',
  '/LICENSE',
  '/README.md',
  '/favicon.ico',
  '/index.html',
  '/logo.avif',
  '/logo.webp',
  '/manifest.json',
  '/sub.html',
  '/terms-and-privacy.html',
  '/terms.html',
  '/test.html',
  '/test-1.html',
  '/test-sub.html',

  '/banner_icon_hamusata.avif',
  '/banner_icon_hamusata.png',
  '/banner_icon_hamusata.webp',
  '/hamusata.avif',
  '/hamusata.png',
  '/hamusata.webp',
  '/hamusata_399-120.avif',
  '/hamusata_399-120.webp',
  '/hamusata_798-240.avif',
  '/hamusata_798-240.webp',
  '/icon.avif',
  '/icon.png',
  '/icon.svg',
  '/icon.webp',
  '/icon_60.avif',
  '/icon_60.webp',
  '/icon_72.avif',
  '/icon_72.webp',
  '/icon_120.avif',
  '/icon_120.webp',
  '/icon_192.avif',
  '/icon_192.webp',
  '/icon_400.avif',
  '/icon_400.webp',
  '/icon_500_500.avif',
  '/icon_500_500.png',
  '/icon_500_500.webp',
  '/icon_800.avif',
  '/icon_800.webp',

  '/css/dark.css',
  '/css/dark-hc.css',
  '/css/dark-mc.css',
  '/css/globus.css',
  '/css/light.css',
  '/css/light-hc.css',
  '/css/light-mc.css',
  '/css/mobile-menu.css',
  '/css/style.css',
  '/css/style-home.css',
  '/css/style-links.css',
  '/css/style-lite.css',
  '/css/foldable.css',

  '/js/lang-switch.js',
  '/js/lang-switch-sub.js',
  '/js/links.js',
  '/js/links-sub.js',
  '/js/script.js',
  '/js/script-sub.js',
  '/js/style-links.js',
  '/js/foldable.js',

  '/lang/lang.json',
  '/lang/sub-lang.json',

  '/links/index.html',
  '/random/index.html',
  '/random/links.js',

  '/tsukimi/style.css',
  '/tsukimi/script.js',

  '/tanzaku/2025/style.css',
  '/tanzaku/2025/script.js',
  '/tanzaku/2025/icon-light.svg',
  '/tanzaku/2025/icon-dark.svg',
  '/tanzaku/2026/style.css',
  '/tanzaku/2026/script.js',
  '/tanzaku/2026/icon.svg',
  '/tanzaku/2026/image/style.css',
  '/tanzaku/2026/image/script.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (e) {
          console.warn('[ServiceWorker] Failed to cache:', url, e);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          try {
            cache.put(event.request, responseToCache);
          } catch (e) {
            console.warn('[ServiceWorker] cache.put failed:', event.request.url, e);
          }
        });
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;

          if (event.request.destination === 'image') {
            return caches.match('/icon.webp');
          } else if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});
