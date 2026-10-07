import { readFile, writeFile } from 'node:fs/promises';
import { marked } from 'marked';

// Resolve against this script so the build also works from another directory.
async function buildMarkdown(pageFile, sourceFile, label, indent) {
    const pageUrl = new URL('../' + pageFile, import.meta.url);
    const introUrl = new URL('../' + sourceFile, import.meta.url);
    const start = '<!-- ' + label + ': generated from ' + sourceFile + '; run npm run build. -->';
    const end = '<!-- END ' + label + ' -->';
    const [page, markdown] = await Promise.all([
        readFile(pageUrl, 'utf8'),
        readFile(introUrl, 'utf8'),
    ]);
    const startIndex = page.indexOf(start);
    const endIndex = page.indexOf(end);
    if (startIndex < 0 || endIndex < startIndex ||
        page.indexOf(start, startIndex + start.length) !== -1 ||
        page.indexOf(end, endIndex + end.length) !== -1) {
        throw new Error('Expected exactly one ' + label + ' block in ' + pageFile + '.');
    }
    if (!markdown.trim()) throw new Error(sourceFile + ' must not be empty.');

    // This is author-controlled Markdown, compiled once, never fetched by visitors.
    const intro = marked.parse(markdown).trim().split('\n').map(line => indent + line).join('\n');
    const result = page.slice(0, startIndex + start.length) + '\n' +
        intro + '\n' + indent + page.slice(endIndex);
    if (result !== page) await writeFile(pageUrl, result);
    console.log('Built ' + pageFile + ' from ' + sourceFile + '.');
}

await buildMarkdown('index.html', 'content/intro.md', 'INTRODUCTION', '        ');
await buildMarkdown('pictures.html', 'content/pictures.md', 'PICTURES DESCRIPTION', '            ');
