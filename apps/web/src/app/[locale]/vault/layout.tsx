'use client';

import { useParams } from 'next/navigation';
import VaultShell from '@/components/shells/VaultShell';

export default function VaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const locale = params.locale as string;

    return <VaultShell locale={locale}>{children}</VaultShell>;
}
