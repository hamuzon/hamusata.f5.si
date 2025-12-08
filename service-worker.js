Const CACHE_NAME = 'hamusata-v10.01.00';

const urlsToCache = [
  '/',              
  '/404.html',
  '/manifest.json',
  
  '/index.html',
  '/sub.html', 
  '/terms.html',
  
  '/css/style.css',
  '/css/mobile-menu.css',
  '/css/globus.css',
  '/css/style-links.css',
  '/css/style-lite.css',
  '/css/dark.css',
  '/css/dark-hc.css',
  '/css/dark-mc.css',
  '/css/light.css',
  '/css/light-hc.css',
  '/css/light-mc.css',

  '/js/script.js',
  '/js/script-sub.js',
  '/js/lang-switch.js',
  '/js/lang-switch-sub.js',
  '/js/links.js',
  '/js/links-sub.js',
  '/js/style-links.js',
  
  '/lang/lang.json',
  '/lang/sub-lang.json',

 '/favicon.ico',

 '/hamusata.png',
 '/hamusata.webp',
 '/hamusata_399-120.webp',
 '/hamusata_798-240.webp',
 '/icon.png',
 '/icon.svg',
 '/icon.webp',
 '/icon_60.webp',
 '/icon_72.webp',
 '/icon_120.webp',
 '/icon_400.webp',
 '/icon_500_500.png',
 '/icon_500_500.webp',
 '/icon_800.webp',
 '/banner_icon_hamusata.png',
 '/banner_icon_hamusata.webp',


  '/links/index.html',
  '/mutual_Links/index.html',
  '/random/index.html'
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

  const url = new URL(event.request.url);

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200)
            return networkResponse;

          return caches.open(CACHE_NAME).then(cache => {
            try {
              cache.put(event.request, networkResponse.clone());
            } catch (e) {
              console.warn('[ServiceWorker] cache.put failed:', event.request.url, e);
            }
            return networkResponse;
          });
        })
        .catch(() => {
          if (event.request.destination === 'image') {
            return caches.match('/icon.webp');
          } else if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
    })
  );
});
