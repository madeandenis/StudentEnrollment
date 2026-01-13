import { api } from '@/lib/api';
import type { LogoutRequest } from '@/features/auth/logout/types';
import { TokenStore } from '@/lib/stores/tokenStore';
import { UserStore } from '@/lib/stores/userStore';

export const logout = async (data?: LogoutRequest): Promise<void> => {
    try {
        await api.post('/auth/logout', data);
    } catch {
    }
    finally {
        TokenStore.clear();
        UserStore.clear();
    }
};
