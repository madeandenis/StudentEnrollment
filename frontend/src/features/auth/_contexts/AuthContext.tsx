import { createContext, useContext, useState, type ReactNode } from 'react';
import type { ClaimsUser } from '@/features/auth/_common/types';

interface AuthContextType {
    user: ClaimsUser | null;
    setUser: (user: ClaimsUser | null) => void;
    clearUser: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<ClaimsUser | null>(null);

    const setUser = (user: ClaimsUser | null) => {
        setUserState(user);
    };

    const clearUser = () => setUserState(null);

    const value: AuthContextType = {
        user,
        setUser,
        clearUser,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
