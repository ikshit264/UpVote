import { redirect } from 'next/navigation';
import { getCompanySession } from '@/lib/auth';
import SettingsContent from './settings-content';

export default async function AppSettingsPage({ params }: { params: Promise<{ appId: string }> }) {
    const session = await getCompanySession();

    if (!session?.user) {
        redirect('/auth/login');
    }

    const { appId } = await params;

    return <SettingsContent applicationId={appId} />;
}

