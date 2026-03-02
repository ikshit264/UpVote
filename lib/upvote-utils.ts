/**
 * UpVote Auth Synchronization Utility
 * Centralizes login/logout events for the feedback widget.
 */

interface UpvoteUser {
    id: string;
    email: string;
}

/**
 * Dispatches a custom event when a user logs in.
 * Use this in your login success handler.
 */
export function syncUpvoteLogin(user: UpvoteUser) {
    const event = new CustomEvent('upvote:login', { detail: user });
    window.dispatchEvent(event);
}

/**
 * Dispatches a custom event when a user logs out.
 * Use this in your logout handler.
 */
export function syncUpvoteLogout() {
    const event = new CustomEvent('upvote:logout');
    window.dispatchEvent(event);
}
