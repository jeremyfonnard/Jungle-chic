import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jungle Chic - Maillots de Bain Élégants',
  description: 'Boutique en ligne de maillots de bain pour femmes avec un design jungle élégant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}