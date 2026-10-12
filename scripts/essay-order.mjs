export function parseOrder(text) {
    const files = text.split(/\r?\n/).map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
    for (const file of files) {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(file)) {
            throw new Error('Invalid filename in essays/order.txt: ' + file);
        }
    }
    if (new Set(files).size !== files.length) throw new Error('Duplicate filename in essays/order.txt.');
    return files;
}

export function sortEssays(essays, order) {
    const rank = new Map(order.map((file, index) => [file.replace(/\.md$/, '.html'), index]));
    return essays.sort((a, b) => {
        const first = rank.get(a.filename) ?? Infinity;
        const second = rank.get(b.filename) ?? Infinity;
        if (first !== second) return first - second;
        return a.title.localeCompare(b.title);
    });
}
