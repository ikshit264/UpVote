"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-mesh-ai">
            {/* Background elements are handled by .bg-mesh-ai in globals.css for a smoother, AI-first look */}
            
            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
                    {/* Headline - High contrast, tight tracking (Intercom style) */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tighter text-zinc-950 dark:text-white"
                    >
                        Make Customer Feedback
                        <br />
                        <span className="text-blue-600">
                            Your Superpower
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl font-normal leading-relaxed"
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
                        className="flex flex-col sm:flex-row gap-4 items-center pt-4"
                    >
                        <Link href="/auth/signup">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-soft transition-all hover:scale-[1.02] active:scale-[0.98]">
                                Start Free Trial
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="#demo">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm">
                                View Live Demo
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Social Proof / Trust */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="pt-6 flex flex-wrap justify-center items-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400"
                    >
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-5 h-5 text-blue-500" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-5 h-5 text-blue-500" />
                            <span>14-day free trial</span>
                        </div>
                    </motion.div>
                </div>

                {/* Dashboard Preview / Visual - Soft Elevation */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-16 sm:mt-24 relative mx-auto max-w-5xl"
                >
                    <div className="relative rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 shadow-soft-lg overflow-hidden p-2 backdrop-blur-sm">
                        <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 overflow-hidden aspect-[16/9] relative group flex items-center justify-center">
                            
                            {/* Abstract UI composition */}
                            <div className="text-center space-y-6">
                                <motion.div 
                                    className="inline-block p-5 rounded-2xl bg-white dark:bg-zinc-800 shadow-soft mb-2"
                                    animate={{ y: [-5, 5, -5] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Star className="w-12 h-12 text-blue-600 dark:text-blue-400 drop-shadow-sm" />
                                </motion.div>
                                <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg tracking-tight">Interactive Dashboard Preview</p>
                            </div>

                            {/* Floating functional elements */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="absolute top-12 left-8 md:max-w-xs z-10"
                            >
                                <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md p-4 rounded-xl shadow-soft border border-zinc-100 dark:border-zinc-700 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-lg shadow-inner">
                                        👍
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">New Upvote!</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Feedback #294 is trending</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 1 }}
                                className="absolute bottom-12 right-8 md:max-w-xs z-10"
                            >
                                <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md p-4 rounded-xl shadow-soft border border-zinc-100 dark:border-zinc-700 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg shadow-inner">
                                        🚀
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Feature Shipped</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Dark Mode has been released</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
