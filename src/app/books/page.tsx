import Image from "next/image";
import { books } from "@/data/books";
import { BooksGrid, RatingDots } from "./BooksGrid";

export default function Page() {
  const ratedBooks = books.filter((b) => b.rating > 0);
  const avgRating =
    ratedBooks.length > 0
      ? (ratedBooks.reduce((s, b) => s + b.rating, 0) / ratedBooks.length).toFixed(1)
      : "—";

  const currentYear = new Date().getFullYear().toString();
  const booksThisYear = books.filter((b) =>
    b.dateRead?.startsWith(currentYear)
  ).length;

  const totalPages = books.reduce((s, b) => s + (b.pages ?? 0), 0);

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Books</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          I love reading — books and audiobooks alike. Here&apos;s what I&apos;ve been getting through.
        </p>
      </div>

      {/* Stats — TE product-spec panel */}
      <div className="grid grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 mb-12">
        {[
          { value: books.length, label: "Read" },
          { value: avgRating, label: "Avg rating" },
          { value: booksThisYear || "—", label: `In ${currentYear}` },
          {
            value: totalPages > 0 ? totalPages.toLocaleString() : "—",
            label: "Pages",
          },
        ].map(({ value, label }) => (
          <div key={label} className="bg-[var(--background)] px-4 py-3">
            <div className="text-xl font-semibold tabular-nums">{value}</div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-400 mt-0.5">
              {label}
            </div>
          </div>
        ))}
      </div>

      <BooksGrid books={books} />

      {/* Reviews — only shown for books with a blurb in blurbs.json */}
      {books.some((b) => b.blurb) && (
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
            {books
              .filter((b) => b.blurb)
              .map((book) => (
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
    </div>
  );
}
