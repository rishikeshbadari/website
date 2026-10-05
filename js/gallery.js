document.addEventListener('DOMContentLoaded', function() {
    var grid = document.getElementById('photoGrid');
    var lightbox = document.getElementById('photoLightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    var activeIndex = 0;

    if (!grid || typeof galleryData === 'undefined') return;

    galleryData.forEach(function(photo, index) {
        var tile = document.createElement('button');
        tile.className = 'photo-tile';
        tile.type = 'button';
        tile.setAttribute('aria-label', 'Open photo ' + (index + 1));

        var img = document.createElement('img');
        img.alt = '';
        img.loading = index < 10 ? 'eager' : 'lazy';
        img.decoding = 'async';

        img.addEventListener('load', function() {
            sizeTile(tile, img);
        });
        img.src = photo.thumb;

        tile.appendChild(img);
        tile.addEventListener('click', function() {
            openLightbox(index);
        });
        grid.appendChild(tile);
    });

    window.addEventListener('resize', debounce(function() {
        grid.querySelectorAll('.photo-tile').forEach(function(tile) {
            var img = tile.querySelector('img');
            if (img && img.complete && img.naturalWidth > 0) {
                sizeTile(tile, img);
            }
        });
    }, 120));

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
        if (event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowLeft' && activeIndex > 0) openLightbox(activeIndex - 1);
        if (event.key === 'ArrowRight' && activeIndex < galleryData.length - 1) openLightbox(activeIndex + 1);
    });

    function sizeTile(tile, img) {
        var styles = window.getComputedStyle(grid);
        var rowHeight = parseFloat(styles.getPropertyValue('grid-auto-rows'));
        var gap = parseFloat(styles.getPropertyValue('row-gap'));
        var width = tile.getBoundingClientRect().width;
        var height = width * (img.naturalHeight / img.naturalWidth);
        var span = Math.ceil((height + gap) / (rowHeight + gap));
        tile.style.gridRowEnd = 'span ' + span;
    }

    function openLightbox(index) {
        activeIndex = index;
        var photo = galleryData[index];
        lightboxImg.src = photo.src;
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
    }

    function debounce(fn, delay) {
        var timer = null;
        return function() {
            clearTimeout(timer);
            timer = setTimeout(fn, delay);
        };
    }
});
