'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
    className?: string;
    size?: number;
    animated?: boolean;
}

export default function Logo({ className = '', size = 32, animated = false }: LogoProps) {
    return (
        <div
            className={`relative flex items-center justify-center shrink-0 ${className} animate-zoom-in ${animated ? 'animate-logo-pulse' : ''}`}
            style={{ width: size, height: size }}
        >
            {/* Container with a base scale-up to handle image transparency/whitespace */}
            <div className="relative w-[115%] h-[115%] flex-shrink-0 transition-transform duration-500">
                <Image
                    src="/icon.png"
                    alt="UpVote Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            {animated && (
                <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full animate-logo-glow -z-10" />
            )}
        </div>
    );
}

