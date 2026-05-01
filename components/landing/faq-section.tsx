"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { m } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const faqs = [
  {
    question: "How do I embed the widget?",
    answer:
      "Paste a single snippet into your HTML, React, or Next.js app. No SDK setup required.",
  },
  {
    question: "Can my team review and respond to feedback together?",
    answer:
      "Yes. Your team can triage requests, reply to users, and track what is gaining momentum from one shared dashboard.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes. You can start with the Hobby plan for free and upgrade whenever you need more scale.",
  },
];

export default function FAQSection() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section id="faq" className="overflow-hidden bg-white py-24 dark:bg-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container relative mx-auto px-4 md:px-6">
        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950 p-8 text-center shadow-[0_30px_80px_rgba(15,23,42,0.45)] dark:bg-zinc-900 md:p-16"
        >
          <div className="pointer-events-none absolute inset-[1px] rounded-[2.35rem] bg-gradient-to-br from-white/8 via-transparent to-white/5" />
          <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-700/35 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-zinc-700/25 blur-[100px]" />
          <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl">
              Frequently Asked Questions
            </h2>

            <div className="mx-auto mb-16 max-w-3xl">
              <Accordion type="single" collapsible className="space-y-4 text-left">
                {faqs.map((faq, index) => (
                  <m.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AccordionItem
                      value={`item-${index}`}
                      className="rounded-2xl border border-white/10 bg-white/8 px-6 shadow-[0_12px_30px_rgba(15,23,42,0.18)] backdrop-blur-md transition-all hover:border-zinc-400/40 hover:bg-white/12"
                    >
                      <AccordionTrigger className="group py-6 hover:no-underline">
                        <h3 className="text-left text-lg font-bold text-zinc-100 transition-colors group-hover:text-white md:text-xl">
                          {faq.question}
                        </h3>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 text-base leading-relaxed text-zinc-300 md:text-lg">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </m.div>
                ))}
              </Accordion>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="h-14 rounded-2xl border-0 bg-zinc-700 px-10 text-lg font-bold text-white shadow-lg shadow-zinc-500/25 transition-all hover:scale-[1.02] hover:bg-zinc-800 active:scale-[0.98]"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 rounded-2xl bg-white text-lg font-bold text-zinc-950 px-10 shadow-lg shadow-zinc-900/10 transition-all hover:scale-[1.02] hover:bg-zinc-700 hover:text-zinc-100"
                >
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
