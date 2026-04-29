"use client";

import { m } from "framer-motion";
import { useState } from "react";
import { ArrowUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InteractiveDemo() {
    const [upvotes, setUpvotes] = useState(42);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [comments, setComments] = useState([
        { id: 1, text: "This would be a game changer for our workflow!", author: "Jenila", time: "2h ago" },
        { id: 2, text: "Yes please! I've been waiting for this.", author: "James", time: "5h ago" },
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
        <section id="demo" className="py-24 px-4 overflow-hidden bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
            <div className="container mx-auto max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side: Explainer */}
                    <div className="space-y-8">
                        <m.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white"
                        >
                            Try it live.<br />
                            <span className="text-zinc-700 dark:text-zinc-500">Embed it in seconds.</span>
                        </m.h2>
                        <m.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-zinc-600 dark:text-zinc-400"
                        >
                            Your users can upvote features, leave comments, and engage with your product roadmap without ever leaving your site.
                        </m.p>

                        <m.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-950/30 flex items-center justify-center text-zinc-700 dark:text-zinc-400 font-bold">1</div>
                                <div>
                                    <p className="font-semibold text-zinc-900 dark:text-white">Embed with one line of code.</p>
                                    <p className="text-sm text-zinc-500">Works with HTML, Next.js, React, and more.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-950/30 flex items-center justify-center text-zinc-700 dark:text-zinc-400 font-bold">2</div>
                                <div>
                                    <p className="font-semibold text-zinc-900 dark:text-white">Fully customizable</p>
                                    <p className="text-sm text-zinc-500">Match your brand with colors, fonts, and styles.</p>
                                </div>
                            </div>
                        </m.div>
                    </div>

                    {/* Right Side: Live Demo Widget */}
                    <m.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-zinc-500/20 blur-3xl rounded-full opacity-50" />
                        <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden w-full max-w-md mx-auto">
                            {/* Simulated Widget Header */}
                            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleUpvote}
                                        aria-label={hasUpvoted ? "Remove upvote from feature request" : "Upvote feature request"}
                                        aria-pressed={hasUpvoted}
                                        className={`cursor-pointer flex flex-col items-center justify-center w-12 h-14 rounded-lg border transition-all ${hasUpvoted
                                            ? "bg-zinc-700 border-zinc-700 text-white shadow-lg shadow-zinc-500/30"
                                            : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-300"
                                            }`}
                                    >
                                        <ArrowUp className={`w-5 h-5 ${hasUpvoted ? "translate-y-[-2px]" : ""}`} />
                                        <span className="text-xs font-bold">{upvotes}</span>
                                    </button>
                                    <div>
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Dark Mode Ready</h3>
                                        <p className="text-sm text-zinc-500">Please add native dark mode support for the dashboard.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Simulated Comments */}
                            <div className="p-6 bg-white dark:bg-zinc-900 max-h-[300px] overflow-y-auto space-y-4">
                                {comments.map((comment) => (
                                    <m.div
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
                                    </m.div>
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
                                        className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                                    />
                                    <Button type="submit" size="icon" aria-label="Submit comment" disabled={!inputValue.trim()}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </m.div>
                </div>
            </div>
        </section>
    );
}
