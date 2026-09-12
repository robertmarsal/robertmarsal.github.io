#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STATE = path.join(ROOT, '.cover-manager');
const coverPath = (book) => path.join(ROOT, 'public/books', `${book.isbn}.jpg`);
const series = (book) => book.title.match(/\(([^,)#]+),?\s*#[\d.]+[,\s]*\)/)?.[1]?.trim();
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const help = `Cover manager (Node 22+)\n\n  pnpm covers list [title, author, or series]\n  pnpm covers pick <ISBN or search text>\n  pnpm covers set <ISBN> <image URL or local file>\n  pnpm covers restore <ISBN>\n\nPick creates a browser preview; enter its numbered choice in the terminal.\nThe original cover is backed up once. Restore returns to that original.\nSearch uses Open Library editions; no API key required.`;

export async function request(url, json = true) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'RobertMarsal-CoverManager/1.0 (https://robertmarsal.github.io)' } });
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${new URL(url).hostname}`);
  if (Number(response.headers.get('content-length')) > 20_000_000) throw new Error('Response exceeds 20 MB');
  const chunks = []; let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > 20_000_000) throw new Error('Response exceeds 20 MB');
    chunks.push(chunk);
  }
  const data = Buffer.concat(chunks);
  return json ? JSON.parse(data.toString()) : data;
}

export function validateImage(data) {
  const jpeg = data[0] === 255 && data[1] === 216 && data[2] === 255;
  const png = data.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const webp = data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP';
  if (data.length < 2000 || data.length > 20_000_000 || !(jpeg || png || webp)) throw new Error('Expected a JPEG, PNG, or WebP cover between 2 KB and 20 MB.');
}

export async function install(book, data, root = ROOT) {
  validateImage(data);
  if (!/^[\w-]+$/.test(book.isbn)) throw new Error('Invalid book identifier');
  const dest = path.join(root, 'public/books', `${book.isbn}.jpg`);
  const backup = path.join(root, '.cover-manager/backups', `${book.isbn}.jpg`);
  await fs.mkdir(path.dirname(backup), { recursive: true });
  await fs.mkdir(path.dirname(dest), { recursive: true });
  try { await fs.copyFile(dest, backup, 1); } catch (error) { if (!['EEXIST', 'ENOENT'].includes(error.code)) throw error; }
  const temp = `${dest}.${process.pid}.tmp`;
  try { await fs.writeFile(temp, data); await fs.rename(temp, dest); }
  finally { await fs.rm(temp, { force: true }); }
}

export async function alternatives(book, get = request) {
  const title = book.title.replace(/\s*\([^)]*#[\d.]+[^)]*\)/, '').trim();
  const query = new URLSearchParams({ title, author: book.author, fields: 'key,title,author_name,cover_i', limit: '3' });
  const data = await get(`https://openlibrary.org/search.json?${query}`);
  const results = new Map();
  const add = (id, label) => { if (Number.isInteger(id) && id > 0 && !results.has(id)) results.set(id, { url: `https://covers.openlibrary.org/b/id/${id}-L.jpg?default=false`, label }); };
  for (const work of data.docs ?? []) {
    add(work.cover_i, `${work.title} — ${(work.author_name ?? []).join(', ')}`);
    const key = work.key.startsWith('/works/') ? work.key : `/works/${work.key}`;
    if (!/^\/works\/OL\d+W$/.test(key)) continue;
    for (let offset = 0; offset < 300; offset += 100) {
      // Keep requests sequential and below the public API's default rate limit.
      await new Promise(resolve => setTimeout(resolve, 1100));
      let editions;
      try { editions = await get(`https://openlibrary.org${key}/editions.json?limit=100&offset=${offset}`); }
      catch (error) { console.warn(`Edition lookup: ${error.message}`); break; }
      for (const edition of editions.entries ?? []) {
        const label = [edition.title, ...(edition.publishers ?? []), edition.publish_date, ...(edition.languages ?? []).map(l => l.key.split('/').at(-1))].filter(Boolean).join(' · ');
        for (const id of edition.covers ?? []) add(id, label);
      }
      if ((editions.entries ?? []).length < 100) break;
    }
  }
  return [...results.values()];
}

