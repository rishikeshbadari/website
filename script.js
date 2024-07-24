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
 
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('image-gallery');

    galleryData.forEach((image, index) => {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';

        imageContainer.innerHTML = `
            <img src="${image.src}" alt="Picture ${index + 1}">
            <div class="image-overlay">
                <div class="image-date">${image.date}</div>
                <div class="image-caption">${image.caption}</div>
            </div>
        `;

        gallery.appendChild(imageContainer);
    });
});
