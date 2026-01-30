"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function SupportSection() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !message) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/support", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, message }),
            });

            if (!response.ok) throw new Error("Failed to submit");

            setIsSubmitted(true);
            toast.success("Message sent successfully!");
            setEmail("");
            setMessage("");
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-24 px-4 bg-white dark:bg-zinc-950">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Left Side: Message Area */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                                Need Help? We're Here.
                            </h2>
                            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                                Have questions or feedback? Drop us a message and we'll get back to you as soon as possible.
                            </p>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                            <div className="relative">
                                <Textarea
                                    placeholder="Your message..."
                                    className="min-h-[200px] bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    disabled={isLoading || isSubmitted}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Email & Send Button */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8 md:pt-20"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                                <div className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <span className="text-lg">ikshit.talera@gmail.com</span>
                            </div>

                            <div className="space-y-4 pt-4">
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="h-14 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-full px-6 text-lg focus:ring-2 focus:ring-blue-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading || isSubmitted}
                                />

                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading || isSubmitted}
                                    className="w-full h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group transition-all"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : isSubmitted ? (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            Sent
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {isSubmitted && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center text-green-600 dark:text-green-400 font-medium"
                            >
                                Thanks! We've received your message.
                            </motion.p>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
