import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://upvote.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'UpVote - Customer Feedback & Feature Voting Platform',
    template: '%s | UpVote'
  },
  description: 'The easiest way to collect, manage and prioritize customer feedback. Beautiful embeddable widgets for modern product teams. Boost engagement and build better products.',
  keywords: [
    'customer feedback', 'feature voting', 'product management', 'feedback widget',
    'roadmap prioritization', 'user feedback loop', 'product strategy', 'SaaS tools',
    'customer voice', 'feature requests', 'agile product management', 'embeddable widget'
  ],
  authors: [{ name: 'UpVote Team' }],
  creator: 'UpVote Inc.',
  publisher: 'UpVote Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'UpVote',
    title: 'UpVote - Customer Feedback & Feature Voting Platform',
    description: 'Collect customer feedback with a beautiful embeddable widget. Let your users upvote ideas and help you prioritize.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UpVote Platform Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UpVote - Customer Feedback & Feature Voting Platform',
    description: 'The easiest way to collect, manage and prioritize customer feedback.',
    images: ['/og-image.png'],
    creator: '@upvote',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'UpVote',
  url: baseUrl,
  logo: `${baseUrl}/icon.svg`,
  description: 'Customer feedback and feature voting platform for modern product teams.',
  sameAs: [
    'https://twitter.com/upvote',
    'https://github.com/upvote'
  ]
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'UpVote',
  url: baseUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${baseUrl}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
};

import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
          />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
