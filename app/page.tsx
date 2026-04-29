"use client";

import dynamic from 'next/dynamic';
import HeroSection from '@/components/landing/hero-section';
import Navbar from '@/components/landing/navbar';
import { useSession } from 'next-auth/react';
import { Section } from '@/components/ui/section';

// Lazy load heavy components with priority loading after initial content
const DashboardPreview = dynamic(() => import('@/components/landing/dashboard-preview'), {
  loading: () => (
    <div className="py-24 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-64 w-full max-w-4xl bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
      </div>
    </div>
  ),
  ssr: true
});

const InteractiveDemo = dynamic(() => import('@/components/landing/interactive-demo'), {
  loading: () => <div className="py-24 flex items-center justify-center">Loading...</div>,
  ssr: true
});

const PricingSection = dynamic(() => import('@/components/landing/pricing-section'), {
  loading: () => <div className="py-24 flex items-center justify-center">Loading...</div>,
  ssr: true
});

const FeaturesGrid = dynamic(() => import('@/components/landing/features-grid'), {
  loading: () => (
    <div className="py-24 flex items-center justify-center">
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
        ))}
      </div>
    </div>
  ),
  ssr: true
});

const FAQSection = dynamic(() => import('@/components/landing/faq-section'), {
  loading: () => <div className="py-24 flex items-center justify-center">Loading...</div>,
  ssr: true
});

const PerformanceMonitor = dynamic(() => import('@/components/performance-monitor'), {
  ssr: false
});

const Footer = dynamic(() => import('@/components/landing/footer'), {
  loading: () => <div className="h-32 bg-zinc-100 dark:bg-zinc-900"></div>,
  ssr: true
});



export default function HomePage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 selection:bg-zinc-100 selection:text-zinc-950">
      {/* Navigation Bar - Priority Load */}
      <Navbar />

      <main>
        {/* Hero Section - Priority Load */}
        <Section bg="bg-white" toColor="to-zinc-50">
          <HeroSection />
        </Section>
        
        {/* Dashboard Preview - Lazy Loaded */}
        <Section bg="bg-zinc-50" toColor="to-white">
          <DashboardPreview />
        </Section>
        
        {/* Features Grid - Lazy Loaded */}
        {/* <Section bg="bg-white" toColor="to-zinc-50"> */}
          <FeaturesGrid />
        {/* </Section> */}
        
        {/* Interactive Demo - Lazy Loaded */}
        {/* <Section bg="bg-zinc-50" toColor="bg-[#F8FAFC]"> */}
          <InteractiveDemo />
        {/* </Section> */}
        
        {/* Pricing Section - Lazy Loaded */}
        {/* <Section bg="bg-zinc-50" toColor="to-white"> */}
          <PricingSection />
        {/* </Section> */}

        <FAQSection />

      </main>

      {/* Footer - Lazy Loaded */}
      <Footer />

      {/* Development Performance Monitor */}
      <PerformanceMonitor />
    </div>
  );
}
