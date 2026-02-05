'use client';

import { CockpitShell } from '@/components/layout/shells/CockpitShell';
import { useParams } from 'next/navigation';

export default function CockpitLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const locale = (params.locale as string) || 'en';
    
    return (
        <CockpitShell locale={locale}>
            {children}
        </CockpitShell>
    );
}
