/* Blog — card rendering, modal, markdown */
document.addEventListener('DOMContentLoaded', function() {
    var container = document.getElementById('blog-container');
    var modal = document.getElementById('blogModal');
    var modalClose = document.getElementById('blogModalClose');
    var modalContent = document.getElementById('blogModalContent');
    var postCache = {};

    // Build blog cards from blogData
    blogData.forEach(function(post, index) {
        var card = document.createElement('article');
        card.className = 'blog-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        var hasDescription = post.description && post.description.length > 0;
        if (!hasDescription) card.classList.add('blog-card-no-desc');
        card.innerHTML =
            '<div class="blog-card-text">' +
                '<h3>' + post.title + '</h3>' +
                (hasDescription ? '<p class="blog-card-description">' + post.description + '</p>' : '') +
            '</div>' +
            '<span class="blog-card-date">' + post.date + '</span>';

        card.addEventListener('click', function() {
            openPost(index);
        });
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPost(index);
            }
        });

        container.appendChild(card);
    });

    function openPost(index) {
        var post = blogData[index];
        if (!post) return;

        // Show modal immediately with loading state
        Modal.open(modal, modalClose);

        if (postCache[post.file]) {
            renderPost(post, postCache[post.file]);
            return;
        }

        modalContent.innerHTML = '<p style="color:#999;text-align:center;padding:40px;">Loading...</p>';

        fetch('blog/posts/' + post.file)
            .then(function(res) {
                if (!res.ok) throw new Error('Failed to load post');
                return res.text();
            })
            .then(function(md) {
                postCache[post.file] = md;
                renderPost(post, md);
            })
            .catch(function() {
                modalContent.innerHTML = '<p style="color:#c53030;text-align:center;padding:40px;">Failed to load post.</p>';
            });
    }

    function renderPost(post, markdown) {
        var html = marked.parse(markdown);
        modalContent.innerHTML =
            '<div class="blog-post-header">' +
                '<span class="blog-post-date">' + post.date + '</span>' +
            '</div>' +
            '<div class="blog-post-body">' + html + '</div>';
    }

    function closeModal() {
        Modal.close(modal);
    }

    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
});
