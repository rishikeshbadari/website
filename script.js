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
                
                // Try WebP first, fallback to JPEG
                const webpSrc = img.dataset.webpSrc;
                const jpegSrc = img.dataset.jpegSrc;
                
                loadImage(img, webpSrc).then(() => {
                    photoCard.classList.remove('loading');
                    photoCard.classList.add('loaded');
                }).catch(() => {
                    // Fallback to JPEG if WebP fails
                    loadImage(img, jpegSrc).then(() => {
                        photoCard.classList.remove('loading');
                        photoCard.classList.add('loaded');
                    }).catch(() => {
                        photoCard.classList.remove('loading');
                        photoCard.classList.add('error');
                    });
                });
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '100px' // Start loading 100px before the image comes into view
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

    // Preload critical images (first 6 images after sorting) with optimized versions
    function preloadCriticalImages() {
        const criticalImages = sortedGalleryData.slice(0, 6);
        criticalImages.forEach(imageData => {
            const imageSources = getOptimizedImageSources(imageData.src);
            
            // Preload WebP thumbnail first (priority)
            const webpImg = new Image();
            webpImg.src = imageSources.thumbWebP;
            
            // Preload JPEG fallback
            const jpegImg = new Image();
            jpegImg.src = imageSources.thumbJpeg;
            
            // Preload full-size WebP for modal (lower priority)
            setTimeout(() => {
                const fullWebpImg = new Image();
                fullWebpImg.src = imageSources.fullWebP;
            }, 1000);
        });
    }

    // Function to get optimized image sources with WebP support
    function getOptimizedImageSources(optimizedSrc) {
        const baseName = optimizedSrc.split('/')[2].split('.')[0]; // Extract filename from optimized path
        
        return {
            // Thumbnail versions for gallery (400x400)
            thumbWebP: `pictures/thumbs/${baseName}.webp`,
            thumbJpeg: `pictures/thumbs/${baseName}.jpg`,
            // Full-size versions for modal (1200x1200 max)
            fullWebP: `pictures/optimized/${baseName}.webp`,
            fullJpeg: `pictures/optimized/${baseName}.jpg`,
            // Use optimized version as fallback
            original: optimizedSrc
        };
    }

    // Function to create responsive picture element with WebP support
    function createResponsivePicture(imageSources, alt, isThumb = true, isEager = false) {
        const picture = document.createElement('picture');
        
        // WebP source (modern browsers)
        const webpSource = document.createElement('source');
        webpSource.type = 'image/webp';
        webpSource.srcset = isThumb ? imageSources.thumbWebP : imageSources.fullWebP;
        
        // JPEG fallback source
        const jpegSource = document.createElement('source');
        jpegSource.type = 'image/jpeg';
        jpegSource.srcset = isThumb ? imageSources.thumbJpeg : imageSources.fullJpeg;
        
        // Fallback img element
        const img = document.createElement('img');
        img.className = isThumb ? 'photo-main' : 'modal-image';
        img.alt = alt;
        img.loading = isEager ? 'eager' : 'lazy';
        img.src = isThumb ? imageSources.thumbJpeg : imageSources.fullJpeg; // Fallback
        
        // For lazy loading, store sources in data attributes
        if (!isEager && isThumb) {
            img.dataset.webpSrc = imageSources.thumbWebP;
            img.dataset.jpegSrc = imageSources.thumbJpeg;
        }
        
        picture.appendChild(webpSource);
        picture.appendChild(jpegSource);
        picture.appendChild(img);
        
        return { picture, img };
    }

    // Create optimized photo cards using sorted data
    sortedGalleryData.forEach((image, index) => {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card loading';

        const imageSources = getOptimizedImageSources(image.src);
        
        // Create a low-quality placeholder for blur-up effect
        const placeholderSrc = createPlaceholder(200, 150);

        // Create responsive picture element for thumbnail
        const { picture, img: mainImg } = createResponsivePicture(
            imageSources, 
            image.caption, 
            true, // isThumb
            index < 6 // isEager for first 6 images
        );

        photoCard.innerHTML = `
            <div class="image-wrapper">
                <img class="photo-placeholder" src="${placeholderSrc}" alt="">
            </div>
            <div class="photo-caption">
                <div class="photo-date">${image.date}</div>
                <div class="photo-title">${image.caption}</div>
            </div>
        `;

        // Insert the picture element
        const imageWrapper = photoCard.querySelector('.image-wrapper');
        imageWrapper.appendChild(picture);
        
        // If it's one of the first 6 images, load immediately
        if (index < 6) {
            loadImage(mainImg, imageSources.thumbWebP).then(() => {
                photoCard.classList.remove('loading');
                photoCard.classList.add('loaded');
            }).catch(() => {
                // Fallback to JPEG if WebP fails
                loadImage(mainImg, imageSources.thumbJpeg).then(() => {
                    photoCard.classList.remove('loading');
                    photoCard.classList.add('loaded');
                }).catch(() => {
                    photoCard.classList.remove('loading');
                    photoCard.classList.add('error');
                });
            });
        } else {
            // Use intersection observer for others
            imageObserver.observe(mainImg);
        }

        // Add click event to open modal with full-size optimized image
        photoCard.addEventListener('click', function() {
            // Load full-size optimized image in modal
            modalImage.src = imageSources.fullWebP;
            modalImage.alt = image.caption;
            modalDate.textContent = image.date;
            modalCaption.textContent = image.caption;
            
            // Fallback to JPEG if WebP is not supported
            modalImage.onerror = function() {
                modalImage.src = imageSources.fullJpeg;
            };
            
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

    // Setup modal event listeners
    function setupModalListeners() {
        // Close modal when clicking outside or on close button
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target === closeBtn) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // Headshot loading animation
    const headshotContainer = document.getElementById('headshot-container');
    const headshotImg = document.getElementById('headshot');
    
    if (headshotContainer && headshotImg) {
        // Add loading state
        headshotContainer.classList.add('loading');
        
        // Load headshot image
        const headshot = new Image();
        headshot.onload = function() {
            // Remove loading state after image loads
            setTimeout(() => {
                headshotContainer.classList.remove('loading');
            }, 500); // Small delay to ensure the animation is visible
        };
        headshot.onerror = function() {
            headshotContainer.classList.remove('loading');
        };
        headshot.src = headshotImg.src;
    }
});
