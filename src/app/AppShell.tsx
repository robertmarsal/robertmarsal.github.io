"use client";

import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTravelsPage = pathname === "/travels";

  return (
    <>
      <div
        className={
          isTravelsPage
            ? "font-[family-name:var(--font-geist-mono)]"
            : "container mx-auto px-6 py-12 font-[family-name:var(--font-geist-mono)]"
        }
      >
        {children}
      </div>

      {!isTravelsPage && (
        <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-16">
          <div className="container mx-auto px-6 py-6 font-[family-name:var(--font-geist-mono)]">
            <p className="text-xs text-neutral-400">
              &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      )}
    </>
  );
}
