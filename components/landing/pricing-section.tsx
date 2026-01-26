"use client";

import { motion } from "framer-motion";
import { Check, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PricingSection() {
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/30">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                        Choose the perfect plan for your needs. Always free to get started.
                    </p>

                    <div className="flex items-center justify-center gap-4 mb-8">
                        <span className={`text-sm font-medium ${!isAnnual ? "text-zinc-900 dark:text-white" : "text-zinc-500"}`}>Monthly</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="cursor-pointer relative w-14 h-7 bg-zinc-200 dark:bg-zinc-700 rounded-full p-1 transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-600 focus:outline-none"
                        >
                            <motion.div
                                animate={{ x: isAnnual ? 28 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="w-5 h-5 bg-white rounded-full shadow-sm"
                            />
                        </button>
                        <span className={`text-sm font-medium ${isAnnual ? "text-zinc-900 dark:text-white" : "text-zinc-500"}`}>
                            Yearly <span className="text-green-600 text-xs font-bold ml-1">(Save 20%)</span>
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Free Plan */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="p-8 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm"
                    >
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Hobby</h3>
                        <p className="text-zinc-500 text-sm mb-6">For personal projects</p>
                        <div className="text-4xl font-bold text-zinc-900 dark:text-white mb-6">
                            $0 <span className="text-lg font-normal text-zinc-500">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                                <Check className="w-4 h-4 text-zinc-900 dark:text-white" />
                                1 Project
                            </li>
                            <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                                <Check className="w-4 h-4 text-zinc-900 dark:text-white" />
                                50 Feedbacks / mo
                            </li>
                            <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                                <Check className="w-4 h-4 text-zinc-900 dark:text-white" />
                                Basic Analytics
                            </li>
                        </ul>
                        <Link href="/auth/signup">
                            <Button variant="outline" className="w-full">Get Started</Button>
                        </Link>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="relative p-8 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl scale-105 z-10"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            Most Popular
                        </div>
                        <h3 className="text-xl font-bold mb-2">Pro</h3>
                        <p className="text-zinc-400 dark:text-zinc-500 text-sm mb-6">For growing startups</p>
                        <div className="text-4xl font-bold mb-6">
                            ${isAnnual ? "29" : "39"} <span className="text-lg font-normal text-zinc-400 dark:text-zinc-500">/mo</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 dark:text-blue-600" />
                                Unlimited Projects
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 dark:text-blue-600" />
                                Unlimited Feedback
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 dark:text-blue-600" />
                                Advanced Analytics
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 dark:text-blue-600" />
                                Custom Branding
                            </li>
                        </ul>
                        <Link href="/auth/signup">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0">Start Free Trial</Button>
                        </Link>
                    </motion.div>

                    {/* Enterprise Plan */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="p-8 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm"
                    >
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Enterprise</h3>
                        <p className="text-zinc-500 text-sm mb-6">For large teams</p>
                        <div className="text-4xl font-bold text-zinc-900 dark:text-white mb-6">
                            Custom
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                                <Check className="w-4 h-4 text-zinc-900 dark:text-white" />
                                SSO & Advanced Security
                            </li>
                            <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                                <Check className="w-4 h-4 text-zinc-900 dark:text-white" />
                                Dedicated Support
                            </li>
                            <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                                <Check className="w-4 h-4 text-zinc-900 dark:text-white" />
                                SLA Guarantee
                            </li>
                        </ul>
                        <Link href="mailto:sales@upvote.com">
                            <Button variant="outline" className="w-full">Contact Sales</Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
