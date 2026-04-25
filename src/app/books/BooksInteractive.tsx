"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { parseSeriesFromTitle, type Book } from "@/data/books";
import { BooksGrid, RatingDots } from "./BooksGrid";

function bookSearchHaystack(book: Book): string {
  const series = parseSeriesFromTitle(book.title);
  const parts = [book.title, book.author, series].filter(Boolean) as string[];
  return parts.join(" \n ").toLowerCase();
}

function filterBooksByQuery(books: Book[], raw: string): Book[] {
  const tokens = raw
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.length === 0) return books;

  return books.filter((book) => {
    const hay = bookSearchHaystack(book);
    return tokens.every((t) => hay.includes(t));
  });
}

export function BooksInteractive({ books }: { books: Book[] }) {
  const [query, setQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filtered = useMemo(
    () => filterBooksByQuery(books, query),
    [books, query]
  );

  const reviewed = useMemo(
    () => filtered.filter((b) => b.blurb),
    [filtered]
  );

  useEffect(() => {
    if (!selectedBook) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedBook(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedBook]);

  const selectedSeries = selectedBook
    ? parseSeriesFromTitle(selectedBook.title)
    : null;

  return (
    <>
      <div className="mb-8" role="search">
        <label htmlFor="books-search" className="sr-only">
          Search books by title, author, or series
        </label>
        <input
          id="books-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or series…"
          autoComplete="off"
          spellCheck={false}
          className="w-full px-3 py-2.5 text-sm bg-[var(--background)] border border-neutral-200 dark:border-neutral-800 rounded-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#FF6600] focus:border-[#FF6600]"
        />
        {query.trim() && (
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            {filtered.length === books.length
              ? `${books.length} books`
              : `${filtered.length} of ${books.length} books`}
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 py-8 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-sm">
          No books match &ldquo;{query.trim()}&rdquo;.
        </p>
      ) : (
        <BooksGrid books={filtered} onSelectBook={setSelectedBook} />
      )}

      {reviewed.length > 0 && (
        <div className="mt-16">
          <h2 className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 mb-6">
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="0" y="0" width="3" height="3" fill="#FF6600" />
              <rect x="5" y="0" width="3" height="3" fill="#FF6600" />
              <rect x="0" y="5" width="3" height="3" fill="#FF6600" />
              <rect x="5" y="5" width="3" height="3" fill="#FF6600" />
            </svg>
            Reviews
          </h2>
          <ul className="space-y-10">
            {reviewed.map((book) => (
              <li
                key={book.isbn}
                className="flex gap-6 pb-10 border-b border-neutral-100 dark:border-neutral-800 last:border-0"
              >
                <a
                  href={`https://www.goodreads.com/search?q=${book.isbn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-[80px]"
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-900 shadow-sm">
                    <Image
                      src={`/books/${book.isbn}.jpg`}
                      alt={`${book.title} by ${book.author}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                </a>
                <div className="flex flex-col gap-1">
                  <a
                    href={`https://www.goodreads.com/search?q=${book.isbn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF6600] font-medium leading-snug hover:underline"
                  >
                    {book.title}
                  </a>
                  <p className="text-xs text-neutral-400 uppercase tracking-wide">
                    {book.author}
                  </p>
                  <RatingDots rating={book.rating} />
                  <p className="pt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {book.blurb}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedBook && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="book-details-title"
        >
          <button
            type="button"
            aria-label="Close book details"
            className="absolute inset-0 bg-black/55"
            onClick={() => setSelectedBook(null)}
          />

          <div
            className="absolute inset-y-0 right-0 flex w-full justify-end"
            onClick={() => setSelectedBook(null)}
          >
            <div className="h-full w-full max-w-xl overflow-y-auto border-l border-neutral-200 dark:border-neutral-800 bg-[var(--background)] shadow-2xl">
              <div onClick={(event) => event.stopPropagation()}>
              <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                    Book details
                  </p>
                  <h2
                    id="book-details-title"
                    className="mt-2 text-xl font-semibold leading-tight"
                  >
                    {selectedBook.title}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    {selectedBook.author}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="shrink-0 rounded-sm border border-neutral-200 px-2.5 py-1.5 text-xs uppercase tracking-widest text-neutral-500 transition-colors hover:border-[#FF6600] hover:text-[#FF6600] dark:border-neutral-800 dark:text-neutral-400"
                >
                  Close
                </button>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="w-full max-w-[220px] shrink-0">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-sm bg-neutral-100 shadow-sm dark:bg-neutral-900">
                      <Image
                        src={`/books/${selectedBook.isbn}.jpg`}
                        alt={`${selectedBook.title} by ${selectedBook.author}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 220px"
                        priority
                      />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800">
                      {[
                        {
                          label: "Rating",
                          value:
                            selectedBook.rating > 0
                              ? `${selectedBook.rating}/5`
                              : "Unrated",
                        },
                        {
                          label: "Read",
                          value: selectedBook.dateRead ?? "Unknown",
                        },
                        {
                          label: "Pages",
                          value: selectedBook.pages?.toLocaleString() ?? "—",
                        },
                        {
                          label: "Series",
                          value: selectedSeries ?? "Standalone",
                        },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="bg-[var(--background)] px-4 py-3"
                        >
                          <div className="text-sm font-medium">{value}</div>
                          <div className="mt-1 text-[10px] uppercase tracking-widest text-neutral-400">
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <RatingDots rating={selectedBook.rating} />
                    </div>

                    {selectedBook.blurb && (
                      <div className="mt-6">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                          Notes
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                          {selectedBook.blurb}
                        </p>
                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={`https://www.goodreads.com/search?q=${selectedBook.isbn}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-sm bg-[#FF6600] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                      >
                        View on Goodreads
                      </a>
                      <button
                        type="button"
                        onClick={() => setSelectedBook(null)}
                        className="inline-flex items-center justify-center rounded-sm border border-neutral-200 px-4 py-2 text-sm text-neutral-600 transition-colors hover:border-[#FF6600] hover:text-[#FF6600] dark:border-neutral-800 dark:text-neutral-400"
                      >
                        Back to shelf
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
