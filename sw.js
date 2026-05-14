const CACHE_NAME = 'museum-cache-v1'; // Хранилище для файлов
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

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
