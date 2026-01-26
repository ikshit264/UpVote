"use client";

import { motion } from "framer-motion";
import { BarChart3, MessageSquare, Shield, Zap, Users, Globe } from "lucide-react";

const features = [
    {
        icon: <Zap className="w-6 h-6 text-amber-500" />,
        title: "Lightning Fast",
        description: "Our widget loads in under 100ms, ensuring no impact on your site's performance.",
        className: "md:col-span-1 md:row-span-1",
    },
    {
        icon: <Users className="w-6 h-6 text-blue-500" />,
        title: "User Management",
        description: "Identify your standard loyal users and prioritize their feedback automatically.",
        className: "md:col-span-2 md:row-span-1",
    },
    {
        icon: <MessageSquare className="w-6 h-6 text-green-500" />,
        title: "Rich Comments",
        description: "Markdown support, image uploads, and threaded discussions for deeper insights.",
        className: "md:col-span-2 md:row-span-1",
    },
    {
        icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
        title: "Analytics Dashboard",
        description: "Visual trends and sentiment analysis to help you make data-driven decisions.",
        className: "md:col-span-1 md:row-span-1",
    },
    {
        icon: <Shield className="w-6 h-6 text-red-500" />,
        title: "Spam Protection",
        description: "Built-in moderation tools and automated spam filtering keep your feedback clean.",
        className: "md:col-span-1 md:row-span-1",
    },
    {
        icon: <Globe className="w-6 h-6 text-cyan-500" />,
        title: "Multi-Language",
        description: "Automatically translate feedback and widget interface to 30+ languages.",
        className: "md:col-span-2 md:row-span-1",
    },
];

export default function FeaturesGrid() {
    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6"
                    >
                        Everything you need to build better products
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-zinc-600 dark:text-zinc-400"
                    >
                        A complete suite of tools to help you collect, manage, and act on customer feedback without the complexity.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`p-6 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-xl transition-all ${feature.className}`}
                        >
                            <div className="h-full flex flex-col">
                                <div className="mb-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-700/50 w-fit">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
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
