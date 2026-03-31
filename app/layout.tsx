import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://upvote.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "UpVote - Customer Feedback & Feature Voting Platform",
    template: "%s | UpVote Blog",
  },
  description:
    "The easiest way to collect, manage and prioritize customer feedback. Beautiful embeddable widgets for modern product teams. Boost engagement and build better products.",
  keywords: [
    "customer feedback",
    "feature voting",
    "product management",
    "feedback widget",
    "roadmap prioritization",
    "user feedback loop",
    "product strategy",
    "SaaS tools",
    "customer voice",
    "feature requests",
    "agile product management",
    "embeddable widget",
  ],
  authors: [{ name: "UpVote Team" }],
  creator: "UpVote Inc.",
  publisher: "UpVote Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "UpVote",
    title: "UpVote - Customer Feedback & Feature Voting Platform",
    description:
      "The easiest way to collect, manage and prioritize customer feedback. Beautiful embeddable widgets for modern product teams. Boost engagement and build better products.",
    images: [
      {
        url: "/favicon.png",
        width: 1200,
        height: 630,
        alt: "UpVote Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UpVote - Customer Feedback & Feature Voting Platform",
    description:
      "The easiest way to collect, manage and prioritize customer feedback. Beautiful embeddable widgets for modern product teams. Boost engagement and build better products.",
    images: ["/favicon.png"],
    creator: "@upvote",
  },
  icons: {
    icon: [
      {
        url: "/favicon.png",
      },
    ],
    apple: [
      {
        url: "/favicon.png",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": 0,
      "max-image-preview": "none",
      "max-snippet": 0,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UpVote",
  url: baseUrl,
  logo: `${baseUrl}/favicon.png`,
  description:
    "Customer feedback and feature voting platform for modern product teams.",
  sameAs: ["https://twitter.com/upvote", "https://github.com/upvote"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "UpVote",
  url: baseUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${baseUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

import { Providers } from "@/components/providers";
import { MotionProvider } from "@/components/motion-provider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="efUycTJ4YvHHMa3xrsLYYR3BZJuH0ARf_XlVLMNykLo" />
        <script
          async
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NNR59M22');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NNR59M22"
          height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe></noscript>
        <Providers>
          <MotionProvider>
            {children}
            <Toaster position="top-center" richColors />
          </MotionProvider>
        </Providers>
      </body>
    </html>
  );
}
