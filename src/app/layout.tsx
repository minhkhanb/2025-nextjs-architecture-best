import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import ClientProvider from './ClientProvider'; // Import ClientProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MyBrand - TailwindCSS Inspired',
  description: 'A modern website built with Next.js and TailwindCSS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <ClientProvider>
          {/* Navigation Bar */}
          <header className="bg-white shadow">
            <div className="container mx-auto flex items-center justify-between px-6 py-4">
              <div className="text-lg font-bold text-gray-800">MyBrand</div>
              <nav className="space-x-4">
                <Link
                  href="/home"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Home
                </Link>
                <Link
                  href="/pokemon"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Pokémon
                </Link>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main>{children}</main>

          {/* Footer */}
          <footer className="bg-gray-100">
            <div className="container mx-auto px-6 py-4 text-center text-gray-600">
              © 2025 MyBrand. All rights reserved.
            </div>
          </footer>
        </ClientProvider>
      </body>
    </html>
  );
}
