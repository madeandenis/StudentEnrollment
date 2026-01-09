import { api } from '@/lib/api';
import type { LogoutRequest } from '@/features/auth/logout/types';

export const logout = async (data: LogoutRequest): Promise<void> => {
    await api.post('/auth/logout', data);
};
