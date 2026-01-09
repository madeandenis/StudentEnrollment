import type { ClaimsUser } from "@/features/auth/_common/types";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
    user: ClaimsUser;
    tokenType: string;
}
