/* Hero name reveal — sweep line traces across viewport, revealing title in sync */
(function () {

    var SWEEP_MS    = 1400;  // total time for line to cross the full viewport
    var START_DELAY = 350;   // ms after DOMContentLoaded before animation starts

    function init() {
        var textEl = document.querySelector('.hero-title-text');
        if (!textEl) return;

        // Build the sweep line and attach to body (needs full-viewport span)
        var line = document.createElement('div');
        line.className = 'hero-sweep-line';
        document.body.appendChild(line);

        setTimeout(function () {
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {

                    var W    = window.innerWidth;
                    var rect = textEl.getBoundingClientRect();

                    // Fraction of viewport covered before/during text
                    var startFrac = rect.left / W;
                    var durFrac   = rect.width / W;
                    var delayMs   = SWEEP_MS * startFrac;
                    var revealMs  = Math.max(SWEEP_MS * durFrac, 150);

                    // Sweep line: translate from 0 → viewport width + self
                    line.style.transition = 'transform ' + SWEEP_MS + 'ms cubic-bezier(0.4, 0, 0.6, 1)';
                    line.style.transform  = 'translateX(' + (W + 4) + 'px)';

                    // Reveal text: clip-path inset shrinks right edge in sync with line
                    textEl.style.transitionProperty       = 'clip-path';
                    textEl.style.transitionDuration       = revealMs + 'ms';
                    textEl.style.transitionDelay          = delayMs + 'ms';
                    textEl.style.transitionTimingFunction = 'linear';
                    textEl.style.clipPath                 = 'inset(0 0% 0 0)';

                    // Remove line element after it has exited
                    setTimeout(function () {
                        if (line.parentNode) line.parentNode.removeChild(line);
                    }, SWEEP_MS + 200);

                });
            });
        }, START_DELAY);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
