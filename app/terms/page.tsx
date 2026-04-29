import React from 'react';
import Link from 'next/link';
import { Shield, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/landing/footer'), {
    loading: () => <div className="h-32 bg-zinc-100 dark:bg-zinc-900" />,
    ssr: true
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://upvote.entrext.com';

export const metadata = {
    title: 'Terms of Service | UpVote - Customer Feedback Platform',
    description: 'Read the terms and conditions for using UpVote. Understand our service agreement, user responsibilities, and legal framework for product feedback management.',
    openGraph: {
        title: 'Terms of Service - UpVote',
        description: 'The legal framework and terms governing your use of UpVote.',
        url: `${baseUrl}/terms`,
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Terms of Service - UpVote',
        description: 'The legal framework and terms governing your use of UpVote.',
    },
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100">
            <nav className="fixed top-0 left-0 right-0 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ChevronLeft className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
                        <span className="font-bold tracking-tight">UpVote</span>
                    </Link>
                    <Shield className="w-5 h-5 text-zinc-700" />
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Last updated: March 12, 2026</p>
                </div>

                <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">1. Agreement to Terms</h2>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            By accessing or using UpVote, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">2. Use of Service</h2>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            UpVote provides a platform for collecting and managing customer feedback. You are responsible for maintaining the security of your account and any content you post.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">3. User Content</h2>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Users are solely responsible for the content they submit. We reserve the right to remove any content that violates our community guidelines or these terms.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">4. Limitation of Liability</h2>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            UpVote shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">5. Changes to Terms</h2>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this site.
                        </p>
                    </section>
                </div>

                <div className="mt-20 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                    <Link href="/">
                        <Button variant="ghost" className="rounded-full">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
