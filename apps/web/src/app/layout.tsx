import type { Metadata } from 'next';
import './globals.css';

// Fonts will be loaded via CSS or downloaded separately
// Placeholder configuration for now
export const metadata: Metadata = {
    title: 'Banda Chao',
    description: 'Closed Loop Digital Ecosystem',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
