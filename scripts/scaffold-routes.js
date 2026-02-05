const fs = require('fs');
const path = require('path');

const routes = [
    // Public
    'about',
    'legal/privacy',
    'legal/terms',
    'legal/returns',
    'faq',
    'status',

    // Auth & Onboarding
    'auth/login',
    'auth/register',
    'onboarding',
    'kyc',

    // Buyer
    'square',
    'playground',
    'products',
    'products/[id]',
    'cart',
    'checkout',
    'checkout/success',
    'orders',
    'orders/[id]',
    'orders/[id]/track',
    'wallet',
    'notifications',
    'messages/[conversationId]',

    // Cockpit
    'cockpit',
    'cockpit/products',
    'cockpit/products/import',
    'cockpit/orders',
    'cockpit/inventory',
    'cockpit/rfq',
    'cockpit/bids',
    'cockpit/payouts',
    'cockpit/settings',

    // Vault
    'vault',
    'vault/opportunities',
    'vault/factories/[id]',
    'vault/portfolio',
    'vault/transactions',

    // Throne
    'throne',
    'throne/finance',
    'throne/users',
    'throne/verification',
    'throne/disputes',
    'throne/fraud-monitoring',
    'throne/referrals',
    'throne/cycles',
    'throne/system',
    'throne/ai-control',

    // Social
    'feed',
    'profile/[id]',
    'videos',
    'videos/[id]',
    'makers',
    'makers/[id]'
];

const baseDir = path.join(__dirname, '../apps/web/src/app/[locale]');

function getComponentName(routePath) {
    const parts = routePath.split('/');
    return parts.map(p => {
        if (p.startsWith('[') && p.endsWith(']')) {
            return p.slice(1, -1).charAt(0).toUpperCase() + p.slice(1, -1).slice(1) + 'Detail';
        }
        return p.charAt(0).toUpperCase() + p.slice(1);
    }).join('') + 'Page';
}

function getTemplate(routePath, componentName) {
    return `'use client';

import { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ${componentName}() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // usage stub
        // const res = await ApiClient.get('/mock/${routePath}');
        // setData(res);
        setTimeout(() => {
            setData({ message: 'Mock data loaded' });
            setLoading(false);
        }, 500);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 capitalize">${routePath.replace(/\//g, ' ')}</h1>
      
      <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="p-4 bg-muted rounded-md border border-dashed text-center text-muted-foreground">
                    Placeholder for ${routePath} content.
                    <br />
                    <Button className="mt-4" variant="outline">Action Stub</Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
`;
}

routes.forEach(route => {
    const dirPath = path.join(baseDir, route);
    const filePath = path.join(dirPath, 'page.tsx');

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
        console.log(`Creating ${route}...`);
        fs.writeFileSync(filePath, getTemplate(route, getComponentName(route)));
    } else {
        console.log(`Skipping ${route} (exists)`);
    }
});

console.log('Done!');
