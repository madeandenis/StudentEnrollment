import { api } from "@/lib/api";
import type { LoginRequest, LoginResponse } from '@/features/auth/login/types';
import { TokenStore } from '@/lib/token-store';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    const loginData = response.data;

    TokenStore.setTokens(
        loginData.accessToken,
        loginData.accessTokenExpiresAt,
        loginData.refreshTokenExpiresAt,
        loginData.tokenType
    );

    return loginData;
};
