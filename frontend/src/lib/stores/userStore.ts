import type { ClaimsUser } from '@/features/auth/_common/types';

export class UserStore {
    private static user: ClaimsUser | null = null;
    private static hydrated = false;

    static setUser(user: ClaimsUser) {
        UserStore.user = user;
        UserStore.hydrated = true;
    }

    static clear() {
        UserStore.user = null;
        UserStore.hydrated = false;
    }

    static markHydrated() {
        UserStore.hydrated = true;
    }

    static getUser(): ClaimsUser | null {
        return UserStore.user;
    }

    static isHydrated(): boolean {
        return UserStore.hydrated;
    }

    static isAuthenticated(): boolean {
        return !!UserStore.user;
    }

    static getRoles(): string[] {
        return UserStore.user?.roles ?? [];
    }

    private static readonly ADMIN_ROLES = [
        'admin',
        'suadmin',
    ];

    static isAdmin(): boolean {
        return UserStore.getRoles().some(role =>
            UserStore.ADMIN_ROLES.includes(role.toLowerCase())
        );
    }
}
