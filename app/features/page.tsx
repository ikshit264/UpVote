import { getAllFeatures } from "@/lib/features";
import Link from "next/link";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/landing/navbar";

const Footer = dynamic(() => import("@/components/landing/footer"), {
    loading: () => <div className="h-32 bg-zinc-50" />,
    ssr: true,
});

export const metadata: Metadata = {
    title: "Features — Collect, Analyze & Act on Customer Feedback",
    description:
        "Everything you need to collect, analyze, and act on customer feedback. Lightning-fast widget, smart prioritization, rich discussions, one-line embed, full customization, spam protection, and analytics.",
    keywords: [
        "customer feedback features",
        "feedback widget",
        "feature prioritization",
        "feedback analytics",
        "MonkFeed features",
    ],
    authors: [{ name: "MonkFeed Team" }],
    openGraph: {
        title: "MonkFeed Features",
        description:
            "Everything you need to collect, analyze, and act on customer feedback.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "MonkFeed Features",
        description:
            "Everything you need to collect, analyze, and act on customer feedback.",
    },
    alternates: {
        canonical: "https://monkfeed.entrext.com/features",
    },
};

const reasons = [
    {
        title: "For SaaS Teams",
        body: "Collect feature requests from your most engaged users and build your product roadmap based on real customer demand and validated feedback.",
    },
    {
        title: "For Mobile Apps",
        body: "Embed lightweight feedback collection directly in your app. Understand user behavior and improve onboarding flows with actionable insights.",
    },
    {
        title: "For Fintech Platforms",
        body: "Secure feedback collection with built-in moderation and spam protection. Keep your insights clean while maintaining user trust and compliance.",
    },
    {
        title: "Lightning Performance",
        body: "Minimal performance impact on your website. Your Core Web Vitals stay intact while you capture every customer insight.",
    },
    {
        title: "Data-Driven Decisions",
        body: "Transform raw feedback into product decisions faster. Our analytics dashboard helps product teams identify trends and prioritize features.",
    },
    {
        title: "Easy Implementation",
        body: "No complex integrations required. Add one line of code and start collecting feedback in seconds. Works with any tech stack.",
    },
];

export default async function FeaturesPage() {
    const features = getAllFeatures();
    const session = await getServerSession(authOptions);

    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-blue-500/20">
            <Navbar />

            {/* Hero */}
            <section className="relative overflow-hidden bg-zinc-50 pt-32 pb-20">
                <div className="absolute inset-0 opacity-[0.35]">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:70px_70px]" />
                </div>
                <div className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18),transparent_60%)] blur-3xl" />

                <div className="container relative z-10 mx-auto px-4">
                    <div className="mx-auto max-w-3xl space-y-6 text-center">
                        <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 md:text-6xl">
                            MonkFeed Features
                        </h1>
                        <p className="text-xl text-zinc-600">
                            Everything you need to collect, analyze, and act on customer feedback.
                        </p>
                        <p className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-500">
                            MonkFeed provides a complete suite of tools designed specifically for SaaS teams,
                            mobile apps, and fintech platforms. Our lightweight, embeddable feedback widget turns
                            passive users into active contributors, helping you prioritize improvements and build
                            what users actually want.
                        </p>
                    </div>
                </div>
            </section>

            {/* Feature grid */}
            <section className="bg-white py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <Link
                                key={feature.slug}
                                href={`/features/${feature.slug}`}
                                className="group relative flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                            >
                                <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(120deg,transparent,rgba(59,130,246,0.06),transparent)] opacity-0 transition duration-500 group-hover:opacity-100" />
                                <div className="relative z-10 flex h-full flex-col space-y-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-2xl transition-transform duration-300 group-hover:scale-110">
                                        {feature.icon}
                                    </div>
                                    <h2 className="text-xl font-semibold text-zinc-900">
                                        {feature.title}
                                    </h2>
                                    <p className="flex-1 text-sm leading-relaxed text-zinc-600">
                                        {feature.tagline}
                                    </p>
                                    <div className="flex items-center pt-2 text-sm font-medium text-blue-600 transition-transform group-hover:translate-x-1">
                                        Learn more
                                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose MonkFeed */}
            <section className="border-y border-zinc-200 bg-zinc-50 py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl space-y-4 text-center">
                        <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900">
                            Why Choose MonkFeed?
                        </h2>
                        <p className="text-lg text-zinc-600">
                            Build better products with customer-centric feedback — from collection to roadmap.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {reasons.map((reason) => (
                            <div
                                key={reason.title}
                                className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
                            >
                                <h3 className="text-lg font-semibold text-zinc-900">{reason.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{reason.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-white py-24">
                <div className="container mx-auto px-4">
                    <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] bg-zinc-900 px-8 py-16 text-center shadow-xl md:px-12">
                        <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-blue-500/20 blur-[80px]" />
                        <div className="relative z-10 space-y-6">
                            <h2 className="text-3xl font-bold text-white md:text-4xl">
                                Start Collecting Customer Feedback Today
                            </h2>
                            <p className="mx-auto max-w-xl text-zinc-300">
                                Join SaaS teams and mobile app developers who are building better products with
                                MonkFeed. No credit card required.
                            </p>
                            <div className="flex justify-center pt-2">
                                <Link
                                    href={session ? "/dashboard" : "/auth/signup"}
                                    className="rounded-full bg-white px-8 py-4 font-semibold text-zinc-900 shadow-lg transition-all hover:bg-zinc-200"
                                >
                                    {session ? "Go to Dashboard" : "Get Started Free"}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
