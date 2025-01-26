import Image from "next/image";
import { books } from "@/data/books";

export default async function Page() {
  return (
    <div>
      <div className="mb-10">Tech book reviews</div>
      <ul>
        {books.map((book) => {
          return (
            <li key={book.isbn} className="flex">
              <Image
                src={`/books/${book.isbn}.jpg`}
                alt={`${book.title} - Book Cover`}
                width={120}
                height={150}
                className="rounded-sm grayscale brightness-125 hover:grayscale-0 transition duration-300 ease-in-out"
              />
              <div className="pl-5">
                <div className="text-red-400">{book.title}</div>
                <p className="text-neutral-400">{book.author}</p>
                <div className="pt-5">{book.blurb}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
