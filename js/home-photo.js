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
    function showPhoto() {
        figure.hidden = false;
        revealPage();
    }
    image.addEventListener('load', function() {
        if (typeof image.decode === 'function') {
            image.decode().then(showPhoto, showPhoto);
        } else {
            showPhoto();
        }
    }, { once: true });
    image.addEventListener('error', revealPage, { once: true });
    // Load only the chosen original. Keep it still until the next page load.
    image.src = photo.src;
})();
