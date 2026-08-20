#!/usr/bin/env node
/**
 * Syncs a Goodreads library CSV export to src/data/books.generated.json
 * and downloads missing cover images to public/books/.
 *
 * Usage:
 *   node scripts/sync-goodreads.mjs /path/to/goodreads_library_export.csv
 *
 * How to export from Goodreads:
 *   My Books → Import and Export → Export Library
 *
 * Cover images are fetched from Hardcover (when HARDCOVER_API_KEY or
 * HARDCOVER_API_TOKEN is set in the root .env file), Goodreads (when the CSV has a
 * Book Id), Google Books, and Open Library. Books with an ISBN are looked up by ISBN.
 * Books without an ISBN are searched by title + author. Books missing an ISBN use
 * a stable "gr-{id}" identifier.
 *
 * Blurbs/reviews are NOT managed by this script — edit src/data/blurbs.json
 * manually and they will be merged in at build time.
 */

import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BOOKS_JSON = path.join(ROOT, "src/data/books.generated.json");
const COVERS_DIR = path.join(ROOT, "public/books");
const ENV_PATH = path.join(ROOT, ".env");

// Keep this script dependency-free while allowing `npm run sync-goodreads` to
// read the root .env file. Environment variables supplied by the shell win.
try {
  process.loadEnvFile(ENV_PATH);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const HARDCOVER_API_KEY = (
  process.env.HARDCOVER_API_KEY || process.env.HARDCOVER_API_TOKEN || ""
)
  .trim()
  .replace(/^Bearer\s+/i, "");
const HARDCOVER_API_URL = "https://api.hardcover.app/v1/graphql";

// ---------------------------------------------------------------------------
// CSV parsing
// ---------------------------------------------------------------------------

function parseCSVLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

function parseCSV(content) {
  const lines = content.replace(/\r\n/g, "\n").split("\n").filter((l) => l.trim());
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    return Object.fromEntries(headers.map((h, i) => [h.trim(), (values[i] ?? "").trim()]));
  });
}

// Goodreads wraps ISBNs in Excel-style ="..." notation
function cleanISBN(raw) {
  return raw.replace(/[="]/g, "").trim();
}

// ---------------------------------------------------------------------------
// Cover image downloading
// ---------------------------------------------------------------------------

async function download(url, dest) {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "robertmarsal.github.io Goodreads cover sync" },
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) return false;

    const image = Buffer.from(await response.arrayBuffer());
    // Open Library returns a 1×1 GIF placeholder when no cover exists.
    if (image.length < 2000) return false;

    // Write only validated data. This avoids failed requests leaving zero-byte
    // files that make subsequent runs believe a cover is already present.
    fs.writeFileSync(dest, image);
    return true;
  } catch {
    return false;
  }
}

function hasUsableCover(dest) {
  try {
    return fs.statSync(dest).size >= 2000;
  } catch {
    return false;
  }
}

function imageUrlFromCachedImage(image) {
  if (typeof image === "string") return image;
  if (image && typeof image.url === "string") return image.url;
  return null;
}

