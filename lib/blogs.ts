import blogsData from './blogs.json';

export interface BlogMetadata {
    title: string;
    description: string;
    keywords: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface BlogImage {
    src: string;
    alt: string;
    caption?: string;
    title?: string;
    width?: number;
    height?: number;
    position?: 'before' | 'after';
}

export interface BlogSection {
    id?: string;
    heading?: string;
    content: string;
    images?: BlogImage[];
}

export interface Blog {
    slug: string;
    title: string;
    description: string;
    image: string;
    imageAlt?: string;
    date: string;
    author: string;
    category: string;
    content?: string;
    sections?: BlogSection[];
    metadata: BlogMetadata;
    faqs?: FAQ[];
}

export function getAllBlogs(): Blog[] {
    return (blogsData as Blog[])
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogBySlug(slug: string): Blog | undefined {
    return (blogsData as Blog[]).find((blog) => blog.slug === slug);
}
