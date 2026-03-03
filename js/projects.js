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

                // Show modal and manage focus
                projectModal.classList.add('show');
                document.body.style.overflow = 'hidden';
                modalClose.focus();
            }
        });
    });

    // Close modal
    function closeProjectModal() {
        projectModal.classList.remove('show');
        document.body.style.overflow = '';
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
});
