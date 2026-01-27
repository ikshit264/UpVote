/**
 * Subscription Service Layer
 * 
 * Handles all subscription-related operations including:
 * - Plan limit validation
 * - Usage tracking
 * - Feature access control
 * - Subscription status management
 */

import prisma from '@/lib/prisma';
import { Plan, SubscriptionStatus } from '@prisma/client';
import {
    PLAN_CONFIG,
    PlanFeature,
    planHasFeature,
    isUnlimited,
    PLANS
} from './payment-config';

/**
 * Custom error for plan limit violations
 */
export class PlanLimitError extends Error {
    constructor(
        message: string,
        public limitType: 'projects' | 'feedbacks',
        public currentPlan: Plan,
        public upgradeUrl: string = '/pricing'
    ) {
        super(message);
        this.name = 'PlanLimitError';
    }
}

/**
 * Get or create subscription for a company
 * All companies default to FREE plan
 */
export async function getOrCreateSubscription(companyId: string) {
    let subscription = await prisma.subscription.findUnique({
        where: { companyId },
    });

    if (!subscription) {
        // Create default FREE subscription for new companies
        subscription = await prisma.subscription.create({
            data: {
                companyId,
                plan: PLANS.FREE,
                status: 'ACTIVE',
            },
        });
    }

    return subscription;
}

/**
 * Get current billing period dates based on subscription anniversary
 */
export function getCurrentPeriod(subscription: { currentPeriodStart: Date | null; currentPeriodEnd: Date | null }) {
    const now = new Date();

    if (subscription.currentPeriodStart && subscription.currentPeriodEnd) {
        // Check if still in current period
        if (now >= subscription.currentPeriodStart && now <= subscription.currentPeriodEnd) {
            return {
                start: subscription.currentPeriodStart,
                end: subscription.currentPeriodEnd,
            };
        }
    }

    // For FREE plan or no period set, use calendar month
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    return { start, end };
}

/**
 * Get or create current period's usage metrics
 */
export async function getOrCreateUsageMetrics(companyId: string) {
    const subscription = await getOrCreateSubscription(companyId);
    const period = getCurrentPeriod(subscription);

    let usage = await prisma.usageMetrics.findUnique({
        where: {
            companyId_periodStart: {
                companyId,
                periodStart: period.start,
            },
        },
    });

    if (!usage) {
        usage = await prisma.usageMetrics.create({
            data: {
                companyId,
                periodStart: period.start,
                periodEnd: period.end,
                projectCount: 0,
                feedbackCount: 0,
            },
        });
    }

    return usage;
}

/**
 * Check if company can create a new project
 * Enforces project limit for FREE plan (1 project max)
 */
export async function canCreateProject(companyId: string): Promise<boolean> {
    const subscription = await getOrCreateSubscription(companyId);
    const limits = PLAN_CONFIG[subscription.plan].limits;

    // Unlimited projects
    if (isUnlimited(limits.projects)) {
        return true;
    }

    // Count total projects (not period-based, lifetime limit)
    const projectCount = await prisma.application.count({
        where: { companyId },
    });

    return projectCount < limits.projects;
}

/**
 * Check if company can create a new feedback
 * Enforces monthly feedback limit for FREE plan (50/month)
 */
export async function canCreateFeedback(companyId: string): Promise<boolean> {
    const subscription = await getOrCreateSubscription(companyId);
    const limits = PLAN_CONFIG[subscription.plan].limits;

    // Unlimited feedback
    if (isUnlimited(limits.feedbacksPerMonth)) {
        return true;
    }

    // Get current period usage
    const usage = await getOrCreateUsageMetrics(companyId);

    return usage.feedbackCount < limits.feedbacksPerMonth;
}

/**
 * Increment project count
 * Call this AFTER successfully creating a project
 */
export async function incrementProjectCount(companyId: string): Promise<void> {
    const usage = await getOrCreateUsageMetrics(companyId);

    await prisma.usageMetrics.update({
        where: { id: usage.id },
        data: {
            projectCount: {
                increment: 1,
            },
        },
    });
}

