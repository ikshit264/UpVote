import React from 'react';
import { SectionTransition } from '@/components/ui/section-transition';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Background color of this section (e.g., "bg-white", "bg-zinc-50")
   */
  bg?: string;
  /**
   * Background color for the gradient transition to next section
   * If not provided, no transition will be rendered
   */
  toColor?: string;
  /**
   * Height of the transition (default: "h-24")
   */
  transitionHeight?: string;
}

/**
 * Section Wrapper Component
 * 
 * Reusable wrapper that automatically adds a smooth transition after each section.
 * Use this to wrap any content section on your landing page.
 */
export function Section({ 
  children, 
  className = "",
  bg = "bg-white",
  toColor,
  transitionHeight = "h-40"
}: SectionProps) {
  if (!toColor) {
    return (
      <section className={`w-full ${bg} ${className}`}>
        {children}
      </section>
    );
  }

  return (
    <div className="relative">
      <section className={`w-full ${bg} ${className}`}>
        {children}
      </section>
      {/* Gradient overlay that sits on top of the section bottom */}
      <div 
        className={`absolute bottom-0 left-0 right-0 ${transitionHeight} bg-gradient-to-b from-transparent ${toColor} pointer-events-none z-10`}
        aria-hidden="true"
      />
    </div>
  );
}

export default Section;
