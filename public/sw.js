const CACHE = 'smartcloset-v1'

const PRECACHE = [
  '/',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
]

// Dominios que se cachean con stale-while-revalidate
const CACHE_DOMAINS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'images.unsplash.com',
]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  const url = new URL(request.url)

  // Solo GET
  if (request.method !== 'GET') return

  // Fuentes y assets externos — cache first
  if (CACHE_DOMAINS.some((d) => url.hostname.includes(d))) {
    e.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(request)
        if (cached) return cached
        const fresh = await fetch(request)
        cache.put(request, fresh.clone())
        return fresh
      })
    )
    return
  }

  // API calls — network only
  if (url.pathname.startsWith('/api')) return

  // Navegación (HTML) — network first, fallback a '/'
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).catch(() => caches.match('/'))
    )
    return
  }

  // Assets estáticos (JS, CSS, imágenes) — stale while revalidate
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(request)
        const fetchPromise = fetch(request).then((fresh) => {
          cache.put(request, fresh.clone())
          return fresh
        }).catch(() => cached)
        return cached || fetchPromise
      })
    )
  }
})
