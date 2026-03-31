"use client";

import { m, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import { BarChart3, MessageSquare, Shield, Zap, Users } from "lucide-react";

const features = [
  { icon: Zap, title: "Lightning Fast", description: "The widget stays lightweight and loads quickly, so your Core Web Vitals and user experience stay intact." },
  { icon: Users, title: "Smart Prioritization", description: "Spot the ideas that matter most by focusing on requests from your most engaged customers and teammates." },
  { icon: MessageSquare, title: "Rich Discussions", description: "Capture clearer context with comments, threaded replies, and richer feedback conversations around each request." },
  { icon: BarChart3, title: "Analytics Dashboard", description: "Track trends, sentiment, and feature demand with a dashboard that helps product teams make informed roadmap decisions." },
  { icon: Shield, title: "Spam Protection", description: "Keep submissions clean and useful with built-in moderation tools and filtering for low-quality feedback." },
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
    <section id="features" className="relative py-28 overflow-hidden bg-zinc-50">

      {/* grid background */}
      <div className="absolute inset-0 opacity-[0.35]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      {/* spotlight glow */}
      <m.div
        style={{ left: smoothX, top: smoothY }}
        className="pointer-events-none absolute w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(59,130,246,0.15),transparent_60%)] blur-3xl"
      />

      <div className="container px-4 md:px-6 mx-auto relative z-10">

        {/* heading */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">

          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900"
          >
            Everything you need to build better products
          </m.h2>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-600"
          >
            A complete suite of tools to collect, manage, and act on customer feedback without slowing down your website.
          </m.p>

        </div>

        {/* feature grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-6">

          {features.map((feature, i) => {
            const Icon = feature.icon;
            const isLastOddCard = i === features.length - 1 && features.length % 2 !== 0;
            const layoutClass =
              `${isLastOddCard ? "md:col-span-2" : ""} ${i < 3 ? "xl:col-span-2" : "xl:col-span-3"}`;

            return (
              <m.div
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
                className={`group relative h-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg ${layoutClass}`}
              >

                {/* gradient border hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none bg-[linear-gradient(120deg,transparent,rgba(59,130,246,0.2),transparent)]" />

                <div className="space-y-5 relative z-10">

                  {/* icon */}
                  <m.div
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-11 h-11 rounded-xl bg-zinc-100 flex items-center justify-center"
                  >
                    <Icon className="w-5 h-5 text-zinc-700" />
                  </m.div>

                  <h3 className="text-lg font-semibold text-zinc-900">
                    {feature.title}
                  </h3>

                  <p className="text-zinc-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>

                </div>

              </m.div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
