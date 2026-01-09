import { api } from '@/lib/api';
import type { RegisterRequest } from '@/features/auth/register/types';
import type { ClaimsUser } from '@/features/auth/_common/types';

export const register = async (data: RegisterRequest): Promise<ClaimsUser> => {
    const response = await api.post<ClaimsUser>('/auth/register', data);
    return response.data;
};
