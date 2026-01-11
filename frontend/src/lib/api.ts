import axios from 'axios';
import createAuthRefreshInterceptor from '@/lib/auto-refresh';
import { refreshToken } from '@/features/auth/refresh/api';
import { TokenStore } from '@/lib/token-store';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:5213';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = TokenStore.getAccessToken();
    const tokenType = TokenStore.getTokenType();

    if (token) {
        config.headers.Authorization = `${tokenType} ${token}`;
    }

    return config;
});

createAuthRefreshInterceptor(api, refreshToken, {
    pauseInstanceWhileRefreshing: true,
});
