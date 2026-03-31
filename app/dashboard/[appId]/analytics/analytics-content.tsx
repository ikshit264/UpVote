'use client';

import dynamic from 'next/dynamic';

interface AnalyticsContentProps {
  appId: string;
}

const AnalyticsContentClient = dynamic(
  () => import('./analytics-content-client'),
  {
    ssr: false,
    loading: () => (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-zinc-100 dark:bg-zinc-900"
            />
          ))}
        </div>
        <div className="h-96 rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
      </div>
    ),
  },
);

export default function AnalyticsContent(props: AnalyticsContentProps) {
  return <AnalyticsContentClient {...props} />;
}
