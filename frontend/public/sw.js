// Lightweight network-first service worker for PWA installability without stale-cache issues.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  // Let the browser handle network requests directly so APIs and sheets stay 100% fresh.
})

