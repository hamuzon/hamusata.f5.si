const CACHE_NAME = 'hamusata-v1.0';

// キャッシュするファイル一覧
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
  '/hamusata_399-120.webp',
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
  '/random/index.html'
];

// インストール：キャッシュ登録
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.warn('[SW] addAll failed:', err))
      .then(() => self.skipWaiting())
  );
});

// アクティベート：古いキャッシュ削除
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

// フェッチ：キャッシュ優先 + ネット取得 + fallback
self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {

      // キャッシュに存在 → 即返す
      if (cachedResponse) return cachedResponse;

      // ネットワークへ
      return fetch(event.request)
        .then(networkResponse => {

          // 正常レスポンスのみキャッシュ
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          // キャッシュ保存
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone())
              .catch(e =>
                console.warn('[SW] cache.put failed:', event.request.url, e)
              );
            return networkResponse;
          });
        })

        // オフライン fallback
        .catch(() => {
          if (event.request.destination === 'image') {
            return caches.match('/icon.webp');
          }
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
