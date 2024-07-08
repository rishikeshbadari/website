document.addEventListener('DOMContentLoaded', function() {
    const resumeBtn = document.getElementById('resume-btn');
    const movieRecsBtn = document.getElementById('movie-recs-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    if (resumeBtn) {
        resumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://your-resume-url-here.com', '_blank');
        });
    }

    if (movieRecsBtn) {
        movieRecsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://letterboxd.com/your-username', '_blank');
        });
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            document.body.classList.toggle('dark-mode');
        });
    }
});
 