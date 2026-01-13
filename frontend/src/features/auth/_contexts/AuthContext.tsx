import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ClaimsUser } from '@/features/auth/_common/types';
import { useMe } from '../me';

interface AuthContextType {
    user: ClaimsUser | null;
    setUser: (user: ClaimsUser | null) => void;
    clearUser: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<ClaimsUser | null>(null);

    const { data, isLoading, isError } = useMe();

    useEffect(() => {
        if (data) {
            setUserState(data.user);
        }
        if (isError) {
            setUserState(null);
        }
    }, [data, isError]);

    const value: AuthContextType = {
        user,
        setUser: setUserState,
        clearUser: () => setUserState(null),
        isAuthenticated: !!user,
        isAdmin: user?.roles?.some(r => r.toLowerCase().includes('admin')) ?? false,
        isLoading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
