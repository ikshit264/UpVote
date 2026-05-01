'use client';

import { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';

/**
 * ADVANCED MONKFEED WIDGET
 * Event-driven, cache-busting, and lifecycle-aware.
 */
export default function MonkFeedWidget() {
    const [userData, setUserData] = useState<{ id: string; email: string } | null>(null);
    const [remountKey, setRemountKey] = useState(0);

    // Initial session fetch (fallback)
    const fetchSession = useCallback(async () => {
        try {
            // Force cache bypass by adding a timestamp
            const res = await fetch(`/api/auth/session?t=${Date.now()}`);
            const data = await res.json();
            const user = data.user?.email ? { id: data.user.id, email: data.user.email } : null;
            setUserData(user);
        } catch (e) {
            console.error('MonkFeed session fetch failed', e);
        }
    }, []);

    useEffect(() => {
        fetchSession();

        // Event listeners for centralized auth syncing
        const handleLogin = (e: any) => {
            setUserData(e.detail);
            setRemountKey(prev => prev + 1); // Force immediate remount
        };

        const handleLogout = () => {
            setUserData(null);
            setRemountKey(prev => prev + 1); // Force cleanup remount

            // Aggressive DOM cleanup for SPAs
            if (typeof window !== 'undefined' && (window as any).__monkfeed_cleanup) {
                (window as any).__monkfeed_cleanup();
            }
        };

        window.addEventListener('monkfeed:login', handleLogin);
        window.addEventListener('monkfeed:logout', handleLogout);
        window.addEventListener('focus', fetchSession);

        return () => {
            window.removeEventListener('monkfeed:login', handleLogin);
            window.removeEventListener('monkfeed:logout', handleLogout);
            window.removeEventListener('focus', fetchSession);
        };
    }, [fetchSession]);

    return (
        <div key={remountKey}>
            <div
                className="monkfeed-widget"
                data-application-id="69a41f203a9a405a41b02afc"
                data-user-id={userData?.id || ''}
                data-email={userData?.email || ''}
                data-position="right"
                data-theme="light"
            />
            <Script
                src={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/widget.js`}
                strategy="afterInteractive"
            />
        </div>
    );
}
