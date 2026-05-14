// Название кэша — меняйте его при обновлении файлов
const CACHE_NAME = 'museum-cache-v3'; 

// Список файлов для кэширования (убедитесь, что пути верны)
const urlsToCache = [
  '/linguist_exhibits/',
  '/linguist_exhibits/index.html',
  '/linguist_exhibits/drum.html',
  '/linguist_exhibits/backpack.html',
  '/linguist_exhibits/umbrella.html',
  '/linguist_exhibits/css/main.css',
  '/linguist_exhibits/css/adaptation.css',
  '/linguist_exhibits/css/hotspot.css',
  '/linguist_exhibits/css/navigation.css',
  '/linguist_exhibits/img/logo3.png',
  '/linguist_exhibits/img/back.jpg',
  '/linguist_exhibits/img/back copy.jpg',
  '/linguist_exhibits/img/backpack.jpg',
  '/linguist_exhibits/img/backpack1.jpg',
  '/linguist_exhibits/img/backpack2.jpg',
  '/linguist_exhibits/img/backpack3.jpg',
  '/linguist_exhibits/img/ampho.png',
  '/linguist_exhibits/img/idrum1.jpg',
  '/linguist_exhibits/img/idrum2.jpg',
  '/linguist_exhibits/img/idrum3.jpg',
  '/linguist_exhibits/img/img1.jpg',
  '/linguist_exhibits/img/img2.jpg',
  '/linguist_exhibits/img/img3.jpg',
  '/linguist_exhibits/img/img_drum.png',
  '/linguist_exhibits/img/img_umbr.png',
  '/linguist_exhibits/img/iumbr1.jpg',
  '/linguist_exhibits/img/iumbr2.jpg',
  '/linguist_exhibits/img/iumbr3.jpg',
  '/linguist_exhibits/3d-models/amphora.glb',
  '/linguist_exhibits/3d-models/backpack.glb',
  '/linguist_exhibits/3d-models/drum.glb',
  '/linguist_exhibits/3d-models/umbr.glb',
  '/linguist_exhibits/3d-models/cauldron.glb',
  '/linguist_exhibits/3d-models/guitar.glb',
  '/linguist_exhibits/3d-models/tent.glb',
  '/linguist_exhibits/audio/amphora.mp3',
  '/linguist_exhibits/audio/drum.mp3',
  '/linguist_exhibits/audio/backpack.mp3',
  '/linguist_exhibits/audio/umbrella.mp3',
  '/linguist_exhibits/fonts/SC Jurere.ttf'
];

// --- УСТАНОВКА: Кэшируем файлы ---
self.addEventListener('install', event => {
  console.log('[SW] Установка...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Кэширование файлов...');
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting())
  );
});

// --- АКТИВАЦИЯ: Удаляем старый кэш ---
self.addEventListener('activate', event => {
  console.log('[SW] Активация...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Удаление старого кэша:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// --- ПЕРЕХВАТ ЗАПРОСОВ: ОБРАБОТКА АУДИО И 3D ---
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isAudio = event.request.url.match(/\.(mp3|wav|ogg)$/i);
  const isModel = event.request.url.match(/\.glb$/i);

  // --- 1. Обработка АУДИО и 3D МОДЕЛЕЙ (с поддержкой Range-запросов) ---
  if (isAudio || isModel) {
    console.log('[SW] Перехват аудио/модели:', event.request.url);
    
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        // Пытаемся найти файл в кэше
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
          console.log('[SW] Найдено в кэше:', event.request.url);
          // Обновляем кэш в фоне (Stale-while-revalidate)
          event.waitUntil(
            fetch(event.request).then(networkResponse => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
            }).catch(() => {})
          );
          return cachedResponse;
        }
        
        // Если нет в кэше — загружаем из сети
        console.log('[SW] Нет в кэше, загружаем из сети');
        const networkResponse = await fetch(event.request);
        if (networkResponse && networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      })
    );
    return;
  }

  // --- 2. Обработка остальных файлов (стандартная) ---
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      });
    })
  );
});
