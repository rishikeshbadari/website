/* Shared modal open/close helpers */
var Modal = (function () {
    function open(el, closeBtn) {
        el.classList.add('show');
        document.body.style.overflow = 'hidden';
        if (closeBtn) closeBtn.focus();
    }
    function close(el) {
        el.classList.remove('show');
        document.body.style.overflow = '';
    }
    function bindClose(el, closeBtn) {
        if (closeBtn) closeBtn.addEventListener('click', function () { close(el); });
        el.addEventListener('click', function (e) {
            if (e.target === el) close(el);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && el.classList.contains('show')) close(el);
        });
    }
    return { open: open, close: close, bindClose: bindClose };
})();
