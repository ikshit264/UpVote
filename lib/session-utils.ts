/**
 * Session Management Utilities
 * 
 * Helper functions for managing user sessions with NextAuth
 */

/**
 * Get current session duration in days
 * @returns Number of days sessions persist
 */
export function getSessionDurationInDays(): number {
    return 7; // 7 days as configured
}

/**
 * Get session expiry time for a user
 * @param loginDate - Date when user logged in
 * @returns Date when session expires
 */
export function getSessionExpiryDate(loginDate: Date = new Date()): Date {
    const expiryDate = new Date(loginDate);
    expiryDate.setDate(expiryDate.getDate() + getSessionDurationInDays());
    return expiryDate;
}

/**
 * Check if session is about to expire
 * @param loginDate - Date when user logged in
 * @param warningDays - Days before expiry to show warning (default: 1)
 * @returns true if session will expire soon
 */
export function isSessionExpiringSoon(
    loginDate: Date,
    warningDays: number = 1
): boolean {
    const now = new Date();
    const expiryDate = getSessionExpiryDate(loginDate);
    const daysUntilExpiry = Math.floor(
        (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= warningDays && daysUntilExpiry >= 0;
}

/**
 * Get days remaining in session
 * @param loginDate - Date when user logged in
 * @returns Number of days until session expires
 */
export function getDaysUntilExpiry(loginDate: Date): number {
    const now = new Date();
    const expiryDate = getSessionExpiryDate(loginDate);
    const daysRemaining = Math.floor(
        (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, daysRemaining);
}

/**
 * Format session duration as human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted string like "7 days" or "3 hours"
 */
export function formatSessionDuration(seconds: number): string {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);

    if (days > 0) {
        return `${days} day${days !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
}

/**
 * Session configuration constants
 */
export const SESSION_CONFIG = {
    /** Session duration in seconds (7 days) */
    MAX_AGE: 7 * 24 * 60 * 60,

    /** Update session age in seconds (24 hours) */
    UPDATE_AGE: 24 * 60 * 60,

    /** Session duration in days */
    DURATION_DAYS: 7,

    /** When to show expiry warning (days) */
    WARNING_THRESHOLD_DAYS: 1,
} as const;
