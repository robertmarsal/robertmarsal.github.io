My website.

### Manage book covers

Run `pnpm covers pick "Horus Heresy"` (or any title, author, or ISBN). Choose a
book in the terminal, open the printed preview link in your browser, then enter
the alternative cover number to save it. The gallery includes your current
series covers for comparison. Press Enter at either prompt to cancel.

```sh
pnpm covers list "Horus Heresy"
pnpm covers pick "Horus Rising"
pnpm covers set <ISBN> /path/to/cover.jpg
pnpm covers set <ISBN> "https://example.com/cover.jpg"
pnpm covers restore <ISBN>
```

Requires Node 22+ and internet access for discovery. Alternatives come from
[Open Library search](https://openlibrary.org/dev/docs/api/search) and edition
records, with images from the [Covers API](https://openlibrary.org/dev/docs/api/covers).
No API key is needed. Discovery checks up to three matching works and 300 editions
per work; related titles and different languages may appear, so inspect the
artwork and publisher information. If no suitable cover is available, use `set`
with your own image. The preview does not open a browser automatically.

Selections replace `public/books/<ISBN>.jpg`; Goodreads sync preserves existing
covers. JPEG, PNG, and WebP files retain their original bytes under the site's
existing `.jpg` filenames. The tool checks signatures and file size, but does not
fully decode images. Backups and previews live in ignored `.cover-manager/`.
`restore` returns to the cover before the first replacement, not the previous
selection. Books that had no cover initially have no original to restore.
Commit the changed cover files to publish them with your site.

Run cover-manager checks with `node --test scripts/covers.test.mjs`.
