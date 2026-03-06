import Image from "next/image";
import { books } from "@/data/books";

export default async function Page() {
  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Book Reviews</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Technical books I&apos;ve read and found worthwhile.</p>
      </div>
      <ul className="space-y-10">
        {books.map((book) => {
          return (
            <li key={book.isbn} className="flex gap-6 pb-10 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
              <div className="shrink-0">
                <Image
                  src={`/books/${book.isbn}.jpg`}
                  alt={`${book.title} - Book Cover`}
                  width={100}
                  height={130}
                  className="rounded-sm grayscale brightness-125 hover:grayscale-0 transition duration-300 ease-in-out shadow-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-red-400 font-medium leading-snug">{book.title}</div>
                <p className="text-xs text-neutral-400 uppercase tracking-wide">{book.author}</p>
                <div className="pt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{book.blurb}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
