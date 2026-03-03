document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('image-gallery');

    // Gallery code — only runs on the pictures page
    if (gallery) {
        const displayedGalleryData = galleryData;

        // Responsive sizes matching the CSS grid breakpoints:
        // <=479px: 1 column, 16px padding each side
        // <=767px: 2 columns, 20px padding, 16px gap
        // <=991px: auto-fill ~240px min, 25px padding, 20px gap
        // <=1200px: auto-fill ~280px min, 30px padding, 25px gap
        // default: auto-fill ~320px min, 40px padding, 30px gap
        const gallerySizes = [
            '(max-width: 479px) calc(100vw - 32px)',
            '(max-width: 767px) calc(50vw - 28px)',
            '(max-width: 1200px) calc(33vw - 40px)',
            '350px'
        ].join(', ');

        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Photo viewer');
        modal.innerHTML = `
            <button class="modal-close" aria-label="Close">\u00d7</button>
            <button class="modal-nav modal-prev" aria-label="Previous photo">\u2039</button>
            <button class="modal-nav modal-next" aria-label="Next photo">\u203a</button>
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

        const modalImage = modal.querySelector('.modal-image');
        const closeBtn = modal.querySelector('.modal-close');
        const prevBtn = modal.querySelector('.modal-prev');
        const nextBtn = modal.querySelector('.modal-next');
        let currentIndex = -1;

        function updateNavButtons() {
            var atStart = currentIndex <= 0;
            var atEnd = currentIndex >= (displayedGalleryData.length - 1);
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
            var item = displayedGalleryData[index];
            if (!item) return;
            var sources = getImageSources(item.src);
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

        function closeModal() {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }

        closeBtn.addEventListener('click', closeModal);

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

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

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

        // Get thumb (400w) and full (1200w) paths for an image
        function getImageSources(optimizedSrc) {
            var parts = (optimizedSrc || '').split('/');
            var file = parts[parts.length - 1] || '';
            var baseName = file.split('.')[0];

            return {
                thumbWebP: 'pictures/thumbs/' + baseName + '.webp',
                thumbJpeg: 'pictures/thumbs/' + baseName + '.jpg',
                fullWebP: 'pictures/optimized/' + baseName + '.webp',
                fullJpeg: 'pictures/optimized/' + baseName + '.jpg'
            };
        }

        // Build a <picture> element. If eager, sets srcset immediately.
        // Otherwise leaves srcset empty for the IntersectionObserver to fill.
        function createResponsivePicture(sources, alt, isEager) {
            var picture = document.createElement('picture');

            var webpSource = document.createElement('source');
            webpSource.type = 'image/webp';
            webpSource.sizes = gallerySizes;

            var jpegSource = document.createElement('source');
            jpegSource.type = 'image/jpeg';
            jpegSource.sizes = gallerySizes;

            var img = document.createElement('img');
            img.className = 'photo-main';
            img.alt = alt;
            img.sizes = gallerySizes;

            if (isEager) {
                webpSource.srcset = sources.thumbWebP + ' 600w,' + sources.fullWebP + ' 1600w';
                jpegSource.srcset = sources.thumbJpeg + ' 600w,' + sources.fullJpeg + ' 1600w';
                img.srcset = sources.thumbJpeg + ' 600w,' + sources.fullJpeg + ' 1600w';
                img.src = sources.thumbJpeg;
            }

            picture.appendChild(webpSource);
            picture.appendChild(jpegSource);
            picture.appendChild(img);

            return { picture: picture, img: img, webpSource: webpSource, jpegSource: jpegSource };
        }

        // Deferred cards to load after the first batch
        var deferredCards = [];

        // Build gallery cards
        displayedGalleryData.forEach(function(image, index) {
            try {
                var photoCard = document.createElement('div');
                photoCard.className = 'photo-card loading';
                photoCard.setAttribute('role', 'button');
                photoCard.setAttribute('tabindex', '0');
                photoCard.setAttribute('aria-label', 'View photo ' + (index + 1));

                var isEager = index < 6;
                var sources = getImageSources(image.src);
                var result = createResponsivePicture(sources, 'Photo ' + (index + 1), isEager);

                photoCard.innerHTML =
                    '<div class="image-wrapper"></div>' +
                    '<div class="photo-caption"></div>';

                var imageWrapper = photoCard.querySelector('.image-wrapper');
                imageWrapper.appendChild(result.picture);

                result.img.onload = function() {
                    photoCard.classList.remove('loading');
                };
                result.img.onerror = function() {
                    photoCard.classList.remove('loading');
                    photoCard.classList.add('error');
                };

                if (!isEager) {
                    deferredCards.push({
                        sources: sources,
                        img: result.img,
                        webpSource: result.webpSource,
                        jpegSource: result.jpegSource
                    });
                }

                photoCard.addEventListener('click', function() {
                    openModal(index);
                });

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

        // Load remaining images after a short delay so the page renders first
        setTimeout(function() {
            deferredCards.forEach(function(data) {
                data.webpSource.srcset = data.sources.thumbWebP + ' 600w,' + data.sources.fullWebP + ' 1600w';
                data.jpegSource.srcset = data.sources.thumbJpeg + ' 600w,' + data.sources.fullJpeg + ' 1600w';
                data.img.srcset = data.sources.thumbJpeg + ' 600w,' + data.sources.fullJpeg + ' 1600w';
                data.img.src = data.sources.thumbJpeg;
            });
        }, 100);
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
