'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const SupportContent = dynamic(() => import('@/components/support-content'), {
    loading: () => <div className="p-8">Loading...</div>,
    ssr: false
});

export default function AppSupportPage() {
    const params = useParams();
    const appId = params.appId as string;

    return <SupportContent applicationId={appId} />;
}
