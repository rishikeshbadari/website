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

                sessionStorage.setItem('internalNav', '1');
                document.body.style.transition = 'opacity 0.15s ease-out';
                document.body.style.opacity = '0.7';
            });
        });
    }

    function preloadCriticalPages() {
        setTimeout(function() {
            var origin = window.location.origin;

            // HTML pages
            var pages = [
                '/',
                '/projects.html'
            ];

            if (typeof blogData !== 'undefined' && blogData.length > 0) {
                pages.push('/blog.html');
            }

            // Page-specific CSS, JS, and data files
            var resources = [
                '/css/home.css',
                '/css/projects.css', '/data/projects-data.js', '/js/projects.js',
                '/css/blog.css', '/js/blog.js', '/vendor/marked.min.js'
            ];

            pages.concat(resources).forEach(function(path) {
                preloadPage(origin + path);
            });
        }, 1000);
    }

    function showBlogLinkIfNeeded() {
        if (typeof blogData !== 'undefined' && blogData.length > 0) {
            var blogLink = document.querySelector('.landing-link-about[href="/blog.html"]');
            if (blogLink) blogLink.style.display = '';
        }
    }

    function addSpeculationRules() {
        if (typeof HTMLScriptElement === 'undefined' ||
            !HTMLScriptElement.supports ||
            !HTMLScriptElement.supports('speculationrules')) return;

        var urls = ['/', '/projects.html'];
        if (typeof blogData !== 'undefined' && blogData.length > 0) {
            urls.push('/blog.html');
        }

        var script = document.createElement('script');
        script.type = 'speculationrules';
        script.textContent = JSON.stringify({
            prerender: [{ urls: urls }]
        });
        document.head.appendChild(script);
    }

    function init() {
        showBlogLinkIfNeeded();
        addHoverPreloading();
        addExitAnimations();
        preloadCriticalPages();
        addSpeculationRules();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
