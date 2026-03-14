"use client";

import { motion } from "framer-motion";
import { BarChart3, MessageSquare, Shield, Zap, Users, Globe } from "lucide-react";

const features = [
    {
        icon: <Zap className="w-5 h-5 text-amber-500" />,
        title: "Lightning Fast",
        description: "Focus on performance. Our widget loads in under 100ms, ensuring zero impact on your core web vitals.",
        className: "md:col-span-1 md:row-span-2",
        visual: "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10",
    },
    {
        icon: <Users className="w-5 h-5 text-blue-500" />,
        title: "User Management",
        description: "Identify your standard loyal users and prioritize their feedback automatically based on usage data.",
        className: "md:col-span-2 md:row-span-1",
        visual: "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10",
    },
    {
        icon: <MessageSquare className="w-5 h-5 text-green-500" />,
        title: "Rich Comments",
        description: "Markdown support, image uploads, and threaded discussions for deeper, more actionable insights.",
        className: "md:col-span-2 md:row-span-1",
        visual: "bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10",
    },
    {
        icon: <BarChart3 className="w-5 h-5 text-purple-500" />,
        title: "Analytics Dashboard",
        description: "Visual trends and sentiment analysis to help you make data-driven decisions seamlessly.",
        className: "md:col-span-1 md:row-span-1",
        visual: "bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10",
    },
    {
        icon: <Shield className="w-5 h-5 text-red-500" />,
        title: "Spam Protection",
        description: "Built-in moderation tools and automated spam filtering keep your feedback clean and reliable.",
        className: "md:col-span-1 md:row-span-1",
        visual: "bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10",
    },
    {
        icon: <Globe className="w-5 h-5 text-cyan-500" />,
        title: "Multi-Language",
        description: "Automatically translate feedback and widget interface to 30+ languages to reach a global audience.",
        className: "md:col-span-2 md:row-span-1",
        visual: "bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-950/20 dark:to-cyan-900/10",
    },
];

export default function FeaturesGrid() {
    return (
        <section id="features" className="py-24 bg-white dark:bg-zinc-950 relative">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white"
                    >
                        Everything you need to build better products
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed"
                    >
                        A complete suite of tools to help you collect, manage, and act on customer feedback without the complexity.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto auto-rows-[300px]">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-soft transition-all hover:shadow-soft-lg flex flex-col ${feature.className}`}
                        >
                            {/* Visual Area */}
                            <div className={`flex-1 w-full min-h-[120px] ${feature.visual} flex items-center justify-center relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent dark:from-zinc-900/80 dark:via-zinc-900/20" />
                                <motion.div 
                                    className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center z-10 relative"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {feature.icon}
                                </motion.div>
                            </div>
                            
                            {/* Content Area */}
                            <div className="p-8 bg-white dark:bg-zinc-900 z-10 relative flex flex-col justify-end shrink-0">
                                <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-3 tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
