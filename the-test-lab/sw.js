/* The Test Lab service worker.
   Caches the site so it keeps working without a network connection.
   HTML is fetched from the network first, so you always test the latest page;
   assets are served from the cache and refreshed in the background. */
const VERSION = 'the-test-lab-v1';
const BASE = new URL('./', self.registration.scope).pathname;

const PAGES = ['forms', 'dropdowns', 'checkboxes', 'buttons', 'alerts', 'windows', 'frames', 'links', 'storage',
  'tables', 'files', 'drag-drop', 'hover', 'keyboard', 'scrolling', 'svg-canvas', 'waits', 'widgets', 'shadow-dom',
  'login', 'secure', 'new-window', 'frame-single', 'frame-outer', 'frame-inner'];
const SCRIPTS = ['home', 'forms', 'dropdowns', 'checkboxes', 'buttons', 'alerts', 'windows', 'frames', 'links',
  'storage', 'tables', 'files', 'drag-drop', 'hover', 'keyboard', 'scrolling', 'svg-canvas', 'waits', 'widgets',
  'shadow-dom', 'login'];
const FONTS = ['plus-jakarta-sans-latin-400-normal', 'plus-jakarta-sans-latin-500-normal',
  'plus-jakarta-sans-latin-600-normal', 'plus-jakarta-sans-latin-700-normal', 'plus-jakarta-sans-latin-800-normal',
  'jetbrains-mono-latin-400-normal', 'jetbrains-mono-latin-500-normal'];

const ASSETS = [
  BASE, BASE + 'index.html', BASE + 'manifest.webmanifest',
  BASE + 'assets/css/styles.css', BASE + 'assets/js/layout.js', BASE + 'assets/img/favicon.svg',
  BASE + 'assets/files/sample.txt', BASE + 'assets/files/sample.json', BASE + 'assets/files/upload-me.txt',
  ...PAGES.map(p => `${BASE}pages/${p}.html`),
  ...SCRIPTS.map(s => `${BASE}assets/js/pages/${s}.js`),
  ...FONTS.map(f => `${BASE}assets/fonts/${f}.woff2`)
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION)
      .then(cache => Promise.all(ASSETS.map(url => cache.add(url).catch(() => { /* skip missing file */ }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const isHtml = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isHtml) {
    event.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then(hit => hit || caches.match(BASE + 'index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(hit => {
      const network = fetch(req)
        .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; })
        .catch(() => hit);
      return hit || network;
    })
  );
});
