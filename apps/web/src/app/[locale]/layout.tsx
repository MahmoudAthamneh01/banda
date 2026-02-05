import i18nConfig from '../../../i18nConfig';
import { dir } from 'i18next';
import '../globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
    title: 'Banda Chao',
    description: 'Closed Loop Digital Ecosystem',
};

export function generateStaticParams() {
    return i18nConfig.locales.map((locale) => ({ locale }));
}

export default function RootLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const langDir = dir(locale);

    return (
        <html lang={locale} dir={langDir} suppressHydrationWarning>
            <body className="antialiased min-h-screen bg-ink-900 text-slate-200" suppressHydrationWarning>
                <AuthProvider>
                    <main>{children}</main>
                </AuthProvider>
            </body>
        </html>
    );
}
