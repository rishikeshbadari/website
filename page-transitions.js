// Smart page preloading for instant navigation
class PageTransitions {
    constructor() {
        this.prefetchedPages = new Set();
        this.init();
    }

    init() {
        // Preload pages on link hover
        this.addHoverPreloading();
        
        // Add smooth exit animation
        this.addExitAnimations();
        
        // Preload critical pages immediately
        this.preloadCriticalPages();
    }

    addHoverPreloading() {
        const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="index.html"], a[href^="pictures.html"], a[href^="projects.html"], a[href^="blog.html"]');

        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.preloadPage(link.href);
            });

            link.addEventListener('touchstart', () => {
                this.preloadPage(link.href);
            }, { passive: true });
        });
    }

    preloadPage(url) {
        // Convert relative URLs to absolute
        const fullUrl = new URL(url, window.location.origin).href;
        
        if (this.prefetchedPages.has(fullUrl) || fullUrl === window.location.href) {
            return;
        }

        // Create invisible link for prefetching
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = fullUrl;
        
        document.head.appendChild(prefetchLink);
        this.prefetchedPages.add(fullUrl);
    }

    addExitAnimations() {
        const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="index.html"], a[href^="pictures.html"], a[href^="projects.html"], a[href^="blog.html"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't animate external links or if opening in new tab
                if (e.ctrlKey || e.metaKey || e.shiftKey || link.target === '_blank') {
                    return;
                }
                
                // Add exit animation
                document.body.style.transition = 'opacity 0.15s ease-out';
                document.body.style.opacity = '0.7';
            });
        });
    }

    preloadCriticalPages() {
        // Preload other pages after a short delay
        setTimeout(() => {
            const criticalPages = [
                window.location.origin + '/',
                window.location.origin + '/pictures.html',
                window.location.origin + '/projects.html',
                window.location.origin + '/blog.html'
            ];
            
            criticalPages.forEach(page => {
                if (page !== window.location.href) {
                    this.preloadPage(page);
                }
            });
        }, 1000);
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PageTransitions());
} else {
    new PageTransitions();
} 