"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowUp, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InteractiveDemo() {
    const [upvotes, setUpvotes] = useState(42);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [comments, setComments] = useState([
        { id: 1, text: "This would be a game changer for our workflow!", author: "Alice", time: "2h ago" },
        { id: 2, text: "Yes please! I've been waiting for this.", author: "Bob", time: "5h ago" },
    ]);

    const handleUpvote = () => {
        if (hasUpvoted) {
            setUpvotes((prev) => prev - 1);
            setHasUpvoted(false);
        } else {
            setUpvotes((prev) => prev + 1);
            setHasUpvoted(true);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setComments((prev) => [
            { id: Date.now(), text: inputValue, author: "You", time: "Just now" },
            ...prev,
        ]);
        setInputValue("");
    };

    return (
        <section className="py-24 px-4 overflow-hidden bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
            <div className="container mx-auto max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side: Explainer */}
                    <div className="space-y-8">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white"
                        >
                            Try it yourself.<br />
                            <span className="text-blue-600 dark:text-blue-500">It's that simple.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-zinc-600 dark:text-zinc-400"
                        >
                            Your users can upvote features, leave comments, and engage with your product roadmap without ever leaving your site.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">1</div>
                                <div>
                                    <h4 className="font-semibold">Embed with one line</h4>
                                    <p className="text-sm text-zinc-500">Copy-paste into any HTML, Next.js, or React app.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">2</div>
                                <div>
                                    <h4 className="font-semibold">Customize to match brand</h4>
                                    <p className="text-sm text-zinc-500">Colors, fonts, and styles are fully themeable.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Live Demo Widget */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full opacity-50" />
                        <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden w-full max-w-md mx-auto">
                            {/* Simulated Widget Header */}
                            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleUpvote}
                                        className={`cursor-pointer flex flex-col items-center justify-center w-12 h-14 rounded-lg border transition-all ${hasUpvoted
                                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30"
                                            : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-blue-300"
                                            }`}
                                    >
                                        <ArrowUp className={`w-5 h-5 ${hasUpvoted ? "translate-y-[-2px]" : ""}`} />
                                        <span className="text-xs font-bold">{upvotes}</span>
                                    </button>
                                    <div>
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Dark Mode Support</h3>
                                        <p className="text-sm text-zinc-500">Please add native dark mode support for the dashboard.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Simulated Comments */}
                            <div className="p-6 bg-white dark:bg-zinc-900 max-h-[300px] overflow-y-auto space-y-4">
                                {comments.map((comment) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={comment.id}
                                        className="flex gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-500 text-transform uppercase">
                                            {comment.author[0]}
                                        </div>
                                        <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg rounded-tl-none">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className="text-xs font-bold text-zinc-900 dark:text-white">{comment.author}</span>
                                                <span className="text-[10px] text-zinc-400">{comment.time}</span>
                                            </div>
                                            <p className="text-sm text-zinc-700 dark:text-zinc-300">{comment.text}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Simulated Input */}
                            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                                <form onSubmit={handleSubmit} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Leave a comment..."
                                        className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Button type="submit" size="icon" disabled={!inputValue.trim()}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
