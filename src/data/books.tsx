import booksData from "./books.generated.json";
import blurbs from "./blurbs.json";

export type Book = {
  isbn: string;
  title: string;
  author: string;
  rating: number; // 0 = unrated, 1–5
  dateRead?: string | null;
  pages?: number | null;
  blurb?: string;
};

export const books: Book[] = booksData.map((book) => ({
  ...book,
  blurb: blurbs[book.isbn as keyof typeof blurbs] ?? undefined,
}));
