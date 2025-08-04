const CACHE_NAME = 'my-cache-v1';

// 서비스 워커 설치
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/scripts.js',
        '/icons/icon-192x192.png',
        '/offline.html'  // 오프라인 페이지 추가
      ]);
    })
  );
});

// 서비스 워커 활성화 (구버전 캐시 삭제)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]; // 현재 버전의 캐시만 유지

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // 불필요한 캐시 삭제
          }
        })
      );
    })
  );
});

// 네트워크 요청 처리 (오프라인 대체 페이지 제공)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).catch(() => {
        return caches.match('/offline.html'); // 오프라인 페이지 제공
      });
    })
  );
});
