self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('hamusata-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/style.css',
        '/css/mobile-menu.css',
        '/icon_500_500.png',
        '/icon_500_500.webp'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});