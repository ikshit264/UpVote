"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkMobile);
    };
  }, [mouseX, mouseY, isMobile]);

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-44 md:pb-32 bg-white dark:bg-black">

      {/* CLOUD LAYER */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* floating cloud */}
        <motion.div
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
        />

        {/* second cloud */}
        <motion.div
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
        />

        {/* mouse attractor cloud */}
        {!isMobile && (
          <motion.div
            style={{
              left: smoothX,
              top: smoothY,
            }}
            className="absolute w-[450px] h-[450px] rounded-full bg-indigo-400/50 blur-[160px] mix-blend-multiply -translate-x-1/2 -translate-y-1/2"
          />
        )}

      </div>

      {/* HERO CONTENT */}
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">

          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Make Customer Feedback
            <br />
            <span className="text-blue-600">Your Superpower</span>
          </h1>

          <p className="text-lg md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Collect, analyze, and act on user feedback with our beautiful widget.
            Turn passive users into active contributors and build what they
            actually want.
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