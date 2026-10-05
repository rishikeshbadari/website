document.addEventListener('DOMContentLoaded', function() {
    var lists = document.querySelectorAll('[data-project-list]');
    if (!lists.length || typeof projectData === 'undefined') return;

    var modal = document.getElementById('projectModal');
    var closeBtn = document.getElementById('projectModalClose');
    var readmeEl = document.getElementById('modalReadmeContent');
    var linksEl = document.getElementById('modalProjectLinks');
    var demoEl = document.getElementById('modalProjectDemo');
    var pictureLightbox = null;
    var pictureLightboxImg = null;
    var picturePrevBtn = null;
    var pictureNextBtn = null;
    var pictureLightboxCount = null;
    var activePictureIndex = 0;
    var lastFocusedPictureTile = null;
    var pictureResizeTimer = null;

    projectData.forEach(function(project) {
        lists.forEach(function(list) {
            list.appendChild(buildProjectCard(project));
        });
    });

    if (modal && closeBtn) {
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(event) {
            if (event.target === modal) closeModal();
        });
        document.addEventListener('keydown', function(event) {
            if (pictureLightbox && pictureLightbox.classList.contains('show')) {
                if (event.key === 'Escape') closePictureLightbox();
                if (event.key === 'ArrowLeft' && activePictureIndex > 0) openPictureLightbox(activePictureIndex - 1);
                if (event.key === 'ArrowRight' && activePictureIndex < galleryData.length - 1) openPictureLightbox(activePictureIndex + 1);
                return;
            }
            if (event.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
    }

    window.addEventListener('resize', function() {
        clearTimeout(pictureResizeTimer);
        pictureResizeTimer = setTimeout(resizePictureTiles, 120);
    });

    function buildProjectCard(project) {
        var card = document.createElement('button');
        card.className = 'project-card';
        card.type = 'button';
        card.dataset.project = project.id;
        card.innerHTML = '<h3>' + project.title + '</h3><span class="project-link">' + project.action + '</span>';
        card.addEventListener('click', function() {
            if (project.url) {
                window.location.href = project.url;
                return;
            }
            openProject(project);
        });
        return card;
    }

    function openProject(project) {
        if (!modal || !readmeEl || !linksEl || !demoEl) return;
        readmeEl.innerHTML = project.readme || '';
        linksEl.innerHTML = project.links || '';
        demoEl.innerHTML = project.demo || '';
        modal.classList.toggle('is-pictures-project', project.id === 'pictures');
        modal.classList.add('show');
        document.body.classList.add('modal-open');
        renderPicturesProject(project);
        var scrollEl = modal.querySelector('.project-modal-scroll');
        if (scrollEl) scrollEl.scrollTop = 0;
        closeBtn.focus();
    }

    function closeModal() {
        closePictureLightbox();
        modal.classList.remove('show');
        modal.classList.remove('is-pictures-project');
        document.body.classList.remove('modal-open');
    }

    function renderPicturesProject(project) {
        if (project.id !== 'pictures' || typeof galleryData === 'undefined') return;
        var mount = demoEl.querySelector('[data-pictures-all]');
        if (!mount) return;
        var count = readmeEl.querySelector('[data-picture-count]');
        if (count) count.textContent = galleryData.length;

        var photos = galleryData.map(function(photo, index) {
            return '<button class="picture-project-tile" type="button" data-picture-index="' + index + '" aria-label="Open photograph ' + (index + 1) + ' of ' + galleryData.length + '"><img src="' + photo.thumb + '" alt="" loading="' + (index < 18 ? 'eager' : 'lazy') + '" decoding="async"></button>';
        });

        mount.innerHTML = photos.join('');

        mount.querySelectorAll('[data-picture-index]').forEach(function(tile) {
            var img = tile.querySelector('img');
            var index = Number(tile.dataset.pictureIndex);

            function handlePictureLoad() {
                if (index % 24 === 0 && img.naturalWidth > img.naturalHeight) {
                    tile.classList.add('is-featured');
                }
                sizePictureTile(tile, img, mount);
                tile.style.backgroundColor = '';
            }

            img.addEventListener('load', handlePictureLoad);
            if (img.complete && img.naturalWidth > 0) {
                handlePictureLoad();
            }
            tile.addEventListener('click', function() {
                openPictureLightbox(index);
            });
        });

        requestAnimationFrame(resizePictureTiles);
    }

    function sizePictureTile(tile, img, mount) {
        var styles = window.getComputedStyle(mount);
        var rowHeight = parseFloat(styles.getPropertyValue('grid-auto-rows'));
        var gap = parseFloat(styles.getPropertyValue('row-gap'));
        var width = tile.getBoundingClientRect().width;
        if (!width || !rowHeight) return;
        var height = width * (img.naturalHeight / img.naturalWidth);
        var span = Math.ceil((height + gap) / (rowHeight + gap));
        tile.style.gridRowEnd = 'span ' + span;
    }

    function resizePictureTiles() {
        var mount = demoEl.querySelector('[data-pictures-all]');
        if (!mount) return;
        mount.querySelectorAll('.picture-project-tile').forEach(function(tile) {
            var img = tile.querySelector('img');
            if (img && img.complete && img.naturalWidth > 0) {
                sizePictureTile(tile, img, mount);
            }
        });
    }

    function buildPictureLightbox() {
        if (pictureLightbox) return;

        pictureLightbox = document.createElement('div');
        pictureLightbox.className = 'picture-project-lightbox';
        pictureLightbox.setAttribute('role', 'dialog');
        pictureLightbox.setAttribute('aria-modal', 'true');
        pictureLightbox.setAttribute('aria-label', 'Picture viewer');
        pictureLightbox.setAttribute('aria-hidden', 'true');
        pictureLightbox.innerHTML =
            '<button class="picture-lb-close" type="button" aria-label="Close picture viewer">&times;</button>' +
            '<button class="picture-lb-nav picture-lb-prev" type="button" aria-label="Previous picture">&larr;</button>' +
            '<img class="picture-lb-img" src="" alt="">' +
            '<button class="picture-lb-nav picture-lb-next" type="button" aria-label="Next picture">&rarr;</button>' +
            '<p class="picture-lb-count" aria-live="polite"></p>';
        document.body.appendChild(pictureLightbox);

        pictureLightboxImg = pictureLightbox.querySelector('.picture-lb-img');
        picturePrevBtn = pictureLightbox.querySelector('.picture-lb-prev');
        pictureNextBtn = pictureLightbox.querySelector('.picture-lb-next');
        pictureLightboxCount = pictureLightbox.querySelector('.picture-lb-count');

        pictureLightbox.querySelector('.picture-lb-close').addEventListener('click', closePictureLightbox);
        picturePrevBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            if (activePictureIndex > 0) openPictureLightbox(activePictureIndex - 1);
        });
        pictureNextBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            if (activePictureIndex < galleryData.length - 1) openPictureLightbox(activePictureIndex + 1);
        });
        pictureLightbox.addEventListener('click', function(event) {
            if (event.target === pictureLightbox) closePictureLightbox();
        });
    }

    function openPictureLightbox(index) {
        if (typeof galleryData === 'undefined' || !galleryData[index]) return;
        buildPictureLightbox();
        if (!pictureLightbox.classList.contains('show')) {
            lastFocusedPictureTile = document.activeElement;
        }
        activePictureIndex = index;
        pictureLightboxImg.src = galleryData[index].src;
        pictureLightboxImg.alt = 'Photograph ' + (index + 1) + ' of ' + galleryData.length;
        pictureLightboxCount.textContent = (index + 1) + ' / ' + galleryData.length;
        picturePrevBtn.classList.toggle('is-disabled', index === 0);
        pictureNextBtn.classList.toggle('is-disabled', index === galleryData.length - 1);
        pictureLightbox.classList.add('show');
        pictureLightbox.setAttribute('aria-hidden', 'false');
        pictureLightbox.querySelector('.picture-lb-close').focus();
        preloadPicture(index - 1);
        preloadPicture(index + 1);
    }

    function closePictureLightbox() {
        if (!pictureLightbox) return;
        pictureLightbox.classList.remove('show');
        pictureLightbox.setAttribute('aria-hidden', 'true');
        pictureLightboxImg.removeAttribute('src');
        if (lastFocusedPictureTile && typeof lastFocusedPictureTile.focus === 'function') {
            lastFocusedPictureTile.focus();
        }
    }

    function preloadPicture(index) {
        if (!galleryData[index]) return;
        var image = new Image();
        image.src = galleryData[index].src;
    }
});
