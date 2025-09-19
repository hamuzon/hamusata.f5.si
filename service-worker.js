
const CACHE_NAME = 'hamusata-v1.0';

// キャッシュ対象のすべてのファイル
const urlsToCache = [
  '/', '/index.html', '/404.html', '/manifest.json',

  // CSS
  '/css/style.css',
  '/css/mobile-menu.css',
  '/css/dark.css',
  '/css/dark-hc.css',
  '/css/dark-mc.css',
  '/css/light.css',
  '/css/light-hc.css',
  '/css/light-mc.css',

  // 画像 / アイコン
  '/images/hamusata_399-120.webp',
  '/images/banner_icon_hamusata.png',
  '/images/banner_icon_hamusata.webp',
  '/images/favicon.ico',
  '/images/hamusata.png',
  '/images/hamusata.webp',
  '/images/icon.png',
  '/images/icon.svg',
  '/images/icon.webp',
  '/images/icon_400.webp',
  '/images/icon_500_500.png',
  '/images/icon_500_500.webp',

  // サブページ
  '/links/index.html',
  '/mutual_Links/index.html',
  '/random/index.html'
];

// インストール時にすべてキャッシュ
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
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache:', key);
          return caches.delete(key);
        }
      }))
    ).then(() => self.clients.claim())
  );
});

// フェッチ時にキャッシュ優先
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then(networkResponse => {
          // 新規ファイルはキャッシュに追加
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // オフライン時フォールバック
          if (event.request.destination === 'image') {
            return caches.match('/images/icon.webp');
          } else if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
