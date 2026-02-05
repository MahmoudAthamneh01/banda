'use client';

import { BuyerShell } from '@/components/layout/shells/BuyerShell';
import { useParams } from 'next/navigation';

export default function MarketplaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const locale = (params.locale as string) || 'en';
    
    return (
        <BuyerShell locale={locale}>
            {children}
        </BuyerShell>
    );
}
