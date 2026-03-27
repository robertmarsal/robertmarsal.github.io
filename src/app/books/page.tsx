import Image from "next/image";
import { books, type Book } from "@/data/books";



function RatingDots({ rating }: { rating: number }) {
  if (rating === 0) return null;
  return (
    <div className="flex gap-0.5 mt-1.5" title={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 ${i <= rating ? "bg-[#FF6600]" : "bg-neutral-600"}`}
        />
      ))}
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <a
      href={`https://www.goodreads.com/search?q=${book.isbn}`}
      target="_blank"
      rel="noopener noreferrer"
      title={`${book.title} — ${book.author}`}
      className="group relative aspect-[2/3] block"
    >
      <div className="relative w-full h-full rounded-sm overflow-hidden shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl hover:z-10 cursor-pointer">
        <Image
          src={`/books/${book.isbn}.jpg`}
          alt={`${book.title} by ${book.author}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
        />

        {/* Dark overlay with book info — slides up on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-all duration-300 ease-in-out flex flex-col justify-end p-2.5">
          <div className="translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <p className="text-white text-xs font-medium leading-tight line-clamp-2">
              {book.title}
            </p>
            <p className="text-neutral-400 text-[10px] mt-0.5 line-clamp-1">
              {book.author}
            </p>
            <RatingDots rating={book.rating} />
          </div>
        </div>

        {/* Orange inset ring on hover */}
        <div className="absolute inset-0 ring-0 group-hover:ring-1 group-hover:ring-[#FF6600] ring-inset rounded-sm transition-all duration-300 pointer-events-none" />
      </div>
    </a>
  );
}

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

      {(() => {
        // Group books by year, preserving sort order
        const groups: { year: string; books: typeof books }[] = [];
        for (const book of books) {
          const year = book.dateRead ?? "Unknown";
          const last = groups[groups.length - 1];
          if (last?.year === year) {
            last.books.push(book);
          } else {
            groups.push({ year, books: [book] });
          }
        }
        return groups.map(({ year, books: group }) => (
          <div key={year} className="mb-10">
            {/* Year separator */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium tracking-widest text-[#FF6600] uppercase">
                {year}
              </span>
              <div className="flex-1 h-px bg-[#FF6600] opacity-30" />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {group.map((book) => (
                <BookCard key={book.isbn} book={book} />
              ))}
            </div>
          </div>
        ));
      })()}

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
