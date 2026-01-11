export class TokenStore {
    private static accessToken: string | null = null;
    private static accessTokenExpiresAt: number | null = null;
    private static refreshTokenExpiresAt: number | null = null;
    private static tokenType: string | null = null;

    static setTokens(
        accessToken: string,
        accessTokenExpiresAt: Date | string,
        refreshTokenExpiresAt: Date | string,
        tokenType?: string
    ) {
        TokenStore.accessToken = accessToken;
        TokenStore.accessTokenExpiresAt = new Date(accessTokenExpiresAt).getTime();
        TokenStore.refreshTokenExpiresAt = new Date(refreshTokenExpiresAt).getTime();
        TokenStore.tokenType = tokenType || 'Bearer';
    }

    static getAccessToken(): string | null {
        return TokenStore.accessToken;
    }

    static getAccessTokenExpiresAt(): number | null {
        return TokenStore.accessTokenExpiresAt;
    }

    static getRefreshTokenExpiresAt(): number | null {
        return TokenStore.refreshTokenExpiresAt;
    }

    static getTokenType(): string | null {
        return TokenStore.tokenType;
    }

    static clear() {
        TokenStore.accessToken = null;
        TokenStore.accessTokenExpiresAt = null;
        TokenStore.refreshTokenExpiresAt = null;
        TokenStore.tokenType = null;
    }

    static isAccessTokenValid(): boolean {
        return (
            !!TokenStore.accessToken &&
            !!TokenStore.accessTokenExpiresAt &&
            Date.now() < TokenStore.accessTokenExpiresAt
        );
    }
}
