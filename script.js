document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('image-gallery');

    // Gallery code — only runs on the pictures page
    if (gallery) {
        // Use gallery data in the defined order as provided in gallery-data.js
        const displayedGalleryData = galleryData;

        // Create placeholder once and reuse for all cards
        const placeholderSrc = createPlaceholder(200, 150);

        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Photo viewer');
        modal.innerHTML = `
            <button class="modal-close" aria-label="Close">×</button>
            <button class="modal-nav modal-prev" aria-label="Previous photo">‹</button>
            <button class="modal-nav modal-next" aria-label="Next photo">›</button>
            <div class="modal-content">
                <div class="modal-media">
                    <img class="modal-image" src="" alt="Full size photo">
                </div>
                <div class="modal-info">
                    <div class="modal-date"></div>
                    <div class="modal-caption"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Get modal elements
        const modalImage = modal.querySelector('.modal-image');
        const closeBtn = modal.querySelector('.modal-close');
        const prevBtn = modal.querySelector('.modal-prev');
        const nextBtn = modal.querySelector('.modal-next');
        let currentIndex = -1;

        function updateNavButtons() {
            const atStart = currentIndex <= 0;
            const atEnd = currentIndex >= (displayedGalleryData.length - 1);
            if (prevBtn) {
                prevBtn.classList.toggle('disabled', atStart);
                prevBtn.disabled = atStart;
            }
            if (nextBtn) {
                nextBtn.classList.toggle('disabled', atEnd);
                nextBtn.disabled = atEnd;
            }
        }

        function loadModalImageByIndex(index) {
            const item = displayedGalleryData[index];
            if (!item) return;
            const sources = getOptimizedImageSources(item.src);
            modalImage.onerror = function() {
                modalImage.src = sources.fullJpeg;
            };
            modalImage.src = sources.fullWebP;
            modalImage.alt = 'Photo ' + (index + 1);
            updateNavButtons();
        }

        function openModal(index) {
            currentIndex = index;
            loadModalImageByIndex(currentIndex);
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        }

        // Close modal functionality
        function closeModal() {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }

        closeBtn.addEventListener('click', closeModal);

        // Modal navigation events
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (currentIndex > 0) {
                    currentIndex -= 1;
                    loadModalImageByIndex(currentIndex);
                }
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (currentIndex < displayedGalleryData.length - 1) {
                    currentIndex += 1;
                    loadModalImageByIndex(currentIndex);
                }
            });
        }

        // Close modal when clicking outside the content
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Keyboard navigation for modal
        document.addEventListener('keydown', function(e) {
            if (!modal.classList.contains('show')) return;
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                if (currentIndex > 0) {
                    currentIndex -= 1;
                    loadModalImageByIndex(currentIndex);
                }
            } else if (e.key === 'ArrowRight') {
                if (currentIndex < displayedGalleryData.length - 1) {
                    currentIndex += 1;
                    loadModalImageByIndex(currentIndex);
                }
            }
        });

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
            rootMargin: '100px'
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

        // Preload critical images (first 6) with best-fit versions
        function preloadCriticalImages() {
            const criticalImages = displayedGalleryData.slice(0, 6);
            criticalImages.forEach(imageData => {
                const imageSources = getOptimizedImageSources(imageData.src);
                const bestThumb = getBestThumbSources(imageSources);

                const webpImg = new Image();
                webpImg.src = bestThumb.webp;

                const jpegImg = new Image();
                jpegImg.src = bestThumb.jpeg;

                setTimeout(() => {
                    const fullWebpImg = new Image();
                    fullWebpImg.src = imageSources.fullWebP;
                }, 1000);
            });
        }

        // Function to get optimized image sources with WebP support
        function getOptimizedImageSources(optimizedSrc) {
            const parts = (optimizedSrc || '').split('/');
            const file = parts[parts.length - 1] || '';
            const baseName = file.split('.')[0];

            return {
                thumbWebP: 'pictures/thumbs/' + baseName + '.webp',
                thumbJpeg: 'pictures/thumbs/' + baseName + '.jpg',
                fullWebP: 'pictures/optimized/' + baseName + '.webp',
                fullJpeg: 'pictures/optimized/' + baseName + '.jpg',
                original: optimizedSrc
            };
        }

        // Prefer sharper sources on high-DPI screens
        function isHighDpi() {
            return (window.devicePixelRatio || 1) >= 2;
        }

        function getBestThumbSources(imageSources) {
            if (isHighDpi()) {
                return {
                    webp: imageSources.fullWebP,
                    jpeg: imageSources.fullJpeg
                };
            }
            return {
                webp: imageSources.thumbWebP,
                jpeg: imageSources.thumbJpeg
            };
        }

        // Function to create responsive picture element with WebP support
        function createResponsivePicture(imageSources, alt, isThumb, isEager) {
            const picture = document.createElement('picture');

            const webpSource = document.createElement('source');
            webpSource.type = 'image/webp';
            const bestThumb = getBestThumbSources(imageSources);
            webpSource.srcset = isThumb ? bestThumb.webp : imageSources.fullWebP;

            const jpegSource = document.createElement('source');
            jpegSource.type = 'image/jpeg';
            jpegSource.srcset = isThumb ? bestThumb.jpeg : imageSources.fullJpeg;

            const img = document.createElement('img');
            img.className = isThumb ? 'photo-main' : 'modal-image';
            img.alt = alt;
            img.loading = isEager ? 'eager' : 'lazy';
            img.src = isThumb ? bestThumb.jpeg : imageSources.fullJpeg;

            if (!isEager && isThumb) {
                img.dataset.webpSrc = bestThumb.webp;
                img.dataset.jpegSrc = bestThumb.jpeg;
            }

            picture.appendChild(webpSource);
            picture.appendChild(jpegSource);
            picture.appendChild(img);

            return { picture, img };
        }

        // Create placeholder function (called once, reused for all cards)
        function createPlaceholder(width, height) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;

            var gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#f0f0f0');
            gradient.addColorStop(1, '#e0e0e0');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            return canvas.toDataURL();
        }

        // Create optimized photo cards using defined order
        displayedGalleryData.forEach((image, index) => {
            try {
                var photoCard = document.createElement('div');
                photoCard.className = 'photo-card loading';
                photoCard.setAttribute('role', 'button');
                photoCard.setAttribute('tabindex', '0');
                photoCard.setAttribute('aria-label', 'View photo ' + (index + 1));

                var imageSources = getOptimizedImageSources(image.src);

                var result = createResponsivePicture(
                    imageSources,
                    'Photo ' + (index + 1),
                    true,
                    index < 6
                );
                var picture = result.picture;
                var mainImg = result.img;

                photoCard.innerHTML =
                    '<div class="image-wrapper">' +
                        '<img class="photo-placeholder" src="' + placeholderSrc + '" alt="">' +
                    '</div>' +
                    '<div class="photo-caption"></div>';

                var imageWrapper = photoCard.querySelector('.image-wrapper');
                imageWrapper.appendChild(picture);

                if (index < 6) {
                    var bestThumb = getBestThumbSources(imageSources);
                    loadImage(mainImg, bestThumb.webp).then(function() {
                        photoCard.classList.remove('loading');
                        photoCard.classList.add('loaded');
                    }).catch(function() {
                        loadImage(mainImg, bestThumb.jpeg).then(function() {
                            photoCard.classList.remove('loading');
                            photoCard.classList.add('loaded');
                        }).catch(function() {
                            photoCard.classList.remove('loading');
                            photoCard.classList.add('error');
                        });
                    });
                } else {
                    if ('IntersectionObserver' in window) {
                        imageObserver.observe(mainImg);
                    } else {
                        var bestThumb = getBestThumbSources(imageSources);
                        loadImage(mainImg, bestThumb.webp).then(function() {
                            photoCard.classList.remove('loading');
                            photoCard.classList.add('loaded');
                        }).catch(function() {
                            loadImage(mainImg, bestThumb.jpeg).then(function() {
                                photoCard.classList.remove('loading');
                                photoCard.classList.add('loaded');
                            }).catch(function() {
                                photoCard.classList.remove('loading');
                                photoCard.classList.add('error');
                            });
                        });
                    }
                }

                // Click handler to open modal
                photoCard.addEventListener('click', function() {
                    openModal(index);
                });

                // Keyboard handler for accessibility
                photoCard.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openModal(index);
                    }
                });

                gallery.appendChild(photoCard);
            } catch (err) {
                console.error('Failed to render photo card', { index: index, image: image, err: err });
            }
        });

        // Preload critical images
        preloadCriticalImages();
    }

    // Headshot loading animation (runs on home page)
    var headshotContainer = document.getElementById('headshot-container');
    var headshotImg = document.getElementById('headshot');

    if (headshotContainer && headshotImg) {
        headshotContainer.classList.add('loading');

        var headshot = new Image();
        headshot.onload = function() {
            setTimeout(function() {
                headshotContainer.classList.remove('loading');
            }, 500);
        };
        headshot.onerror = function() {
            headshotContainer.classList.remove('loading');
        };
        headshot.src = headshotImg.src;
    }
});
