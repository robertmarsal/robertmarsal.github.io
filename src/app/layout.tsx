import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "./AppShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rob Marsal | Home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="h-16 border-b border-neutral-200 dark:border-neutral-800">
          <div className="container mx-auto flex h-full items-center px-6">
            <div className="flex w-full items-center justify-between font-[family-name:var(--font-geist-mono)]">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight hover:text-[#FF6600] transition-colors">
                <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0">
                  <polygon points="5,1 9,5 5,9 1,5" fill="#FF6600" />
                </svg>
                Rob Marsal
              </Link>
              <ul className="flex space-x-8 text-sm">
                <li>
                  <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-[#FF6600] transition-colors">
                    <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0">
                      <polygon points="4,0.5 7.5,3.2 6.2,7.5 1.8,7.5 0.5,3.2" fill="currentColor" />
                    </svg>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="inline-flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-[#FF6600] transition-colors">
                    <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0">
                      <rect x="0" y="0" width="8" height="2" fill="currentColor" />
                      <rect x="0" y="3" width="8" height="2" fill="currentColor" />
                      <rect x="0" y="6" width="8" height="2" fill="currentColor" />
                    </svg>
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/data" className="inline-flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-[#FF6600] transition-colors">
                    <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0">
                      <rect x="0" y="0" width="3" height="3" fill="currentColor" />
                      <rect x="5" y="0" width="3" height="3" fill="currentColor" />
                      <rect x="0" y="5" width="3" height="3" fill="currentColor" />
                      <rect x="5" y="5" width="3" height="3" fill="currentColor" />
                    </svg>
                    Data
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
