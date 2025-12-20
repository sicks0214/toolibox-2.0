import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Tools - Toolibox',
  description: 'Free online PDF tools to merge, split, compress and convert PDF files',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
