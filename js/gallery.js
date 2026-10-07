document.addEventListener('DOMContentLoaded', function() {
    var grid = document.getElementById('photoGrid');
    var lightbox = document.getElementById('photoLightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    if (!grid || !lightbox || !lightboxImg || typeof galleryData === 'undefined') return;
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    var activeIndex = 0;
    var returnFocus = null;

    galleryData.forEach(function(photo, index) {
        var tile = document.createElement('button');
        tile.className = 'photo-tile';
        tile.type = 'button';
        tile.setAttribute('aria-label', 'Open photo ' + (index + 1));

        var img = document.createElement('img');
        img.alt = '';
        img.loading = index < 10 ? 'eager' : 'lazy';
        img.decoding = 'async';
        var dimensions = typeof galleryDimensions !== 'undefined' && galleryDimensions[photo.thumb];
        // A square is a safe fallback if an image was added without rebuilding.
        img.width = dimensions ? dimensions[0] : 1;
        img.height = dimensions ? dimensions[1] : 1;

        img.addEventListener('load', function() {
            img.width = img.naturalWidth;
            img.height = img.naturalHeight;
            sizeTile(tile, img);
        });
        img.src = photo.thumb;

        tile.appendChild(img);
        tile.addEventListener('click', function() {
            openLightbox(index);
        });
        grid.appendChild(tile);
    });

    function sizeAllTiles() {
        grid.querySelectorAll('.photo-tile').forEach(function(tile) {
            var img = tile.querySelector('img');
            if (img) sizeTile(tile, img);
        });
    }
    sizeAllTiles();

    var resizeFrame = null;
    function scheduleLayout() {
        if (resizeFrame !== null) return;
        resizeFrame = requestAnimationFrame(function() {
            resizeFrame = null;
            sizeAllTiles();
        });
    }
    // Container width can change without a window resize (e.g. scrollbars).
    if (typeof ResizeObserver !== 'undefined') {
        var previousWidth = grid.getBoundingClientRect().width;
        new ResizeObserver(function(entries) {
            var width = entries[0].contentRect.width;
            if (width === previousWidth) return;
            previousWidth = width;
            scheduleLayout();
        }).observe(grid);
    }
    window.addEventListener('resize', scheduleLayout);
    window.addEventListener('pageshow', scheduleLayout);

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', function() {
        if (activeIndex > 0) openLightbox(activeIndex - 1);
    });
    nextBtn.addEventListener('click', function() {
        if (activeIndex < galleryData.length - 1) openLightbox(activeIndex + 1);
    });
    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function(event) {
        if (!lightbox.classList.contains('is-open')) return;
        if (event.key === 'Tab') {
            var controls = [closeBtn, prevBtn, nextBtn].filter(function(button) { return !button.disabled; });
            var current = controls.indexOf(document.activeElement);
            var next = (current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
            event.preventDefault();
            controls[next].focus();
        }
        if (event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowLeft' && activeIndex > 0) openLightbox(activeIndex - 1);
        if (event.key === 'ArrowRight' && activeIndex < galleryData.length - 1) openLightbox(activeIndex + 1);
    });

    function sizeTile(tile, img) {
        var styles = window.getComputedStyle(grid);
        var rowHeight = parseFloat(styles.getPropertyValue('grid-auto-rows'));
        var gap = parseFloat(styles.getPropertyValue('row-gap'));
        var width = tile.getBoundingClientRect().width;
        var imageWidth = Number(img.getAttribute('width'));
        var imageHeight = Number(img.getAttribute('height'));
        if (!(width > 0 && rowHeight > 0 && imageWidth > 0 && imageHeight > 0)) return;
        var height = width * (imageHeight / imageWidth);
        var span = Math.max(1, Math.ceil((height + gap) / (rowHeight + gap)));
        tile.style.gridRowEnd = 'span ' + span;
    }

    function openLightbox(index) {
        if (!lightbox.classList.contains('is-open')) returnFocus = document.activeElement;
        activeIndex = index;
        var photo = galleryData[index];
        lightboxImg.src = photo.src;
        lightboxImg.alt = 'Photograph ' + (index + 1) + ' of ' + galleryData.length;
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === galleryData.length - 1;
        prevBtn.classList.toggle('is-disabled', index === 0);
        nextBtn.classList.toggle('is-disabled', index === galleryData.length - 1);
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
        closeBtn.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
        lightboxImg.removeAttribute('src');
        if (returnFocus) returnFocus.focus();
    }

});
