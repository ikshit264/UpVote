import { redirect } from 'next/navigation';
import { getCompanySession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { canCreateProject, getOrCreateSubscription } from '@/lib/subscription-service';
import { PLAN_CONFIG, DODO_CONFIG } from '@/lib/payment-config';
import ApplicationsContent from './applications-content';
import { Suspense } from 'react';

/**
 * Main Dashboard Page - Applications List
 * This is the landing page after login
 * User must have at least one application to proceed
 * 
 * Uses Suspense to stream heavy content while page shell loads instantly.
 */

// Skeleton fallback for the applications grid
function ApplicationsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="h-10 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

// Async component that fetches data and renders content
async function DashboardContent() {
  const session = await getCompanySession();

  if (!session?.user) {
    redirect('/auth/login');
  }

  const companyId = (session.user as any).id;

  // Get subscription info
  const subscription = await getOrCreateSubscription(companyId);
  const canCreate = await canCreateProject(companyId);
  const limits = PLAN_CONFIG[subscription.plan].limits;

  // Check if Entrext team user
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  const isEntrextTeam = company?.isEntrextTeam ?? false;

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

  return (
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
      isEntrextTeam={isEntrextTeam}
    />
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto p-8">
        <Suspense fallback={<ApplicationsSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  );
}
