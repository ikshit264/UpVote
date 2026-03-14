"use client";

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import HeroSection from '@/components/landing/hero-section';
import FeaturesGrid from '@/components/landing/features-grid';
import { motion, useScroll, useSpring } from 'framer-motion';
import { UserAccountNav } from '@/components/user-account-nav';
import { useSession } from 'next-auth/react';
import SupportSection from '@/components/landing/support-section';
import Footer from '@/components/landing/footer';

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

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 selection:bg-blue-100 selection:text-blue-900">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
            <Logo size={32} animated />
            <span className="hidden sm:inline">UpVote</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/blogs"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Blog
            </Link>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

            {isAuthenticated ? (
              <UserAccountNav />
            ) : (
              <>
                <Link href="#pricing">
                  <Button variant="ghost" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">Pricing</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-full px-6">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
        <HeroSection />
        <FeaturesGrid />
        <InteractiveDemo />
        <PricingSection />
        {/* <SupportSection /> */}

        {/* Call to Action Layer */}
        <section className="py-24 px-4 bg-zinc-950 dark:bg-zinc-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="container mx-auto text-center relative z-10 flex flex-col items-center"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white dark:text-zinc-950 mb-6 max-w-3xl mx-auto">
              Ready to build what your users actually want?
            </h2>
            <p className="text-zinc-400 dark:text-zinc-500 mb-10 text-xl font-medium max-w-xl mx-auto leading-relaxed">
              Join thousands of product teams collecting, prioritizing, and acting on feedback with UpVote.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="h-16 px-12 text-xl font-bold rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-soft transition-all hover:scale-[1.02] active:scale-[0.98]">
                Create Free Account
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Development Performance Monitor */}
      <PerformanceMonitor />
    </div>
  );
}
