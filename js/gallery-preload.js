(function() {
    function preloadGallery() {
        if (typeof galleryData === 'undefined' || window.sessionGalleryImageCache) return;

        var urls = galleryData.map(function(photo) { return photo.src; });
        var nextIndex = 0;
        var activeRequests = 0;
        var maxConcurrentRequests = 2;

        // This marker prevents duplicate preload queues during this page session.
        window.sessionGalleryImageCache = true;

        function loadNext() {
            while (activeRequests < maxConcurrentRequests && nextIndex < urls.length) {
                var url = urls[nextIndex++];
                activeRequests += 1;

                // `reload` refreshes the browser cache after every page reload.
                // Consuming the body ensures the complete original is cached before
                // the queue continues, without adding image elements to the page.
                fetch(url, { cache: 'reload' })
                    .then(function(response) {
                        return response.ok ? response.blob() : null;
                    })
                    .catch(function() {
                        // A click can still load an image if its background request fails.
                    })
                    .then(function() {
                        activeRequests -= 1;
                        loadNext();
                    });
            }
        }

        loadNext();
    }

    // Do not compete with the initial page render or its critical resources.
    // The full gallery starts loading as soon as the current page has finished.
    if (document.readyState === 'complete') {
        preloadGallery();
    } else {
        window.addEventListener('load', preloadGallery, { once: true });
    }
})();
