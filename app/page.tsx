"use client";

import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import HeroSection from '@/components/landing/hero-section';
import DashboardPreview from '@/components/landing/dashboard-preview';
import FeaturesGrid from '@/components/landing/features-grid';
import Navbar from '@/components/landing/navbar';
import { motion } from 'framer-motion';
import { UserAccountNav } from '@/components/user-account-nav';
import { useSession } from 'next-auth/react';
import Footer from '@/components/landing/footer';
import { Section } from '@/components/ui/section';

// Lazy load heavy components for better performance
const InteractiveDemo = dynamic(() => import('@/components/landing/interactive-demo'), {
  loading: () => <div className="py-24 flex items-center justify-center">Loading...</div>,
  ssr: true
});

const PricingSection = dynamic(() => import('@/components/landing/pricing-section'), {
  loading: () => <div className="py-24 flex items-center justify-center">Loading...</div>,
  ssr: true
});

const PerformanceMonitor = dynamic(() => import('@/components/performance-monitor'), {
  ssr: false
});



export default function HomePage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';



  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Bar */}
      <Navbar />

      <main>
        <Section bg="bg-white" toColor="to-zinc-50">
          <HeroSection />
        </Section>
        
        <Section bg="bg-zinc-50" toColor="to-white">
          <DashboardPreview />
        </Section>
        
        {/* <Section bg="bg-white" toColor="to-zinc-50"> */}
          <FeaturesGrid />
        {/* </Section> */}
        
        {/* <Section bg="bg-zinc-50" toColor="bg-[#F8FAFC]"> */}
          <InteractiveDemo />
        {/* </Section> */}
        
        {/* <Section bg="bg-zinc-50" toColor="to-white"> */}
          <PricingSection />
        {/* </Section> */}

      </main>

      {/* Footer */}
      <Footer />

      {/* Development Performance Monitor */}
      <PerformanceMonitor />
    </div>
  );
}
