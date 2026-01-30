"use client";

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import AnimatedLogo from '@/components/animated-logo';
import HeroSection from '@/components/landing/hero-section';
import FeaturesGrid from '@/components/landing/features-grid';
import { motion, useScroll, useSpring } from 'framer-motion';
import { UserAccountNav } from '@/components/user-account-nav';
import { useSession } from 'next-auth/react';
import SupportSection from '@/components/landing/support-section';

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
            <AnimatedLogo size={32} reducedMotion />
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
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">Sign in</Button>
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
        <SupportSection />

        {/* Call to Action Layer */}
        <section className="py-24 px-4 bg-zinc-900 dark:bg-zinc-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="container mx-auto text-center relative z-10 flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-zinc-900 mb-6 max-w-2xl mx-auto">
              Ready to build what your users actually want?
            </h2>
            <p className="text-zinc-400 dark:text-zinc-600 mb-10 text-lg max-w-xl mx-auto">
              Join thousands of product teams collecting feedback with UpVote.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/20">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-4">
              <AnimatedLogo size={24} reducedMotion />
              UpVote
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xs">
              The easiest way to collect and manage customer feedback. Built for modern product teams.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-2 text-zinc-500 dark:text-zinc-400">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Integrations</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-2 text-zinc-500 dark:text-zinc-400">
              <li><Link href="/blogs" className="hover:text-blue-600 transition-colors">Blog</Link></li>
              <li><Link href="/ifo" className="hover:text-blue-600 transition-colors">Information</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-400 text-sm">
            © {new Date().getFullYear()} UpVote Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social Icons would go here */}
          </div>
        </div>
      </footer>

      {/* Development Performance Monitor */}
      <PerformanceMonitor />
    </div>
  );
}
