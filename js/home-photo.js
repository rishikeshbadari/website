(function() {
    var figure = document.getElementById('homePhoto');
    var image = document.getElementById('homePhotoImage');
    if (!figure || !image || typeof galleryData === 'undefined' || !galleryData.length) return;

    var photo = galleryData[Math.floor(Math.random() * galleryData.length)];
    image.addEventListener('load', function() {
        figure.hidden = false;
    }, { once: true });
    // Load only the chosen original. Keep it still until the next page load.
    image.src = photo.src;
})();
