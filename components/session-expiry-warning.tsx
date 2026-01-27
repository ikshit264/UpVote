'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getDaysUntilExpiry, SESSION_CONFIG } from '@/lib/session-utils';

/**
 * SessionExpiryWarning Component
 * 
 * Displays a warning when user's session is about to expire.
 * Shows a notification 1 day before expiry.
 * 
 * Usage:
 * ```tsx
 * import SessionExpiryWarning from '@/components/session-expiry-warning';
 * 
 * // In your layout or dashboard
 * <SessionExpiryWarning />
 * ```
 */
export default function SessionExpiryWarning() {
    const { data: session, status } = useSession();
    const [showWarning, setShowWarning] = useState(false);
    const [daysRemaining, setDaysRemaining] = useState<number>(0);

    useEffect(() => {
        if (status !== 'authenticated' || !session) return;

        // Check session expiry every hour
        const checkExpiry = () => {
            // In a real app, you'd store the login timestamp
            // For now, we'll use a placeholder - you can extend this
            // by adding a timestamp to the session object
            const loginDate = new Date(); // This should come from session
            const days = getDaysUntilExpiry(loginDate);

            setDaysRemaining(days);
            setShowWarning(days <= SESSION_CONFIG.WARNING_THRESHOLD_DAYS && days > 0);
        };

        checkExpiry();
        const interval = setInterval(checkExpiry, 60 * 60 * 1000); // Check every hour

        return () => clearInterval(interval);
    }, [session, status]);

    if (!showWarning || status !== 'authenticated') return null;

    return (
        <div className="fixed top-20 right-4 z-50 max-w-sm animate-in slide-in-from-top-5">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-lg">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <svg
                            className="w-5 h-5 text-yellow-600 dark:text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                            Session Expiring Soon
                        </h3>
                        <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-200">
                            Your session will expire in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}.
                            Visit the site to extend your session.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowWarning(false)}
                        className="flex-shrink-0 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
                        aria-label="Dismiss"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
