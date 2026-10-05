(function() {
    var HOLD_MS = 8500;
    var FADE_MS = 1400;

    function hexToHsl(hex) {
        var r = parseInt(hex.slice(1, 3), 16) / 255;
        var g = parseInt(hex.slice(3, 5), 16) / 255;
        var b = parseInt(hex.slice(5, 7), 16) / 255;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h = 0;
        var s = 0;
        var l = (max + min) / 2;

        if (max !== min) {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
            if (max === g) h = (b - r) / d + 2;
            if (max === b) h = (r - g) / d + 4;
            h /= 6;
        }

        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function titleColorFromPhoto(hex) {
        var hsl = hexToHsl(hex);
        var saturation = Math.min(hsl.s + 18, 44);
        return 'hsl(' + hsl.h + ', ' + saturation + '%, 91%)';
    }

    function setTitleColor(color) {
        var title = document.querySelector('.hero-title');
        if (title) title.style.color = color;
    }

    function init() {
        var container = document.querySelector('.hero-mosaic');
        if (!container || typeof galleryData === 'undefined' || !galleryData.length) return;

        var photos = galleryData.slice().sort(function() { return Math.random() - 0.5; });
        var index = 0;
        var img = document.createElement('img');
        img.className = 'hero-bg-img';
        img.alt = '';
        img.loading = 'eager';
        img.decoding = 'async';
        container.appendChild(img);
        setTitleColor('hsl(0, 0%, 91%)');

        img.addEventListener('load', function showInitialPhoto() {
            requestAnimationFrame(function() {
                img.style.opacity = '1';
                setTimeout(advance, HOLD_MS);
            });
        }, { once: true });
        img.addEventListener('error', function() {
            setTimeout(advance, HOLD_MS);
        }, { once: true });
        img.src = photos[0].hero;

        function advance() {
            index = (index + 1) % photos.length;
            var photo = photos[index];
            img.style.opacity = '0';

            setTimeout(function() {
                img.src = photo.hero;
                function fadeIn() {
                    requestAnimationFrame(function() {
                        requestAnimationFrame(function() {
                            setTitleColor('hsl(0, 0%, 91%)');
                            img.style.opacity = '1';
                            setTimeout(advance, HOLD_MS);
                        });
                    });
                }

                if (typeof img.decode === 'function') {
                    img.decode().then(fadeIn).catch(fadeIn);
                } else if (img.complete && img.naturalWidth > 0) {
                    fadeIn();
                } else {
                    img.onload = fadeIn;
                    img.onerror = function() { setTimeout(advance, HOLD_MS); };
                }
            }, FADE_MS);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
