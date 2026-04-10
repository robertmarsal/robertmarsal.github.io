"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
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

  const filtered = useMemo(
    () => filterBooksByQuery(books, query),
    [books, query]
  );

  const reviewed = useMemo(
    () => filtered.filter((b) => b.blurb),
    [filtered]
  );

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
        <BooksGrid books={filtered} />
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
    </>
  );
}
