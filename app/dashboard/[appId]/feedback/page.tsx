'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const FeedbackContent = dynamic(() => import('@/components/feedback-content'), {
    loading: () => <div className="p-8">Loading...</div>,
    ssr: false
});

export default function AppFeedbackPage() {
    const params = useParams();
    const appId = params.appId as string;

    return <FeedbackContent applicationId={appId} />;
}
