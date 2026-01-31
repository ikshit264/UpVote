import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://upvote.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/dashboard/',
                '/api/',
                '/widget/',
                '/widget-loading',
                '/_next/',
                '/static/',
            ],
        },
        sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/feed.xml`],
    };
}
