import { getAllBlogs } from "@/lib/blogs";

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://upvote.entrext.com';
    const blogs = getAllBlogs();

    const feedItems = blogs
        .map((blog) => `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${baseUrl}/blogs/${blog.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blogs/${blog.slug}</guid>
      <description><![CDATA[${blog.description}]]></description>
      <pubDate>${new Date(blog.date).toUTCString()}</pubDate>
      <author>${blog.author}</author>
      <category>${blog.category}</category>
    </item>`)
        .join("");

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Upvote Blog</title>
    <link>${baseUrl}/blogs</link>
    <description>Expert insights on product management, customer feedback automation, and scaling your B2B SaaS.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${feedItems}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "s-maxage=3600, stale-while-revalidate",
        },
    });
}
