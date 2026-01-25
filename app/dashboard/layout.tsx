import { redirect } from 'next/navigation';
import { getCompanySession } from '@/lib/auth';
import DashboardSidebar from '@/components/dashboard-sidebar';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getCompanySession();

    if (!session) {
        redirect('/auth/login');
    }

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
            <DashboardSidebar company={session.user as any} />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
