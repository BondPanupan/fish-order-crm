import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar/Sidebar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Fish CRM',
  description: 'Fish order management system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ marginLeft: '220px', flex: 1, minHeight: '100vh', background: '#f3f4f6' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
