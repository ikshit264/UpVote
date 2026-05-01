/**
 * MonkFeed Auth Synchronization Utility
 * Centralizes login/logout events for the feedback widget.
 */

interface MonkFeedUser {
    id: string;
    email: string;
}

/**
 * Dispatches a custom event when a user logs in.
 * Use this in your login success handler.
 */
export function syncMonkFeedLogin(user: MonkFeedUser) {
    const event = new CustomEvent('monkfeed:login', { detail: user });
    window.dispatchEvent(event);
}

/**
 * Dispatches a custom event when a user logs out.
 * Use this in your logout handler.
 */
export function syncMonkFeedLogout() {
    const event = new CustomEvent('monkfeed:logout');
    window.dispatchEvent(event);
}