async function preview(book, books, candidates) {
  const card = (url, label, number = '') => `<article><img loading="lazy" src="${escape(url)}" alt="${escape(label)}"><h3>${escape(number)}</h3><p>${escape(label)}</p></article>`;
  const siblings = series(book) ? books.filter(b => series(b) === series(book)) : [book];
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Choose a cover</title><style>body{font:15px system-ui;background:#f6f4ef;color:#25221e;max-width:1200px;margin:40px auto;padding:0 24px}h1{letter-spacing:-.04em}h2{margin-top:40px}section{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:20px}article{padding:14px;background:white;border:1px solid #e3dfd7;border-radius:10px}img{width:100%;height:230px;object-fit:contain}h3{color:#b74700;margin:12px 0 4px}p{font-size:12px;line-height:1.5}header p{font-size:15px}@media(prefers-color-scheme:dark){body{background:#191817;color:#eee}article{background:#242220;border-color:#393530}h3{color:#ff9a57}}</style><header><h1>${escape(book.title)}</h1><p>Compare the artwork, then enter a cover number in your terminal. Search results may include other editions or related titles.</p></header><h2>Current ${series(book) ? 'series' : 'cover'}</h2><section>${siblings.map(b => card(pathToFileURL(coverPath(b)).href, b.title, b.isbn === book.isbn ? 'Current selection' : '')).join('')}</section><h2>Alternatives</h2><section>${candidates.map((c, i) => card(c.url, c.label, `#${i + 1}`)).join('')}</section></html>`;
  await fs.mkdir(STATE, { recursive: true });
  const target = path.join(STATE, `preview-${book.isbn}.html`);
  await fs.writeFile(target, html);
  console.log(`\nOpen this preview in your browser:\n${pathToFileURL(target).href}\n`);
}

async function main() {
  const [command, ...args] = process.argv.slice(2).filter(arg => arg !== '--');
  if (!command || ['help', '--help', '-h'].includes(command)) return console.log(help);
  if (!['list', 'pick', 'set', 'restore'].includes(command)) throw new Error(help);
  const books = JSON.parse(await fs.readFile(path.join(ROOT, 'src/data/books.generated.json'), 'utf8'));
  const query = (command === 'set' ? args[0] : args.join(' '))?.toLowerCase() ?? '';
  if (command !== 'list' && !query) throw new Error('Provide an ISBN or search text.');
  const exact = books.filter(b => b.isbn.toLowerCase() === query);
  const matches = exact.length ? exact : books.filter(b => `${b.title} ${b.author}`.toLowerCase().includes(query));
  if (command === 'list') { for (const b of matches) console.log(`${b.isbn}  ${b.title} — ${b.author}`); return; }
  if (!matches.length) throw new Error('No matching book. Try pnpm covers list <search>.');
  if (command !== 'pick' && matches.length !== 1) throw new Error('Multiple matches. Use the exact ISBN from pnpm covers list.');
  let rl;
  const ask = async (prompt) => {
    if (!stdin.isTTY) throw new Error('Interactive selection requires a terminal. Use list, set, or restore for scripting.');
    rl ??= createInterface({ input: stdin, output: stdout });
    return (await rl.question(prompt)).trim();
  };
  try {
    let book = matches[0];
    if (matches.length > 1) {
      matches.forEach((b, i) => console.log(`${i + 1}. ${b.title} — ${b.author}`));
      const answer = await ask('Book number (Enter to cancel): ');
      if (!answer) return;
      if (!/^\d+$/.test(answer) || !matches[Number(answer) - 1]) throw new Error('Invalid book number.');
      book = matches[Number(answer) - 1];
    }
    if (command === 'restore') {
      const original = await fs.readFile(path.join(STATE, 'backups', `${book.isbn}.jpg`)).catch(error => { if (error.code === 'ENOENT') throw new Error('No original cover backup exists for this book.'); throw error; });
      await install(book, original);
      console.log(`Restored original cover: ${book.title}`); return;
    }
    let source;
    if (command === 'set') { source = args[1]; if (!source || args.length !== 2) throw new Error('Usage: pnpm covers set <ISBN> <image URL or local file>'); }
    else {
      console.log(`Finding editions for ${book.title}…`);
      const candidates = await alternatives(book);
      if (!candidates.length) throw new Error('No alternatives found. Use covers set with an image URL or local file.');
      await preview(book, books, candidates);
      candidates.forEach((c, i) => console.log(`${i + 1}. ${c.label}`));
      while (true) {
        const answer = await ask('Cover number to save (Enter to keep current): ');
        if (!answer) return;
        if (/^\d+$/.test(answer) && candidates[Number(answer) - 1]) { source = candidates[Number(answer) - 1].url; break; }
        console.log(`Enter a number from 1 to ${candidates.length}.`);
      }
    }
    const data = /^https?:\/\//i.test(source) ? await request(source, false) : await fs.readFile(path.resolve(source));
    await install(book, data);
    console.log(`Saved public/books/${book.isbn}.jpg\nUndo: pnpm covers restore ${book.isbn}`);
  } finally { rl?.close(); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(`Cover manager: ${error.message}`); process.exitCode = 1; });
