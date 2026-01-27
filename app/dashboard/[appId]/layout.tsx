import { redirect } from 'next/navigation';
import { getCompanySession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ReactNode } from 'react';
import AppDashboardSidebar from '@/components/app-dashboard-sidebar';

/**
 * Layout for app-specific dashboard
 * Wraps all /dashboard/[appId]/* pages
 */
export default async function AppDashboardLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ appId: string }>;
}) {
    const session = await getCompanySession();

    if (!session?.user) {
        redirect('/auth/login');
    }

    const companyId = (session.user as any).id;
    const { appId } = await params;

    // Verify the application belongs to this company
    const application = await prisma.application.findFirst({
        where: {
            id: appId,
            companyId
        }
    });

    if (!application) {
        // App doesn't exist or doesn't belong to user
        redirect('/dashboard');
    }

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
            <AppDashboardSidebar
                company={session.user as any}
                application={application}
            />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

