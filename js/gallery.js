/* Photo gallery — lightbox modal & lazy loading */
document.addEventListener('DOMContentLoaded', function() {
    var gallery = document.getElementById('image-gallery');
    if (!gallery) return;

    var displayedGalleryData = galleryData;

    // Responsive sizes matching the CSS grid breakpoints
    var gallerySizes = [
        '(max-width: 479px) calc(100vw - 32px)',
        '(max-width: 767px) calc(50vw - 28px)',
        '(max-width: 1200px) calc(33vw - 40px)',
        '350px'
    ].join(', ');

    // Create modal element
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Photo viewer');
    modal.innerHTML =
        '<button class="modal-close" aria-label="Close">\u00d7</button>' +
        '<button class="modal-nav modal-prev" aria-label="Previous photo">\u2039</button>' +
        '<button class="modal-nav modal-next" aria-label="Next photo">\u203a</button>' +
        '<div class="modal-content">' +
            '<div class="modal-media">' +
                '<img class="modal-image" src="" alt="Full size photo">' +
            '</div>' +
            '<div class="modal-info">' +
                '<div class="modal-date"></div>' +
                '<div class="modal-caption"></div>' +
            '</div>' +
        '</div>';
    document.body.appendChild(modal);

    var modalImage = modal.querySelector('.modal-image');
    var closeBtn = modal.querySelector('.modal-close');
    var prevBtn = modal.querySelector('.modal-prev');
    var nextBtn = modal.querySelector('.modal-next');
    var currentIndex = -1;

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
        Modal.open(modal, closeBtn);
    }

    function closeModal() {
        Modal.close(modal);
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

    // Get thumb (600w) and full (1600w) paths for an image
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

    function loadPictureSources(data) {
        data.webpSource.srcset = data.sources.thumbWebP + ' 600w,' + data.sources.fullWebP + ' 1600w';
        data.jpegSource.srcset = data.sources.thumbJpeg + ' 600w,' + data.sources.fullJpeg + ' 1600w';
        data.img.srcset = data.sources.thumbJpeg + ' 600w,' + data.sources.fullJpeg + ' 1600w';
        data.img.src = data.sources.thumbJpeg;
    }

    // Build a <picture> element with empty srcset (populated on load trigger)
    function createResponsivePicture(alt) {
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

        picture.appendChild(webpSource);
        picture.appendChild(jpegSource);
        picture.appendChild(img);

        return { picture: picture, img: img, webpSource: webpSource, jpegSource: jpegSource };
    }

    // Build gallery cards
    displayedGalleryData.forEach(function(image, index) {
        try {
            var photoCard = document.createElement('div');
            photoCard.setAttribute('role', 'button');
            photoCard.setAttribute('tabindex', '0');
            photoCard.setAttribute('aria-label', 'View photo ' + (index + 1));
            photoCard.className = 'photo-card';

            var sources = getImageSources(image.src);
            var result = createResponsivePicture('Photo ' + (index + 1));

            photoCard.innerHTML =
                '<div class="image-wrapper"></div>' +
                '<div class="photo-caption"></div>';

            var imageWrapper = photoCard.querySelector('.image-wrapper');
            imageWrapper.style.backgroundColor = image.color || '#f5f5f5';
            imageWrapper.appendChild(result.picture);

            // Fade in on load; handle cached images with img.complete
            result.img.onload = function() {
                result.img.classList.add('loaded');
            };
            result.img.onerror = function() {
                photoCard.classList.add('error');
            };

            var pictureData = {
                sources: sources,
                img: result.img,
                webpSource: result.webpSource,
                jpegSource: result.jpegSource
            };

            if (index === 0) result.img.fetchPriority = 'high';
            loadPictureSources(pictureData);
            if (result.img.complete) result.img.classList.add('loaded');

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
});
