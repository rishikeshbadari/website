import { readFile, writeFile, access } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseOrder } from './essay-order.mjs';
import { buildEssays } from './build-essays.mjs';

export async function createEssay(title, folder = new URL('../essays/', import.meta.url)) {
    title = title.trim();
    if (!title || /[\r\n]/.test(title)) throw new Error('Please give the essay a single-line title.');
    const slug = title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!slug) throw new Error('Please include a letter or number in the title.');
    const filename = slug + '.md';
    for (const extension of ['.md', '.html']) {
        try {
            await access(new URL(slug + extension, folder));
        } catch (error) {
            if (error.code === 'ENOENT') continue;
            throw error;
        }
        throw new Error(slug + extension + ' already exists. Choose a different title.');
    }
    const orderUrl = new URL('order.txt', folder);
    let orderText;
    try {
        orderText = await readFile(orderUrl, 'utf8');
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        orderText = '# Move filenames up or down to reorder essays.\n';
    }
    parseOrder(orderText); // Validate before creating any files.
    await writeFile(new URL(filename, folder), '# ' + title + '\n\n<!-- Write your essay here. -->\n', { flag: 'wx' });
    // Keep existing comments and order; add the new essay at the top.
    const withoutOldEntry = orderText.split(/\r?\n/).filter(line => line.trim() !== filename).join('\n');
    await writeFile(orderUrl, filename + '\n' + withoutOldEntry);
    return filename;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
    try {
        let title = process.argv.slice(2).join(' ');
        if (!title && process.stdin.isTTY) {
            const prompt = createInterface({ input: process.stdin, output: process.stdout });
            try { title = await prompt.question('Essay title: '); }
            finally { prompt.close(); }
        }
        if (!title) throw new Error('Usage: npm run essay -- "Your essay title"');
        const filename = await createEssay(title);
        await buildEssays();
        console.log('Ready to write: essays/' + filename);
        console.log('Added at the top. Reorder anytime in essays/order.txt.');
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
