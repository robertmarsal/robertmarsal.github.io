export default function Home() {
  return (
    <main className="max-w-2xl">
      <section className="mb-16">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Hi, I&apos;m Rob
        </h1>
        <p className="text-red-400 text-sm mb-6">Software Engineer &mdash; London</p>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          I build software and write about what I&apos;m learning. Currently
          interested in distributed systems, developer tooling, and the craft of
          writing clear, maintainable code.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-widest text-neutral-400 mb-4">Links</h2>
        <ul className="space-y-3">
          <li>
            <a
              href="https://github.com/robertmarsal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                aria-hidden="true"
                height="1.1em"
                width="1.1em"
                className="text-neutral-400 group-hover:text-red-400 transition-colors shrink-0"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
                ></path>
              </svg>
              <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-red-400 transition-colors">
                github.com/robertmarsal
              </span>
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-neutral-400 mb-4">Writing</h2>
        <ul className="space-y-2">
          <li>
            <a href="/books" className="flex items-center justify-between group py-2 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-sm group-hover:text-red-400 transition-colors">Book reviews</span>
              <span className="text-xs text-neutral-400">&rarr;</span>
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
