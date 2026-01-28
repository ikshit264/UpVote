'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Star, Rocket, ShieldCheck } from 'lucide-react';
import { PLAN_CONFIG, PLANS, Plan } from '@/lib/payment-config';
import { toast } from 'sonner';

import { DodoPayments } from 'dodopayments-checkout';

interface BillingContentProps {
    subscription: any;
    user: any;
    dodoConfig: any;
}

export default function BillingContent({ subscription, user, dodoConfig }: BillingContentProps) {
    const [interval, setInterval] = useState<'monthly' | 'annual'>('monthly');
    const currentPlan = (subscription?.plan as Plan) || PLANS.FREE;

    const plans = [
        {
            id: PLANS.FREE,
            config: PLAN_CONFIG[PLANS.FREE],
            icon: Star,
            color: 'text-zinc-500',
            bg: 'bg-zinc-50 dark:bg-zinc-800/50',
            border: 'border-zinc-200 dark:border-zinc-800',
        },
        {
            id: PLANS.PRO,
            config: PLAN_CONFIG[PLANS.PRO],
            icon: Rocket,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50/50 dark:bg-indigo-900/10',
            border: 'border-indigo-200 dark:border-indigo-900/50',
            popular: true,
        },
        {
            id: PLANS.ENTERPRISE,
            config: PLAN_CONFIG[PLANS.ENTERPRISE],
            icon: ShieldCheck,
            color: 'text-purple-600',
            bg: 'bg-purple-50/50 dark:bg-purple-900/10',
            border: 'border-purple-200 dark:border-purple-900/50',
        },
    ];

    const isUpgrade = (planId: Plan) => {
        if (currentPlan === PLANS.FREE) return planId !== PLANS.FREE;
        if (currentPlan === PLANS.PRO) return planId === PLANS.ENTERPRISE;
        return false;
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto py-4">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-widest">
                        <CreditCard className="w-4 h-4" />
                        Billing & Plans
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                        Upgrade your Experience
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl text-sm font-medium">
                        Choose the plan that's right for your team. Save up to 20% with annual billing.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl ring-1 ring-zinc-200 dark:ring-zinc-800 shrink-0">
                    <button
                        onClick={() => setInterval('monthly')}
                        className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${interval === 'monthly'
                            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setInterval('annual')}
                        className={`px-6 py-2 rounded-xl text-sm font-black transition-all relative ${interval === 'annual'
                            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                            }`}
                    >
                        Yearly
                        <Badge className="absolute -top-3 -right-3 bg-green-500 text-white border-none text-[8px] px-1.5 py-0">
                            -20%
                        </Badge>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                    const Icon = plan.icon;
                    const isActive = currentPlan === plan.id;
                    const canUpgrade = isUpgrade(plan.id);

                    const priceDisplay = typeof plan.config.price.display === 'string'
                        ? plan.config.price.display
                        : (plan.config.price.display as any)[interval];

                    const handleUpgrade = () => {
                        console.log('Upgrade clicked for plan:', plan.id);
                        if (!canUpgrade) {
                            console.log('Cannot upgrade to this plan.');
                            return;
                        }

                        if (plan.id === PLANS.ENTERPRISE) {
                            window.location.href = `mailto:sales@upvote.com?subject=Enterprise Plan Inquiry`;
                            return;
                        }

                        // Trigger Dodo Payments
                        const productId = interval === 'monthly'
                            ? dodoConfig.productIds.PRO_MONTHLY
                            : dodoConfig.productIds.PRO_ANNUAL;

                        console.log('Using product ID:', productId);

                        try {
                            console.log('Dodo SDK found, initializing...');

                            // Initialize once (can be done outside if needed, but here is safe)
                            DodoPayments.Initialize({
                                mode: 'test',
                            });

                            DodoPayments.Checkout.open({
                                products: [
                                    {
                                        productId: productId,
                                        quantity: 1,
                                    }
                                ],
                                customer: {
                                    email: user?.email,
                                    name: user?.name,
                                },
                                metadata: {
                                    companyId: user?.id,
                                },
                                onSuccess: (data: any) => {
                                    console.log('Payment successful', data);
                                    toast.success('Upgrade successful! Your features are being unlocked.');
                                },
                                onError: (error: any) => {
                                    console.error('Payment error', error);
                                    toast.error('Something went wrong. Please try again.');
                                }
                            });
                            console.log('Opening checkout...');
                        } catch (err) {
                            console.error('Dodo initialization error:', err);
                            toast.error('Failed to initialize checkout.');
                        }
                    };

                    return (
                        <Card
                            key={plan.id}
                            className={`relative flex flex-col p-6 border-2 transition-all duration-300 ${isActive
                                ? `${plan.border} shadow-lg scale-[1.02] z-10 bg-white dark:bg-zinc-900`
                                : 'border-transparent shadow-sm hover:shadow-md bg-white/50 dark:bg-zinc-900/50'
                                }`}
                        >
                            {plan.popular && !isActive && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-indigo-600 text-white border-none px-2 py-0.5 font-bold uppercase text-[9px] tracking-widest shadow-lg rounded-full">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            {isActive && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-green-500 text-white border-none px-2 py-0.5 font-bold uppercase text-[9px] tracking-widest shadow-lg rounded-full">
                                        Current Plan
                                    </Badge>
                                </div>
                            )}

                            <div className="mb-6">
                                <div className={`w-10 h-10 rounded-xl ${plan.bg} ${plan.color} flex items-center justify-center mb-3`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                                    {plan.config.name}
                                </h3>
                                <p className="text-zinc-500 text-xs mt-1">
                                    {plan.config.description}
                                </p>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-zinc-900 dark:text-white">
                                        {priceDisplay}
                                    </span>
                                    {(plan.id !== PLANS.ENTERPRISE && plan.id !== PLANS.FREE) && (
                                        <span className="text-zinc-500 font-bold text-sm">/mo</span>
                                    )}
                                </div>
                                {interval === 'annual' && plan.id === PLANS.PRO && (
                                    <p className="text-[10px] text-green-600 font-bold mt-1">
                                        Billed annually ($348/year)
                                    </p>
                                )}
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.config.displayFeatures.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                                        <div className={`mt-0.5 rounded-full p-0.5 ${isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                                            <Check className="w-2.5 h-2.5" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full h-10 rounded-xl font-bold text-sm transition-all duration-300 ${isActive
                                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-default hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                    : canUpgrade
                                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-[1.02]'
                                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-300 cursor-not-allowed border-none'
                                    }`}
                                disabled={!canUpgrade && !isActive}
                                onClick={handleUpgrade}
                            >
                                {isActive ? 'Active Plan' : canUpgrade ? 'Upgrade Now' : 'Plan Restricted'}
                            </Button>
                        </Card>
                    );
                })}
            </div>

            <Card className="p-6 bg-zinc-900 text-white rounded-2xl border-none shadow-xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-6 opacity-5 transition-opacity group-hover:opacity-10">
                    <ShieldCheck className="w-24 h-24" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-xl">
                        <h3 className="text-xl font-black mb-1">Need something larger?</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Our Enterprise plan offers custom limits, dedicated support, and advanced security for large teams.
                        </p>
                    </div>
                    <Button className="bg-white text-zinc-900 hover:bg-zinc-100 rounded-xl font-bold px-6 h-10 shrink-0">
                        Contact Sales
                    </Button>
                </div>
            </Card>
        </div>
    );
}
