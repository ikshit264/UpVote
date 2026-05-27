# MonkFeed Features Section — Design Spec

**Date:** 2026-05-28
**Status:** Approved (pending spec review)

## Goal

Add a Features section that mirrors the existing blog architecture: a `/features`
listing page plus an individual page per feature at `/features/[slug]`. There are
**7 features**, each with full marketing prose, a hero image, FAQs, and SEO metadata.

Styling matches the **light** homepage Features section
(`components/landing/features-grid.tsx`), *not* the dark blog pages — even though
the file/data structure mirrors the blog system.

## Decisions (from brainstorming)

- **Analytics & Trends:** gets its own (7th) detail page; content + meta written from scratch.
- **Theme:** light (zinc-50 backgrounds, white cards, blue spotlight), matching the landing Features grid.
- **Navbar:** repoint "Features" from the `#features` homepage anchor to `/features`.
- **Content depth:** full prose per section, comparable to existing blog posts.
- **FAQs:** included (3–4 per feature) for SEO parity with blogs.
- **Homepage `#features` grid:** left untouched.

## Architecture

Mirrors `lib/blogs.ts` / `lib/blogs.json` / `app/blogs/page.tsx` / `app/blogs/[slug]/page.tsx`.

### Data layer

**`lib/features.ts`** — types + accessors:
- `getAllFeatures(): Feature[]` — sorted by `order` ascending.
- `getFeatureBySlug(slug): Feature | undefined`.

**`lib/features.json`** — 7 entries.

```ts
interface FeatureMetadata { title: string; description: string; keywords: string; }
interface FAQ { question: string; answer: string; }
interface FeatureImage { src: string; alt: string; caption?: string; position?: 'before' | 'after'; }
interface FeatureSection { id?: string; heading?: string; content: string; images?: FeatureImage[]; }

interface Feature {
  slug: string;          // e.g. "lightning-speed"
  title: string;         // e.g. "Lightning Speed"
  tagline: string;       // short line for the grid card
  icon: string;          // emoji: 🚀 📊 💬 ⚙️ 🎨 🛡️ 📈
  image: string;         // /features/mf_01_lightning_speed.png
  imageAlt: string;
  order: number;         // grid + sort order
  metadata: FeatureMetadata;
  hero: { heading: string; subheading: string };  // detail-page H1 + lead
  sections: FeatureSection[];
  faqs?: FAQ[];
}
```

### Feature inventory (slug → image)

| order | title                | slug                  | icon | image                                   |
|-------|----------------------|-----------------------|------|-----------------------------------------|
| 1 | Lightning Speed          | `lightning-speed`         | 🚀 | `mf_01_lightning_speed.png`            |
| 2 | Smart Prioritization     | `smart-prioritization`    | 📊 | `mf_02_smart_prioritization_v2.png`    |
| 3 | Rich Discussions         | `rich-discussions`        | 💬 | `mf_03_rich_discussions_v2.png`        |
| 4 | One-Line Code Embed      | `one-line-code-embed`     | ⚙️ | `mf_04_one-line_embed_v2.png`          |
| 5 | Full Customization       | `full-customization`      | 🎨 | `mf_05_customization.png`              |
| 6 | Spam Protection          | `spam-protection`         | 🛡️ | `mf_06_spam_protection.png`            |
| 7 | Analytics & Trends       | `analytics-and-trends`    | 📈 | `mf_07_analytics_and_trends.png`       |

Images copied from `C:\Users\ikshi\Downloads\Features-20260527T183405Z-3-001\Features`
into `public/features/`.

### Listing page — `app/features/page.tsx` (light)

Static page (no client interactivity required beyond Navbar). Sections top to bottom:

1. **Navbar**
2. **Hero** — "MonkFeed Features" / "Everything you need to collect, analyze, and act on customer feedback" + the "Build Better Products with Customer-Centric Feedback" intro paragraph.
3. **Feature grid** — 7 cards (emoji + title + tagline) from `getAllFeatures()`, each linking to `/features/[slug]`. Card hover/elevation consistent with `features-grid.tsx`.
4. **Why Choose MonkFeed?** — 6 blocks (For SaaS Teams, For Mobile Apps, For Fintech Platforms, Lightning Performance, Data-Driven Decisions, Easy Implementation). Static content hardcoded in the page.
5. **CTA band** — "Start Collecting Customer Feedback Today" + **Get Started Free** button → `/dashboard` if authenticated, else `/auth/signup`.
6. **Footer**

`metadata` export: title/description targeting "MonkFeed Features", canonical `/features`.

### Detail page — `app/features/[slug]/page.tsx` (light)

Mirrors `app/blogs/[slug]/page.tsx` structure, light-themed:

- `generateStaticParams()` from `getAllFeatures()`.
- `generateMetadata()` from `feature.metadata` (provided meta titles/descriptions), canonical `/features/[slug]`, openGraph/twitter with hero image.
- Layout: Navbar → "← Back to all features" → Hero (emoji + `title` as eyebrow/badge + `hero.heading` as H1 + `hero.subheading` as lead + hero image) → prose `sections` (markdown via `react-markdown`, with optional section images) → FAQ section → CTA band → Footer.
  - Note: `title`/`tagline` are the grid-card fields; `hero.heading`/`hero.subheading` are the longer detail-page headline + lead (e.g. heading "Feedback Collection That Doesn't Slow Your Site Down"). The detail hero uses both — `title` as a small eyebrow and `hero.heading` as the H1.
- JSON-LD scripts: `BreadcrumbList` (Home → Features → feature) and `FAQPage` (when faqs present). (Blog uses `BlogPosting`; features have no article semantics, so we omit that and rely on Breadcrumb + FAQ.)
- `notFound()` when slug unknown.

### Content

Full prose written for all 7 features from the provided outlines. Each feature's
`sections` follow its outline bullets (e.g. Lightning Speed: performance concerns →
how MonkFeed solves it → real metrics → use cases → quick start). Analytics & Trends
content + meta authored from scratch to match the other six. 3–4 FAQs per feature.

### Wiring

- **`components/landing/navbar.tsx`** — change the three "Features" links (desktop nav, mobile inline nav, mobile overlay) from `href="#features"` to `href="/features"`.
- **`components/landing/footer.tsx`** — add a "Features" link (`/features`) under Quick Links.
- **`app/sitemap.ts`** — add `/features` (priority ~0.8) and one entry per feature (priority ~0.7), mirroring the blog entries logic via `getAllFeatures()`.

## Out of scope

- Changing the homepage `#features` grid section.
- Social media post generation (the source doc mentions it; not a website concern).
- Newsletter / interactive widgets on feature pages.

## Verification

- `npm run build` (or `next build`) succeeds; all 7 `/features/[slug]` routes statically generated.
- `/features` renders 7 cards, each navigating to the correct detail page.
- Navbar + footer "Features" links resolve to `/features`.
- Sitemap includes `/features` and all 7 feature URLs.
