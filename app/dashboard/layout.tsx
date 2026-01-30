import { redirect } from 'next/navigation';
import { getCompanySession } from '@/lib/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getCompanySession();

    if (!session) {
        redirect('/auth/login');
    }

    // Don't render sidebar here - let child routes handle their own layout
    // This prevents double sidebars when [appId] layout renders
    return <>{children}</>;
}
