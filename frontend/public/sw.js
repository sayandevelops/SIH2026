/**
 * ShieldScan Defense-Grade Service Worker
 * Version: 1.0.0
 * Provides offline caching, app shell pre-caching, and stale-while-revalidate strategies
 */

const CACHE_NAME = "shieldscan-core-v1";
const RUNTIME_CACHE = "shieldscan-runtime-v1";

// Essential static shell files to pre-cache on install
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/manifest.json",
  "/shield.svg",
  "/apple-touch-icon.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/icon-maskable-192x192.png",
  "/icons/icon-maskable-512x512.png",
  "/icons/favicon-32x32.png",
  "/icons/favicon-16x16.png",
];

// Install Event — pre-cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS).catch((err) => {
          console.warn("[ShieldScan SW] Non-fatal precache warning:", err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event — cleanup outdated caches
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              console.log("[ShieldScan SW] Removing old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch Event — smart caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-http/https requests (e.g. chrome-extension://, moz-extension://)
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // Ignore non-GET requests (e.g. POST to /api/screen or /api/upload)
  if (request.method !== "GET") {
    return;
  }

  // Bypass service worker in dev mode or for Vite internals and API proxies
  if (
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.pathname.startsWith("/@") ||
    url.pathname.startsWith("/src/") ||
    url.pathname.startsWith("/nvidia-api") ||
    url.pathname.includes("node_modules")
  ) {
    return;
  }

  // Handle API requests: Network-first, with fallback JSON if offline
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            offline: true,
            status: "offline",
            message: "ShieldScan backend is unreachable. You are currently operating in offline mode.",
            timestamp: new Date().toISOString(),
          }),
          {
            status: 503,
            statusText: "Service Unavailable (Offline)",
            headers: { "Content-Type": "application/json" },
          }
        );
      })
    );
    return;
  }

  // Handle SPA Navigation requests (HTML pages)
  // Network-First with fallback to cached index.html
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match("/index.html");
          return cachedResponse || (await cache.match("/"));
        })
    );
    return;
  }

  // Handle Google Fonts & static stylesheets
  if (url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com") {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Handle static assets (JS, CSS, images, SVGs): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse || new Response("", { status: 408, statusText: "Offline or Network Timeout" }));

      return cachedResponse || fetchPromise;
    })
  );
});

// Message Event — handle manual update triggers from the UI
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
