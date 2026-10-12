import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createEssay } from './new-essay.mjs';
import { parseOrder, sortEssays } from './essay-order.mjs';
import { essayTitle } from './build-essays.mjs';

test('essay titles tolerate plain text, blank lines, and missing headings', () => {
    assert.equal(essayTitle('Context\n\nSome writing.', 'context.md'), 'Context');
    assert.equal(essayTitle('\n\n# My Title\n\nSome writing.', 'context.md'), 'My Title');
    assert.equal(essayTitle('\uFEFF\r\n# My Title\r\n', 'context.md'), 'My Title');
    assert.equal(essayTitle('<!-- note -->\n\n# Custom Title\n', 'context.md'), 'Custom Title');
    assert.equal(essayTitle('Custom Title\n============\n', 'context.md'), 'Custom Title');
    assert.equal(essayTitle('```md\n# Not a title\n```\n', 'a-new-idea.md'), 'A New Idea');
    assert.equal(essayTitle('', 'a-new-idea.md'), 'A New Idea');
});

test('manual ordering wins; unlisted essays remain visible', () => {
    const essays = [
        { filename: 'alpha.html', title: 'Alpha' },
        { filename: 'context.html', title: 'Context' },
        { filename: 'zebra.html', title: 'Zebra' },
    ];
    const order = parseOrder('# My order\r\nzebra.md\r\n\r\ncontext.md\n');
    assert.deepEqual(sortEssays(essays, order).map(essay => essay.filename),
        ['zebra.html', 'context.html', 'alpha.html']);
    assert.throws(() => parseOrder('context.md\ncontext.md'), /Duplicate/);
    assert.throws(() => parseOrder('../context.md'), /Invalid/);
});

test('creation adds a title and list entry without overwriting existing essays', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'website-essay-test-'));
    const folder = pathToFileURL(directory + '/');
    try {
        await writeFile(new URL('order.txt', folder), '# Keep this note\ncontext.md\n');
        const filename = await createEssay('A New Idea', folder);
        assert.equal(filename, 'a-new-idea.md');
        const original = await readFile(new URL(filename, folder), 'utf8');
        assert.ok(original.startsWith('# A New Idea\n'));
        const order = await readFile(new URL('order.txt', folder), 'utf8');
        assert.deepEqual(parseOrder(order), ['a-new-idea.md', 'context.md']);
        assert.ok(order.includes('# Keep this note'));
        await assert.rejects(createEssay('A New Idea', folder), /already exists/);
        assert.equal(await readFile(new URL(filename, folder), 'utf8'), original);
        await writeFile(new URL('another.html', folder), 'A hand-written page');
        await assert.rejects(createEssay('Another', folder), /already exists/);
        await assert.rejects(createEssay('First\nSecond', folder), /single-line/);
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});
