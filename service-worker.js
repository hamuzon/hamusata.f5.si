const CACHE_NAME = 'hamusata-cache-v1';
const urlsToCache = [
  '/',
  '/links/',
  '/random/',
  '/random/links.js',
  '/css/style.css',
  '/css/mobile-menu.css',
  '/css/dark.css',
  '/css/dark-hc.css',
  '/css/dark-mc.css',
  '/css/light.css',
  '/css/light-hc.css',
  '/css/light-mc.css',
  '/icon_400.webp',
  '/icon_500_500.png',
  '/icon_500_500.webp',
  '/icon_800.webp',
  '/icon.png',
  '/icon.webp',
  '/icon.svg',
  '/hamusata.webp',
  '/hamusata.png',
  '/hamusata_798-240.webp',
  '/hamusata_399-120.webp',
  '/banner_icon_hamusata.webp',
  '/banner_icon_hamusata.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});