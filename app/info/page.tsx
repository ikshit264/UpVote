import React from 'react';
import Link from 'next/link';
import { Info, ChevronLeft, Globe, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://upvote.entrext.com';

export const metadata = {
    title: 'Platform Information | UpVote - Mission & Global Vision',
    description: 'Discover the story behind UpVote. Learn about our mission to democratize product feedback and our vision for transparent feature prioritization.',
    keywords: [
        'product mission', 'feature prioritization vision', 'UpVote information',
        'customer feedback platform', 'product roadmap transparency',
        'about UpVote', 'SaaS feedback tool', 'community-driven development'
    ],
    openGraph: {
        title: 'Platform Information - UpVote Mission',
        description: 'The mission and vision for the future of product feedback.',
        url: `${baseUrl}/info`,
        type: 'website',
    },
    alternates: {
        canonical: `${baseUrl}/info`,
    },
};

export default function InfoPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100">
            <nav className="fixed top-0 left-0 right-0 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ChevronLeft className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                        <span className="font-bold tracking-tight">UpVote</span>
                    </Link>
                    <Info className="w-5 h-5 text-blue-600" />
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
                <div className="space-y-4 mb-16">
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none px-3 py-1 text-xs">About Us</Badge>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Information Hub</h1>
                    <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Everything you need to know about the UpVote platform and our commitment to product excellence.
                    </p>
                </div>

                <div className="grid gap-12">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
                                <Globe className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold">Our Mission</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                To bridge the gap between product teams and their users by providing transparent, actionable feedback loops.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
                                <Zap className="w-6 h-6 text-yellow-500" />
                            </div>
                            <h3 className="text-xl font-bold">The Vision</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                Empowering teams to ship features that matter, backed by real user demand and prioritized data.
                            </p>
                        </div>
                    </div>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Users className="w-6 h-6 text-indigo-500" />
                            Who We Serve
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            UpVote is built for founders, product managers, and developers who value their users' input. We believe that the best products are built in collaboration with the people who use them every day.
                        </p>
                        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                            <p className="text-sm text-zinc-500 italic">
                                "Product development shouldn't be a guessing game. UpVote puts the power of prioritization back into the hands of the community."
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold">Platform Status</h2>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                            <span className="font-medium">All systems operational</span>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                            We maintain a 99.9% uptime to ensure your feedback collection never stops.
                        </p>
                    </section>
                </div>

                <div className="mt-20 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                    <Link href="/">
                        <Button variant="ghost" className="rounded-full">
                            Back to Home
                        </Button>
                    </Link>
                    <Link href="/auth/signup">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                            Join Us
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
            {children}
        </span>
    );
}
