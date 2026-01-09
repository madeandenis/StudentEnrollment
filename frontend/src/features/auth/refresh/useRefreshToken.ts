import { useMutation } from '@tanstack/react-query';
import { refreshToken } from '@/features/auth/refresh/api';

export const useRefreshToken = () => {
    return useMutation({
        mutationFn: refreshToken,
    });
};
