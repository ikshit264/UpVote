/**
 * Payment Configuration
 * 
 * Central configuration for all payment-related constants and plan definitions
 * Used throughout the application for plan limits, features, and pricing
 */

export const PLANS = {
    FREE: 'FREE',
    PRO: 'PRO',
    ENTERPRISE: 'ENTERPRISE',
} as const;

export type Plan = typeof PLANS[keyof typeof PLANS];

export const SUBSCRIPTION_STATUS = {
    ACTIVE: 'ACTIVE',
    TRIALING: 'TRIALING',
    PAST_DUE: 'PAST_DUE',
    CANCELED: 'CANCELED',
    INCOMPLETE: 'INCOMPLETE',
    ON_HOLD: 'ON_HOLD',
} as const;

export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];

/**
 * Plan Features and Limits Configuration
 */
export const PLAN_CONFIG = {
    [PLANS.FREE]: {
        name: 'Hobby',
        description: 'For personal projects',
        price: {
            monthly: 0,
            annual: 0,
            display: '$0',
        },
        limits: {
            projects: 1,              // Maximum 1 project
            feedbacksPerMonth: 50,    // Maximum 50 feedbacks per month
        },
        features: [
            'basic_analytics',
            'email_support',
        ],
        displayFeatures: [
            '1 Project',
            '50 Feedbacks / mo',
            'Basic Analytics',
        ],
    },
    [PLANS.PRO]: {
        name: 'Pro',
        description: 'For growing startups',
        price: {
            monthly: 39,
            annual: 29, // 20% discount on annual
            display: {
                monthly: '$39/mo',
                annual: '$29/mo',
            },
        },
        limits: {
            projects: -1,             // -1 = Unlimited
            feedbacksPerMonth: -1,    // -1 = Unlimited
        },
        features: [
            'basic_analytics',
            'advanced_analytics',
            'custom_branding',
            'priority_support',
            'api_access',
        ],
        displayFeatures: [
            'Unlimited Projects',
            'Unlimited Feedback',
            'Advanced Analytics',
            'Custom Branding',
        ],
        trialDays: 14, // 14-day free trial
    },
    [PLANS.ENTERPRISE]: {
        name: 'Enterprise',
        description: 'For large teams',
        price: {
            monthly: 'custom',
            annual: 'custom',
            display: 'Custom',
        },
        limits: {
            projects: -1,
            feedbacksPerMonth: -1,
        },
        features: [
            'basic_analytics',
            'advanced_analytics',
            'custom_branding',
            'priority_support',
            'api_access',
            'sso',
            'dedicated_support',
            'sla',
            'custom_contracts',
        ],
        displayFeatures: [
            'SSO & Advanced Security',
            'Dedicated Support',
            'SLA Guarantee',
        ],
    },
} as const;

/**
 * Feature flags for feature-based access control
 */
export type PlanFeature =
    | 'basic_analytics'
    | 'advanced_analytics'
    | 'custom_branding'
    | 'priority_support'
    | 'api_access'
    | 'sso'
    | 'dedicated_support'
    | 'sla'
    | 'custom_contracts';

/**
 * DODO Payments Configuration
 * Product IDs are set via environment variables
 */
export const DODO_CONFIG = {
    environment: {
        test: 'https://test.dodopayments.com',
        live: 'https://live.dodopayments.com',
    },
    productIds: {
        PRO_MONTHLY: process.env.DODO_PRO_MONTHLY_PRODUCT_ID || '',
        PRO_ANNUAL: process.env.DODO_PRO_ANNUAL_PRODUCT_ID || '',
    },
    webhookEvents: [
        'subscription.created',
        'subscription.updated',
        'subscription.renewed',
        'subscription.canceled',
        'subscription.payment_failed',
        'subscription.reactivated',
        'subscription.trial_will_end',
    ],
} as const;

/**
 * Billing intervals
 */
export const BILLING_INTERVALS = {
    MONTHLY: 'monthly',
    ANNUAL: 'annual',
} as const;

export type BillingInterval = typeof BILLING_INTERVALS[keyof typeof BILLING_INTERVALS];

/**
 * Usage limit types for error messaging
 */
export const LIMIT_TYPES = {
    PROJECTS: 'projects',
    FEEDBACKS: 'feedbacks',
} as const;

export type LimitType = typeof LIMIT_TYPES[keyof typeof LIMIT_TYPES];

/**
 * Helper function to check if a plan has unlimited access
 */
export function isUnlimited(limit: number): boolean {
    return limit === -1;
}

/**
 * Helper function to get plan limits
 */
export function getPlanLimits(plan: Plan) {
    return PLAN_CONFIG[plan].limits;
}

/**
 * Helper function to check if a plan has a specific feature
 */
export function planHasFeature(plan: Plan, feature: PlanFeature): boolean {
    return PLAN_CONFIG[plan].features.includes(feature);
}

/**
 * Helper function to get display price
 */
export function getDisplayPrice(plan: Plan, interval?: BillingInterval): string {
    const config = PLAN_CONFIG[plan];

    if (plan === PLANS.FREE) {
        return config.price.display as string;
    }

    if (plan === PLANS.ENTERPRISE) {
        return config.price.display as string;
    }

    // PRO plan
    if (interval) {
        return (config.price.display as { monthly: string; annual: string })[interval];
    }

    return config.name;
}

/**
 * Contact information for Enterprise plan
 */
export const ENTERPRISE_CONTACT = {
    email: 'sales@upvote.com',
    subject: 'Enterprise Plan Inquiry',
};
