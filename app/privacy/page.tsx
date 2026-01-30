import React from 'react';
import Link from 'next/link';
import { Shield, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://upvote.entrext.com';

export const metadata = {
    title: 'Privacy Policy | UpVote - Data Protection & User Privacy',
    description: 'Read the UpVote Privacy Policy. Learn how we handle customer feedback data, protect user identity, and maintain transparency in product prioritization.',
    keywords: [
        'privacy policy', 'data protection', 'GDPR compliance', 'user privacy',
        'feedback data safety', 'secure voting system', 'UpVote privacy',
        'customer data handling', 'product management security', 'SaaS privacy'
    ],
    openGraph: {
        title: 'Privacy Policy - UpVote Platform',
        description: 'How we protect your data while you build better products.',
        url: `${baseUrl}/privacy`,
        type: 'website',
    },
    alternates: {
        canonical: `${baseUrl}/privacy`,
    },
};

export default function PrivacyPage() {
    const lastUpdated = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100">
            <nav className="fixed top-0 left-0 right-0 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ChevronLeft className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                        <span className="font-bold tracking-tight">UpVote</span>
                    </Link>
                    <Shield className="w-5 h-5 text-blue-600" />
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
                <div className="space-y-2 mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Last updated: {lastUpdated}</p>
                </div>

                <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">1. Introduction</h2>
                        <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                            Welcome to UpVote. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website or use our feedback widget.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">2. Data We Collect</h2>
                        <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                            We collect information that you provides directly to us when you create an account, such as your name, email address, and company details. When you use our widget, we collect feedback content and voting data.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
                            <li>Identity Data: Name, company name.</li>
                            <li>Contact Data: Email address.</li>
                            <li>Usage Data: Information about how you use our website or widget.</li>
                            <li>Technical Data: IP address, browser type, and version.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">3. How We Use Your Data</h2>
                        <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                            We use your data to provide our services, manage your account, and improve our product. Specifically:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
                            <li>To register you as a new customer.</li>
                            <li>To provide and maintain our Service.</li>
                            <li>To notify you about changes to our Service.</li>
                            <li>To provide customer support.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">4. Data Security</h2>
                        <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">5. Contact Us</h2>
                        <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                            If you have any questions about this privacy policy, please contact us at <span className="text-blue-600 font-medium">privacy@upvote.com</span>.
                        </p>
                    </section>
                </div>

                <div className="mt-20 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                    <Link href="/">
                        <Button variant="outline" className="rounded-full">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
