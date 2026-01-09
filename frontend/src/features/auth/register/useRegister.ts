import { useMutation } from '@tanstack/react-query';
import { register } from '@/features/auth/register/api';

export const useRegister = () => {
    return useMutation({
        mutationFn: register,
    });
};
