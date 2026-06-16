const CACHE_NAME = 'zora-v1'
const STATIC_ASSETS = ['/', '/collections', '/new-arrivals', '/about', '/manifest.json']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))))
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || e.request.url.includes('/api/') || e.request.url.includes('supabase.co') || e.request.url.includes('imagekit.io')) return
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const c = r.clone(); caches.open(CACHE_NAME).then(cache => cache.put(e.request, c)) }
      return r
    }).catch(() => caches.match(e.request).then(cached => cached || (e.request.mode === 'navigate' ? caches.match('/') : undefined)))
  )
})
