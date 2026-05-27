import { MetadataRoute } from 'next';
import { getAllBlogs } from '@/lib/blogs';
import { getAllFeatures } from '@/lib/features';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://monkfeed.entrext.com';
    const blogs = getAllBlogs();
    const features = getAllFeatures();

    const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
        url: `${baseUrl}/blogs/${blog.slug}`,
        lastModified: new Date(blog.date),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    const featureEntries: MetadataRoute.Sitemap = features.map((feature) => ({
        url: `${baseUrl}/features/${feature.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blogs`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/features`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/info`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        ...featureEntries,
        ...blogEntries,
    ];
}
