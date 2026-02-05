'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@bandachao/ui';
import { Skeleton } from '@/components/ui/skeleton';

export default function MessagesConversationIdDetailPage() {
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // usage stub
        // const res = await ApiClient.get('/mock/messages/[conversationId]');
        // setData(res);
        setTimeout(() => {
            // setData({ message: 'Mock data loaded' });
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
      <h1 className="text-3xl font-bold mb-6 capitalize">messages [conversationId]</h1>
      
      <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="p-4 bg-muted rounded-md border border-dashed text-center text-muted-foreground">
                    Placeholder for messages/[conversationId] content.
                    <br />
                    <Button className="mt-4" variant="outline">Action Stub</Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
