import { createContext, useContext } from 'react';
import type { ClaimsUser } from '@/features/auth/_common/types';

interface AuthContextType {
    user: ClaimsUser | null;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = AuthContext.Provider;

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside a AuthProvider');
    return ctx;
}
