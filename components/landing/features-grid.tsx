"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import { BarChart3, MessageSquare, Shield, Zap, Users, Globe } from "lucide-react";

const features = [
  { icon: Zap, title: "Lightning Fast", description: "Our widget loads in under 100ms ensuring zero impact on your Core Web Vitals." },
  { icon: Users, title: "User Management", description: "Automatically prioritize feedback from your most engaged users." },
  { icon: MessageSquare, title: "Rich Comments", description: "Markdown support, image uploads, and threaded discussions." },
  { icon: BarChart3, title: "Analytics Dashboard", description: "Understand trends and sentiment with visual analytics." },
  { icon: Shield, title: "Spam Protection", description: "Automated moderation and filtering keep feedback clean." },
  { icon: Globe, title: "Multi-Language", description: "Translate feedback across 30+ languages instantly." }
];

export default function FeaturesGrid() {

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section className="relative py-28 overflow-hidden bg-zinc-50">

      {/* grid background */}
      <div className="absolute inset-0 opacity-[0.35]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      {/* spotlight glow */}
      <motion.div
        style={{ left: smoothX, top: smoothY }}
        className="pointer-events-none absolute w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(59,130,246,0.15),transparent_60%)] blur-3xl"
      />

      <div className="container px-4 md:px-6 mx-auto relative z-10">

        {/* heading */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900"
          >
            Everything you need to build better products
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-600"
          >
            A complete suite of tools to collect, manage, and act on customer feedback.
          </motion.p>

        </div>

        {/* feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {features.map((feature, i) => {

            const Icon = feature.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  rotateX: 4,
                  rotateY: -4,
                }}
                className="group relative rounded-2xl bg-white border border-zinc-200 p-8 shadow-sm transition-all duration-300 hover:shadow-lg"
              >

                {/* gradient border hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none bg-[linear-gradient(120deg,transparent,rgba(59,130,246,0.2),transparent)]" />

                <div className="space-y-5 relative z-10">

                  {/* icon */}
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-11 h-11 rounded-xl bg-zinc-100 flex items-center justify-center"
                  >
                    <Icon className="w-5 h-5 text-zinc-700" />
                  </motion.div>

                  <h3 className="text-lg font-semibold text-zinc-900">
                    {feature.title}
                  </h3>

                  <p className="text-zinc-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>

                </div>

              </motion.div>
            );
          })}
        </div>
      </div>

    </section>
  );
}