/* Quotes — renders quotesData into the quotes list */
document.addEventListener('DOMContentLoaded', function () {
    var list = document.getElementById('quotes-list');
    if (!list || typeof quotesData === 'undefined' || quotesData.length === 0) return;

    quotesData.forEach(function (q) {
        var item = document.createElement('div');
        item.className = 'quote-item';
        item.innerHTML =
            '<p class="quote-text">\u201c' + q.text + '\u201d</p>' +
            '<span class="quote-author">' + q.author + '</span>';
        list.appendChild(item);
    });
});
