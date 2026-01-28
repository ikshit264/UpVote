"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Gradients - Optimized with CSS animations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50" style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-50" style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) 1.5s infinite' }} />
            </div>

            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-900 dark:from-white dark:via-zinc-400 dark:to-white"
                    >
                        Make Customer Feedback
                        <br />
                        <span className="text-blue-600 dark:text-blue-400">
                            Your Superpower
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl"
                    >
                        Collect, analyze, and act on user feedback with our beautiful widget.
                        Turn passive users into active contributors and build what they
                        actually want.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 items-center"
                    >
                        <Link href="/auth/signup">
                            <Button size="lg" className="h-12 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all">
                                Start Free Trial
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/demo">
                            <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                                View Live Demo
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Social Proof / Trust */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="pt-8 flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400"
                    >
                        <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            <span>14-day free trial</span>
                        </div>
                    </motion.div>
                </div>

                {/* Dashboard Preview / Visual */}
                <motion.div
                    initial={{ opacity: 0, y: 40, rotateX: 10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-16 sm:mt-24 relative mx-auto max-w-5xl perspective-1000"
                >
                    <div className="relative rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-black/50 backdrop-blur-xl shadow-2xl overflow-hidden p-2">
                        <div className="rounded-lg bg-zinc-100 dark:bg-zinc-900 overflow-hidden aspect-[16/9] relative group">
                            {/* Abstract UI representation since we don't have a screenshot yet */}
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center">
                                <div className="text-center space-y-4">
                                    <div className="inline-block p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                                        <Star className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <p className="text-zinc-500 font-medium">Dashboard Interface Preview</p>
                                </div>
                            </div>

                            {/* Floating elements animation - Optimized */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="absolute top-10 left-10 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-lg border border-zinc-100 dark:border-zinc-700 max-w-xs z-10"
                                style={{ animation: 'float 4s ease-in-out infinite' }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                        👍
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">New Upvote!</p>
                                        <p className="text-xs text-zinc-500">Just now from User #294</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1 }}
                                className="absolute bottom-10 right-10 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-lg border border-zinc-100 dark:border-zinc-700 max-w-xs z-10"
                                style={{ animation: 'float 5s ease-in-out 1s infinite' }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                        🚀
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Feature Shipped</p>
                                        <p className="text-xs text-zinc-500">Dark Mode has been released</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Glossy reflection effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none rounded-xl" />
                    </div>

                    {/* Background Glow behind dashboard */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-2xl opacity-20 -z-10 group-hover:opacity-30 transition-opacity" />
                </motion.div>
            </div>
        </section>
    );
}
