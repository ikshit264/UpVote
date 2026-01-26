"use client";

import { motion } from "framer-motion";

const companies = [
    "Acme Corp",
    "Globex",
    "Soylent Corp",
    "Initech",
    "Umbrella Corp",
    "Massive Dynamic",
    "Cyberdyne",
    "Wayne Enterprises",
];

export default function SocialProof() {
    return (
        <section className="py-12 border-y border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto mb-8 text-center">
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
                    Trusted by innovative teams everywhere
                </p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 20,
                        ease: "linear",
                    }}
                    className="flex gap-12 sm:gap-24 whitespace-nowrap py-4 px-4"
                >
                    {[...companies, ...companies].map((company, index) => (
                        <div
                            key={index}
                            className="text-xl md:text-2xl font-bold text-zinc-300 dark:text-zinc-700 flex items-center justify-center min-w-[120px]"
                        >
                            {company}
                        </div>
                    ))}
                </motion.div>

                {/* Gradients to fade edges */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent"></div>
            </div>
        </section>
    );
}
