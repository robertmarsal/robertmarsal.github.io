import { books, parseSeriesFromTitle } from "@/data/books";
import { BooksInteractive } from "./BooksInteractive";

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
  const fiveStarBooks = books.filter((b) => b.rating === 5).length;

  const authorCounts = new Map<string, number>();
  const seriesCounts = new Map<string, number>();
  const yearCounts = new Map<string, number>();

  for (const book of books) {
    authorCounts.set(book.author, (authorCounts.get(book.author) ?? 0) + 1);

    const series = parseSeriesFromTitle(book.title);
    if (series) {
      seriesCounts.set(series, (seriesCounts.get(series) ?? 0) + 1);
    }

    if (book.dateRead) {
      yearCounts.set(book.dateRead, (yearCounts.get(book.dateRead) ?? 0) + 1);
    }
  }

  const mostReadAuthor =
    [...authorCounts.entries()].sort((a, b) => b[1] - a[1])[0] ?? null;
  const topSeries =
    [...seriesCounts.entries()].sort((a, b) => b[1] - a[1])[0] ?? null;
  const longestBook =
    books.reduce(
      (longest, book) =>
        (book.pages ?? 0) > (longest.pages ?? 0) ? book : longest,
      books[0]
    ) ?? null;

  const yearInsights = [...yearCounts.entries()]
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .slice(0, 8);
  const maxYearCount = Math.max(...yearInsights.map(([, count]) => count), 1);

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Books</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          I love reading — books and audiobooks alike. Here&apos;s what I&apos;ve been getting through.
        </p>
      </div>

      <details className="mb-8 group border border-neutral-200 bg-[var(--background)] dark:border-neutral-800">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
              Reading insights
            </div>
            <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Stats, pace, and patterns from the shelf.
            </div>
          </div>
          <div className="shrink-0 text-xs uppercase tracking-widest text-[#FF6600]">
            <span className="group-open:hidden">Expand</span>
            <span className="hidden group-open:inline">Collapse</span>
          </div>
        </summary>

        <div className="border-t border-neutral-200 p-4 dark:border-neutral-800 sm:p-5">
          <div className="grid grid-cols-2 gap-px border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 sm:grid-cols-4">
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
                <div className="mt-0.5 text-[10px] uppercase tracking-widest text-neutral-400">
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            <section className="border border-neutral-200 bg-[var(--background)] p-5 dark:border-neutral-800">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                    Reading pace
                  </h2>
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    Books finished by year.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold tabular-nums">
                    {yearInsights[0]?.[1] ?? "—"}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-400">
                    best year
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {yearInsights.map(([year, count]) => (
                  <div key={year} className="grid grid-cols-[42px_1fr_32px] items-center gap-3">
                    <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      {year}
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-900">
                      <div
                        className="h-full rounded-full bg-[#FF6600]"
                        style={{ width: `${(count / maxYearCount) * 100}%` }}
                      />
                    </div>
                    <div className="text-right text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                      {count}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-px border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800">
              {[
                {
                  label: "Most read author",
                  value: mostReadAuthor?.[0] ?? "—",
                  detail: mostReadAuthor ? `${mostReadAuthor[1]} books` : "No data",
                },
                {
                  label: "Top series",
                  value: topSeries?.[0] ?? "—",
                  detail: topSeries ? `${topSeries[1]} books` : "No series yet",
                },
                {
                  label: "Longest book",
                  value: longestBook?.title ?? "—",
                  detail: longestBook?.pages
                    ? `${longestBook.pages.toLocaleString()} pages`
                    : "No page count",
                },
                {
                  label: "Five-star reads",
                  value: fiveStarBooks.toString(),
                  detail: fiveStarBooks > 0 ? "Personal canon" : "No perfect scores",
                },
              ].map(({ label, value, detail }) => (
                <div key={label} className="bg-[var(--background)] p-4">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                    {label}
                  </div>
                  <div className="mt-2 text-base font-medium leading-snug">
                    {value}
                  </div>
                  <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {detail}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </details>

      <BooksInteractive books={books} />
    </div>
  );
}
