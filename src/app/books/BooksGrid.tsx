"use client";

import { useState } from "react";
import Image from "next/image";
import type { Book } from "@/data/books";

export function RatingDots({ rating }: { rating: number }) {
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

function parseSeries(title: string): string | null {
  const match = title.match(/\(([^,)#]+),?\s*#[\d.]+[,\s]*\)/);
  return match ? match[1].trim() : null;
}

export function BooksGrid({ books }: { books: Book[] }) {
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);

  // isbn -> series name
  const seriesMap = new Map<string, string>();
  for (const book of books) {
    const series = parseSeries(book.title);
    if (series) seriesMap.set(book.isbn, series);
  }

  // Group by year, preserving sort order
  const groups: { year: string; books: Book[] }[] = [];
  for (const book of books) {
    const year = book.dateRead ?? "Unknown";
    const last = groups[groups.length - 1];
    if (last?.year === year) {
      last.books.push(book);
    } else {
      groups.push({ year, books: [book] });
    }
  }

  return (
    <>
      {groups.map(({ year, books: group }) => (
        <div key={year} className="mb-10">
          {/* Year separator */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium tracking-widest text-[#FF6600] uppercase">
              {year}
            </span>
            <div className="flex-1 h-px bg-[#FF6600] opacity-30" />
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {group.map((book) => {
              const series = seriesMap.get(book.isbn);
              const isSeriesSibling =
                hoveredSeries !== null && series === hoveredSeries;
              const isDimmed =
                hoveredSeries !== null && series !== hoveredSeries;

              return (
                <a
                  key={book.isbn}
                  href={`https://www.goodreads.com/search?q=${book.isbn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${book.title} — ${book.author}`}
                  className={`group relative aspect-[2/3] block transition-opacity duration-200 ${
                    isDimmed ? "opacity-25" : "opacity-100"
                  }`}
                  onMouseEnter={() =>
                    series ? setHoveredSeries(series) : setHoveredSeries(null)
                  }
                  onMouseLeave={() => setHoveredSeries(null)}
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

                    {/* Orange inset ring — always on for series siblings, hover-only otherwise */}
                    <div
                      className={`absolute inset-0 ring-inset rounded-sm transition-all duration-200 pointer-events-none ${
                        isSeriesSibling
                          ? "ring-2 ring-[#FF6600]"
                          : "ring-0 group-hover:ring-1 group-hover:ring-[#FF6600]"
                      }`}
                    />

                    {/* Series label badge — shown on siblings when a series is hovered */}
                    {isSeriesSibling && series && (
                      <div className="absolute top-1.5 left-1.5 right-1.5 pointer-events-none">
                        <span className="inline-block bg-[#FF6600] text-white text-[8px] font-semibold uppercase tracking-wider px-1 py-0.5 rounded-sm leading-none truncate max-w-full">
                          {series}
                        </span>
                      </div>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
