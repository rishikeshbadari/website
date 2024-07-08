document.addEventListener('DOMContentLoaded', function() {
    const movieRecsBtn = document.getElementById('movie-recs-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    if (movieRecsBtn) {
        movieRecsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://letterboxd.com/rbadari/', '_blank');
        });
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            document.body.classList.toggle('dark-mode');
        });
    }
});
 