/* Signature animation — draws "Rishikesh Badari" in Yellowtail */
(function () {

    var FONT_SRC      = 'assets/yellowtail.ttf';
    var TEXT          = 'Rishikesh Badari';
    var FONT_SIZE     = 160;  // SVG coordinate units (Yellowtail renders smaller)
    var DRAW_SECS     = 3.4;  // stroke draw duration
    var FILL_SECS     = 0.9;  // fill fade-in after drawing
    var START_DELAY   = 400;  // ms after page fade-in before animation begins
    var PAD           = 16;   // padding around path bounding box

    function init() {
        var container = document.querySelector('.hero-title');
        if (!container || typeof opentype === 'undefined') return;

        opentype.load(FONT_SRC, function (err, font) {
            if (err) {
                // Fallback: show plain text
                container.textContent = TEXT;
                return;
            }

            // ── Build SVG path ──────────────────────────────────────────────

            var fontPath = font.getPath(TEXT, 0, FONT_SIZE, FONT_SIZE);
            var bb       = fontPath.getBoundingBox();

            var vbX = bb.x1 - PAD;
            var vbY = bb.y1 - PAD;
            var vbW = (bb.x2 - bb.x1) + PAD * 2;
            var vbH = (bb.y2 - bb.y1) + PAD * 2;

            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', vbX + ' ' + vbY + ' ' + vbW + ' ' + vbH);
            svg.setAttribute('aria-label', TEXT);
            svg.setAttribute('role', 'img');
            svg.setAttribute('class', 'hero-signature');

            var pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathEl.setAttribute('d',                fontPath.toPathData(2));
            pathEl.setAttribute('fill',             'currentColor');
            pathEl.setAttribute('fill-opacity',     '0');
            pathEl.setAttribute('stroke',           'currentColor');
            pathEl.setAttribute('stroke-width',     '2');
            pathEl.setAttribute('stroke-linecap',   'round');
            pathEl.setAttribute('stroke-linejoin',  'round');

            svg.appendChild(pathEl);

            // Clear the container and insert SVG (must be in DOM for getTotalLength)
            container.innerHTML = '';
            container.appendChild(svg);

            // ── Animate ─────────────────────────────────────────────────────

            var length = pathEl.getTotalLength();
            pathEl.style.strokeDasharray  = length;
            pathEl.style.strokeDashoffset = length;

            setTimeout(function () {
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {

                        // Phase 1: draw the stroke
                        pathEl.style.transition =
                            'stroke-dashoffset ' + DRAW_SECS + 's cubic-bezier(0.4, 0, 0.2, 1)';
                        pathEl.style.strokeDashoffset = '0';

                        // Phase 2: fill fades in, stroke fades out
                        setTimeout(function () {
                            pathEl.style.transition =
                                'fill-opacity '   + FILL_SECS + 's ease, ' +
                                'stroke-opacity ' + FILL_SECS + 's ease';
                            pathEl.setAttribute('fill-opacity', '1');
                            pathEl.style.strokeOpacity = '0';
                        }, DRAW_SECS * 1000);

                    });
                });
            }, START_DELAY);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
