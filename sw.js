const CACHE_NAME = 'egov-v1';
const ASSETS = [
  './',
  './index.html',
  './document.html',
  './style.css',
  './app.js',
  './manifest.json',
  './my-id.jpg',
  './app-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
