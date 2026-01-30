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

export interface Blog {
    slug: string;
    title: string;
    description: string;
    image: string;
    date: string;
    author: string;
    category: string;
    content: string;
    metadata: BlogMetadata;
    faqs?: FAQ[];
}

export function getAllBlogs(): Blog[] {
    return blogsData as Blog[];
}

export function getBlogBySlug(slug: string): Blog | undefined {
    return (blogsData as Blog[]).find((blog) => blog.slug === slug);
}