/**
 * Increment feedback count for current period
 * Call this AFTER successfully creating feedback
 */
export async function incrementFeedbackCount(companyId: string): Promise<void> {
    const usage = await getOrCreateUsageMetrics(companyId);

    await prisma.usageMetrics.update({
        where: { id: usage.id },
        data: {
            feedbackCount: {
                increment: 1,
            },
        },
    });
}

/**
 * Get current usage stats
 */
export async function getCurrentUsage(companyId: string) {
    const subscription = await getOrCreateSubscription(companyId);
    const usage = await getOrCreateUsageMetrics(companyId);
    const totalProjects = await prisma.application.count({
        where: { companyId },
    });

    const limits = PLAN_CONFIG[subscription.plan].limits;

    return {
        plan: subscription.plan,
        projects: {
            current: totalProjects,
            limit: limits.projects,
            isUnlimited: isUnlimited(limits.projects),
            percentage: isUnlimited(limits.projects)
                ? 0
                : Math.min(100, (totalProjects / limits.projects) * 100),
        },
        feedbacks: {
            current: usage.feedbackCount,
            limit: limits.feedbacksPerMonth,
            isUnlimited: isUnlimited(limits.feedbacksPerMonth),
            percentage: isUnlimited(limits.feedbacksPerMonth)
                ? 0
                : Math.min(100, (usage.feedbackCount / limits.feedbacksPerMonth) * 100),
        },
        periodStart: usage.periodStart,
        periodEnd: usage.periodEnd,
    };
}

/**
 * Check if company has access to a specific feature
 */
export async function hasFeature(companyId: string, feature: PlanFeature): Promise<boolean> {
    const subscription = await getOrCreateSubscription(companyId);
    return planHasFeature(subscription.plan, feature);
}

/**
 * Check if subscription is in trial period
 */
export function isInTrial(subscription: { status: SubscriptionStatus; trialEnd: Date | null }): boolean {
    if (subscription.status !== 'TRIALING') {
        return false;
    }

    if (!subscription.trialEnd) {
        return false;
    }

    return new Date() < subscription.trialEnd;
}

/**
 * Get days remaining in trial
 */
export function getTrialDaysRemaining(subscription: { trialEnd: Date | null }): number {
    if (!subscription.trialEnd) {
        return 0;
    }

    const now = new Date();
    const diff = subscription.trialEnd.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return Math.max(0, days);
}

/**
 * Update subscription plan
 * Used by webhook handlers
 */
export async function updateSubscriptionPlan(
    companyId: string,
    plan: Plan,
    status: SubscriptionStatus,
    data?: {
        dodoCustomerId?: string;
        dodoSubscriptionId?: string;
        dodoProductId?: string;
        currentPeriodStart?: Date;
        currentPeriodEnd?: Date;
        trialEnd?: Date;
    }
) {
    return await prisma.subscription.upsert({
        where: { companyId },
        create: {
            companyId,
            plan,
            status,
            ...data,
        },
        update: {
            plan,
            status,
            ...data,
        },
    });
}

/**
 * Reset usage for new billing period
 * Called when subscription renews or by cron job
 */
export async function resetUsageForPeriod(
    companyId: string,
    periodStart: Date,
    periodEnd: Date
) {
    return await prisma.usageMetrics.create({
        data: {
            companyId,
            periodStart,
            periodEnd,
            projectCount: 0,
            feedbackCount: 0,
        },
    });
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(companyId: string) {
    const subscription = await getOrCreateSubscription(companyId);

    return await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
            cancelAtPeriodEnd: true,
        },
    });
}

/**
 * Reactivate subscription
 */
export async function reactivateSubscription(companyId: string) {
    const subscription = await getOrCreateSubscription(companyId);

    return await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
            cancelAtPeriodEnd: false,
            status: 'ACTIVE',
        },
    });
}
