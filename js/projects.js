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
    var activePictureIndex = 0;

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
        renderPicturesProject(project);
        var scrollEl = modal.querySelector('.project-modal-scroll');
        if (scrollEl) scrollEl.scrollTop = 0;
        modal.classList.add('show');
        document.body.classList.add('modal-open');
        closeBtn.focus();
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
    }

    function renderPicturesProject(project) {
        if (project.id !== 'pictures' || typeof galleryData === 'undefined') return;
        var mount = demoEl.querySelector('[data-pictures-all]');
        if (!mount) return;

        var photos = galleryData.map(function(photo, index) {
            var thumb = photo.src.replace('/optimized/', '/thumbs/');
            return '<button class="picture-project-tile" type="button" data-picture-index="' + index + '" aria-label="Open photo ' + (index + 1) + '"><img src="' + thumb + '" alt="" loading="' + (index < 18 ? 'eager' : 'lazy') + '" decoding="async"></button>';
        });

        mount.innerHTML = photos.join('');

        mount.querySelectorAll('[data-picture-index]').forEach(function(tile) {
            tile.addEventListener('click', function() {
                openPictureLightbox(Number(tile.dataset.pictureIndex));
            });
        });
    }

    function buildPictureLightbox() {
        if (pictureLightbox) return;

        pictureLightbox = document.createElement('div');
        pictureLightbox.className = 'picture-project-lightbox';
        pictureLightbox.innerHTML =
            '<button class="picture-lb-close" type="button" aria-label="Close">&times;</button>' +
            '<button class="picture-lb-nav picture-lb-prev" type="button" aria-label="Previous picture">&lsaquo;</button>' +
            '<img class="picture-lb-img" src="" alt="">' +
            '<button class="picture-lb-nav picture-lb-next" type="button" aria-label="Next picture">&rsaquo;</button>';
        document.body.appendChild(pictureLightbox);

        pictureLightboxImg = pictureLightbox.querySelector('.picture-lb-img');
        picturePrevBtn = pictureLightbox.querySelector('.picture-lb-prev');
        pictureNextBtn = pictureLightbox.querySelector('.picture-lb-next');

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
        activePictureIndex = index;
        pictureLightboxImg.src = galleryData[index].src;
        picturePrevBtn.classList.toggle('is-disabled', index === 0);
        pictureNextBtn.classList.toggle('is-disabled', index === galleryData.length - 1);
        pictureLightbox.classList.add('show');
    }

    function closePictureLightbox() {
        if (!pictureLightbox) return;
        pictureLightbox.classList.remove('show');
        pictureLightboxImg.removeAttribute('src');
    }
});
