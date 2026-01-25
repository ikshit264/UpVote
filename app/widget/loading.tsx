'use client';

import React from 'react';
import AnimatedLogo from '@/components/animated-logo';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-zinc-950 font-sans">
      <AnimatedLogo size="lg" />

      <div className="mt-8 text-center space-y-4">
        <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white uppercase italic">
          UpVote
        </h2>
        <div className="flex items-center gap-1.5 justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Preparing your feed</p>
      </div>
    </div>
  );
}
