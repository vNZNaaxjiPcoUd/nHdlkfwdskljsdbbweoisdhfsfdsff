
const CACHE_NAME = 'yn-v1.0.98666'; 


const urlsToCache = [
  './index.html',
  './icon-192.png',
  './icon-512.png',
  './style_black.css',
  './r.html',
  './marked.min.js',
  './mermaid.min.js',
  './umd.js',
  './d3@7.js',
  './markmap-lib.js',
  './markmap-view.js',
  './crypto-js.min.js',
  './ynote.js',
  './manifest.js',
  './keepLocal.v1.js',
  './purify.min.js',
  './favicon.ico',
  './index',
  './r',
  './'
];



self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      console.log('開始快取檔案...');
      console.log("版本",CACHE_NAME);
      for (const url of urlsToCache) {
        try { 
          await cache.add(url);
          console.log(`成功快取: ${url}`);
        } catch (err) {
          console.error(`快取失敗的檔案: ${url}`, err);
        }
      }
    })
  );
  self.skipWaiting();
});


self.addEventListener('fetch', event => {
  if (event.request.url.includes('script.google.com')) {
    return;
  }

  event.respondWith(
    (async () => {

      const cachedResponse = await caches.match(event.request, { ignoreSearch: true });
      if (cachedResponse) {
        return cachedResponse;
      }


      const url = new URL(event.request.url);
      if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html') {
        const indexResponse = await caches.match('./index.html', { ignoreSearch: true }) || 
                              await caches.match('./', { ignoreSearch: true });
        if (indexResponse) return indexResponse;
      }


      try {
        return await fetch(event.request);
      } catch (error) {
        console.error('離線且無快取：', error, event.request.url);
        return new Response('<h1>離線中且尚無快取資料</h1>', {
          status: 533,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
    })()
  );
});



self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {

      const cacheNames = await caches.keys();
      
      const deletePromises = cacheNames
        .filter(cacheName => cacheName !== CACHE_NAME)
        .map(async cacheName => {
          console.log('刪除舊快取:', cacheName);
          return await caches.delete(cacheName);
        });


      await Promise.all(deletePromises);


      await self.clients.claim();
    })()
  );
});

