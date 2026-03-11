/* Decorative flowing lines — dynamic viewport-based paths */
(function() {
    var svg = document.querySelector('.home-lines');
    if (!svg) return;

    // Skip draw-in if this was an internal navigation (flag set by page-transitions.js).
    // Fresh loads and reloads won't have the flag, so draw-in plays.
    if (sessionStorage.getItem('internalNav')) {
        svg.classList.add('no-draw');
    }
    sessionStorage.removeItem('internalNav');

    // Each path defined as viewport proportions:
    // [startX, startY, cp1X, cp1Y, cp2X, cp2Y, endX, endY]
    var defs = [
        [-0.07, 0.89, 0.10, 0.69, 0.24, 0.36, 0.38, -0.06],
        [-0.03, 1.00, 0.17, 0.78, 0.33, 0.42, 0.49, -0.09],
        [-0.14, 0.80, 0.06, 0.60, 0.19, 0.24, 0.29, -0.11],
        [ 1.07, 0.11, 0.92, 0.36, 0.78, 0.67, 0.66,  1.06],
        [ 1.04, 0.00, 0.89, 0.26, 0.73, 0.59, 0.59,  1.11],
        [ 1.13, 0.24, 0.97, 0.44, 0.85, 0.73, 0.76,  1.06]
    ];

    var paths = svg.querySelectorAll('.hline');

    function updatePaths() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        for (var i = 0; i < paths.length && i < defs.length; i++) {
            var d = defs[i];
            paths[i].setAttribute('d',
                'M' + (d[0]*w).toFixed(1) + ',' + (d[1]*h).toFixed(1) +
                ' C' + (d[2]*w).toFixed(1) + ',' + (d[3]*h).toFixed(1) +
                ' ' + (d[4]*w).toFixed(1) + ',' + (d[5]*h).toFixed(1) +
                ' ' + (d[6]*w).toFixed(1) + ',' + (d[7]*h).toFixed(1)
            );
        }
    }

    updatePaths();

    // Trigger animations now that paths have geometry
    svg.classList.add('ready');

    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updatePaths, 150);
    });
})();
