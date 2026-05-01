"use client";

import { m } from "framer-motion";
import { Check, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PricingSection() {
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <section id="pricing" className="py-24 bg-[#F8FAFC] dark:bg-zinc-950 relative ">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <m.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white mb-6"
                    >
                        Simple, transparent pricing - start Free
                    </m.h2>
                    <m.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 font-normal leading-relaxed"
                    >
                        Start collecting user feedback today. <span className="font-bold italic">No credit card required.</span>
                    </m.p>

                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-4 mb-8"
                    >
                        <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-zinc-900 dark:text-white" : "text-zinc-500"}`}>Monthly</span>
                        <button
                            type="button"
                            onClick={() => setIsAnnual(!isAnnual)}
                            aria-label={isAnnual ? "Switch to monthly billing" : "Switch to yearly billing"}
                            aria-pressed={isAnnual}
                            className="cursor-pointer relative w-14 h-7 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700 focus:outline-none shadow-inner"
                        >
                            <m.div
                                animate={{ x: isAnnual ? 28 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="w-5 h-5 bg-white rounded-full shadow-sm"
                                style={{ transform: "translateZ(0)", willChange: "transform" }}
                            />
                        </button>
                        <span className={`text-sm font-medium transition-colors ${isAnnual ? "text-zinc-900 dark:text-white" : "text-zinc-500"}`}>
                            Yearly <span className="text-green-600 dark:text-green-400 text-xs font-bold ml-1 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">(Save 20%)</span>
                        </span>
                    </m.div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {/* Free Plan */}
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: 0.1 }}
                        className="p-8 md:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-soft transition-shadow hover:shadow-soft-lg"
                    >
                        <h3 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Hobby Plan</h3>
                        <p className="text-zinc-500 text-sm mb-8">Perfect for side projects and personal sites - Free Forever.</p>
                        <div className="text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white mb-8">
                            $0 <span className="text-lg font-medium text-zinc-400 dark:text-zinc-500">/ Month</span>
                        </div>
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 font-medium">
                                <Check className="w-5 h-5 text-zinc-500" />
                                1 Project
                            </li>
                            <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 font-medium">
                                <Check className="w-5 h-5 text-zinc-500" />
                                50 Feedbacks / month
                            </li>
                            <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 font-medium">
                                <Check className="w-5 h-5 text-zinc-500" />
                                Basic Analytics
                            </li>
                        </ul>
                        <Link href="/auth/signup">
                            <Button variant="outline" className="w-full h-12 rounded-xl border-zinc-200 dark:border-zinc-700 text-base font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">Get Started</Button>
                        </Link>
                    </m.div>

                    {/* Pro Plan */}
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: 0.2 }}
                        className="relative p-8 md:p-10 rounded-3xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-soft-lg md:-my-6 z-10 overflow-hidden"
                    >
                        {/* Decorative background element for Pro */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-700/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-zinc-700 text-white text-xs font-bold px-4 py-1.5 rounded-b-xl uppercase tracking-wider shadow-sm">
                            Most Popular
                        </div>
                        <h3 className="text-2xl font-bold mb-2 mt-2">Pro Plan</h3>
                        <p className="text-zinc-400 dark:text-zinc-500 text-sm mb-8">For growing startups and SaaS teams.</p>
                        <div className="text-5xl font-extrabold tracking-tight mb-8">
                            ${isAnnual ? "29" : "39"} <span className="text-lg font-medium text-zinc-400 dark:text-zinc-500">/ Month</span>
                        </div>
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-3 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-zinc-400 dark:text-zinc-700" />
                                Unlimited Projects
                            </li>
                            <li className="flex items-center gap-3 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-zinc-400 dark:text-zinc-700" />
                                Unlimited Feedback
                            </li>
                            <li className="flex items-center gap-3 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-zinc-400 dark:text-zinc-700" />
                                Advanced Analytics
                            </li>
                            <li className="flex items-center gap-3 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-zinc-400 dark:text-zinc-700" />
                                Custom Branding & Domains
                            </li>
                        </ul>
                        <Link href="/auth/signup">
                            <Button className="w-full h-12 rounded-xl bg-zinc-700 hover:bg-zinc-800 text-white border-0 text-base font-medium shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]">Start Free Trial</Button>
                        </Link>
                    </m.div>

                    {/* Enterprise Plan */}
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: 0.3 }}
                        className="p-8 md:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-soft transition-shadow hover:shadow-soft-lg"
                    >
                        <h3 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Enterprise Plan</h3>
                        <p className="text-zinc-500 text-sm mb-8">For large teams demanding more security.</p>
                        <div className="text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white mb-8">
                            Custom
                        </div>
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 font-medium">
                                <Check className="w-5 h-5 text-zinc-500" />
                                SSO & Advanced Security
                            </li>
                            <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 font-medium">
                                <Check className="w-5 h-5 text-zinc-500" />
                                Dedicated Success Manager
                            </li>
                            <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 font-medium">
                                <Check className="w-5 h-5 text-zinc-500" />
                                99.9% Uptime SLA
                            </li>
                        </ul>
                        <Link href="mailto:sales@monkfeed.com">
                            <Button variant="outline" className="w-full h-12 rounded-xl border-zinc-200 dark:border-zinc-700 text-base font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">Contact Sales</Button>
                        </Link>
                    </m.div>
                </div>
            </div>
        </section>
    );
}
