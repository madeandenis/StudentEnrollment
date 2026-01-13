import { api } from '@/lib/api';
import type { RefreshTokenResponse } from '@/features/auth/refresh/types';
import { TokenStore } from '@/lib/token-store';

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
    const response = await api.post<RefreshTokenResponse>('/auth/refresh', {}, {
        skipAuthRefresh: true
    } as any);
    const refreshTokenData = response.data;

    TokenStore.setTokens(
        refreshTokenData.accessToken,
        refreshTokenData.accessTokenExpiresAt,
        refreshTokenData.refreshTokenExpiresAt,
        refreshTokenData.tokenType
    );

    return refreshTokenData;
};
