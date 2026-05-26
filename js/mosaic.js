/* Hero background — single image, dip to dark, fade in next photo */
(function () {

    var HOLD_S   = 22;  // seconds each photo is held
    var FADE_MS  = 1500; // fade-out duration, and fade-in duration (must match CSS)

    // ── Color helpers ─────────────────────────────────────────────────────────

    function hexToHsl(hex) {
        var r = parseInt(hex.slice(1, 3), 16) / 255;
        var g = parseInt(hex.slice(3, 5), 16) / 255;
        var b = parseInt(hex.slice(5, 7), 16) / 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h = 0, s = 0, l = (max + min) / 2;
        if (max !== min) {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6;                break;
                case b: h = ((r - g) / d + 4) / 6;                break;
            }
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function textColorFromPhoto(hex) {
        var hsl = hexToHsl(hex);
        var s   = Math.min(hsl.s + 20, 45);
        return 'hsl(' + hsl.h + ', ' + s + '%, 90%)';
    }

    function setTitleColor(color) {
        var title = document.querySelector('.hero-title');
        if (title) title.style.color = color;
    }

    // ── Hero build ────────────────────────────────────────────────────────────

    function buildHero() {
        var container = document.querySelector('.hero-mosaic');
        if (!container || typeof galleryData === 'undefined' || galleryData.length === 0) return;

        var photos   = galleryData.slice().sort(function () { return Math.random() - 0.5; });
        var photoIdx = 0;

        var img = document.createElement('img');
        img.className = 'hero-bg-img';
        img.alt       = '';
        img.loading   = 'eager';
        img.decoding  = 'async';
        img.fetchPriority = 'high';
        img.setAttribute('fetchpriority', 'high');
        container.appendChild(img);

        function revealPhoto(photo) {
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    setTitleColor(textColorFromPhoto(photo.color));
                    img.classList.add('is-visible');
                    scheduleNext();
                });
            });
        }

        function loadPhoto(photo) {
            var settled = false;

            function cleanup() {
                img.onload = null;
                img.onerror = null;
            }

            function finish() {
                if (settled) return;
                settled = true;
                cleanup();
                revealPhoto(photo);
            }

            function fail() {
                if (settled) return;
                settled = true;
                cleanup();
                scheduleNext();
            }

            img.onload = function () {
                if (typeof img.decode === 'function') {
                    img.decode().then(finish).catch(finish);
                } else {
                    finish();
                }
            };
            img.onerror = fail;
            img.src = photo.src;

            if (img.complete) {
                if (img.naturalWidth > 0) {
                    img.onload();
                } else {
                    fail();
                }
            }
        }

        // Load the first photo without blocking the rest of the page.
        loadPhoto(photos[0]);

        function advance() {
            photoIdx = (photoIdx + 1) % photos.length;
            var photo = photos[photoIdx];

            // Step 1: fade out
            img.classList.remove('is-visible');

            setTimeout(function () {
                // Step 2: swap src while dark, decode fully, then fade in.
                loadPhoto(photo);
            }, FADE_MS);
        }

        function scheduleNext() {
            setTimeout(advance, HOLD_S * 1000);
        }
    }

    if (document.readyState === 'loading' && !document.querySelector('.hero-mosaic')) {
        document.addEventListener('DOMContentLoaded', buildHero);
    } else {
        buildHero();
    }

})();
