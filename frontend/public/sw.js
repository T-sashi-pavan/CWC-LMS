// Lightweight network-first service worker for PWA installability without stale-cache issues.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  // Let the browser handle network requests directly so APIs and sheets stay 100% fresh.
})


// Web Push notification handler
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { title: 'CWC Ecosystem', body: event.data ? event.data.text() : '' }
  }
  const title = data.title || 'CWC Ecosystem'
  const options = {
    body: data.body || 'New update available on CWC Ecosystem.',
    icon: data.icon || '/favicon-192.png',
    badge: data.badge || '/favicon-48.png',
    data: { url: data.url || '/' },
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = (event.notification.data && event.notification.data.url) || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          client.navigate(target)
          return client.focus()
        }
      }
      return self.clients.openWindow(target)
    })
  )
})
