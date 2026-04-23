const CACHE = 'fuelog-v72';
const ASSETS = [
  '/Fuelog/',
  '/Fuelog/index.html',
  '/Fuelog/manifest.json',
  '/Fuelog/icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS).catch(()=>{}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first for HTML (navigation + index.html). Makes app updates
// appear immediately instead of requiring users to wrestle with caches.
// Falls back to cache only when offline so the PWA still works on no network.
// Cache-first for everything else so fonts/icons load fast.
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('api.anthropic.com') ||
      url.includes('openfoodfacts') ||
      url.includes('fonts.googleapis') ||
      url.includes('fonts.gstatic') ||
      url.includes('unpkg.com')) {
    return;
  }
  const isDoc = e.request.mode === 'navigate' ||
                url.endsWith('/Fuelog/') ||
                url.endsWith('/Fuelog/index.html') ||
                url.endsWith('/Fuelog/manifest.json');
  if (isDoc) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request).then(r => r || caches.match('/Fuelog/index.html')))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => {
      if (r) return r;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('/Fuelog/index.html'));
    })
  );
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
