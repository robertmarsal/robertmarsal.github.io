export default function ProjectsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Projects</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Personal projects I&apos;ve built and shipped.
        </p>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 bg-[var(--background)]">
        <div className="grid grid-cols-1 gap-px bg-neutral-200 dark:bg-neutral-800 md:grid-cols-[160px_1fr]">
          <div className="bg-[var(--background)] px-4 py-3 flex flex-col items-center text-center">
            <div className="mt-3">
              <svg
                width="72"
                height="72"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect width="32" height="32" rx="6" fill="#b5651d" />
                <rect x="3" y="3" width="11" height="7" rx="1.5" fill="#f5e6d8" />
                <rect x="17" y="3" width="12" height="7" rx="1.5" fill="#e8c89a" />
                <rect x="3" y="13" width="7" height="7" rx="1.5" fill="#e8c89a" />
                <rect x="13" y="13" width="16" height="7" rx="1.5" fill="#f5e6d8" />
                <rect x="3" y="23" width="16" height="6" rx="1.5" fill="#f5e6d8" />
                <rect x="22" y="23" width="7" height="6" rx="1.5" fill="#e8c89a" />
              </svg>
            </div>
            <div className="mt-3 text-lg font-semibold">LayRight</div>
          </div>

          <div className="bg-[var(--background)] px-4 py-4">
            <div className="flex h-full items-stretch justify-between gap-4">
              <div className="flex h-full flex-1 flex-col justify-between">
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  I built LayRight for myself while installing the flooring in
                  my office. It helped me plan board placement and cuts before
                  starting, and I decided to share in case anyone else finds it
                  useful.
                </p>
                <p className="pt-3 text-xs uppercase tracking-widest text-neutral-400">
                  Flooring layout planner
                </p>
              </div>
              <a
                href="https://layright.app"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 self-center text-sm text-[#FF6600] hover:underline"
              >
                Visit app
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
