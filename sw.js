/* Service Worker — caches background video for instant cross-page loads */
var CACHE_NAME = 'bg-video-v1';
var VIDEO_FILES = [
    '/assets/bg-video.webm',
    '/assets/bg-video.mp4',
    '/assets/video-poster.jpg'
];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(VIDEO_FILES);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(names) {
            return Promise.all(
                names.filter(function(name) { return name !== CACHE_NAME; })
                     .map(function(name) { return caches.delete(name); })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', function(e) {
    var url = new URL(e.request.url);
    var isVideoAsset = VIDEO_FILES.some(function(f) {
        return url.pathname === f;
    });

    if (isVideoAsset) {
        e.respondWith(
            caches.match(e.request).then(function(cached) {
                return cached || fetch(e.request).then(function(response) {
                    var clone = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(e.request, clone);
                    });
                    return response;
                });
            })
        );
    }
});
