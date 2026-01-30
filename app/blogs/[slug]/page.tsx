import { getBlogBySlug, getAllBlogs } from "@/lib/blogs";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Props {
    params: { slug: string };
}

export async function generateStaticParams() {
    const blogs = getAllBlogs();
    return blogs.map((blog) => ({
        slug: blog.slug,
    }));
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const blog = getBlogBySlug(slug);

    if (!blog) {
        return {
            title: "Blog Not Found | Upvote",
        };
    }

    return {
        title: blog.metadata.title,
        description: blog.metadata.description,
        keywords: blog.metadata.keywords,
        authors: [{ name: blog.author }],
        openGraph: {
            title: blog.metadata.title,
            description: blog.metadata.description,
            images: [blog.image],
            type: "article",
            publishedTime: blog.date,
            authors: [blog.author],
        },
        twitter: {
            card: "summary_large_image",
            title: blog.metadata.title,
            description: blog.metadata.description,
            images: [blog.image],
        },
    };
}

export default async function BlogDetailPage({ params }: Props) {
    const { slug } = await params;
    const blog = getBlogBySlug(slug);
    const session = await getServerSession(authOptions);

    if (!blog) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-blue-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": blog.title,
                        "description": blog.description,
                        "image": [`${process.env.NEXT_PUBLIC_APP_URL}${blog.image}`],
                        "datePublished": blog.date,
                        "author": [{
                            "@type": "Organization",
                            "name": "Upvote",
                            "url": process.env.NEXT_PUBLIC_APP_URL
                        }]
                    })
                }}
            />
            {blog.faqs && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": blog.faqs.map(faq => ({
                                "@type": "Question",
                                "name": faq.question,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": faq.answer
                                }
                            }))
                        })
                    }}
                />
            )}
            {/* Article Header */}
            <header className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <Link
                            href="/blogs"
                            className="inline-flex items-center text-zinc-400 hover:text-white transition-colors group"
                        >
                            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                            Back to all blogs
                        </Link>

                        <div className="space-y-4">
                            <span className="px-3 py-1 text-xs font-medium bg-blue-600/90 text-white rounded-full">
                                {blog.category}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-white">
                                {blog.title}
                            </h1>
                            <div className="flex items-center gap-4 text-zinc-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-blue-400 border border-zinc-700">
                                        UT
                                    </div>
                                    <span className="font-medium text-zinc-200">{blog.author}</span>
                                </div>
                                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                <span>{new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>

                        <div className="relative aspect-21/9 rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl">
                            <Image
                                src={blog.image}
                                alt={blog.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Article Content */}
            <main className="pb-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <article className="prose prose-invert prose-zinc prose-lg max-w-none 
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
              prose-p:text-zinc-400 prose-p:leading-relaxed
              prose-strong:text-zinc-200 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-3xl prose-img:border prose-img:border-zinc-800
              prose-hr:border-zinc-800
              prose-blockquote:border-l-blue-600 prose-blockquote:bg-zinc-900/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:text-zinc-300
            ">
                            <ReactMarkdown>{blog.content}</ReactMarkdown>
                        </article>

                        {/* FAQ Section */}
                        {blog.faqs && blog.faqs.length > 0 && (
                            <section className="mt-20 space-y-8">
                                <h2 className="text-3xl font-bold border-b border-zinc-800 pb-4">Frequently Asked Questions</h2>
                                <div className="space-y-6">
                                    {blog.faqs.map((faq, index) => (
                                        <div key={index} className="space-y-2 p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                                            <h3 className="text-xl font-semibold text-zinc-100">{faq.question}</h3>
                                            <p className="text-zinc-400 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CTA Section */}
                        <div className="mt-20 p-10 rounded-[2.5rem] bg-zinc-900/50 border border-zinc-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-colors" />
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-3xl font-bold">Ready to automate your feedback loop?</h3>
                                <p className="text-zinc-400 text-lg">Join hundreds of early-stage SaaS teams who use Upvote to build better products, faster.</p>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    {session ? (
                                        <Link
                                            href="/dashboard"
                                            className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 font-semibold transition-all shadow-lg shadow-blue-600/20"
                                        >
                                            Go to Dashboard
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/auth/signup"
                                            className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 font-semibold transition-all shadow-lg shadow-blue-600/20"
                                        >
                                            Start Free Trial
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
