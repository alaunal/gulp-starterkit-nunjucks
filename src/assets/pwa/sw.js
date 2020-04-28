const PRECACHE = 'gulp-starterkit-v1';
const RUNTIME = 'runtime';
const PRECACHE_URLS = [
    '/',
    '/static/images/icon-man.png',
    '/static/css/main.css',
    '/static/js/main.js'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(PRECACHE)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(PRECACHE_URLS);
        })
    );
});


// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it responses with the original request
self.addEventListener('fetch', event => {
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                } else
                    return fetch(event.request);
            })
        )
    }
});
