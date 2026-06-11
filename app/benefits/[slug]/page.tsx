import { getBenefitBySlug, getAllBenefits, type BenefitImage, type BenefitSection } from "@/lib/benefits";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Footer from "@/components/landing/footer";
import Navbar from "@/components/landing/navbar";

function slugifyHeading(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

function BenefitFigure({ image }: { image: BenefitImage }) {
    return (
        <figure className="my-10 not-prose">
            <div className="relative w-full overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 shadow-md">
                <Image
                    src={image.src}
                    alt={image.alt}
                    title={image.title || image.alt}
                    width={image.width || 1600}
                    height={image.height || 900}
                    className="h-auto w-full object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                />
            </div>
            {image.caption && (
                <figcaption className="mt-3 px-4 text-center text-sm italic text-zinc-500">
                    {image.caption}
                </figcaption>
            )}
        </figure>
    );
}

function SectionImages({ images, position }: { images?: BenefitImage[]; position: "before" | "after" }) {
    if (!images || images.length === 0) return null;
    const filtered = images.filter((img) => (img.position || "after") === position);
    if (filtered.length === 0) return null;
    return (
        <div className={filtered.length > 1 ? "my-10 grid grid-cols-1 gap-6 sm:grid-cols-2" : ""}>
            {filtered.map((img, idx) => (
                <BenefitFigure key={`${position}-${idx}-${img.src}`} image={img} />
            ))}
        </div>
    );
}

interface Props {
    params: { slug: string };
}

export async function generateStaticParams() {
    const benefits = getAllBenefits();
    return benefits.map((benefit) => ({ slug: benefit.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const benefit = getBenefitBySlug(slug);

    if (!benefit) {
        return { title: "Benefit Not Found | MonkFeed" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://monkfeed.entrext.com";

    return {
        title: benefit.metadata.title,
        description: benefit.metadata.description,
        keywords: benefit.metadata.keywords,
        authors: [{ name: "MonkFeed Team" }],
        openGraph: {
            title: benefit.metadata.title,
            description: benefit.metadata.description,
            images: [benefit.image],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: benefit.metadata.title,
            description: benefit.metadata.description,
            images: [benefit.image],
        },
        alternates: {
            canonical: `${baseUrl}/benefits/${slug}`,
        },
    };
}

export default async function BenefitDetailPage({ params }: Props) {
    const { slug } = await params;
    const benefit = getBenefitBySlug(slug);
    const session = await getServerSession(authOptions);

    if (!benefit) {
        notFound();
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://monkfeed.entrext.com";

    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-blue-500/20">
            <Navbar />

            {benefit.faqs && benefit.faqs.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            mainEntity: benefit.faqs.map((faq) => ({
                                "@type": "Question",
                                name: faq.question,
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: faq.answer,
                                },
                            })),
                        }),
                    }}
                />
            )}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        itemListElement: [
                            { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
                            { "@type": "ListItem", position: 2, name: "Benefits", item: `${baseUrl}/benefits` },
                            { "@type": "ListItem", position: 3, name: benefit.title, item: `${baseUrl}/benefits/${benefit.slug}` },
                        ],
                    }),
                }}
            />

            {/* Header */}
            <header className="relative overflow-hidden bg-zinc-50 pt-32 pb-16">
                <div className="absolute inset-0 opacity-[0.35]">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:70px_70px]" />
                </div>
                <div className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16),transparent_60%)] blur-3xl" />

                <div className="container relative z-10 mx-auto px-4">
                    <div className="mx-auto max-w-4xl space-y-8">
                        <Link
                            href="/benefits"
                            className="group inline-flex items-center text-zinc-500 transition-colors hover:text-zinc-900"
                        >
                            <svg className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                            Back to all benefits
                        </Link>

                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 shadow-sm">
                                <span className="text-base">{benefit.icon}</span>
                                {benefit.title}
                            </div>
                            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 md:text-5xl">
                                {benefit.hero.heading}
                            </h1>
                            <p className="max-w-2xl text-lg leading-relaxed text-zinc-600">
                                {benefit.hero.subheading}
                            </p>
                        </div>

                        <div className="relative aspect-[9/4] overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-50 shadow-xl">
                            <Image
                                src={benefit.image}
                                alt={benefit.imageAlt || benefit.title}
                                title={benefit.imageAlt || benefit.title}
                                fill
                                className="object-contain"
                                priority
                                sizes="(max-width: 1024px) 100vw, 1024px"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="pb-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl">
                        <article className="prose prose-zinc prose-lg max-w-none
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-900
              prose-p:text-zinc-600 prose-p:leading-relaxed
              prose-strong:text-zinc-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-li:text-zinc-600
              prose-code:text-zinc-800 prose-code:before:content-[''] prose-code:after:content-['']
              prose-img:rounded-3xl prose-img:border prose-img:border-zinc-200
            ">
                            {benefit.sections.map((section: BenefitSection, idx: number) => {
                                const sectionId = section.id || (section.heading ? slugifyHeading(section.heading) : `section-${idx}`);
                                return (
                                    <section key={sectionId} id={sectionId} className="scroll-mt-24">
                                        {section.heading && (
                                            <h2 className="mt-12 mb-6 text-3xl font-bold text-zinc-900 md:text-4xl">
                                                {section.heading}
                                            </h2>
                                        )}
                                        <SectionImages images={section.images} position="before" />
                                        <ReactMarkdown>{section.content}</ReactMarkdown>
                                        <SectionImages images={section.images} position="after" />
                                    </section>
                                );
                            })}
                        </article>

                        {/* FAQ */}
                        {benefit.faqs && benefit.faqs.length > 0 && (
                            <section className="mt-20 space-y-8">
                                <h2 className="border-b border-zinc-200 pb-4 text-3xl font-bold text-zinc-900">
                                    Frequently Asked Questions
                                </h2>
                                <div className="space-y-6">
                                    {benefit.faqs.map((faq, index) => (
                                        <div key={index} className="space-y-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                                            <h3 className="text-xl font-semibold text-zinc-900">{faq.question}</h3>
                                            <p className="leading-relaxed text-zinc-600">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CTA */}
                        <div className="relative mt-20 overflow-hidden rounded-[2.5rem] bg-zinc-900 p-10 shadow-xl">
                            <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-blue-500/20 blur-[80px]" />
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-3xl font-bold text-white">Ready to experience {benefit.title}?</h3>
                                <p className="text-lg text-zinc-300">
                                    Join hundreds of early-stage SaaS teams who use MonkFeed to build better products, faster.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    <Link
                                        href={session ? "/dashboard" : "/auth/signup"}
                                        className="rounded-full bg-white px-8 py-4 font-semibold text-zinc-900 shadow-lg transition-all hover:bg-zinc-200"
                                    >
                                        {session ? "Go to Dashboard" : "Start Free Trial"}
                                    </Link>
                                    <Link
                                        href="/benefits"
                                        className="rounded-full border border-zinc-700 px-8 py-4 font-semibold text-white transition-all hover:bg-zinc-800"
                                    >
                                        Explore all benefits
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
