import { getAllBlogs } from "@/lib/blogs";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Upvote Blog | Product Management, Feedback & Growth",
    description: "Expert insights on product management, customer feedback automation, and scaling your B2B SaaS. Read the latest from the Upvote team.",
    keywords: ["product management blog", "customer feedback strategies", "SaaS growth tips", "feature prioritization", "Upvote"],
    authors: [{ name: "Upvote Team" }],
    openGraph: {
        title: "Upvote Blog | Product Management & Growth",
        description: "Expert insights on product management, customer feedback automation, and scaling your B2B SaaS.",
        type: "website",
    },
    alternates: {
        canonical: "https://upvote.entrext.com/blogs",
    },
};

export default function BlogsPage() {
    const blogs = getAllBlogs();

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-blue-500/30">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white to-white/50">
                            The Upvote Blog
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Insights, guides, and strategies to help you build products users love and automate your feedback loop.
                        </p>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="pb-32">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog, index) => (
                            <Link
                                key={blog.slug}
                                href={`/blogs/${blog.slug}`}
                                className="group block relative bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden hover:bg-zinc-800/50 transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/30"
                            >
                                <div className="relative aspect-16/10 overflow-hidden">
                                    <Image
                                        src={blog.image}
                                        alt={blog.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 text-xs font-medium bg-blue-600/90 text-white rounded-full backdrop-blur-sm">
                                            {blog.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-zinc-500">
                                        <span>{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                        <span>{blog.author}</span>
                                    </div>

                                    <h2 className="text-2xl font-bold text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {blog.title}
                                    </h2>

                                    <p className="text-zinc-400 line-clamp-3 leading-relaxed">
                                        {blog.description}
                                    </p>

                                    <div className="pt-4 flex items-center text-blue-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                        Read more
                                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 bg-zinc-900/30 border-y border-zinc-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto p-8 md:p-12 rounded-[2.5rem] bg-linear-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 relative overflow-hidden text-center space-y-8">
                        <div className="relative z-10 space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold">Never miss an update</h2>
                            <p className="text-zinc-400 max-w-md mx-auto">Get the latest product management insights and Upvote news delivered to your inbox.</p>

                            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-6 py-4 rounded-2xl bg-zinc-900/80 border border-zinc-700 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                                <button className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 font-semibold transition-all shadow-lg shadow-blue-600/20">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
