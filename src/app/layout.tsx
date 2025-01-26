import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Robert Marsal | Home",
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
        <nav>
          <div className="container mx-auto px-4 py-2">
            <div className="flex justify-left font-[family-name:var(--font-geist-mono)]">
              <ul className="flex space-x-8 py-4">
                <li>
                  <Link href="/" className="hover:text-red-400">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/books" className="hover:text-red-400">
                    Books
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8 font-[family-name:var(--font-geist-mono)]">
          {children}
        </div>
      </body>
    </html>
  );
}
