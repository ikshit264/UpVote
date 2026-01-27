'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
    fcp?: number; // First Contentful Paint
    lcp?: number; // Largest Contentful Paint
    fid?: number; // First Input Delay
    cls?: number; // Cumulative Layout Shift
}

export default function PerformanceMonitor() {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({});
    const [showMetrics, setShowMetrics] = useState(false);

    useEffect(() => {
        // Only show in development
        if (process.env.NODE_ENV !== 'development') return;

        // Measure First Contentful Paint
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    setMetrics((prev) => ({ ...prev, fcp: entry.startTime }));
                }
            }
        });

        try {
            observer.observe({ entryTypes: ['paint'] });
        } catch (e) {
            // Browser doesn't support this API
        }

        // Measure Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as any;
            setMetrics((prev) => ({ ...prev, lcp: lastEntry.startTime }));
        });

        try {
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            // Browser doesn't support this API
        }

        // Measure page load time
        window.addEventListener('load', () => {
            const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            if (navTiming) {
                console.log('📊 Performance Metrics:');
                console.log(`   ⏱️  DOM Content Loaded: ${(navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart).toFixed(2)}ms`);
                console.log(`   ⏱️  Page Load: ${(navTiming.loadEventEnd - navTiming.fetchStart).toFixed(2)}ms`);
                console.log(`   ⏱️  DOM Interactive: ${(navTiming.domInteractive - navTiming.fetchStart).toFixed(2)}ms`);
            }
        });

        return () => {
            observer.disconnect();
            lcpObserver.disconnect();
        };
    }, []);

    // Only render in development
    if (process.env.NODE_ENV !== 'development') return null;

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={() => setShowMetrics(!showMetrics)}
                className="fixed bottom-4 right-4 z-50 bg-black/80 text-white px-3 py-2 rounded-lg text-xs font-mono hover:bg-black transition-colors"
                title="Toggle Performance Metrics"
            >
                ⚡ Perf
            </button>

            {/* Metrics display */}
            {showMetrics && (
                <div className="fixed bottom-16 right-4 z-50 bg-black/90 text-white p-4 rounded-lg text-xs font-mono max-w-xs space-y-2">
                    <div className="font-bold mb-2 border-b border-white/30 pb-2">
                        Performance Metrics
                    </div>
                    {metrics.fcp && (
                        <div>
                            <span className="text-green-400">FCP:</span>{' '}
                            <span className={metrics.fcp < 1800 ? 'text-green-400' : metrics.fcp < 3000 ? 'text-yellow-400' : 'text-red-400'}>
                                {metrics.fcp.toFixed(0)}ms
                            </span>
                        </div>
                    )}
                    {metrics.lcp && (
                        <div>
                            <span className="text-blue-400">LCP:</span>{' '}
                            <span className={metrics.lcp < 2500 ? 'text-green-400' : metrics.lcp < 4000 ? 'text-yellow-400' : 'text-red-400'}>
                                {metrics.lcp.toFixed(0)}ms
                            </span>
                        </div>
                    )}
                    <div className="text-zinc-400 text-[10px] mt-2 pt-2 border-t border-white/20">
                        Check console for more details
                    </div>
                </div>
            )}
        </>
    );
}
