document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('image-gallery');
    
    // Sort gallery data by date (newest first)
    const sortedGalleryData = [...galleryData].sort((a, b) => {
        const dateA = parseImageDate(a.date);
        const dateB = parseImageDate(b.date);
        return dateB - dateA; // Newest first (descending order)
    });

    // Function to parse the date strings from gallery data
    function parseImageDate(dateString) {
        // Handle the format "Month Day, Year at Time"
        // e.g., "September 6, 2024 at 8:02 PM"
        try {
            // Remove the " at [time]" part and parse just the date
            const datePart = dateString.split(' at ')[0];
            return new Date(datePart);
        } catch (error) {
            console.warn('Could not parse date:', dateString);
            return new Date(0); // Fallback to epoch for unparseable dates
        }
    }
    
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <button class="modal-close">×</button>
        <div class="modal-content">
            <img class="modal-image" src="" alt="">
            <div class="modal-info">
                <div class="modal-date"></div>
                <div class="modal-caption"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Get modal elements
    const modalImage = modal.querySelector('.modal-image');
    const modalDate = modal.querySelector('.modal-date');
    const modalCaption = modal.querySelector('.modal-caption');
    const closeBtn = modal.querySelector('.modal-close');

    // Intersection Observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const photoCard = img.closest('.photo-card');
                
                // Load the actual image
                loadImage(img, img.dataset.src).then(() => {
                    photoCard.classList.remove('loading');
                    photoCard.classList.add('loaded');
                }).catch(() => {
                    photoCard.classList.remove('loading');
                    photoCard.classList.add('error');
                });
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px' // Start loading 50px before the image comes into view
    });

    // Function to load image with better error handling
    function loadImage(imgElement, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                imgElement.src = src;
                resolve();
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    // Preload critical images (first 6 images after sorting)
    function preloadCriticalImages() {
        const criticalImages = sortedGalleryData.slice(0, 6);
        criticalImages.forEach(imageData => {
            const img = new Image();
            img.src = imageData.src;
        });
    }

    // Create optimized photo cards using sorted data
    sortedGalleryData.forEach((image, index) => {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card loading';

        // Create a low-quality placeholder for blur-up effect
        const placeholderSrc = createPlaceholder(200, 150); // Low-res placeholder

        photoCard.innerHTML = `
            <div class="image-wrapper">
                <img class="photo-placeholder" src="${placeholderSrc}" alt="">
                <img class="photo-main" 
                     data-src="${image.src}" 
                     alt="${image.caption}"
                     ${index < 6 ? 'loading="eager"' : 'loading="lazy"'}>
            </div>
            <div class="photo-caption">
                <div class="photo-date">${image.date}</div>
                <div class="photo-title">${image.caption}</div>
            </div>
        `;

        const mainImg = photoCard.querySelector('.photo-main');
        
        // If it's one of the first 6 images, load immediately
        if (index < 6) {
            loadImage(mainImg, image.src).then(() => {
                photoCard.classList.remove('loading');
                photoCard.classList.add('loaded');
            }).catch(() => {
                photoCard.classList.remove('loading');
                photoCard.classList.add('error');
            });
        } else {
            // Use intersection observer for others
            imageObserver.observe(mainImg);
        }

        // Add click event to open modal
        photoCard.addEventListener('click', function() {
            modalImage.src = image.src;
            modalImage.alt = image.caption;
            modalDate.textContent = image.date;
            modalCaption.textContent = image.caption;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });

        gallery.appendChild(photoCard);
    });

    // Create placeholder function
    function createPlaceholder(width, height) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        
        // Create a subtle gradient placeholder
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#f0f0f0');
        gradient.addColorStop(1, '#e0e0e0');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        return canvas.toDataURL();
    }

    // Preload critical images
    preloadCriticalImages();

    // Close modal functionality
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Smooth scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Performance monitoring (optional - for debugging)
    if (window.performance) {
        window.addEventListener('load', () => {
            const loadTime = window.performance.now();
            console.log(`Gallery loaded in ${loadTime.toFixed(2)}ms`);
            console.log(`Displaying ${sortedGalleryData.length} photos sorted by date`);
        });
    }
});
