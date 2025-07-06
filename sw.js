// Service Worker for performance optimization and offline functionality
const CACHE_NAME = 'silvia-blog-v2.1';
const STATIC_CACHE = [
    '/',
    '/index.html',
    '/profile.html',
    '/contact.html',
    '/style.css',
    '/contact_style.css',
    '/Profilestyle.css',
    '/main.js',
    '/button.js',
    '/Flowers in the bushes.png',
    '/Me.jpg'
];

// Install event - cache static assets with better error handling
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching static assets...');
                return cache.addAll(STATIC_CACHE.map(url => new Request(url, {
                    cache: 'reload'
                })));
            })
            .then(() => {
                console.log('Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Cache installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker activated');
            return self.clients.claim();
        })
    );
});

// Fetch event - advanced caching strategy
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) return;
    
    // Skip Google Analytics and other third-party requests
    if (event.request.url.includes('google-analytics.com') || 
        event.request.url.includes('googletagmanager.com') ||
        event.request.url.includes('fonts.googleapis.com') ||
        event.request.url.includes('cdn.jsdelivr.net')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached version immediately
                    return cachedResponse;
                }
                
                // Fetch from network with timeout
                return Promise.race([
                    fetch(event.request),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Network timeout')), 3000)
                    )
                ]).then((fetchResponse) => {
                    // Don't cache non-successful responses
                    if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                        return fetchResponse;
                    }
                    
                    // Clone the response for caching
                    const responseToCache = fetchResponse.clone();
                    
                    // Cache dynamic resources with size limit
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            if (event.request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
                                cache.put(event.request, responseToCache);
                            }
                        })
                        .catch((error) => {
                            console.error('Caching failed:', error);
                        });
                    
                    return fetchResponse;
                }).catch((error) => {
                    console.error('Fetch failed:', error);
                    // Return offline fallback if available
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
