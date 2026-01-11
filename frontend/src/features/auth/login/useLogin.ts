import { useMutation } from '@tanstack/react-query';
import { login } from '@/features/auth/login/api';
import { useAuth } from '@/features/auth/_contexts/AuthContext';

export const useLogin = () => {
    const { setUser } = useAuth();

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            setUser(data.user);
        },
    });
};
