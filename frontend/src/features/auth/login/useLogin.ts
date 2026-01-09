import { useMutation } from '@tanstack/react-query';
import { login } from '@/features/auth/login/api';

export const useLogin = () => {
    return useMutation({
        mutationFn: login,
    });
};
