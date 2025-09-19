const CACHE_NAME = 'hamusata-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/sub.html',
  '/terms.html',
  '/test.html',
  '/404.html',
  '/css/',          // css フォルダ内の全ての CSS
  '/links/',
  '/mutual_Links/',
  '/random/',
  '/banner_icon_hamusata.png',
  '/favicon.ico',
  '/hamusata.png',
  '/hamusata.webp',
  '/icon.png',
  '/icon.svg',
  '/icon.webp',
  '/icon_400.webp',
  '/icon_500_500.png',
  '/icon_500_500.webp',
  '/icon_800.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});