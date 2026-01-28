import { redirect } from 'next/navigation';
import { getCompanySession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { canCreateProject, getOrCreateSubscription } from '@/lib/subscription-service';
import { PLAN_CONFIG, DODO_CONFIG } from '@/lib/payment-config';
import ApplicationsContent from './applications-content';

/**
 * Main Dashboard Page - Applications List
 * This is the landing page after login
 * User must have at least one application to proceed
 */
export default async function DashboardPage() {
  const session = await getCompanySession();

  if (!session?.user) {
    redirect('/auth/login');
  }

  const companyId = (session.user as any).id;

  // Get subscription info
  const subscription = await getOrCreateSubscription(companyId);
  const canCreate = await canCreateProject(companyId);
  const limits = PLAN_CONFIG[subscription.plan].limits;

  // Fetch all applications with feedback count
  const applications = await prisma.application.findMany({
    where: { companyId },
    include: {
      _count: {
        select: { feedback: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Always show applications list - user can select which app to enter
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto p-8">
        <ApplicationsContent
          applications={applications.map(app => ({
            id: app.id,
            name: app.name,
            createdAt: app.createdAt.toISOString(),
            _count: app._count
          }))}
          canCreateMore={canCreate}
          currentPlan={subscription.plan}
          maxProjects={limits.projects}
          subscription={subscription}
          user={session.user}
          dodoConfig={DODO_CONFIG}
        />
      </div>
    </div>
  );
}
