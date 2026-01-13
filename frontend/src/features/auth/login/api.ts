import { api } from "@/lib/api";
import type { LoginRequest, LoginResponse } from '@/features/auth/login/types';
import { TokenStore } from "@/lib/stores/tokenStore";
import { UserStore } from "@/lib/stores/userStore";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data, {
        skipAuthRefresh: true
    } as any);

    const { accessToken, accessTokenExpiresAt, refreshTokenExpiresAt, tokenType, user } = response.data;

    TokenStore.setTokens(accessToken, accessTokenExpiresAt, refreshTokenExpiresAt, tokenType);
    UserStore.setUser(user);

    return response.data;
};
