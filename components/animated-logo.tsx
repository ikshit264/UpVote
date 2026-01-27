'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedLogoProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
    className?: string;
    animated?: boolean;
    reducedMotion?: boolean; // New prop for performance optimization
}

const CHARS = {
    structure: ['░', '▒', '▓', '█', '│', '─', '┼', '╋', '╬', '═', '║', '├', '┤', '┬', '┴'],
    arrows: ['▲', '△', '↑', '⇧', '∧', '˄', '▴'],
    symbols: ['•', '○', '◦', '∙', '·', '+', '×'],
    mixed: ['░', '▒', '▓', '│', '─', '┼', '•', '·', '+', '×', '▲', '△', '↑']
};

const SHAPE = [
    '00000000000000044000000000000000',
    '00000000000000444400000000000000',
    '00000000000004444440000000000000',
    '00000000000044444444000000000000',
    '00000000000444444444400000000000',
    '00000000004444444444440000000000',
    '00000000044444444444444000000000',
    '00020000000004444444000000002000',
    '00022000000000444400000000022000',
    '00222200000000444400000000222200',
    '02222220000000444400000002222220',
    '22222222000000444400000022222222',
    '22222222000000444400000022222222',
    '00111000000000444400000000011100',
    '00111000000000444400000000011100',
    '00111000000000444400000000011100',
    '00111000004000444400040000011100',
    '00111000000000444400000000011100',
    '00111000000000444400000000011100',
    '00111000000000444400000000011100',
    '00111000000000444400000000011100',
    '00111000000000444400000000011100',
    '00111000000000444400000000011100',
    '00111000000000444400000000011100',
    '00111000000000444400000000011100',
    '00111000000000444400000000011100',
    '00111000000000444400000000011100',
    '00111000000000444400000000011100',
    '00111100000000444400000000111100',
    '00111100000000444400000000111100',
    '00011100000000444400000000111000',
    '00011110000004444440000001111000',
    '0000111100004444444400011110000',
    '00000111111144444444111111100000',
    '00000011111444444444411111000000',
    '00000001111111111111111100000000',
    '00000000001111111111110000000000',
    '00000000000000000000000000000000',
].map(row => row.split('').map(Number));

const COLS = 32;
const ROWS = SHAPE.length;

function randomFrom(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
}

const SIZE_MAP = {
    xs: { width: 60, height: 72, fontSize: 2 },
    sm: { width: 100, height: 120, fontSize: 3 },
    md: { width: 160, height: 192, fontSize: 5 },
    lg: { width: 240, height: 288, fontSize: 7 },
    xl: { width: 400, height: 480, fontSize: 12 },
};

export default function AnimatedLogo({
    size = 'md',
    className = '',
    animated = true,
    reducedMotion = false
}: AnimatedLogoProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const cellsRef = useRef<{ el: HTMLDivElement; type: number; row: number; nextChange: number; phase: number }[]>([]);
    const tickRef = useRef(0);
    const animationRef = useRef<number | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const lastUpdateRef = useRef(0);

    // Calculate dimensions
    const dims = typeof size === 'number'
        ? { width: size, height: size * 1.2, fontSize: size / 35 }
        : SIZE_MAP[size];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Intersection Observer to pause animation when not visible
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        observer.observe(canvas);

        // Clear existing
        canvas.innerHTML = '';
        cellsRef.current = [];

        // Create grid with optimized rendering
        const fragment = document.createDocumentFragment();
        
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = document.createElement('div');
                cell.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #000;
                    transition: opacity 0.25s ease-out;
                    will-change: opacity;
                `;

                const type = SHAPE[r][c];

                if (type !== 0) {
                    if (type === 1) {
                        cell.textContent = randomFrom(CHARS.structure);
                        cell.style.opacity = '0.7';
                    } else if (type === 2 || type === 3) {
                        cell.textContent = randomFrom(CHARS.arrows);
                        cell.style.opacity = '0.8';
                    } else if (type === 4) {
                        cell.textContent = randomFrom(CHARS.arrows);
                        cell.style.opacity = '0.6';
                    }
                } else {
                    cell.style.opacity = '0';
                }

                fragment.appendChild(cell);
                cellsRef.current.push({
                    el: cell,
                    type,
                    row: r,
                    nextChange: Math.floor(Math.random() * 20),
                    phase: Math.random() * Math.PI * 2
                });
            }
        }
        
        canvas.appendChild(fragment);

        if (!animated || reducedMotion) return;

        // Animation loop with throttling to 30fps for better performance
        const animate = (timestamp: number) => {
            if (!isVisible) {
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            // Throttle to ~30fps instead of 60fps
            if (timestamp - lastUpdateRef.current < 33) {
                animationRef.current = requestAnimationFrame(animate);
                return;
            }
            lastUpdateRef.current = timestamp;

            tickRef.current++;
            const time = tickRef.current * 0.06;

            cellsRef.current.forEach(state => {
                const { el, type, row, phase } = state;

                if (type === 0) {
                    if (Math.random() < 0.001) {
                        el.textContent = randomFrom(CHARS.symbols);
                        el.style.opacity = '0.08';
                        setTimeout(() => { el.style.opacity = '0'; }, 250);
                    }
                    return;
                }

                state.nextChange--;

                if (state.nextChange <= 0) {
                    const wave = Math.sin(time + row * 0.2 + phase);
                    const intensity = (wave + 1) / 2;

                    let char: string, opacity: number;

                    if (type === 1) {
                        char = randomFrom(CHARS.structure);
                        opacity = 0.45 + intensity * 0.5;
                        state.nextChange = 6 + Math.floor(Math.random() * 12);
                    } else if (type === 2 || type === 3) {
                        char = Math.random() < 0.7 ? randomFrom(CHARS.arrows) : randomFrom(CHARS.structure);
                        opacity = 0.55 + intensity * 0.45;
                        state.nextChange = 4 + Math.floor(Math.random() * 8);
                    } else {
                        const flowWave = Math.sin(time * 2.5 - row * 0.4);
                        const flowIntensity = Math.max(0, flowWave);
                        char = Math.random() < 0.75 ? randomFrom(CHARS.arrows) : randomFrom(CHARS.mixed);
                        opacity = 0.3 + flowIntensity * 0.65;
                        state.nextChange = 2 + Math.floor(Math.random() * 6);
                    }

                    el.textContent = char;
                    el.style.opacity = opacity.toFixed(2);
                }
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            observer.disconnect();
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animated, size, isVisible, reducedMotion]);

    return (
        <div
            className={className}
            style={{
                width: dims.width,
                height: dims.height,
                position: 'relative',
            }}
        >
            <div
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'grid',
                    gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                    gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                    fontSize: dims.fontSize,
                    lineHeight: 1,
                    fontFamily: 'Consolas, Monaco, monospace',
                }}
            />
        </div>
    );
}

// Loading screen component
export function LoadingScreen({ text = 'Loading...' }: { text?: string }) {
    return (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
            <AnimatedLogo size="lg" />
            <p className="mt-6 text-sm font-medium text-zinc-400 animate-pulse">{text}</p>
        </div>
    );
}

// Inline loader for buttons, etc.
export function InlineLoader({ size = 'sm' }: { size?: 'xs' | 'sm' | 'md' }) {
    return <AnimatedLogo size={size} />;
}
