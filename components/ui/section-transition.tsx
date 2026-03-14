import React from 'react';

interface SectionTransitionProps {
  /**
   * Tailwind color class for the gradient end (e.g., "to-zinc-50", "to-white")
   */
  toColor: string;
  
  /**
   * Height of the transition area (default: "h-40")
   * Examples: "h-20", "h-32", "h-48"
   */
  height?: string;
}

/**
 * SectionTransition Component
 * 
 * Creates a smooth gradient fade between two sections to avoid harsh color cuts.
 * Renders a full-width, pointer-events-none gradient that fades vertically
 * from transparent to the specified background color.
 */
export function SectionTransition({ 
  toColor, 
  height = "h-40" 
}: SectionTransitionProps) {
  return (
    <div 
      className={`w-full ${height} bg-gradient-to-b from-transparent ${toColor} pointer-events-none relative z-10`}
      aria-hidden="true"
    />
  );
}

export default SectionTransition;
