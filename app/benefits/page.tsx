import { getAllBenefits } from "@/lib/benefits";
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
    title: "Benefits — Why Teams Choose MonkFeed",
    description:
        "Discover the real benefits of MonkFeed: centralized feedback, free forever plan, data-driven product clarity, and privacy-first principles. Transform scattered feedback into product decisions that matter.",
    keywords: [
        "MonkFeed benefits",
        "customer feedback benefits",
        "feedback tool advantages",
        "centralized feedback",
        "free feedback software",
        "privacy focused feedback",
    ],
    authors: [{ name: "MonkFeed Team" }],
    openGraph: {
        title: "MonkFeed Benefits",
        description:
            "Transform scattered feedback into product decisions that matter.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "MonkFeed Benefits",
        description:
            "Transform scattered feedback into product decisions that matter.",
    },
    alternates: {
        canonical: "https://monkfeed.entrext.com/benefits",
    },
};

const whyChoose = [
    {
        title: "Lightning-Fast Widget",
        body: "Loads asynchronously so it never slows down your site or hurts your Core Web Vitals — capturing feedback without costing performance.",
    },
    {
        title: "Smart Prioritization",
        body: "Surfaces requests from your most engaged customers first, so you build what actually moves the needle instead of reacting to the loudest voice.",
    },
    {
        title: "Rich Threaded Discussions",
        body: "Users can comment and debate ideas directly on each request, giving your team the full context behind every piece of feedback.",
    },
    {
        title: "Analytics Dashboard",
        body: "Track trends, spot emerging demand, and measure sentiment over time — all in one focused dashboard built for product teams.",
    },
    {
        title: "Built-in Spam Protection",
        body: "Moderation tools keep your feedback board clean and actionable, filtering out noise so the signal stays clear.",
    },
    {
        title: "One-Line Embed",
        body: "Works with HTML, React, Next.js, and any other stack. Drop in one line of code and start collecting feedback in seconds.",
    },
    {
        title: "Fully Customizable",
        body: "Match your brand's colors, fonts, and style so the widget feels like a native part of your product, not a third-party intrusion.",
    },
    {
        title: "Dark Mode Ready",
        body: "The widget and dashboard both support dark mode out of the box — because we practice what we preach.",
    },
];

export default async function BenefitsPage() {
    const benefits = getAllBenefits();
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
                            MonkFeed Benefits
                        </h1>
                        <p className="text-xl text-zinc-600">
                            Transform scattered feedback into product decisions that matter.
                        </p>
                        <p className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-500">
                            MonkFeed is built around a simple idea: the teams that listen to their users win.
                            From a clutter-free dashboard to a free forever plan, every benefit is designed
                            to remove the friction between your customers and your roadmap.
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits grid */}
            <section className="bg-white py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                        {benefits.map((benefit) => (
                            <Link
                                key={benefit.slug}
                                href={`/benefits/${benefit.slug}`}
                                className="group relative flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                            >
                                <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(120deg,transparent,rgba(59,130,246,0.06),transparent)] opacity-0 transition duration-500 group-hover:opacity-100" />
                                <div className="relative z-10 flex h-full flex-col space-y-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-2xl transition-transform duration-300 group-hover:scale-110">
                                        {benefit.icon}
                                    </div>
                                    <h2 className="text-xl font-semibold text-zinc-900">
                                        {benefit.title}
                                    </h2>
                                    <p className="flex-1 text-sm leading-relaxed text-zinc-600">
                                        {benefit.tagline}
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

            {/* Why Teams Choose MonkFeed */}
            <section className="border-y border-zinc-200 bg-zinc-50 py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl space-y-4 text-center">
                        <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900">
                            Why Teams Choose MonkFeed
                        </h2>
                        <p className="text-lg text-zinc-600">
                            Everything you need to collect, prioritize, and act on feedback — in one lightweight widget.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {whyChoose.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
                            >
                                <h3 className="text-base font-semibold text-zinc-900">{item.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.body}</p>
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
                                Ready to Build Products Users Actually Want?
                            </h2>
                            <p className="mx-auto max-w-xl text-zinc-300">
                                Join 892+ teams already using MonkFeed to turn feedback into action.
                                No credit card required.
                            </p>
                            <div className="flex justify-center pt-2">
                                <Link
                                    href={session ? "/dashboard" : "/auth/signup"}
                                    className="rounded-full bg-white px-8 py-4 font-semibold text-zinc-900 shadow-lg transition-all hover:bg-zinc-200"
                                >
                                    {session ? "Go to Dashboard" : "Start Collecting Feedback Free"}
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
