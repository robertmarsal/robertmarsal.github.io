type Book = {
  isbn: number;
  title: string;
  author: string;
  blurb: string;
};

export const books: Book[] = [
  {
    isbn: 9781837632749,
    title: "Building Data Science Applications with FastAPI - Second Edition",
    author: "François Voron",
    blurb:
      "A great introduction to FastAPI, covering a wide range of topics, from how dependency injection works to building real-time APIs with WebSockets. It also includes practical examples to help put the learned skills into practice.",
  },
];
