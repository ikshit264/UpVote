'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

// Lazy-load the entire analytics content to defer the heavy Recharts library
const AnalyticsContent = dynamic(() => import('./analytics-content'), {
    loading: () => (
        <div className="p-8 space-y-8 animate-pulse">
            <div className="space-y-2">
                <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                <div className="h-4 w-64 bg-zinc-100 dark:bg-zinc-900 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />)}
            </div>
            <div className="h-96 bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
        </div>
    ),
    ssr: false
});

export default function AppAnalyticsPage() {
    const params = useParams();
    const appId = params.appId as string;

    return <AnalyticsContent appId={appId} />;
}
