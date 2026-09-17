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

  '/Image/index.html',
  '/Image/apple.png',
  '/Image/Apple_1.png',
  '/Image/Apple_2.png',
  '/Image/Apple_3.png',
  '/Image/Apple_4.png',
  '/Image/Apple_5.jpg',
  '/Image/Glass_2026-02-25-1.jpg',
  '/Image/Glass_2026-02-25-2.png',
  '/Image/grapes-5min.png',
  '/Image/grapes-5min.jpg',
  '/Image/grapes-5min-1.png',
  '/Image/hamu-pc.jpg',
  '/Image/hamu-pc.png',
  '/Image/hamu-pc.webp',
  '/Image/hamu-pc.avif',
  '/Image/hamu-pc.svg',
  '/Image/kiwi-fruit_1.jpg',
  '/Image/kiwi-fruit_2.jpg',
  '/Image/mikan.png',
  '/Image/mikan-dark.png',
  '/Image/mikan-Green.png',
  '/Image/mikan-WHITE.png',
  '/Image/peach-10min.jpg',
  '/Image/peach-10min.png',
  '/Image/peach-10min.webp',
  '/Image/peach-10min.avif',
  '/Image/strawberry.jpg',
  '/Image/strawberry.png',
  '/Image/strawberry.webp',
  '/Image/strawberry-transparent.png',
  '/Image/sakura_dango.jpg',
  '/Image/sakura_dango.png',
  '/Image/sunflower-8min.jpg',
  '/Image/sunflower-8min.png',
  '/Image/sunflower-8min.webp',
  '/Image/sunflower-8min.avif',
  '/Image/sunflower-8min.bmp',
  '/Image/wallpaper.png',
  '/Image/Three-colored_dango.png',
  '/Image/UMINEKO.png',
  '/Image/Minecraft-1.png',
  '/Image/Minecraft-1.webp',
  '/Image/Minecraft-1.avif',
  '/Image/Minecraft-2.png',
  '/Image/Minecraft-2.webp',
  '/Image/Minecraft-2.avif',
  '/Image/Minecraft-3.png',
  '/Image/Minecraft-3.webp',
  '/Image/Minecraft-3.avif',
  '/Image/Minecraft-4.png',
  '/Image/Minecraft-4.webp',
  '/Image/Minecraft-4.avif',
  '/Image/Minecraft-5.png',
  '/Image/Minecraft-5.webp',
  '/Image/Minecraft-5.avif',
  '/Image/Minecraft-6.png',
  '/Image/Minecraft-6.webp',
  '/Image/Minecraft-6.avif',
  '/Image/Minecraft-7.png',
  '/Image/Minecraft-7.webp',
  '/Image/Minecraft-7.avif',
  '/Image/Minecraft-8.png',
  '/Image/Minecraft-8.webp',
  '/Image/Minecraft-8.avif',
  '/Image/Minecraft-9.png',
  '/Image/Minecraft-9.webp',
  '/Image/Minecraft-9.avif',
  '/Image/Minecraft-10.png',
  '/Image/Minecraft-10.webp',
  '/Image/Minecraft-10.avif',
  '/Image/Minecraft-11.png',
  '/Image/Minecraft-11.webp',
  '/Image/Minecraft-11.jpg',
  '/Image/Minecraft-11.avif',
  '/Image/Minecraft-12.png',
  '/Image/Minecraft-12.webp',
  '/Image/Minecraft-12.jpg',
  '/Image/Minecraft-12.avif',
  '/Image/magma_studio_2023/Apple_1_2023.png',
  '/Image/magma_studio_2023/Apple_2_2023.png',
  '/Image/magma_studio_2023/banana_1_2023.png',
  '/Image/magma_studio_2023/banana_2_2023.png',
  '/Image/magma_studio_2023/beach_2023.png',
  '/Image/magma_studio_2023/grapes_2023.png',
  '/Image/magma_studio_2023/kiwi_fruit_2023.png',
  '/Image/magma_studio_2023/lemon-2023.png',
  '/Image/magma_studio_2023/Mikan_2023.png',
  '/Image/magma_studio_2023/peach_2023.png',
  '/Image/magma_studio_2023/pineapple_2023.png',
  '/Image/magma_studio_2023/strawberry_2023.png',
  '/Image/magma_studio_2023/watermelon_2023.png',

  '/tsukimi/style.css',
  '/tsukimi/script.js',
  '/tsukimi/og-Image.png',

  '/tanzaku/2025/style.css',
  '/tanzaku/2025/script.js',
  '/tanzaku/2025/ogp.png',
  '/tanzaku/2025/icon-light.svg',
  '/tanzaku/2025/icon-dark.svg',
  '/tanzaku/2026/style.css',
  '/tanzaku/2026/script.js',
  '/tanzaku/2026/ogp.png',
  '/tanzaku/2026/image-ogp.png',
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
