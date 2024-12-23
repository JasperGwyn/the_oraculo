import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Providers from './providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Oráculo\'s Whimsical Showdown',
  description: 'A zany game of wits and wagers',
}

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    );
  }
