export default function Home() {
  return (
    <main className="max-w-2xl">
      <section className="mb-16">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Hi, I&apos;m Rob
        </h1>
        <p className="text-sm mb-6 flex items-center gap-2">
          <span className="text-[#FF6600]">Software Engineer</span>
          <span className="text-neutral-300 dark:text-neutral-600">/</span>
          <span className="inline-flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6600] animate-pulse inline-block"></span>
            London
          </span>
        </p>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          I build software and write about what I&apos;m learning. Currently
          interested in distributed systems, developer tooling, reverse
          engineering, and the craft of writing clear, maintainable code.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 mb-4">
          <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="8" height="8" fill="#FF6600" />
          </svg>
          Links
        </h2>
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
                className="text-neutral-400 group-hover:text-[#FF6600] transition-colors shrink-0"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
                ></path>
              </svg>
              <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-[#FF6600] transition-colors">
                github.com/robertmarsal
              </span>
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/robertmarsal/"
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
                className="text-neutral-400 group-hover:text-[#FF6600] transition-colors shrink-0"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.345V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.369-1.85 3.601 0 4.266 2.37 4.266 5.455v6.286zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM7.119 20.452H3.555V9h3.564v11.452z"></path>
              </svg>
              <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-[#FF6600] transition-colors">
                linkedin.com/in/robertmarsal
              </span>
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 mb-4">
          <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="0" y="0" width="8" height="2" fill="#FF6600" />
            <rect x="0" y="3" width="8" height="2" fill="#FF6600" />
            <rect x="0" y="6" width="8" height="2" fill="#FF6600" />
          </svg>
          Projects
        </h2>
        <a
          href="https://layright.app"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-4 border border-neutral-200 bg-white/70 px-4 py-4 transition-colors hover:border-[#FF6600] dark:border-neutral-800 dark:bg-neutral-950/30"
        >
          <div className="flex items-center gap-4">
            <svg
              width="40"
              height="40"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="shrink-0"
            >
              <rect width="32" height="32" rx="6" fill="#b5651d" />
              <rect x="3" y="3" width="11" height="7" rx="1.5" fill="#f5e6d8" />
              <rect x="17" y="3" width="12" height="7" rx="1.5" fill="#e8c89a" />
              <rect x="3" y="13" width="7" height="7" rx="1.5" fill="#e8c89a" />
              <rect x="13" y="13" width="16" height="7" rx="1.5" fill="#f5e6d8" />
              <rect x="3" y="23" width="16" height="6" rx="1.5" fill="#f5e6d8" />
              <rect x="22" y="23" width="7" height="6" rx="1.5" fill="#e8c89a" />
            </svg>
            <div>
              <div className="text-sm font-medium transition-colors group-hover:text-[#FF6600]">
                LayRight
              </div>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Wood flooring layout planner
              </p>
            </div>
          </div>
          <span className="text-xs text-neutral-400 transition-colors group-hover:text-[#FF6600]">
            &rarr;
          </span>
        </a>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 mb-4">
          <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="0" y="0" width="3" height="3" fill="#FF6600" />
            <rect x="5" y="0" width="3" height="3" fill="#FF6600" />
            <rect x="0" y="5" width="3" height="3" fill="#FF6600" />
            <rect x="5" y="5" width="3" height="3" fill="#FF6600" />
          </svg>
          Data
        </h2>
        <ul className="space-y-2">
          <li>
            <a href="/books" className="flex items-center justify-between group py-2 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-sm group-hover:text-[#FF6600] transition-colors">Books</span>
              <span className="text-xs text-neutral-400">&rarr;</span>
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
