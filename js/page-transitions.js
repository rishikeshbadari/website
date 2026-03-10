/* Page transitions — prefetching & exit animations */
(function() {
    var prefetchedPages = {};

    function preloadPage(url) {
        var fullUrl = new URL(url, window.location.origin).href;
        if (prefetchedPages[fullUrl] || fullUrl === window.location.href) return;

        var link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = fullUrl;
        document.head.appendChild(link);
        prefetchedPages[fullUrl] = true;
    }

    function addHoverPreloading() {
        var links = document.querySelectorAll('a[href^="/"], a[href^="./"]');

        links.forEach(function(link) {
            link.addEventListener('mouseenter', function() {
                preloadPage(link.href);
            });

            link.addEventListener('touchstart', function() {
                preloadPage(link.href);
            }, { passive: true });
        });
    }

    function addExitAnimations() {
        var links = document.querySelectorAll('a[href^="/"], a[href^="./"]');

        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                // Don't animate external links or if opening in new tab
                if (e.ctrlKey || e.metaKey || e.shiftKey || link.target === '_blank') {
                    return;
                }

                document.body.style.transition = 'opacity 0.15s ease-out';
                document.body.style.opacity = '0.7';
            });
        });
    }

    function preloadCriticalPages() {
        setTimeout(function() {
            var criticalPages = [
                window.location.origin + '/',
                window.location.origin + '/pictures.html',
                window.location.origin + '/projects.html',
                window.location.origin + '/art.html'
            ];

            if (typeof blogData !== 'undefined' && blogData.length > 0) {
                criticalPages.push(window.location.origin + '/blog.html');
            }

            criticalPages.forEach(function(page) {
                if (page !== window.location.href) {
                    preloadPage(page);
                }
            });
        }, 1000);
    }

    function showBlogLinkIfNeeded() {
        if (typeof blogData !== 'undefined' && blogData.length > 0) {
            var blogLink = document.querySelector('.landing-link-about[href="/blog.html"]');
            if (blogLink) blogLink.style.display = '';
        }
    }

    function init() {
        showBlogLinkIfNeeded();
        addHoverPreloading();
        addExitAnimations();
        preloadCriticalPages();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
