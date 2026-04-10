import { books } from "@/data/books";
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

      <BooksInteractive books={books} />
    </div>
  );
}