async function coverUrlFromHardcover(isbn) {
  if (!HARDCOVER_API_KEY) return null;

  const query = `
    query CoverByIsbn($isbn: String!) {
      editions(
        where: {
          _or: [{ isbn_13: { _eq: $isbn } }, { isbn_10: { _eq: $isbn } }]
        }
        limit: 5
      ) {
        image { url }
        cached_image
        book { cached_image }
      }
    }
  `;

  const response = await fetch(HARDCOVER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HARDCOVER_API_KEY}`,
      "Content-Type": "application/json",
      "User-Agent": "robertmarsal.github.io Goodreads cover sync/1.0",
    },
    body: JSON.stringify({ query, variables: { isbn } }),
    signal: AbortSignal.timeout(20_000),
  });
  const contentType = response.headers.get("content-type") || "unknown content type";
  const body = await response.text();
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    const requestId = response.headers.get("x-request-id");
    const requestReference = requestId ? ` (request ${requestId})` : "";
    throw new Error(
      `Hardcover API returned ${response.status} ${contentType}, not JSON${requestReference}`
    );
  }

  if (!response.ok || data.errors) {
    const message = data.errors?.map((error) => error.message).join("; ") || response.statusText;
    throw new Error(`Hardcover API ${response.status}: ${message}`);
  }

  for (const edition of data.data?.editions ?? []) {
    const url =
      edition.image?.url ||
      imageUrlFromCachedImage(edition.cached_image) ||
      imageUrlFromCachedImage(edition.book?.cached_image);
    if (url) return url;
  }
  return null;
}

async function downloadCoverByISBN(isbn, bookId) {
  const dest = path.join(COVERS_DIR, `${isbn}.jpg`);
  if (hasUsableCover(dest)) {
    console.log(`  Cover already exists: ${isbn}`);
    return true;
  }

  // 1. Hardcover by ISBN — authenticated and avoids relying on a scraped page.
  if (HARDCOVER_API_KEY) {
    try {
      console.log(`  Hardcover by ISBN: ${isbn}`);
      const url = await coverUrlFromHardcover(isbn);
      if (url && (await download(url, dest))) return true;
    } catch (error) {
      console.warn(`  Hardcover lookup failed: ${error.message}`);
    }
  }

  // 2. Goodreads (exact edition from your export; often higher-res than Open Library "L")
  if (bookId) {
    try {
      console.log(`  Goodreads page scrape: book ID ${bookId}`);
      const url = await coverUrlFromGoodreads(bookId);
      if (url && (await download(url, dest))) return true;
    } catch { /* ignore */ }
  }

  // 3. Google Books by ISBN (API may expose extraLarge / large)
  try {
    console.log(`  Google Books by ISBN: ${isbn}`);
    const data = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=3`
    ).then((r) => r.json());
    const thumbnail = bestGoogleThumbnail(data);
    if (thumbnail && (await download(thumbnail, dest))) return true;
  } catch { /* ignore */ }

  // 4. Open Library by ISBN (free, no key; "L" is not always as sharp as Goodreads)
  console.log(`  Open Library by ISBN: ${isbn}`);
  if (await download(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`, dest)) return true;

  console.log(`  No cover found for ISBN ${isbn}`);
  return false;
}

// ---------------------------------------------------------------------------
// Goodreads page scrape
// ---------------------------------------------------------------------------

function fetchHtml(url, redirectCount = 0) {
  if (redirectCount > 5) return Promise.reject(new Error("Too many redirects"));
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
        (res) => {
          if (res.statusCode === 301 || res.statusCode === 302) {
            return fetchHtml(res.headers.location, redirectCount + 1)
              .then(resolve)
              .catch(reject);
          }
          if (res.statusCode !== 200) {
            return reject(new Error(`HTTP ${res.statusCode}`));
          }
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => resolve(body));
        }
      )
      .on("error", reject);
  });
}

/** Strip Goodreads/Amazon CDN dimension codes (e.g. ._SX98_SY475_) for a full-size asset. */
function upgradeGoodreadsCoverUrl(url) {
  if (!url) return url;
  const isGoodreadsCdn =
    url.includes("gr-assets.com") ||
    url.includes("media-amazon.com/images/S/compressed.photo.goodreads.com");
  if (!isGoodreadsCdn) return url;
  // e.g. .../157993._SX98_.jpg or .../157993._SX98_SY160_.jpg → .../157993.jpg
  return url.replace(/\._(?:[A-Z]{1,3}\d+(?:_[A-Z]{1,3}\d+)*)_(?=\.[^./]+(?:\?|$))/i, "");
}

async function coverUrlFromGoodreads(bookId) {
  const html = await fetchHtml(`https://www.goodreads.com/book/show/${bookId}`);
  // og:image can appear in either attribute order
  const match =
    html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  const url = match?.[1];
  if (!url || url.includes("nophoto") || url.includes("nocover")) return null;
  return upgradeGoodreadsCoverUrl(url);
}

// ---------------------------------------------------------------------------
// Pick the best available image URL from a Google Books API response
function bestGoogleThumbnail(data) {
  for (const item of data?.items ?? []) {
    const links = item.volumeInfo?.imageLinks;
    const url =
      links?.extraLarge ?? links?.large ?? links?.medium ?? links?.thumbnail;
    if (url)
      return url
        .replace("http://", "https://")
        .replace(/zoom=\d+/i, "zoom=5");
  }
  return null;
}

async function downloadCoverByTitle(title, author, id, bookId) {
  const dest = path.join(COVERS_DIR, `${id}.jpg`);
  if (hasUsableCover(dest)) {
    console.log(`  Cover already exists: ${id}`);
    return true;
  }

  // 1. Goodreads page scrape — exact match by Goodreads book ID
  if (bookId) {
    try {
      console.log(`  Goodreads page scrape: book ID ${bookId}`);
      const url = await coverUrlFromGoodreads(bookId);
      if (url && (await download(url, dest))) return true;
    } catch { /* ignore */ }
  }

  // 2. Google Books: intitle + inauthor
  //    Note: field operators must NOT be percent-encoded, only the values are.
  try {
    console.log(`  Google Books (title + author): "${title}"`);
    const url =
      `https://www.googleapis.com/books/v1/volumes` +
      `?q=intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}` +
      `&maxResults=5`;
    const data = await fetch(url).then((r) => r.json());
    const thumbnail = bestGoogleThumbnail(data);
    if (thumbnail && (await download(thumbnail, dest))) return true;
  } catch { /* ignore */ }

  // 3. Google Books: title only (broader — catches subtitle/edition mismatches)
  try {
    console.log(`  Google Books (title only): "${title}"`);
    const url =
      `https://www.googleapis.com/books/v1/volumes` +
      `?q=intitle:${encodeURIComponent(title)}` +
      `&maxResults=5`;
    const data = await fetch(url).then((r) => r.json());
    const thumbnail = bestGoogleThumbnail(data);
    if (thumbnail && (await download(thumbnail, dest))) return true;
  } catch { /* ignore */ }

  // 4. Open Library search — check first several docs for any cover ID
  try {
    console.log(`  Open Library: "${title}" by ${author}`);
    const q = encodeURIComponent(`${title} ${author}`);
    const data = await fetch(
      `https://openlibrary.org/search.json?q=${q}&fields=cover_i&limit=5`
    ).then((r) => r.json());
    for (const doc of data?.docs ?? []) {
      if (doc.cover_i) {
        if (await download(`https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`, dest))
          return true;
      }
    }
  } catch { /* ignore */ }

  // 5. Open Library: title-only search as a last resort
  try {
    console.log(`  Open Library (title only): "${title}"`);
    const data = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&fields=cover_i&limit=5`
    ).then((r) => r.json());
    for (const doc of data?.docs ?? []) {
      if (doc.cover_i) {
        if (await download(`https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`, dest))
          return true;
      }
    }
  } catch { /* ignore */ }

  console.log(`  No cover found for "${title}"`);
  return false;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const csvPath = process.argv[2];

  if (!csvPath) {
    console.error("Usage: node scripts/sync-goodreads.mjs <path-to-goodreads_library_export.csv>");
    process.exit(1);
  }

  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`);
    process.exit(1);
  }

  fs.mkdirSync(COVERS_DIR, { recursive: true });

  const content = fs.readFileSync(csvPath, "utf8");
  const rows = parseCSV(content);

  const readBooks = rows
    .filter((r) => r["Exclusive Shelf"] === "read")
    .sort((a, b) =>
      // Most recently read first
      (b["Date Read"] || "0").localeCompare(a["Date Read"] || "0")
    );

  console.log(`Found ${readBooks.length} read books in export\n`);

  const books = [];

  for (const row of readBooks) {
    const isbn13 = cleanISBN(row["ISBN13"]);
    const isbn10 = cleanISBN(row["ISBN"]);
    const isbn = isbn13 || isbn10;

    // For books without an ISBN, use a stable gr-{goodreads-id} identifier
    const id = isbn || `gr-${row["Book Id"]}`;

    const title = row["Title"];
    const author = row["Author"];
    const rating = parseInt(row["My Rating"] || "0", 10);
    const pages = parseInt(row["Number of Pages"] || "0", 10) || null;
    // Goodreads date format: YYYY/MM/DD
    const dateRead = row["Date Read"] ? row["Date Read"].slice(0, 4) : null;

    console.log(`Processing: ${title}`);

    const bookId = row["Book Id"];

    if (isbn) {
      await downloadCoverByISBN(isbn, bookId);
    } else {
      console.log(`  No ISBN — trying Goodreads + title/author search`);
      await downloadCoverByTitle(title, author, id, bookId);
    }

    books.push({
      isbn: id,
      title,
      author,
      rating,
      dateRead,
      pages,
    });
  }

  fs.writeFileSync(BOOKS_JSON, JSON.stringify(books, null, 2) + "\n");

  console.log(`\nWrote ${books.length} books to ${path.relative(ROOT, BOOKS_JSON)}`);
  console.log("Done. Run your dev server to see the changes.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
