/**
 * Limit Enforcement Middleware
 * 
 * Functions to enforce plan limits BEFORE operations
 * Throws PlanLimitError when limits are exceeded
 */

import {
    canCreateProject,
    canCreateFeedback,
    getOrCreateSubscription,
    getCurrentUsage,
    PlanLimitError
} from '../subscription-service';
import { PLAN_CONFIG } from '../payment-config';

/**
 * Enforce project creation limit
 * Call this BEFORE creating a project
 * 
 * @throws {PlanLimitError} When project limit is reached
 */
export async function enforceProjectLimit(companyId: string): Promise<void> {
    const canCreate = await canCreateProject(companyId);

    if (!canCreate) {
        const subscription = await getOrCreateSubscription(companyId);
        const limits = PLAN_CONFIG[subscription.plan].limits;

        throw new PlanLimitError(
            `You have reached your project limit of ${limits.projects}. Upgrade to Pro for unlimited projects.`,
            'projects',
            subscription.plan,
            '/pricing'
        );
    }
}

/**
 * Enforce feedback creation limit
 * Call this BEFORE creating feedback
 * 
 * @throws {PlanLimitError} When feedback limit is reached
 */
export async function enforceFeedbackLimit(companyId: string): Promise<void> {
    const canCreate = await canCreateFeedback(companyId);

    if (!canCreate) {
        const subscription = await getOrCreateSubscription(companyId);
        const usage = await getCurrentUsage(companyId);
        const limits = PLAN_CONFIG[subscription.plan].limits;

        throw new PlanLimitError(
            `You have used ${usage.feedbacks.current}/${limits.feedbacksPerMonth} feedbacks this month. Upgrade to Pro for unlimited feedback.`,
            'feedbacks',
            subscription.plan,
            '/pricing'
        );
    }
}

/**
 * Handle plan limit errors in API routes
 * Returns formatted error response for client
 */
export function formatLimitErrorResponse(error: PlanLimitError) {
    return {
        error: error.message,
        limitType: error.limitType,
        currentPlan: error.currentPlan,
        upgradeRequired: true,
        upgradeUrl: error.upgradeUrl,
    };
}

/**
 * Check if error is a PlanLimitError
 */
export function isPlanLimitError(error: unknown): error is PlanLimitError {
    return error instanceof PlanLimitError;
}
