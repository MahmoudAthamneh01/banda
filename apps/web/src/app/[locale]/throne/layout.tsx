'use client';

import { ThroneShell } from '@/components/layout/shells/ThroneShell';
import { useParams } from 'next/navigation';

export default function ThroneLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const locale = (params.locale as string) || 'en';
    
    return (
        <ThroneShell locale={locale}>
            {children}
        </ThroneShell>
    );
}
