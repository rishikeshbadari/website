(function() {
    function preloadGallery() {
        if (typeof galleryData === 'undefined' || window.sessionGalleryImageCache) return;

        var sessionKey = Date.now().toString(36) + Math.random().toString(36).slice(2);
        var images = [];

        galleryData.forEach(function(photo) {
            var separator = photo.src.indexOf('?') === -1 ? '?' : '&';
            photo.src += separator + 'gallery-session=' + sessionKey;

            var image = new Image();
            image.decoding = 'async';
            image.src = photo.src;
            images.push(image);
        });

        // Keep the image resources alive for this document's entire session.
        window.sessionGalleryImageCache = images;
    }

    // Do not compete with the initial page render or its critical resources.
    // The full gallery starts loading as soon as the current page has finished.
    if (document.readyState === 'complete') {
        preloadGallery();
    } else {
        window.addEventListener('load', preloadGallery, { once: true });
    }
})();
