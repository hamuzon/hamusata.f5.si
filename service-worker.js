const CACHE_NAME = 'hamusata-full-cache-v1';

const urlsToCache = [
  '/', // ルート
  '/index.html',
  '/404.html',

  // CSS
  '/css/style.css',
  '/css/mobile-menu.css',
  '/css/dark.css',
  '/css/dark-hc.css',
  '/css/dark-mc.css',
  '/css/light.css',
  '/css/light-hc.css',
  '/css/light-mc.css',

  // アイコン / 画像
  '/banner_icon_hamusata.png',
  '/banner_icon_hamusata.webp',
  '/favicon.ico',
  '/hamusata.png',
  '/hamusata.webp',
  '/icon.png',
  '/icon.svg',
  '/icon.webp',
  '/icon_400.webp',
  '/icon_500_500.png',
  '/icon_500_500.webp',

  // サブページ
  '/links/index.html',
  '/mutual_Links/index.html',
  '/random/index.html',

  // Manifest
  '/manifest.json'
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching all files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// アクティベート時に古いキャッシュ削除
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
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

// フェッチ時のキャッシュ戦略
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then(networkResponse => {
          // 成功したらキャッシュに追加
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // オフライン時のフォールバック
          if (event.request.destination === 'image') {
            return caches.match('/icon.webp');
          } else if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});