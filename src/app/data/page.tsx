export default function DataPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Data</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Collections and datasets I publish from personal projects and habits.
        </p>
      </div>

      <section>
        <h2 className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 mb-4">
          <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="0" y="0" width="8" height="2" fill="#FF6600" />
            <rect x="0" y="3" width="8" height="2" fill="#FF6600" />
            <rect x="0" y="6" width="8" height="2" fill="#FF6600" />
          </svg>
          Collections
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
    </div>
  );
}
