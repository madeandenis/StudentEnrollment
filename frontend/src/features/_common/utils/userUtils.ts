import type { ClaimsUser } from "@/features/auth/_common/types";

/**
 * Returns a human-readable display name for a user
 */
export function getDisplayName(user?: ClaimsUser): string {
    if (!user) return 'User';
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    return user.userName || user.email || 'User';
}

/**
 * Returns initials for a user 
 */
export function getInitials(user?: ClaimsUser): string {
    if (!user) return 'U';
    if (user.firstName && user.lastName) {
        return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return (user.email?.[0] || 'U').toUpperCase();
}
