import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { install, validateImage, alternatives } from './covers.mjs';

const image = (byte) => { const data = Buffer.alloc(3000, byte); data.set([255,216,255]); return data; };
test('replacement preserves original backup and rejects invalid downloads without changing cover', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'covers-test-'));
  try {
    const book = { isbn: '123' };
    await install(book, image(1), root);
    await install(book, image(2), root);
    await install(book, image(3), root);
    assert.deepEqual(await fs.readFile(path.join(root, '.cover-manager/backups/123.jpg')), image(1));
    await assert.rejects(install(book, Buffer.from('<html>Error</html>'), root));
    assert.deepEqual(await fs.readFile(path.join(root, 'public/books/123.jpg')), image(3));
    await assert.rejects(install({ isbn: '../escape' }, image(1), root));
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
test('rejects oversized data and placeholder images', () => {
  assert.throws(() => validateImage(Buffer.alloc(20_000_001)));
  assert.throws(() => validateImage(Buffer.from('GIF89a')));
});
test('edition alternatives deduplicate covers and retain publisher details', async () => {
  const urls = [];
  const candidates = await alternatives({ title: 'Example (Series, #2)', author: 'Author' }, async url => {
    urls.push(url);
    return url.includes('search.json') ? { docs: [{key: '/works/OL1W', title: 'Example', cover_i: 10}] } : { entries: [{title: 'Example', covers: [10, 20, -1], publishers: ['Publisher'], publish_date: '2020'}] };
  });
  assert.equal(candidates.length, 2);
  assert.match(candidates[1].label, /Publisher · 2020/);
  assert.equal(new URL(urls[0]).searchParams.get('title'), 'Example');
});
