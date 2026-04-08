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
    return { open: open, close: close };
})();
