import { createContext, useContext, useState, type ReactNode } from 'react';
import type { ClaimsUser } from '@/features/auth/_common/types';
import type { LoginResponse } from '@/features/auth/login/types';

interface AuthContextType {
    user: ClaimsUser | null;
    accessToken: string | null;
    login: (response: LoginResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<ClaimsUser | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const login = (response: LoginResponse) => {
        setUser(response.user);
        setAccessToken(response.accessToken);
    };

    const logout = () => {
        setUser(null);
        setAccessToken(null);
    };

    const value: AuthContextType = {
        user,
        accessToken,
        login,
        logout,
        isAuthenticated: !!user && !!accessToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
