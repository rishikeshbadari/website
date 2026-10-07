(function() {
    var figure = document.getElementById('homePhoto');
    var image = document.getElementById('homePhotoImage');
    function revealPage() {
        if (typeof window.revealHome === 'function') window.revealHome();
    }
    if (!figure || !image || typeof galleryData === 'undefined' || !galleryData.length) {
        revealPage();
        return;
    }

    var photo = galleryData[Math.floor(Math.random() * galleryData.length)];
    var preview = photo.thumb || photo.hero || photo.src;
    var originalStarted = false;

    function loadOriginal() {
        if (originalStarted || preview === photo.src) return;
        originalStarted = true;
        var original = new Image();
        original.decoding = 'async';
        original.fetchPriority = 'low';
        original.addEventListener('load', function() {
            function replacePreview() {
                image.src = photo.src;
                figure.hidden = false;
                revealPage();
            }
            if (typeof original.decode === 'function') {
                original.decode().then(replacePreview).catch(function() {
                    // Keep the preview if the original cannot be decoded.
                });
            } else {
                replacePreview();
            }
        }, { once: true });
        // A failed original leaves the successfully loaded preview in place.
        original.src = photo.src;
    }

    function showPhoto() {
        figure.hidden = false;
        revealPage();
        // Give the revealed page a paint before starting the large download.
        requestAnimationFrame(function() {
            requestAnimationFrame(loadOriginal);
        });
    }
    image.addEventListener('load', function() {
        if (typeof image.decode === 'function') {
            image.decode().then(showPhoto, showPhoto);
        } else {
            showPhoto();
        }
    }, { once: true });
    image.addEventListener('error', function() {
        revealPage();
        loadOriginal();
    }, { once: true });
    // Reveal quickly using the same photo's thumbnail, then upgrade in place.
    image.src = preview;
})();
