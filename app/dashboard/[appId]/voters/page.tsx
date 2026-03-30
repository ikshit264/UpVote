'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const UsersContent = dynamic(() => import('@/components/users-content'), {
    loading: () => <div className="p-8">Loading...</div>,
    ssr: false
});

export default function AppUsersPage() {
    const params = useParams();
    const appId = params.appId as string;

    return <UsersContent applicationId={appId} />;
}
