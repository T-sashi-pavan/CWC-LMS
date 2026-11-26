const CACHE_NAME = 'cwc-shell-v1'
const SHELL_ASSETS = ['/', '/manifest.webmanifest', '/favicon-192.png', '/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).catch(() => {})
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  // Never cache API, Supabase auth, or external analytics requests
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api')) {
    return
  }

  // Network-first with offline cache fallback for app shell & static assets
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {})
        }
        return res
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match('/')))
  )
})
