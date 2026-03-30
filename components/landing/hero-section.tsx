"use client";

import { useEffect, useState, useRef } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const [isMobile, setIsMobile] = useState(false);
  const [isIdle, setIsIdle] = useState(true); // Start as idle so animation begins immediately
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-animation values for idle state - initialized with LEFT corner position
  const autoX = useMotionValue(typeof window !== 'undefined' ? 200 : 200);
  const autoY = useMotionValue(typeof window !== 'undefined' ? 200 : 200);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      // Reset idle state on mouse move
      setIsIdle(false);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      
      // Set idle after 3 seconds of no movement
      idleTimeoutRef.current = setTimeout(() => {
        setIsIdle(true);
      }, 3000);
    };

    // Start in idle mode immediately for instant animation
    setIsIdle(true);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkMobile);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [mouseX, mouseY, isMobile]);

  // Automatic floating animation when idle - starts immediately
  useEffect(() => {
    if (!isIdle || isMobile) return;

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.015;
      
      // Create smooth figure-8 pattern starting from left corner
      const newX = 200 + Math.sin(time) * 200 + Math.sin(time * 0.5) * 100;
      const newY = 200 + Math.cos(time * 0.8) * 150 + Math.sin(time * 0.3) * 80;
      
      autoX.set(newX);
      autoY.set(newY);
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isIdle, isMobile, autoX, autoY]);

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-44 md:pb-32 bg-white dark:bg-black">

      {/* CLOUD LAYER */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ contain: "layout paint style" }}
      >

        {/* floating cloud */}
        <m.div
          transformTemplate={(_, generatedTransform) => `${generatedTransform} translateZ(0)`}
          animate={{
            x: [0, 80, -60, 0],
            y: [0, -60, 80, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-400/40 rounded-full blur-[180px] mix-blend-multiply"
          style={{ willChange: "transform", contain: "layout paint style" }}
        />

        {/* second cloud */}
        <m.div
          transformTemplate={(_, generatedTransform) => `${generatedTransform} translateZ(0)`}
          animate={{
            x: [0, -80, 100, 0],
            y: [0, 100, -60, 0],
          }}
          transition={{
            duration: 34,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -right-40 w-[650px] h-[650px] bg-purple-400/40 rounded-full blur-[200px] mix-blend-multiply"
          style={{ willChange: "transform", contain: "layout paint style" }}
        />


      </div>

      {/* HERO CONTENT */}
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">

          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Customer Feedback Widget for SaaS & Mobile Apps
            <br />
            <span className="text-blue-600">Collect, Analyze, Act</span>
          </h1>

          <p className="text-lg md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Turn passive users into active contributors with our lightweight, embeddable feedback widget. Built for SaaS platforms, mobile apps, and fintech teams — collect feature requests, prioritize improvements, and build what users actually want.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">

            <Link href="/auth/signup">
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link href="#demo">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg rounded-xl"
              >
                View Live Demo
              </Button>
            </Link>

          </div>

          <div className="pt-6 flex flex-wrap justify-center gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">

          </div>

        </div>
      </div>

    </section>
  );
}
