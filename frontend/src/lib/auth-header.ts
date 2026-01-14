import type { AxiosInstance } from 'axios';
import { TokenStore } from '@/lib/stores/tokenStore';

export interface AuthHeaderOptions {
    /**
     * Header name to use (default: Authorization)
     */
    headerName?: string;
}

export default function createAuthHeaderInterceptor(
    api: AxiosInstance,
    options?: AuthHeaderOptions
) {
    const {
        headerName = 'Authorization',
    } = options ?? {};

    api.interceptors.request.use((config) => {
        const token = TokenStore.getAccessToken();
        const tokenType = TokenStore.getTokenType() ?? 'Bearer';

        if (token) {
            config.headers[headerName] = `${tokenType} ${token}`;
        }

        return config;
    });
}
