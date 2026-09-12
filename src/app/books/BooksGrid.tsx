"use client";

import Image from "next/image";
import { parseSeriesFromTitle, type Book } from "@/data/books";
import styles from "./books.module.css";

export function RatingDots({ rating }: { rating: number }) {
  if (!rating) return null;
  return (
    <span className="mt-1.5 flex gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`h-1 w-1 rounded-full ${i <= rating ? "bg-[#FF6600]" : "bg-neutral-300 dark:bg-neutral-700"}`} />
      ))}
    </span>
  );
}

function volume(book: Book) {
  return Number(book.title.match(/#([\d.]+)/)?.[1] ?? Infinity);
}

export function BooksGrid({ books, grouping, onSelectBook }: {
  books: Book[];
  grouping: "year" | "series";
  onSelectBook: (book: Book) => void;
}) {
  const groups = new Map<string, Book[]>();
  for (const book of books) {
    const key = grouping === "series"
      ? parseSeriesFromTitle(book.title) ?? "Standalone & other reads"
      : book.dateRead ?? "Undated";
    groups.set(key, [...(groups.get(key) ?? []), book]);
  }
  const ordered = [...groups.entries()]
    .filter(([label, group]) => grouping === "year" || label === "Standalone & other reads" || group.length > 1)
    .sort(([a, aBooks], [b, bBooks]) => grouping === "year"
      ? a === "Undated" ? 1 : b === "Undated" ? -1 : b.localeCompare(a, undefined, { numeric: true })
      : a === "Standalone & other reads" ? 1 : b === "Standalone & other reads" ? -1 : bBooks.length - aBooks.length || a.localeCompare(b));

  return (
    <div className={styles.collection}>
      {ordered.map(([label, group], index) => (
        <section key={label} aria-label={label} className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionNumber}>{String(index + 1).padStart(2, "0")}</span>
            <h2>{label}</h2>
            <span className={styles.rule} />
            <span className={styles.count}>{group.length} {group.length === 1 ? "book" : "books"}</span>
          </div>
          <div className={styles.shelf}>
            {(grouping === "series" ? [...group].sort((a, b) => volume(a) - volume(b)) : group).map((book) => {
              const series = parseSeriesFromTitle(book.title);
              const title = series ? book.title.replace(/\s*\([^)]*#[\d.]+[^)]*\)/, "").trim() : book.title;
              return (
                <button type="button" key={book.isbn} className={styles.book}
                  aria-label={`Open details for ${book.title} by ${book.author}`}
                  onClick={() => onSelectBook(book)}>
                  <span className={styles.coverSpace}>
                    <span className={styles.cover}>
                      <Image src={`/books/${book.isbn}.jpg`} alt="" fill className={styles.coverImage}
                        sizes="(max-width: 480px) 40vw, (max-width: 768px) 27vw, 160px" />
                    </span>
                  </span>
                  <span className={styles.caption}>
                    <span className={styles.titleRow}>
                      {series && grouping === "series" && (
                        <span className={styles.bookNumber} aria-label={`Book ${volume(book)}`}>#{volume(book)}</span>
                      )}
                      <span className={styles.title}>{title}</span>
                    </span>
                    <span className={styles.author}>{book.author}</span>
                    <RatingDots rating={book.rating} />
                    {series && grouping !== "series" && <span className={styles.series}>{series}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
