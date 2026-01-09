import { api } from '@/lib/api';
import type { RefreshTokenResponse } from '@/features/auth/refresh/types';

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
    const response = await api.post<RefreshTokenResponse>('/auth/refresh');
    return response.data;
};
