/* Project modals — logic only (data lives in data/projects-data.js) */
document.addEventListener('DOMContentLoaded', function() {
    var projectModal = document.getElementById('projectModal');
    var modalClose = document.getElementById('projectModalClose');
    var modalReadmeContent = document.getElementById('modalReadmeContent');
    var modalProjectLinks = document.getElementById('modalProjectLinks');
    var modalProjectDemo = document.getElementById('modalProjectDemo');

    // Handle project clicks (click anywhere on the card)
    var projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(function(card) {
        card.addEventListener('click', function(e) {
            var linkClicked = e.target.closest && e.target.closest('a.project-link');
            if (linkClicked) {
                e.preventDefault();
            }
            var projectId = card.dataset.project;
            var project = projectData[projectId];

            if (project) {
                modalReadmeContent.innerHTML = project.readme;
                modalProjectLinks.innerHTML = project.links;
                modalProjectDemo.innerHTML = project.demo;
                if (modalProjectLinks) {
                    modalProjectLinks.style.display = (project.links && project.links.trim().length > 0) ? 'block' : 'none';
                }

                // Initialize fractal content if it's the fractals project
                if (projectId === 'fractals') {
                    setTimeout(initializeFractalContent, 50);
                }

                // Bind olympic report buttons if it's the olympic project
                if (projectId === 'olympic-wins') {
                    setTimeout(bindOlympicButtons, 50);
                }

                // Bind screenshot lightbox for quizbowl
                if (projectId === 'quizbowl') {
                    setTimeout(bindScreenshotLightbox, 50);
                }

                // Show modal and manage focus
                var scrollEl = projectModal.querySelector('.project-modal-scroll');
                if (scrollEl) scrollEl.scrollTop = 0;
                Modal.open(projectModal, modalClose);
            }
        });
    });

    // Close modal
    function closeProjectModal() {
        Modal.close(projectModal);
    }

    modalClose.addEventListener('click', closeProjectModal);

    projectModal.addEventListener('click', function(e) {
        if (e.target === projectModal) {
            closeProjectModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && projectModal.classList.contains('show')) {
            closeProjectModal();
        }
    });

    // --- Fractal branch switching ---

    function showFractal(branch, clickedBtn) {
        var fractalContent = document.getElementById('fractal-content');
        var fractalDemo = document.getElementById('fractal-demo');

        if (fractalContent && fractalDemo && fractalBranches[branch]) {
            fractalContent.innerHTML = fractalBranches[branch].content;
            fractalDemo.innerHTML = fractalBranches[branch].demo;

            var branchButtons = document.querySelectorAll('.branch-btn[data-fractal]');
            branchButtons.forEach(function(btn) { btn.classList.remove('active'); });
            if (clickedBtn) clickedBtn.classList.add('active');
        }
    }

    function bindFractalButtons() {
        var buttons = document.querySelectorAll('.branch-btn[data-fractal]');
        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                showFractal(btn.dataset.fractal, btn);
            });
        });
    }

    function initializeFractalContent() {
        var fractalContent = document.getElementById('fractal-content');
        var fractalDemo = document.getElementById('fractal-demo');

        if (fractalContent && fractalDemo) {
            fractalContent.innerHTML = fractalBranches['main'].content;
            fractalDemo.innerHTML = fractalBranches['main'].demo;
            bindFractalButtons();
        }
    }

    // --- Olympic report switching ---

    function showOlympicReport(which, clickedBtn) {
        var iframe = document.getElementById('olympic-iframe');
        if (iframe && olympicPages[which]) {
            iframe.src = olympicPages[which];
        }
        var buttons = document.querySelectorAll('.branch-buttons [data-report]');
        buttons.forEach(function(btn) {
            if (btn.getAttribute('data-report') === which) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function bindOlympicButtons() {
        var buttons = document.querySelectorAll('.branch-buttons [data-report]');
        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                showOlympicReport(btn.dataset.report, btn);
            });
        });
    }

    // ── Screenshot lightbox ───────────────────────────────────────────────────

    var imgLightbox     = null;
    var imgLightboxImg  = null;
    var imgLightboxSrcs = [];
    var imgLightboxIdx  = 0;

    function buildImgLightbox() {
        if (imgLightbox) return;
        imgLightbox = document.createElement('div');
        imgLightbox.className = 'img-lightbox';
        imgLightbox.innerHTML =
            '<button class="img-lb-close" aria-label="Close">\u00d7</button>' +
            '<button class="img-lb-nav img-lb-prev" aria-label="Previous">\u2039</button>' +
            '<img class="img-lb-img" src="" alt="Screenshot">' +
            '<button class="img-lb-nav img-lb-next" aria-label="Next">\u203a</button>';
        document.body.appendChild(imgLightbox);

        imgLightboxImg = imgLightbox.querySelector('.img-lb-img');

        imgLightbox.querySelector('.img-lb-close').addEventListener('click', closeImgLightbox);
        imgLightbox.querySelector('.img-lb-prev').addEventListener('click', function (e) {
            e.stopPropagation();
            if (imgLightboxIdx > 0) { imgLightboxIdx--; showImgLightbox(imgLightboxIdx); }
        });
        imgLightbox.querySelector('.img-lb-next').addEventListener('click', function (e) {
            e.stopPropagation();
            if (imgLightboxIdx < imgLightboxSrcs.length - 1) { imgLightboxIdx++; showImgLightbox(imgLightboxIdx); }
        });
        imgLightbox.addEventListener('click', function (e) {
            if (e.target === imgLightbox) closeImgLightbox();
        });
        document.addEventListener('keydown', function (e) {
            if (!imgLightbox || !imgLightbox.classList.contains('show')) return;
            if (e.key === 'Escape')      closeImgLightbox();
            if (e.key === 'ArrowLeft'  && imgLightboxIdx > 0)                          { imgLightboxIdx--; showImgLightbox(imgLightboxIdx); }
            if (e.key === 'ArrowRight' && imgLightboxIdx < imgLightboxSrcs.length - 1) { imgLightboxIdx++; showImgLightbox(imgLightboxIdx); }
        });
    }

    function showImgLightbox(index) {
        imgLightboxImg.src = imgLightboxSrcs[index];
        var prevBtn = imgLightbox.querySelector('.img-lb-prev');
        var nextBtn = imgLightbox.querySelector('.img-lb-next');
        prevBtn.classList.toggle('disabled', index <= 0);
        nextBtn.classList.toggle('disabled', index >= imgLightboxSrcs.length - 1);
    }

    function openImgLightbox(srcs, index) {
        buildImgLightbox();
        imgLightboxSrcs = srcs;
        imgLightboxIdx  = index;
        showImgLightbox(index);
        imgLightbox.classList.add('show');
    }

    function closeImgLightbox() {
        if (imgLightbox) imgLightbox.classList.remove('show');
    }

    function bindScreenshotLightbox() {
        var imgs = document.querySelectorAll('.quizbowl-screenshots img');
        if (!imgs.length) return;
        var srcs = Array.prototype.map.call(imgs, function (img) { return img.src; });
        imgs.forEach(function (img, i) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function (e) {
                e.stopPropagation();
                openImgLightbox(srcs, i);
            });
        });
    }
});
