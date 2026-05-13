import i18nConfig from '../../../i18nConfig';
import { dir } from 'i18next';
import '../globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { RuntimeLocalizer } from '@/i18n/RuntimeLocalizer';

export const metadata: Metadata = {
    title: 'Banda Chao',
    description: 'Closed Loop Digital Ecosystem',
};

export function generateStaticParams() {
    return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const langDir = dir(locale);

    return (
        <html lang={locale} dir={langDir} suppressHydrationWarning>
            <body className="antialiased min-h-screen bg-ink-900 text-slate-200" suppressHydrationWarning>
                <AuthProvider>
                    <RuntimeLocalizer locale={locale} />
                    <main>{children}</main>
                </AuthProvider>
            </body>
        </html>
    );
}
