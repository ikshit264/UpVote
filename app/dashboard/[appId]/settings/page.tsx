import { redirect } from 'next/navigation';
import { getCompanySession } from '@/lib/auth';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const SettingsContent = dynamic(() => import('./settings-content'), {
    loading: () => (
      <div className="p-8 space-y-8 animate-pulse max-w-5xl mx-auto">
        <div className="space-y-2">
          <div className="h-8 w-56 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-4 w-80 bg-zinc-100 dark:bg-zinc-900 rounded" />
        </div>
        <div className="h-12 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        <div className="h-64 bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
        <div className="h-48 bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
      </div>
    ),
    ssr: true
});

export default async function AppSettingsPage({ params }: { params: Promise<{ appId: string }> }) {
    const session = await getCompanySession();

    if (!session?.user) {
        redirect('/auth/login');
    }

    const { appId } = await params;

    return <SettingsContent applicationId={appId} />;
}
